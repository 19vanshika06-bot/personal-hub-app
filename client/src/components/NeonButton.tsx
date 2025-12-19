import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export function NeonButton({ children, className, variant = "primary", ...props }: NeonButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-[#FF007A] to-[#833AB4] text-white shadow-lg shadow-[#FF007A]/25 hover:shadow-[#FF007A]/40",
    secondary: "bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white",
    outline: "border-2 border-[#FF007A] text-[#FF007A] hover:bg-[#FF007A]/10",
  };

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
