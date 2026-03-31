import { useEffect, useState } from "react";
import { X, Plus, ImageIcon, LinkIcon } from "lucide-react";
import type { SocialLink, StickerPack, StickerPackFormData } from "~/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { iconMap } from "./Pack-card";
import type { UserStickerPacks } from "generated/prisma";

interface PackFormModalProps {
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  pack?: UserStickerPacks | null;
  onSubmit: (data: StickerPackFormData) => void;
}

const SUGGESTED_TAGS = [
  "marvel",
  "y2k",
  "vintage",
  "music",
  "nature",
  "food",
  "emoji",
  "anime",
  "cute",
  "memes",
];

const SUGGESTED_PLATFORMS = ["Twitter", "Instagram", "TikTok", "Telegram", "Website","Facebook"];

const PackFormModal = ({
  open,
  isPending,
  onOpenChange,
  pack,
  onSubmit,
}: PackFormModalProps) => {
  const [formData, setFormData] = useState<StickerPackFormData>({
    title: "",
    description: "",
    thumbnail: "",
    purchaseLink: "",
    price: 0,
    tags: [],
    socialLinks: []
  });
  const [tagInput, setTagInput] = useState("");

  // State for new social link input
  const [newLinkPlatform, setNewLinkPlatform] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const isEditing = !!pack;

  useEffect(() => {
    if (pack) {
      setFormData({
        title: pack.title,
        description: pack.description || "",
        thumbnail: pack.thumbnail || "",
        purchaseLink: pack.purchaseLink || "",
        price: pack.price,
        tags: pack.tags,
        socialLinks: Array.isArray(pack.socialLinks) ? pack.socialLinks as StickerPack["socialLinks"] : [] 
      });
    } else {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        purchaseLink: "",
        price: 0,
        tags: [],
        socialLinks: []
      });
    }
    setTagInput("");
  }, [pack, open]);

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !formData.tags.includes(normalizedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, normalizedTag],
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };


  const handleAddSocialLink = () => {
    if (!newLinkPlatform.trim() || !newLinkUrl.trim()) return;

    // Basic URL validation
    try {
      new URL(newLinkUrl);
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const newLink: SocialLink = { platform: newLinkPlatform, url: newLinkUrl };

    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink],
    }));

    setNewLinkPlatform("");
    setNewLinkUrl("");
  };


  const handleRemoveSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl font-bold">
            {isEditing ? "Edit Sticker Pack" : "Create Sticker Pack"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="My Awesome Sticker Pack"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your sticker pack..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-sm font-medium">
              Thumbnail URL
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.png"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: e.target.value,
                    }))
                  }
                  className="h-11 pl-10"
                />
              </div>
            </div>
            {formData.thumbnail && (
              <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-lg border">
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Purchase Link */}
          <div className="space-y-2">
            <Label htmlFor="purchaseLink" className="text-sm font-medium">
              Purchase Link
            </Label>
            <Input
              id="purchaseLink"
              type="url"
              placeholder="https://gumroad.com/l/..."
              value={formData.purchaseLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  purchaseLink: e.target.value,
                }))
              }
              className="h-11"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price (USD)
            </Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                $
              </span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                className="h-11 pl-8"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11"
            />

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="gradient-primary gap-1 border-0 pr-1.5"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-primary-foreground/20 ml-0.5 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested Tags */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.filter((tag) => !formData.tags.includes(tag)).map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-1 text-xs transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    {tag}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Social Media Links Section - NEW */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Social Media / Links</Label>

            {/* Inputs to add new link */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Platform (e.g. Twitter)"
                value={newLinkPlatform}
                onChange={(e) => setNewLinkPlatform(e.target.value)}
                className="h-10 sm:w-36"
                list="platform-suggestions"
              />
              <datalist id="platform-suggestions">
                {SUGGESTED_PLATFORMS.map(p => <option key={p} value={p} />)}
              </datalist>

              <div className="relative flex-1">
                <LinkIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="https://..."
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="h-10 pl-9"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddSocialLink}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Display Added Links */}
            {formData.socialLinks.length > 0 && (
              <div className="space-y-2">
                {formData.socialLinks.map((link, index) => {
                  // Get the icon or fallback to LinkIcon
                  const Icon = iconMap[link.platform.toLowerCase()] || LinkIcon;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-md bg-muted p-2 text-sm"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {/* Icon Display with Tooltip */}
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-background" title={link.platform}>
                          <Icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-muted-foreground truncate text-xs">{link.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(index)}
                        className="text-muted-foreground hover:text-destructive rounded-full p-1 hover:bg-background"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-primary-foreground flex-1 cursor-pointer border-0 hover:opacity-90"
              disabled={!formData.title.trim()}
            >
              {isEditing
                ? "Save Changes"
                : isPending
                  ? "creating..."
                  : "Create Pack"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PackFormModal;
