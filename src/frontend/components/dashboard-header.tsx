import { Menu, User, Zap } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { authClient } from "~/server/better-auth/client";
import SearchDropdown from "./search-dropdown";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useCreditsQuery } from "~/queries/useCreditsQuery";
import { useQueryClient } from "@tanstack/react-query";

const DashboardHeader = ({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle: () => void;
}) => {
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["credits"] });
  }, [queryClient])

  const { data: session } = authClient.useSession();
  const { data: credits, isLoading } = useCreditsQuery()
  return (
    <header className="bg-card m-2 rounded-xl p-2 px-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu and search */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onMobileMenuToggle}
            className="hover:bg-accent rounded-lg p-2 transition-colors md:hidden"
          >
            <Menu className="text-muted-foreground h-5 w-5" />
          </button>

          <SearchDropdown />
        </div>

        {/* Right side - Notifications and user */}
        <div className="flex items-center space-x-3">

          <div className="flex items-center space-x-3">
            {/* 🔥 Balance UI */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2"  onClick={() => navigate('/buy-credits')}>
                    <Zap className="h-4 w-4 text-[#e8c114]" fill="gold" />

                    {isLoading ? (
                      <span className="text-muted-foreground text-sm">
                        Loading…
                      </span>
                    ) : (
                      <span className="text-foreground text-sm font-medium">
                        {credits}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>

                <TooltipContent side="bottom" align="end" className="bg-primary">
                  <p className="text-sm">
                    Available credits
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>


            <NavLink
              to="/dashboard/user-profile"
              className="hover:bg-accent flex cursor-pointer items-center space-x-2 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                <User className="text-primary-foreground h-4 w-4" />
              </div>
              <span className="text-foreground hidden text-sm font-medium md:block">
                {session?.user.name}
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};
export default DashboardHeader;
