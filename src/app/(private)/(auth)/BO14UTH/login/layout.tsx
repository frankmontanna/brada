import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
};


export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
   <>
     <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
   </>
  )
}


