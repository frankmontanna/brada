// src/app/(public)/ibpjlogin/login/page.tsx
"use client";

import { IdentificationProvider } from "@/contexts/IdentificationContext";
import { FooterLogin } from "./components/FooterLogin";
import { HeaderLogin } from "./components/HeaderLogin";
import { MainContentLogin } from "./components/MainContentLogin";
import { RSideInfo } from "./components/RSideInfo";
import "./login.css";

export default function Login() {
  return (
    <IdentificationProvider>
      <div>
        <HeaderLogin />
        <div className="flex gap-[18px] mb-[15px] mt-[21px]">
          <MainContentLogin />
          <RSideInfo />
        </div>
        <FooterLogin />
      </div>
    </IdentificationProvider>
  );
}
