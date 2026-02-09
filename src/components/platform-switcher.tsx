"use client";
import * as React from "react";
import {
  Check,
  ChevronDown,
  Cloud,
  Loader2,
  Link2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { PLATFORM } from "~/server/lib/file-system-client";
import { authClient } from "~/server/better-auth/client";
import { usePlatformStore } from "~/store/platform-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useNavigate } from "react-router";

type PlatFormSwitcherProps = {
  isCollapsed: boolean;
};

export function PlatFormSwitcher({ isCollapsed }: PlatFormSwitcherProps) {
  const navigate = useNavigate()
  const utils = api.useUtils();
  const {
    isFetching,
    currentPlatform,
    startPlatformSwitch,
  } = usePlatformStore();

  const { data: platforms, isLoading: platformsLoading } =
    api.settings.getAvailablePlatforms.useQuery();

  const { data: activePlatform, isPending: activeLoading } =
    api.settings.getActivePlatform.useQuery();

  const setPlatformMutation = api.settings.setActivePlatform.useMutation();

  const [selectedPlatform, setSelectedPlatform] =
    React.useState<PLATFORM>("dropbox");

  const [platformBeingSet, setPlatformBeingSet] =
    React.useState<PLATFORM | null>(null);

  const [dropboxLoading, setDropboxLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (activePlatform) {
      setSelectedPlatform(activePlatform);
    }
  }, [activePlatform]);

  const handlePlatformSelect = (platform: PLATFORM) => {
    setPlatformBeingSet(platform);
    setSelectedPlatform(platform);
    startPlatformSwitch(platform);

    setOpen(false);

    setPlatformMutation.mutate(
      { platform },
      {
        onSuccess: () => {
          utils.invalidate()
          navigate("/dashboard")
        },
        onSettled: () => {
          setPlatformBeingSet(null);
        },
      },
    );
  };

  const handleSocialLogin = async (provider: "dropbox" | "google") => {
    try {
      if (provider === "dropbox") setDropboxLoading(true);
      if (provider === "google") setGoogleLoading(true);

      const data = await authClient.signIn.social({
        provider,
      });

      setOpen(false);

      if (data.data?.url) {
        window.location.href = data.data.url;
      } else {
        if (provider === "dropbox") setDropboxLoading(false);
        if (provider === "google") setGoogleLoading(false);
        console.error("No redirect URL returned from authClient.signIn.social");
      }
    } catch (error) {
      if (provider === "dropbox") setDropboxLoading(false);
      if (provider === "google") setGoogleLoading(false);
      console.error(`Error during ${provider} sign in:`, error);
    }
  };

  const loading = platformsLoading || activeLoading || !platforms;

  if (loading) {
    return (
      <div
        className={cn(
          "border-border bg-card flex items-center gap-3 rounded-xl border p-3 transition-all",
          isCollapsed ? "justify-center" : "",
        )}
      >
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Loader2 className="text-primary h-5 w-5 animate-spin" />
        </div>
        <div
          className={cn(
            "flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
          )}
        >
          <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
            Platform
          </span>
          <span className="animate-pulse-soft text-sm font-semibold whitespace-nowrap">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const isDropboxConnected = platforms.includes("dropbox" as PLATFORM) ?? false;
  const isGoogleConnected =
    platforms.includes("google_drive" as PLATFORM) ?? false;

  const bothConnected = isDropboxConnected && isGoogleConnected;

  const buttonContent = (
    <button
      className={cn(
        "group border-border bg-card flex w-full items-center gap-3 rounded-xl border p-2",
        "hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 hover:shadow-md",
        "focus:ring-primary/20 focus:ring-2 focus:outline-none",
        isCollapsed ? "justify-center gap-0" : "",
      )}
    >
      <div className="from-primary/20 to-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br transition-transform group-hover:scale-105">
        {selectedPlatform.toLocaleUpperCase().slice(0, 1)}
      </div>

      <div
        className={cn(
          "flex flex-1 items-center justify-between overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
        )}
      >
        <div className="flex flex-1 flex-col items-start gap-0.5 min-w-0">
          <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
            Platform
          </span>
          <span className="text-foreground text-sm font-semibold truncate">
            {selectedPlatform}
          </span>
        </div>
        
        <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180 ml-2" />
      </div>
    </button>
  );

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        {isCollapsed ? (
          // When collapsed: Wrap the DropdownTrigger inside the Tooltip
          // This ensures the click event is captured correctly by the Dropdown
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                {buttonContent}
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-primary">
              <p>{selectedPlatform}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          // When expanded: Just the standard DropdownTrigger
          <DropdownMenuTrigger asChild>
            {buttonContent}
          </DropdownMenuTrigger>
        )}

        <DropdownMenuContent
          side="right"
          // Center the menu when collapsed, align to end when expanded
          align={isCollapsed ? "center" : "end"} 
          sideOffset={8}
          className="animate-fade-in border-border bg-popover w-64 rounded-xl border p-2 shadow-lg"
        >
          <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
            Connected Platforms
          </DropdownMenuLabel>

          {(["dropbox", "google_drive"] as PLATFORM[]).map((platform) => {
            const isActive = platform === selectedPlatform;
            const isSetting = platformBeingSet === platform;
            const isConnected =
              platform === "dropbox" ? isDropboxConnected : isGoogleConnected;
            const showConnectText = !bothConnected && !isConnected;
            const isCurrentlyFetching =
              isFetching && currentPlatform === platform;

            return (
              <DropdownMenuItem
                key={platform}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  "focus:bg-accent focus:text-accent-foreground",
                  isActive && isConnected && "bg-primary/10",
                )}
                onSelect={(e) => {
                  e.preventDefault();
                  if (isConnected) {
                    handlePlatformSelect(platform);
                  } else {
                    handleSocialLogin(
                      platform === "dropbox" ? "dropbox" : "google",
                    );
                  }
                }}
                disabled={isSetting || isCurrentlyFetching}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                    isActive && isConnected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {isSetting || isCurrentlyFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    platform.toLocaleUpperCase().slice(0, 1)
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  {isSetting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : platform === "dropbox" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isConnected) {
                          handleSocialLogin("dropbox");
                        } else {
                          handlePlatformSelect("dropbox");
                        }
                      }}
                      disabled={dropboxLoading}
                      className="flex w-full cursor-pointer items-center gap-2 text-left"
                    >
                      {dropboxLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : showConnectText ? (
                        "Connect with Dropbox"
                      ) : (
                        <>Dropbox</>
                      )}
                    </button>
                  ) : platform === "google_drive" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isConnected) {
                          handleSocialLogin("google");
                        } else {
                          handlePlatformSelect("google_drive");
                        }
                      }}
                      disabled={googleLoading}
                      className="flex w-full cursor-pointer items-center gap-2 text-left"
                    >
                      {googleLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : showConnectText ? (
                        "Connect with Google Drive"
                      ) : (
                        <>Google Drive</>
                      )}
                    </button>
                  ) : null}
                  {isConnected && (
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Cloud className="h-3 w-3" />
                      Connected
                    </span>
                  )}
                  {!isConnected && (
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Link2 className="h-3 w-3" />
                      Click to connect
                    </span>
                  )}
                </div>

                {isActive && isConnected && (
                  <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full shrink-0">
                    <Check className="text-primary-foreground h-3 w-3" />
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-2" />

          <div className="px-3 py-2">
            <p className="text-muted-foreground text-xs">
              Switch between your connected cloud storage platforms
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}