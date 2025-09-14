import "@/app/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bradesco Net Empresa | Bradesco",
  description: "...",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
