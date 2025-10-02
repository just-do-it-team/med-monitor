import { RouteNames } from "@/app/providers/router/config/route-config.ts";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/ui/button.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { Typography } from "@/shared/ui/typography.tsx";
import SvgIcon from "@/app/assets/icons/common/logo-icon.tsx";
import { BookOpen, LayoutDashboard } from "lucide-react";

export interface linksType {
  id: number;
  name: string;
  icon: ReactNode;
  url: RouteNames | string;
}

export const Navbar = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const links: linksType[] = [
    {
      id: 1,
      name: "Дашборд",
      icon: <LayoutDashboard size={35} />,
      url: RouteNames.DASHBOARD,
    },
    {
      id: 2,
      name: "История",
      icon: <BookOpen size={35} />,
      url: RouteNames.HISTORY,
    },
  ];

  return (
    <div className="flex flex-col justify-between items-center min-w-[134px] max-w-[134px] py-[40px]">
      <div className="flex">
        <SvgIcon width="108" height="43" />
      </div>
      <div className="flex flex-col items-center gap-y-[30px]">
        {links.map((link: linksType) => (
          <Link key={link.id} to={link.url}>
            <Button
              key={link.name}
              variant="ghost"
              size="link"
              className={cn(
                link.url === current
                  ? "flex flex-col text-[18px] bg-white text-darkBlue"
                  : "flex flex-col text-[18px] bg-transparent text-white",
              )}
            >
              {link.icon}
              {link.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex flex-col">
        <Typography size="sm" weight="light" className="text-white/50">
          номер прибора
        </Typography>
        <Typography variant="p" weight="light" className="text-white">
          №111
        </Typography>
      </div>
    </div>
  );
};
