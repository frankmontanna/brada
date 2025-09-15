"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useMemo, useState } from "react";
import { BlockedIP } from "./BlockedIP";

type CloakerConfig = {
  cloakerState: boolean;
  blockStranger: boolean;
  blockMobile: boolean;
  blockBot: boolean;
  updatedAt?: string;
};

type DenyEntry = {
  ip: string;
  createdAt: string;
};

export default function Cloaker() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<CloakerConfig>({
    cloakerState: false,
    blockStranger: false,
    blockMobile: false,
    blockBot: true,
  });

  const [denylist, setDenylist] = useState<DenyEntry[]>([]);
  const [ipToBlock, setIpToBlock] = useState("");

  const cloakerOn = useMemo(() => !!config?.cloakerState, [config]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/cloaker/config", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao buscar AppConfig");
        const cfg = (await res.json()) as CloakerConfig;
        setConfig((prev) => ({ ...prev, ...cfg }));
        const dres = await fetch("/api/cloaker/denylist", {
          cache: "no-store",
        });
        if (dres.ok) {
          const rows = (await dres.json()) as any[];
          const mapped: DenyEntry[] = rows.map((r) => ({
            ip: r.ip ?? r.ipAddress ?? "",
            createdAt: r.createdAt ?? r.firstSeen ?? new Date().toISOString(),
          }));
          setDenylist(mapped);
        } else {
          setDenylist([]);
        }
      } catch (e: any) {
        setError(e?.message ?? "Erro inesperado ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function applyConfig() {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/cloaker/config", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          cloakerState: config.cloakerState,
          blockStranger: config.blockStranger,
          blockMobile: config.blockMobile,
          blockBot: config.blockBot,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Falha ao salvar configurações");
      }
      const saved = (await res.json()) as CloakerConfig;
      setConfig((c) => ({ ...c, ...saved }));
    } catch (e: any) {
      setError(e?.message ?? "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  }

  async function addIp() {
    const ip = ipToBlock.trim();
    if (!ip) return;
    try {
      setError(null);
      const res = await fetch("/api/cloaker/log", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ip, reason: "manual" }),
      });
      if (!res.ok) throw new Error("Falha ao adicionar IP");
      setDenylist((list) => [
        { ip, createdAt: new Date().toISOString() },
        ...list,
      ]);
      setIpToBlock("");
    } catch (e: any) {
      setError(e?.message ?? "Erro ao bloquear IP");
    }
  }

  return (
    <div className="max-w-[1024px]">
      <div className="p-6">
        <Label className="text-lg">Configurações Cloaker</Label>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-4">
          <div className="flex gap-4 items-center">
            <p className="min-w-[140px]">Status Cloaker</p>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  cloakerOn ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {cloakerOn ? "Ativado" : "Desativado"}
              {config.updatedAt && (
                <span className="ml-3 text-xs text-muted-foreground">
                  (atualizado em {new Date(config.updatedAt).toLocaleString()})
                </span>
              )}
            </div>
          </div>

          <div className="flex py-4 items-center space-x-2">
            <Switch
              id="cloaker_control"
              checked={config.cloakerState}
              disabled={loading || saving}
              onCheckedChange={(v) =>
                setConfig((c) => ({ ...c, cloakerState: v }))
              }
            />
            <Label htmlFor="cloaker_control">Ativar Cloaker</Label>
          </div>

          <div>
            <Label className="text-base font-normal">Configurações</Label>
            <div>
              <div className={`${cloakerOn === false ? "opacity-50" : ""}`}>
                <div className="flex py-3 items-center space-x-2">
                  <Switch
                    id="block_stanger_ip"
                    checked={config.blockStranger}
                    disabled={loading || saving}
                    onCheckedChange={(v) =>
                      setConfig((c) => ({ ...c, blockStranger: v }))
                    }
                  />
                  <Label htmlFor="block_stanger_ip">
                    Bloquear IP Estrangeiro
                  </Label>
                </div>

                <div className="flex py-3 items-center space-x-2">
                  <Switch
                    id="block_smartphone"
                    checked={config.blockMobile}
                    disabled={loading || saving}
                    onCheckedChange={(v) =>
                      setConfig((c) => ({ ...c, blockMobile: v }))
                    }
                  />
                  <Label htmlFor="block_smartphone">Bloquear Smartphone</Label>
                </div>

                <div className="flex py-3 items-center space-x-2">
                  <Switch
                    id="block_bot"
                    checked={config.blockBot}
                    disabled={loading || saving}
                    onCheckedChange={(v) =>
                      setConfig((c) => ({ ...c, blockBot: v }))
                    }
                  />
                  <Label htmlFor="block_bot">Bloquear Bot</Label>
                </div>
              </div>

              <Button
                className="my-4 opacity-100"
                onClick={applyConfig}
                disabled={loading || saving}
              >
                {saving ? "Salvando..." : "Aplicar configurações"}
              </Button>

              <div className="flex flex-col py-3 gap-2">
                <Label>Bloquear IP</Label>
                <div className="flex gap-3">
                  <Input
                    className="w-[300px]"
                    placeholder="ex.: 203.0.113.42"
                    value={ipToBlock}
                    onChange={(e) => setIpToBlock(e.target.value)}
                    disabled={saving}
                  />
                  <Button
                    onClick={addIp}
                    disabled={!ipToBlock.trim() || saving}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label>IPs Bloqueados</Label>
              <div className="mt-2 space-y-2">
                {denylist.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {loading
                      ? "Carregando lista..."
                      : "Nenhum IP bloqueado ainda."}
                  </p>
                )}

                {denylist.map((row, idx) => (
                  <BlockedIP
                    key={`${row.ip}-${idx}`}
                    ip={row.ip}
                    createdAt={row.createdAt}
                  />
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <p className="mt-4 text-sm text-muted-foreground">
              Carregando configurações...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
