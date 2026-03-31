export type FolderData = {
  name: string;
  color: string;
  background_pattern: string;
  decorations: DecorationItem[];
  thumbnail: null;
  id: string;
  created_date: string;
  updated_date: string;
  created_by_id: string;
  created_by: string;
  is_sample: boolean;
};

export type DecorationType = "sticker" | "photo" | "frame";

export interface DecorationItem {
  id: string;
  type: DecorationType;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  font_family: string | null;
  font_color: string | null;
  frame_style: string | null;
  frame_content: string | null;
  frame_color: string | null;
  effects: string[];
  zIndex: number;
}


export interface ImageStyle {
  id: string;
  name: string;
  promptSuffix: string;
  thumbnail: string;
  badge: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  styleName: string;
  timestamp: number;
}


export interface Style {
  id: string;
  name: string;
  prompt: string;
}


export interface CreditPackage {
  id: string;
  label: string;
  credits: number;
  price: number;
  isPopular?: boolean;
  bonus?: string;
}

export type PurchaseStatus = "idle" | "processing" | "success";

export interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

export interface StickerPack {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  purchaseLink?: string | null;
  price: number;
  tags: string[];
  socialLinks: SocialLink[];
  favoriteUserIds: string[];
  createdById: string;
  createdBy?: User;
  createdAt: Date;
  updatedAt: Date;
}

export type SocialLink = {
  platform: string;
  url: string;
};

export type StickerPackFormData = {
  title: string;
  description: string;
  thumbnail: string;
  purchaseLink: string;
  price: number;
  tags: string[];
  socialLinks: SocialLink[];
};
