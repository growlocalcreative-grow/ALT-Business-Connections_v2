import { motion } from "motion/react";
import React, { type ReactNode } from "react";
import { cn } from "../lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
}

export const Section = ({ children, className, id, title, subtitle }: SectionProps) => {
  return (
    <section id={id} className={cn("py-20 px-6 md:px-12", className)}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-[#1a3a3a] mb-4"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export const Card = ({ children, className, ...props }: { children: ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("bg-white border border-[#d4af37]/20 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow", className)} {...props}>
      {children}
    </div>
  );
};

export const Button = ({ children, className, onClick, variant = "primary", type = "button", ...props }: { children: ReactNode, className?: string, onClick?: () => void, variant?: "primary" | "secondary" | "outline", type?: "button" | "submit" | "reset" } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = "px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-[#1a3a3a] text-white hover:bg-[#2c5151]",
    secondary: "bg-transparent border-2 border-[#d4af37] text-[#1a3a3a] hover:bg-[#d4af37]/10",
    outline: "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#1a3a3a]"
  };

  return (
    <button type={type} className={cn(baseStyles, variants[variant], className)} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
