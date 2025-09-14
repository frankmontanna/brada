#!/usr/bin/env bash
set -euo pipefail

### CONFIG
DB_URL_INPUT='postgresql://postgres:producao@localhost:5432/brad'

### PREP SISTEMA
if ! command -v curl >/dev/null 2>&1; then
    apt-get update -y
    apt-get install -y curl
fi

echo "==> Instalando Docker (se necessário)..."
if ! command -v docker >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker "$SUDO_USER" 2>/dev/null || true
    usermod -aG docker "$USER" 2>/dev/null || true
fi

mkdir -p deploy

### GERAR .env
DB_URL_FOR_CONTAINER="$DB_URL_INPUT"
if echo "$DB_URL_INPUT" | grep -q "@localhost:"; then
    DB_URL_FOR_CONTAINER="$(echo "$DB_URL_INPUT" | sed 's/@localhost:/@db:/')"
fi

cat > .env <<EOF
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_WS_URL=http://localhost
DATABASE_URL=${DB_URL_FOR_CONTAINER}
JWT_SECRET=8026a49ee1624ed89947451324765ed0
COOKIE_NAME=auth-token
EOF
chmod 600 .env

### NGINX
cat > deploy/nginx.conf <<'EOF'
worker_processes auto;
events { worker_connections 1024; }
http {
  server_tokens off;
  map $http_upgrade $connection_upgrade { default upgrade; '' close; }

  # Segurança básica
  add_header X-Frame-Options DENY always;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy no-referrer-when-downgrade always;

  server {
    listen 80;
    server_name _;

    location / {
      proxy_pass         http://app:3000;
      proxy_http_version 1.1;
      proxy_set_header   Host $host;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto $scheme;

      # WebSocket
      proxy_set_header   Upgrade $http_upgrade;
      proxy_set_header   Connection $connection_upgrade;

      proxy_read_timeout  3600s;
      proxy_send_timeout  3600s;
    }
  }
}
EOF

### DOCKER COMPOSE
cat > docker-compose.yml <<'EOF'
services:
  app:
    build: .
    container_name: app
    restart: unless-stopped
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    # Garante migrate + seed antes do start
    command: sh -lc "npm run prisma:deploy && npm run db:seed || true; npm run start"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000"]
      interval: 15s
      timeout: 5s
      retries: 5

  db:
    image: postgres:16-alpine
    container_name: db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: producao
      POSTGRES_DB: brada
    volumes:
      - pgdata:/var/lib/postgresql/data
    # Segurança: não expõe 5432 publicamente
    # ports:
    #   - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d brada"]
      interval: 5s
      timeout: 3s
      retries: 30

  proxy:
    image: nginx:1.27-alpine
    container_name: proxy
    restart: unless-stopped
    depends_on:
      - app
    ports:
      - "80:80"
    volumes:
      - ./deploy/nginx.conf:/etc/nginx/nginx.conf:ro

volumes:
  pgdata:
EOF

### DOCKERFILE
cat > Dockerfile <<'EOF'
# ---- Build ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl

# Copia artefatos
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# (Opcional) rodar como usuário não-root:
# RUN adduser -D -u 10001 appuser && chown -R appuser:appuser /app
# USER appuser

EXPOSE 3000
CMD ["npm", "run", "start"]
EOF

### .dockerignore
cat > .dockerignore <<'EOF'
node_modules
.next
.git
.cache
dist
*.log
deploy
docker-compose.yml
.env
EOF

### BUILD & UP
echo "==> Buildando e subindo..."
docker compose build --no-cache
docker compose up -d

echo "==> Logs iniciais do app (30 linhas):"
docker compose logs --tail=30 app || true

echo "==> Pronto! Acesse: http://SEU_IP/"
echo "    Logs app:   docker compose logs -f app"
echo "    Logs proxy: docker compose logs -f proxy"
echo "    Parar:      docker compose down"
