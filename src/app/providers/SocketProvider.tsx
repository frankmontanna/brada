"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type Ctx = { socket: Socket | null; connected: boolean };
const SocketCtx = createContext<Ctx>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const opts = { path: "/socket.io", transports: ["websocket"] };

    const url = process.env.NEXT_PUBLIC_WS_URL;
    const s = url ? io(url, opts) : io(opts);

    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);
  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>;
}

export function useSocketCtx() {
  return useContext(SocketCtx);
}
