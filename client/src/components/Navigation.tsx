import { Link, useLocation } from "wouter";
import { Briefcase, Calendar, CheckSquare, StickyNote, BookHeart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: Briefcase, label: "Work" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks" },
    { href: "/notes", icon: StickyNote, label: "Notes" },
    { href: "/journal", icon: BookHeart, label: "Journal" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 md:static md:w-20 md:h-screen md:flex-col md:border-r md:border-t-0 md:justify-center md:items-center py-2 md:py-0">
      <div className="flex justify-around items-center w-full md:flex-col md:h-full md:justify-center md:gap-8">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          
          return (
            <Link key={link.href} href={link.href} className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 group",
              isActive ? "nav-item-active" : "text-muted-foreground hover:text-white"
            )}>
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-gradient-to-tr from-[#FF007A]/20 to-[#833AB4]/20" : "group-hover:bg-white/5"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              </div>
              <span className="text-[10px] mt-1 font-medium md:hidden">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
