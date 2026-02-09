import React, { useState } from "react";
import {
  Share2,
  Copy,
  Mail,
  Users,
  Link,
  Globe,
  Lock,
  Eye,
  EyeOff,
  X,
  Check,
  UserPlus,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { toast } from "react-hot-toast";
import { api } from "~/trpc/react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType: "file" | "folder";
  itemId: string;
  platform: string;
}

interface SharePermission {
  id: string;
  email: string;
  role: "reader" | "commenter" | "writer";
  type: "user" | "domain" | "anyone";
  displayName?: string;
  domain?: string;
}

interface ShareLink {
  id: string;
  url: string;
  role: "reader" | "commenter" | "writer";
  visibility: "anyone" | "domain" | "private";
}

const ShareDialog = ({
  open,
  onOpenChange,
  itemName,
  itemType,
  itemId,
  platform,
}: ShareDialogProps) => {
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<
    "reader" | "commenter" | "writer"
  >("reader");
  const [linkRole, setLinkRole] = useState<"reader" | "commenter" | "writer">(
    "reader",
  );
  const [linkCopied, setLinkCopied] = useState(false);

  const accessLevels = {
    reader: { label: "Viewer", icon: Eye, description: "Can view" },
    commenter: { label: "Commenter", icon: Eye, description: "Can comment" },
    writer: { label: "Editor", icon: EyeOff, description: "Can edit" },
  };

  // --- tRPC Mutations & Queries ---

  // Fetch existing permissions
  const { data: permissionsData, refetch: refetchPermissions } =
    api.folder.listPermissions.useQuery(
      {
        itemId,
        itemType,
      },
      {
        enabled: open && !!itemId,
      },
    );

  const createShareLinkMutation = api.folder.createShareLink.useMutation({
    onSuccess: (data) => {
      setShareLink({
        id: data.id,
        url: data.url,
        role: data.role,
        visibility: "anyone",
      });
      toast.success("Share link created successfully");
    },
    onError: () => {
      toast.error("Failed to create share link");
    },
  });

  const shareWithUserMutation = api.folder.shareWithUser.useMutation({
    onSuccess: () => {
      setNewUserEmail("");
      toast.success("User added successfully");
      void refetchPermissions();
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Failed to share with user");
    },
  });

  const removePermissionMutation = api.folder.removePermission.useMutation({
    onSuccess: () => {
      toast.success("Access removed");
      void refetchPermissions();
    },
    onError: () => {
      toast.error("Failed to remove access");
    },
  });

  const createShareLink = async () => {
    createShareLinkMutation.mutate({
      itemId,
      itemType,
      role: linkRole,
    });
  };

  const shareWithUser = async () => {
    if (!newUserEmail.trim()) return;
    shareWithUserMutation.mutate({
      itemId,
      itemType,
      email: newUserEmail.trim(),
      role: newUserRole,
    });
  };

  const copyShareLink = async () => {
    if (!shareLink?.url) return;

    try {
      await navigator.clipboard.writeText(shareLink.url);
      setLinkCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const removePermission = async (permissionId: string) => {
    removePermissionMutation.mutate({
      itemId,
      itemType,
      permissionId,
    });
  };

  const getAccessIcon = (role: "reader" | "commenter" | "writer") => {
    return accessLevels[role]?.icon;
  };

  const getAccessLabel = (role: "reader" | "commenter" | "writer") => {
    return accessLevels[role]?.label;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share "{itemName}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share with people */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add people</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Enter email address"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      shareWithUser();
                    }
                  }}
                />
              </div>
              <Select
                value={newUserRole}
                onValueChange={(value: any) => setNewUserRole(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Viewer</SelectItem>
                  <SelectItem value="commenter">Commenter</SelectItem>
                  <SelectItem value="writer">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={shareWithUser}
                disabled={
                  !newUserEmail.trim() ||
                  shareWithUserMutation.isPending
                }
                size="sm"
              >
                {shareWithUserMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* People with access */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">People with access</Label>
            <ScrollArea className="h-32 w-full rounded-lg border">
              <div className="space-y-2 p-3">
                {!permissionsData?.permissions ||
                  permissionsData.permissions.length === 0 ? (
                  <div className="text-muted-foreground py-4 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No people with access yet</p>
                  </div>
                ) : (
                  permissionsData.permissions.map((permission: any) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-100 to-pink-100">
                          <span className="text-sm font-medium">
                            {permission.displayName?.[0]?.toUpperCase() ||
                              permission.email?.[0]?.toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {permission.displayName || permission.email}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {permission.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {/* {React.createElement(
                              getAccessIcon(permission.role),
                              {
                                className: "h-3 w-3",
                              },
                            )} */}
                          {permission.role || 'Viewer'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePermission(permission.id)}
                          disabled={removePermissionMutation.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* General access */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">General access</Label>
            <div className="rounded-lg border p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {React.createElement(shareLink ? Globe : Lock, {
                    className: "h-4 w-4",
                  })}
                  <span className="text-sm font-medium">
                    {shareLink ? "Anyone with the link" : "Restricted"}
                  </span>
                </div>
                {shareLink && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {React.createElement(getAccessIcon(shareLink.role), {
                      className: "h-3 w-3",
                    })}
                    {getAccessLabel(shareLink.role)}
                  </Badge>
                )}
              </div>

              {!shareLink ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select
                      value={linkRole}
                      onValueChange={(value: any) => setLinkRole(value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reader">Viewer</SelectItem>
                        <SelectItem value="commenter">Commenter</SelectItem>
                        <SelectItem value="writer">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={createShareLink}
                      disabled={
                        createShareLinkMutation.isPending
                      }
                      variant="outline"
                      size="sm"
                    >
                      {createShareLinkMutation.isPending ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                      Create link
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={shareLink.url}
                      readOnly
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={copyShareLink}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {linkCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {linkCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;