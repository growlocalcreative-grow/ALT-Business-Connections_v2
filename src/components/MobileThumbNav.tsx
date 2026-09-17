import { LayoutGrid, Calendar, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

interface MobileThumbNavProps {
  onJoinClick: () => void;
}

export const MobileThumbNav = ({ onJoinClick }: MobileThumbNavProps) => {
  const location = useLocation();

  const navItems = [
    {
      label: "Directory",
      icon: LayoutGrid,
      path: "/directory",
      type: "link"
    },
    {
      label: "Events",
      icon: Calendar,
      path: "/#events",
      type: "link"
    },
    {
      label: "Join",
      icon: Heart,
      onClick: onJoinClick,
      type: "button"
    }
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-[60]">
      <div className="bg-[#1a3a3a]/90 backdrop-blur-md border border-[#d4af37]/20 rounded-2xl shadow-2xl px-6 py-3 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path?.includes('#') && location.pathname === '/' && location.hash === '#' + item.path.split('#')[1]);
          const Icon = item.icon;

          if (item.type === "link") {
            return (
              <Link
                key={item.label}
                to={item.path!}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive ? "text-[#d4af37]" : "text-white/70 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          }

          if (item.type === "anchor") {
            return (
              <a
                key={item.label}
                href={item.path}
                className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
