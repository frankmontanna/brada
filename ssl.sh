#!/usr/bin/env bash
set -euo pipefail

# ==== CONFIGURÁVEIS ====
DOMAIN="brcdesco-pj.online"
UPSTREAM="127.0.0.1:3000"
SITE_NAME="operador"

# ==== 0) Checagens rápidas ====
if ! command -v apt >/dev/null 2>&1; then
    echo "Este script foi feito para Debian/Ubuntu (usa apt)."
    exit 1
fi

# ==== 1) Instalar dependências ====
export DEBIAN_FRONTEND=noninteractive
apt update
apt install -y nginx certbot python3-certbot-nginx npm

# ==== 2) Firewall (opcional) ====
if command -v ufw >/dev/null 2>&1; then
    ufw allow 80/tcp || true
    ufw allow 443/tcp || true
fi

# ==== 3) WebSocket support ====
cat >/etc/nginx/conf.d/websocket.conf <<'NGX'
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
NGX

# ==== 4) Configuração HTTP provisória ====
cat >/etc/nginx/sites-available/${SITE_NAME} <<NGX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /api/ {
        proxy_pass         http://${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto http;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection \$connection_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering off;
    }

    location / {
        proxy_pass         http://${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto http;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection \$connection_upgrade;
        proxy_read_timeout 60s;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGX

rm -f /etc/nginx/sites-enabled/default || true
ln -sf /etc/nginx/sites-available/${SITE_NAME} /etc/nginx/sites-enabled/${SITE_NAME}

nginx -t
systemctl reload nginx

echo ">> HTTP provisório ativo em http://${DOMAIN}. Emitindo certificado..."

# ==== 5) Certificado Let's Encrypt ====
certbot certonly \
--nginx \
-d "${DOMAIN}" \
--agree-tos \
--register-unsafely-without-email \
-n

# ==== 6) Configuração final (HTTP + HTTPS) ====
cat >/etc/nginx/sites-available/${SITE_NAME} <<NGX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /api/ {
        proxy_pass         http://${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto http;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection \$connection_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering off;
    }

    location / {
        proxy_pass         http://${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto http;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection \$connection_upgrade;
        proxy_read_timeout 60s;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    location /api/ {
        proxy_pass         http://${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection \$connection_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering off;
    }

    location / {
        proxy_pass         http://${UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection \$connection_upgrade;
        proxy_read_timeout 60s;
        proxy_cache_bypass \$http_upgrade;
    }

    client_max_body_size 10m;
}
NGX

nginx -t
systemctl reload nginx

# ==== 7) PM2 ====
echo ">> Instalando e configurando PM2..."
npm install -g pm2

cd /var/www/operador

# ecosystem.config.js com limites de memória
cat >ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: 'operador',
    script: 'dist/server.js',
    env: {
      PORT: '3000',
      HOST: '0.0.0.0',
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=768 --heapsnapshot-signal=SIGUSR2'
    },
    max_memory_restart: '900M',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    out_file: '/var/log/pm2/operador.out.log',
    error_file: '/var/log/pm2/operador.err.log',
    time: true
  }]
}
EOF

pm2 delete operador || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami))

pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:workerInterval 60
pm2 save

echo "=============================================================="
echo "OK! Seu site deve responder em:"
echo "  - http://${DOMAIN}"
echo "  - https://${DOMAIN}"
echo "PM2 configurado com limite de memória e logrotate ativo."
echo "Ver status:  pm2 status"
echo "Ver logs:    pm2 logs operador"
echo "=============================================================="
