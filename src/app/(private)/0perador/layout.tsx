import { SocketProvider } from "@/app/providers/SocketProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Operador | Bradesco",
};

export default async function OperadorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const token = (await cookieStore).get(
    process.env.COOKIE_NAME || "auth-token"
  )?.value;
  let isAuthenticated = false;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, active: true },
      });
      isAuthenticated = !!(user && user.active);
    }
  }

  if (!isAuthenticated) {
    redirect("/BO14UTH/login");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 55)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <SocketProvider>{children}</SocketProvider>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
