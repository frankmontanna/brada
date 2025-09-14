import IconOperador from "@/svg/IconOperador";
import Link from "next/link";

export function OperadorLogo() {
  return (
    <Link href={"/0perador"} className="relative  inline-block">
      <IconOperador />
      <div className="absolute w-fit h-fit  left-[60px] bottom-[-2px] text-lg font-bold">
        OPERADOR <span className="text-bradesco">v1</span>
      </div>
    </Link>
  );
}
