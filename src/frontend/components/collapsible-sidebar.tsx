import { useState, type Dispatch, type SetStateAction } from "react";
import { useLocation, Link, NavLink } from "react-router";
import { cn } from "~/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ShoppingBag,
  User,
  Wand2,
  Menu,
  LogOut,
  Settings,
  Palette,
  PackagePlus,
  Star,
} from "lucide-react";
import { authClient } from "~/server/better-auth/client";
import DashboardIcon from "./dashboard-icon";
import { PLATFORMS } from "~/server/lib/file-system-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { PlatFormSwitcher } from "~/components/platform-switcher";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  disabled?: boolean;
}

type CollapsibleSidebarProps = {
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
};

const navItems: NavItem[] = [
  {
    title: "My Folders",
    url: "/dashboard/folders",
    icon: DashboardIcon,
    disabled: false,
  },
  {
    title: "Starred",
    url: "/dashboard/starred",
    icon: Star,
    disabled: false,
  },
  {
    title: "Marketplace",
    url: "/dashboard/marketplace",
    icon: ShoppingBag,
    disabled: false,
  },
  {
    title: "Artist Dashboard",
    url: "/dashboard/artist",
    icon: User,
    disabled: false,
  },
  {
    title: "Generate Stickers",
    url: "/dashboard/generate-sticker",
    icon: Wand2,
    disabled: false,
  },
];

export function CollapsibleSidebar({
  setMobileMenuOpen,
}: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isSettingLink = location.pathname.startsWith("/dashboard/user-profile");
  const isThemeLink = location.pathname.startsWith("/dashboard/theme");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlelogout = async () => {
    authClient.signOut().then(() => {
      window.location.href = "/auth/login";
    });
  };

  return (
    <aside
      className={`relative flex h-full flex-col transition-all duration-300 ease-in-out ${isCollapsed ? "w-[84px]" : "w-64"} `}
    >
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isCollapsed ? "w-0" : "w-auto",
            )}
          >
            <div
              className={cn(
                "transition-opacity duration-300 ease-in-out",
                isCollapsed ? "opacity-0" : "opacity-100",
              )}
            >
              <h1 className="bg-primary bg-clip-text text-2xl font-bold text-transparent">
                Dekka
              </h1>
              <p
                className={cn(
                  "text-muted-foreground mt-1 truncate text-xs whitespace-nowrap",
                )}
              >
                Transform your folders
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className={`bg-primary hover:bg-primary-hover hidden shrink-0 cursor-pointer rounded-full p-2 transition-colors md:flex`}
          >
            {isCollapsed ? (
              <ChevronRight className="text-primary-foreground h-5 w-5" />
            ) : (
              <ChevronLeft className="text-primary-foreground h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.url);

            const navLinkContent = (
              <>
                <div
                  className={cn("rounded-md p-1", {
                    "bg-primary": isActive,
                  })}
                >
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0",
                      isActive && "text-primary-foreground",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "ml-3 truncate text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out",
                    "transition-opacity delay-200 duration-300",
                    isCollapsed
                      ? "pointer-events-none w-0 overflow-hidden opacity-0"
                      : "pointer-events-auto w-auto opacity-100",
                    isActive && "text-primary",
                  )}
                >
                  {item.title}
                </span>
              </>
            );

            const navLinkClass = cn(
              "group relative flex items-center rounded-xl px-3 py-2 transition-all duration-200",
              item.disabled && "cursor-not-allowed opacity-50",
              !item.disabled &&
              isActive &&
              "bg-secondary text-primary-foreground transform",
              !item.disabled &&
              !isActive &&
              "text-foreground hover:bg-accent hover:text-accent-foreground",
            );

            // Conditionally render Tooltip only when collapsed
            if (isCollapsed) {
              return (
                <Tooltip key={item.title} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.url}
                      className={navLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {navLinkContent}
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-primary">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {navLinkContent}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-4">
        <PlatFormSwitcher isCollapsed={isCollapsed} />
      </div>

      {/* Bottom Section - User Actions */}
      <div className="border-border mt-auto border-t p-4">
        <div className="space-y-2">
          <div
            className={cn(
              "px-4 py-2 transition-all duration-300 ease-in-out",
              isCollapsed
                ? "w-0 overflow-hidden opacity-0"
                : "w-auto opacity-100",
            )}
          >
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Account
            </p>
          </div>

          <NavLink
            to="/dashboard/theme"
            className={cn(
              "group flex w-full items-center rounded-xl px-4 py-3 transition-all duration-300 ease-in-out",
              isThemeLink
                ? "bg-primary text-primary-foreground shadow-lg"
                : "hover:bg-accent",
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Palette
              className={cn(
                "h-5 w-5 shrink-0",
                isThemeLink ? "text-primary-foreground" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "ml-3 truncate text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "pointer-events-none w-0 overflow-hidden opacity-0"
                  : "pointer-events-auto w-auto opacity-100",
                isThemeLink ? "text-primary-foreground" : "text-foreground",
              )}
            >
              Themes
            </span>
          </NavLink>

          <NavLink
            to="/dashboard/user-profile"
            className={cn(
              "group flex w-full items-center rounded-xl px-4 py-3 transition-all duration-300 ease-in-out",
              isSettingLink
                ? "bg-primary text-primary-foreground shadow-lg"
                : "hover:bg-accent",
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Settings
              className={cn(
                "h-5 w-5 shrink-0",
                isSettingLink ? "text-primary-foreground" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "ml-3 truncate text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "pointer-events-none w-0 overflow-hidden opacity-0"
                  : "pointer-events-auto w-auto opacity-100",
                isSettingLink ? "text-primary-foreground" : "text-foreground",
              )}
            >
              Settings
            </span>
          </NavLink>


          <button
            onClick={handlelogout}
            className="group flex w-full cursor-pointer items-center rounded-xl px-4 py-3 transition-all duration-300 ease-in-out hover:bg-destructive-light"
          >
            <LogOut className="text-destructive h-5 w-5 shrink-0" />
            <span
              className={cn(
                "text-destructive ml-3 truncate text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "pointer-events-none w-0 overflow-hidden opacity-0"
                  : "pointer-events-auto w-auto opacity-100",
              )}
            >
              Logout
            </span>
          </button>

        </div>
      </div>
    </aside>
  );
}
