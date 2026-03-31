import { ExternalLink, Facebook, Globe, Instagram, Link2, MoreVertical, Music, Pencil, Send, Trash2, Twitter, Youtube } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import type { UserStickerPacks } from "generated/prisma";
import type { StickerPack } from "~/types";

interface PackCardProps {
    pack: UserStickerPacks;
    isOwner?: boolean;
    index: number;
    onEdit?: (pack: UserStickerPacks) => void;
    onDelete?: (pack: UserStickerPacks) => void;
}

export const iconMap: Record<string, React.ElementType> = {
    twitter: Twitter,
    x: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music,
    telegram: Send,
    website: Globe,
    web: Globe,
    facebook: Facebook,
};

const PackCard = ({ pack, isOwner = false, index, onEdit, onDelete }: PackCardProps) => {
    const handlePurchaseLink = () => {
        if (pack.purchaseLink) {
            window.open(pack.purchaseLink, "_blank", "noopener,noreferrer");
        }
    };
    const socialLinks = Array.isArray(pack.socialLinks) ? pack.socialLinks as StickerPack["socialLinks"] : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card
                className="group relative p-0 overflow-hidden border-0 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-in"

            >
                {/* Thumbnail */}
                <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                    {pack.thumbnail ? (
                        <img
                            src={pack.thumbnail}
                            alt={pack.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center gradient-hero">
                            <span className="text-6xl">🎨</span>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />

                    {/* Price Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge className="gradient-primary border-0 px-3 py-1 text-sm font-semibold shadow-lg">
                            {pack.price === 0 ? "Free" : `$${pack.price.toFixed(2)}`}
                        </Badge>
                    </div>

                    {/* Actions for owner */}
                    {isOwner && (
                        <div
                            className="absolute top-3 right-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="hover:bg-white cursor-pointer">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded bg-white backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => onEdit?.(pack)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete?.(pack)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {pack.title}
                    </h3>

                    {/* Description */}
                    {pack.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {pack.description}
                        </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {pack.tags.slice(0, 3).map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs font-medium px-2 py-0.5"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {pack.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5">
                                +{pack.tags.length - 3}
                            </Badge>
                        )}
                    </div>

                    {/* Social Links Section - NEW */}
                    {socialLinks && socialLinks.length > 0 && (
                        <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                            {socialLinks.map((link, idx) => {
                                // Find the correct icon component
                                const platformKey = link.platform.toLowerCase();
                                const IconComponent = iconMap[platformKey] || Link2; // Fallback to Link2 icon

                                return (
                                    <a
                                        key={idx}
                                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-primary hover:text-primary transition-colors"
                                        title={link.platform} // Tooltip shows full name on hover
                                    >
                                        <IconComponent className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Purchase link indicator */}
                    {pack?.purchaseLink && (
                        <Button
                            className="mt-4 w-full gap-2 cursor-pointer"
                            onClick={handlePurchaseLink}
                        >
                            <ExternalLink className="h-4 w-4" />
                            Purchase Pack
                        </Button>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default PackCard;