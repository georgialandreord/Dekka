import {
  Circle,
  Eye,
  Frame,
  Heart,
  Palette,
  Rainbow,
  Sparkles,
  Square,
  Star,
  Stars,
  Sticker,
  Zap,
} from "lucide-react";
import type { CreditPackage, FolderData, ImageStyle, StickerPack, Style } from "~/types";
import chrome from "~/assets/images/chrome.jpg";
import doodle from "~/assets/images/doodle.png";
import gummy from "~/assets/images/gummy.jpg";
import kawaii from "~/assets/images/kawaii.png";
import minimalist from "~/assets/images/minimalist.png";
import neon from "~/assets/images/neon.png";
import pixel from "~/assets/images/pixel.png";
import polaroid from "~/assets/images/polaroid.png";
import retro from "~/assets/images/retro.png";
import watercolor from "~/assets/images/watercolor.png";

// background pannel data
export const PRESET_COLORS = [
  "#FFB6C1",
  "#E6A8D7",
  "#C8B6FF",
  "#B6D7FF",
  "#B6FFD7",
  "#FFE6B6",
  "#FFB6B6",
  "#D7B6FF",
  "#B6FFE6",
  "#E6B6FF",
  "#E04483",
  "#E0ACE5",
  "#FF3126",
  "#C057D7",
  "#5149C9",
  "#FF8C25",
];

export const PASTEL_COLORS = [
  "#FFE5EC",
  "#FFF0F5",
  "#E5F5FF",
  "#E5FFF0",
  "#FFF5E5",
  "#F5E5FF",
  "#FFE5E5",
  "#E5FFE5",
  "#E5E5FF",
  "#FFFFE5",
  "#FFD4E5",
  "#E5D4FF",
  "#D4FFE5",
  "#FFE5D4",
  "#D4E5FF",
];

export const NEUTRAL_COLORS = [
  "#FFFFFF",
  "#F5F5F5",
  "#E8E8E8",
  "#D3D3D3",
  "#C0C0C0",
  "#A8A8A8",
  "#808080",
  "#696969",
  "#505050",
  "#000000",
  "#F5F5DC",
  "#FAEBD7",
  "#E6D5B8",
  "#D2B48C",
  "#BC9B7A",
];

export const PATTERN_DATA = [
  // { id: "none", name: "None" },
  { id: "leopard", name: "Leopard" },
  { id: "tiger", name: "Tiger Stripes" },
  { id: "zebra", name: "Zebra" },
  { id: "dots", name: "Dots" },
  { id: "stars", name: "Stars" },
  { id: "gradient", name: "Gradient" },
  { id: "hearts", name: "Hearts" },
  { id: "palm_trees", name: "Palm Trees" },
  { id: "wavy_zebra", name: "Wavy Zebra" },
  { id: "purple_flames", name: "Purple Flames" },
  { id: "cherries", name: "Cherries" },
];

// Effect pannel data
export const EFFECTS = [
  {
    id: "sparkles",
    name: "Sparkles",
    icon: Sparkles,
    description: "Add magical yellow sparkles that twinkle",
    preview: "✨",
  },
  {
    id: "glitter",
    name: "Glitter",
    icon: Stars,
    description: "Add pink shimmer and shine effect",
    preview: "💎"
  },
  {
    id: "retro_sticker",
    name: "Retro Sticker",
    icon: Circle,
    description: "White border with shadow - looks like a classic sticker",
    preview: "🏷️",
  },
  {
    id: "holographic",
    name: "Holographic",
    icon: Rainbow,
    description: "Rainbow chrome iridescent effect",
    preview: "🌈",
  },
  {
    id: "neon_glow",
    name: "Neon Glow",
    icon: Zap,
    description: "Vibrant glowing neon outline",
    preview: "💫",
  },
  {
    id: "shadow",
    name: "Drop Shadow",
    icon: Eye,
    description: "Add depth with a soft shadow",
    preview: "🖤",
  },
];

// Frames pannel data
export const FRAMES = [
  { id: "rectangle", name: "Rectangle", icon: Square },
  { id: "square", name: "Square", icon: Square },
  { id: "heart", name: "Heart", icon: Heart },
  { id: "circle", name: "Circle", icon: Circle },
  { id: "polaroid", name: "Polaroid", icon: Square },
  // { id: "star", name: "Star", icon: Star },
];

//sticker pannel data
export const THEME = [
  "all",
  "tattoo_flash",
  "marvel",
  "y2k",
  "vintage",
  "music",
  "nature",
  "food",
];

export const STICKER_DATA = [
  {
    name: "Chrome Rainbow",
    description: "Holographic metallic chrome with rainbow gradients",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/62d380b70_generated_image.png",
        name: "Chrome Rose",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c23645e49_generated_image.png",
        name: "Chrome Skull",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7e0e5552f_generated_image.png",
        name: "Chrome Flame",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/13fe3e93a_generated_image.png",
        name: "Chrome Cloud",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/94fc193a8_generated_image.png",
        name: "Chrome Music Note",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/69b6fc378_generated_image.png",
        name: "Chrome Smiley Flower",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/683540aee_generated_image.png",
        name: "Chrome Lightning",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/86effbde4_generated_image.png",
        name: "Chrome Star",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "6920169d81da7dd313f05b89",
    created_date: "2025-11-21T07:37:01.609000",
    updated_date: "2025-11-21T07:37:01.609000",
    created_by_id: "692006fe0ada7e6b2ccd2758",
    created_by: "gipefo8269@gamepec.com",
    is_sample: false,
  },
  {
    name: "Colorful Favorites",
    description:
      "Gummy bears, rainbows, peace signs and glittery fun - perfectly cropped!",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/30d9019a0_16.png",
        name: "Gummy Bear",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3e754736a_58.png",
        name: "Rainbow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6ed582472_57.png",
        name: "Peace Sign",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8af007597_59.png",
        name: "Glitter Heart",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f2ed00a454aaec76696f66",
    created_date: "2025-10-18T01:27:28.565000",
    updated_date: "2025-10-18T01:27:28.565000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Generated Mix Pack",
    description:
      "Chrome rainbow, gummy candy, Y2K circles, and polaroid doodles",
    theme: "custom",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f9e3c0d52_1.png",
        name: "Chrome Skull",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/2f7e50ed0_2.png",
        name: "Chrome Rose",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/819e02b8a_3.png",
        name: "Chrome Cloud",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/034abd7df_4.png",
        name: "Chrome Flame",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/20b55b9ce_5.png",
        name: "Chrome Music Note",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3c4668975_6.png",
        name: "Chrome Smiley Flower",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/be63c7fbc_7.png",
        name: "Chrome Lightning",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/32a2e7b4c_8.png",
        name: "Chrome Star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9a34fb7b2_9.png",
        name: "Pink Lightning",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7f05007b7_10.png",
        name: "Daisy Circle White",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f7d41b6be_11.png",
        name: "Daisy Circle Pink",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c4fdd4f09_12.png",
        name: "Red Headphones",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/69e9aa14e_13.png",
        name: "Red Message Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d3e795a17_14.png",
        name: "Red Cowboy Boots",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/23cf25bc5_15.png",
        name: "Red Checkered",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6891d5e24_16.png",
        name: "Gummy Bear",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/91adb80ab_17.png",
        name: "Soda Bottle",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/000d5b73d_18.png",
        name: "Green Pepper",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1860e2c13_19.png",
        name: "Gummy Burger",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4688ab555_20.png",
        name: "Fuck Work Polaroid",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/25d7f53c3_21.png",
        name: "Good Cop Polaroid",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ac6ef658b_22.png",
        name: "Bad Ideas Book",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1ac94c284_23.png",
        name: "Teddy Bear Sketch",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/0ce40c03f_24.png",
        name: "Cow Sketch",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/75d23fb47_25.png",
        name: "Mushroom Sketch",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/86b96c1b1_26.png",
        name: "Disco Ball Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1fa3e60b5_27.png",
        name: "Bad Habits Badge",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/143f658ab_28.png",
        name: "Hot Sauce Bottle",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f24cfffd2b8932d9918608",
    created_date: "2025-10-17T14:04:47.498000",
    updated_date: "2025-10-17T14:04:47.498000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Funny Polaroids",
    description: "Polaroid frames with funny text and doodles",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/36747df6d_generated_image.png",
        name: "Good Cop",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e334ad11a_generated_image.png",
        name: "Happy Hour",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f8d5142ac_generated_image.png",
        name: "Me and Your Mom",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/15e007d2a_generated_image.png",
        name: "The Worst Person",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e5e5a1262_generated_image.png",
        name: "Grocery List",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b723f5a76_generated_image.png",
        name: "Fuck Work",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/994ffd7ae_generated_image.png",
        name: "My Car",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ae5f247c4_generated_image.png",
        name: "Tattoo Ideas",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f241c6d9da04760e883907",
    created_date: "2025-10-17T13:16:54.663000",
    updated_date: "2025-10-17T13:16:54.663000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Soft Y2K Circles",
    description: "Cute circular badges with Y2K aesthetic",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d2ac6343f_generated_image.png",
        name: "Disco Ball",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/53c07eae3_generated_image.png",
        name: "Cowboy Boots",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6ed5169da_generated_image.png",
        name: "Flip Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fdcc8b022_generated_image.png",
        name: "Checkered Pattern",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/793fcb408_generated_image.png",
        name: "Cherry Cowboy Boot",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b74f38211_generated_image.png",
        name: "She Text",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3f8ae83d0_generated_image.png",
        name: "Daisy Flowers",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/34ea61fa7_generated_image.png",
        name: "Headphones",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f241ac727614b357badc8d",
    created_date: "2025-10-17T13:16:28.981000",
    updated_date: "2025-10-17T13:16:28.981000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Vintage Badges",
    description: "Retro circular pins with funny sayings and graphics",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/37130695e_generated_image.png",
        name: "Hello Name Tag",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d98083cc4_generated_image.png",
        name: "I'm a Star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/81741d632_generated_image.png",
        name: "Bad Habits",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7bfc67cbc_generated_image.png",
        name: "Have Nice Forever",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/098371b8d_generated_image.png",
        name: "I'm a Hero",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4ea508f83_generated_image.png",
        name: "Snoopy",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/69db42cd0_generated_image.png",
        name: "Batman",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1abc69c59_generated_image.png",
        name: "I Love to Read",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f2419137c5ec8b7a5e3992",
    created_date: "2025-10-17T13:16:01.088000",
    updated_date: "2025-10-17T13:16:01.088000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Beach Vibes",
    description: "Surf culture, beach text, and coastal lifestyle",
    theme: "nature",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fd04142ec_generated_image.png",
        name: "Beach Please",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ad29b99c9_generated_image.png",
        name: "Beach Bummin",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9dd9e34e4_generated_image.png",
        name: "Aloha",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/0658d3195_generated_image.png",
        name: "Surf Shop",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/0476a3d9b_generated_image.png",
        name: "Shaka Hand",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4306d06c5_generated_image.png",
        name: "Surfboard",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8f08083ae_generated_image.png",
        name: "Sea Turtle",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/5bbf602c5_generated_image.png",
        name: "Sunshine",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f2417f65fad9ca89d817e8",
    created_date: "2025-10-17T13:15:43.042000",
    updated_date: "2025-10-17T13:15:43.042000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Black & White Doodles",
    description: "Hand-drawn black and white sketchy stickers",
    theme: "custom",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/642e9cab9_generated_image.png",
        name: "Teddy Bear",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/591b1fbf8_generated_image.png",
        name: "Mushroom",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7f58a3de4_generated_image.png",
        name: "Cow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7f6b8104a_generated_image.png",
        name: "Bad Ideas Book",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1d0d548d3_generated_image.png",
        name: "Hot Sauce",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/99502c68c_generated_image.png",
        name: "Juice Box",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1c72f42f6_generated_image.png",
        name: "Disco Ball Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7f447d640_generated_image.png",
        name: "Born Sick Text",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f241670a2ba70550f715cf",
    created_date: "2025-10-17T13:15:19.102000",
    updated_date: "2025-10-17T13:15:19.102000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Black & White Doodles",
    description: "Hand-drawn black and white sketchy stickers",
    theme: "custom",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f12c639d9_generated_image.png",
        name: "Teddy Bear",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8ac752a5c_generated_image.png",
        name: "Mushroom",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ed43b5082_generated_image.png",
        name: "Cow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d7a3d4e41_generated_image.png",
        name: "Bad Ideas Book",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/126309212_generated_image.png",
        name: "Hot Sauce",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/17faefcdb_generated_image.png",
        name: "Juice Box",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/78d836dfe_generated_image.png",
        name: "Disco Ball Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/09fc29ba3_generated_image.png",
        name: "Born Sick Text",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f2414fcee4f3a1c70f850a",
    created_date: "2025-10-17T13:14:55.462000",
    updated_date: "2025-10-17T13:14:55.462000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Funny Polaroids",
    description: "Polaroid frames with funny text and doodles",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e4ef6e852_generated_image.png",
        name: "Good Cop",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b399164c0_generated_image.png",
        name: "Happy Hour",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6d60c6cec_generated_image.png",
        name: "Me and Your Mom",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8299929fb_generated_image.png",
        name: "The Worst Person",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/bb15d4cdd_generated_image.png",
        name: "Grocery List",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9f7426de7_generated_image.png",
        name: "Fuck Work",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ecc0ffd9d_generated_image.png",
        name: "My Car",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9e0e51c3c_generated_image.png",
        name: "Tattoo Ideas",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f2413124ca14fa7714c59c",
    created_date: "2025-10-17T13:14:25.829000",
    updated_date: "2025-10-17T13:14:25.829000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Gummy Candy",
    description: "Translucent gummy candies and treats",
    theme: "food",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/733aa97aa_generated_image.png",
        name: "Gummy Bear",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7d3d272ef_generated_image.png",
        name: "Gummy Dolphin",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/812ab58ea_generated_image.png",
        name: "Gummy Worm",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ee4e78427_generated_image.png",
        name: "Gummy Dino",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/14921f2ad_generated_image.png",
        name: "Watermelon Slice",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7c3d91c65_generated_image.png",
        name: "Gummy Pepper",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1442a6e85_generated_image.png",
        name: "Gummy Burger",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/0d72a0fec_generated_image.png",
        name: "Cola Bottle",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f2411da411832eb4120d13",
    created_date: "2025-10-17T13:14:05.557000",
    updated_date: "2025-10-17T13:14:05.557000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Gummy Candy",
    description: "Translucent gummy candies and treats",
    theme: "food",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ef81ce531_generated_image.png",
        name: "Gummy Bear",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/705b9b1de_generated_image.png",
        name: "Gummy Dolphin",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/431fdf8ba_generated_image.png",
        name: "Gummy Worm",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e3c901744_generated_image.png",
        name: "Gummy Dino",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/18f24c6ff_generated_image.png",
        name: "Watermelon Slice",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/bf442ca60_generated_image.png",
        name: "Gummy Pepper",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a3986f3e3_generated_image.png",
        name: "Gummy Burger",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8e656f256_generated_image.png",
        name: "Cola Bottle",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f24103ccf885a683ae05af",
    created_date: "2025-10-17T13:13:39.778000",
    updated_date: "2025-10-17T13:13:39.778000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Soft Y2K Circles",
    description: "Cute circular badges with Y2K aesthetic",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/0187a86c6_generated_image.png",
        name: "Disco Ball",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6867ca968_generated_image.png",
        name: "Cowboy Boots",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/45940c651_generated_image.png",
        name: "Flip Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/af1385852_generated_image.png",
        name: "Checkered Pattern",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/33ea3d3c5_generated_image.png",
        name: "Cherry Cowboy Boot",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/91cf624f0_generated_image.png",
        name: "She Text",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a62200bf8_generated_image.png",
        name: "Daisy Flowers",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d4f96ef08_generated_image.png",
        name: "Headphones",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f240ed3b02a9bc10505214",
    created_date: "2025-10-17T13:13:17.896000",
    updated_date: "2025-10-17T13:13:17.896000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Chrome Rainbow",
    description: "Holographic metallic chrome with rainbow gradients",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3005951ea_generated_image.png",
        name: "Chrome Rose",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6014f31cb_generated_image.png",
        name: "Chrome Skull",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/2e37b6f0f_generated_image.png",
        name: "Chrome Flame",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/63cb84dc0_generated_image.png",
        name: "Chrome Cloud",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7566d371d_generated_image.png",
        name: "Chrome Music Note",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/587ad0be8_generated_image.png",
        name: "Chrome Smiley Flower",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/5c1bd96b2_generated_image.png",
        name: "Chrome Lightning",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/516ade046_generated_image.png",
        name: "Chrome Star",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f240d5aaf393a3da162701",
    created_date: "2025-10-17T13:12:53.276000",
    updated_date: "2025-10-17T13:12:53.276000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Chrome Rainbow",
    description: "Holographic metallic chrome with rainbow gradients",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/01eaaa962_generated_image.png",
        name: "Chrome Rose",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1f9b24c0e_generated_image.png",
        name: "Chrome Skull",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/97942a195_generated_image.png",
        name: "Chrome Flame",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7fe648eb1_generated_image.png",
        name: "Chrome Cloud",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/75148e6f7_generated_image.png",
        name: "Chrome Music Note",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/786f2eee5_generated_image.png",
        name: "Chrome Smiley Flower",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a793e0240_generated_image.png",
        name: "Chrome Lightning",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/cf37b6afb_generated_image.png",
        name: "Chrome Star",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f240b637c5ec8b7a5e3521",
    created_date: "2025-10-17T13:12:22.439000",
    updated_date: "2025-10-17T13:12:22.439000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Artist Essentials",
    description: "Art supplies, watercolors, brushes, and creative tools",
    theme: "custom",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f6f2d070a_generated_image.png",
        name: "Watercolor Set",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7f4692d2d_generated_image.png",
        name: "Paint Brushes",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7a9a3acc9_generated_image.png",
        name: "Artist Palette",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4d118ab69_generated_image.png",
        name: "Polaroid Camera",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/32ad9144d_generated_image.png",
        name: "Paint Tubes",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1e9ef26cf_generated_image.png",
        name: "Sketchbook",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4b36217e0_generated_image.png",
        name: "Coffee & Art",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b42482d93_generated_image.png",
        name: "Washi Tape",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23de4bf707b586df85ea4",
    created_date: "2025-10-17T13:00:20.535000",
    updated_date: "2025-10-17T13:00:20.535000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Beach Vibes",
    description: "Surf culture, beach text, and coastal lifestyle",
    theme: "nature",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b325af5d9_generated_image.png",
        name: "Beach Please",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/46b4dcf9d_generated_image.png",
        name: "Beach Bummin",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6b85db621_generated_image.png",
        name: "Aloha",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3a54d0d57_generated_image.png",
        name: "Surf Shop",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d73ecb72b_generated_image.png",
        name: "Shaka Hand",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/81c91176d_generated_image.png",
        name: "Surfboard",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ee078c396_generated_image.png",
        name: "Sea Turtle",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/be3fe005f_generated_image.png",
        name: "Sunshine",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23dce94995267b628669d",
    created_date: "2025-10-17T12:59:58.693000",
    updated_date: "2025-10-17T12:59:58.693000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Retro Nostalgia",
    description: "Mix of nostalgic items, vintage graphics, and retro vibes",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/56b599e4b_generated_image.png",
        name: "Cassette Tape",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ff4344eeb_generated_image.png",
        name: "Vinyl Record",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3fe87f897_generated_image.png",
        name: "Dice",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6fa9479b1_generated_image.png",
        name: "Realistic Photo",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4a545a5ec_generated_image.png",
        name: "Smiley Patch",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f2c7587a1_generated_image.png",
        name: "McDonalds Fries",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b5094c9c4_generated_image.png",
        name: "Miss Dior",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e1a1372a6_generated_image.png",
        name: "Dalmatian",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23db3950d469378a28201",
    created_date: "2025-10-17T12:59:31.940000",
    updated_date: "2025-10-17T12:59:31.940000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Retro Nostalgia",
    description: "Mix of nostalgic items, vintage graphics, and retro vibes",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b61787ebd_generated_image.png",
        name: "Cassette Tape",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/54226347c_generated_image.png",
        name: "Vinyl Record",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7057c7b5f_generated_image.png",
        name: "Dice",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/127ff600c_generated_image.png",
        name: "Realistic Photo",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/686463714_generated_image.png",
        name: "Smiley Patch",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/0355d48fe_generated_image.png",
        name: "McDonalds Fries",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/af5782fb9_generated_image.png",
        name: "Miss Dior",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/92cf5b304_generated_image.png",
        name: "Dalmatian",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23d8ea411832eb411e943",
    created_date: "2025-10-17T12:58:54.063000",
    updated_date: "2025-10-17T12:58:54.063000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Cute Kawaii Mix",
    description: "Pastel hearts, cute illustrations, and kawaii designs",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8a7a4c611_generated_image.png",
        name: "Cute Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b15dd02bd_generated_image.png",
        name: "Korean Text",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6aad0d9da_generated_image.png",
        name: "Heart Frame",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/2c5b1de99_generated_image.png",
        name: "Cute Shoes",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/78382181f_generated_image.png",
        name: "Melting Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/49e956b2d_generated_image.png",
        name: "Victory Hand",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c6c794d02_generated_image.png",
        name: "Cute Text",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/16cf7dc6a_generated_image.png",
        name: "Music Note",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23d74c782b4d769c552a3",
    created_date: "2025-10-17T12:58:28.755000",
    updated_date: "2025-10-17T12:58:28.755000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Food Doodles",
    description: "Hand-drawn black and white food illustrations",
    theme: "food",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fa9f29c15_generated_image.png",
        name: "Espresso",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d3d75d6f3_generated_image.png",
        name: "Wine Glass",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/2248eb040_generated_image.png",
        name: "Pasta",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/74e236aa8_generated_image.png",
        name: "Pizza Slice",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fde103294_generated_image.png",
        name: "Olive Oil",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3d4de79fa_generated_image.png",
        name: "Lemon",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1e744c390_generated_image.png",
        name: "Basil",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c641bd201_generated_image.png",
        name: "Moka Pot",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23d5943eb73b5fc022c2e",
    created_date: "2025-10-17T12:58:01.241000",
    updated_date: "2025-10-17T12:58:01.241000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Beach Vibes",
    description: "Surf culture, beach text, and coastal lifestyle",
    theme: "nature",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ea49e7688_generated_image.png",
        name: "Beach Please",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b8c5b7e7f_generated_image.png",
        name: "Beach Bummin",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9c18488dc_generated_image.png",
        name: "Aloha",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fae241649_generated_image.png",
        name: "Surf Shop",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/696c5b468_generated_image.png",
        name: "Shaka Hand",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ed0869116_generated_image.png",
        name: "Surfboard",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7a31f3582_generated_image.png",
        name: "Sea Turtle",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d7bd0548a_generated_image.png",
        name: "Sunshine",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23d3f992aa0356280ffde",
    created_date: "2025-10-17T12:57:35.997000",
    updated_date: "2025-10-17T12:57:35.997000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Artist Essentials",
    description: "Art supplies, watercolors, brushes, and creative tools",
    theme: "custom",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3ff34ffb0_generated_image.png",
        name: "Watercolor Set",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3daa0502b_generated_image.png",
        name: "Paint Brushes",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6bf94e9a0_generated_image.png",
        name: "Artist Palette",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/912f7f537_generated_image.png",
        name: "Polaroid Camera",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ec78158f9_generated_image.png",
        name: "Paint Tubes",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fd13c0b7c_generated_image.png",
        name: "Sketchbook",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/381a3b7ca_generated_image.png",
        name: "Coffee & Art",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/0c22d1432_generated_image.png",
        name: "Washi Tape",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23d2e98769e2d3eeeaa1b",
    created_date: "2025-10-17T12:57:18.580000",
    updated_date: "2025-10-17T12:57:18.580000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Vintage Badges",
    description: "Retro circular pins with funny sayings and graphics",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/848f0795e_generated_image.png",
        name: "Hello Name Tag",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/cf4f0e1c3_generated_image.png",
        name: "I'm a Star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/36bb87454_generated_image.png",
        name: "Bad Habits",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7aa5fe953_generated_image.png",
        name: "Have Nice Forever",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c59a6335d_generated_image.png",
        name: "I'm a Hero",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/5ad4c4807_generated_image.png",
        name: "Snoopy",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/dce908125_generated_image.png",
        name: "Batman",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/5e6721351_generated_image.png",
        name: "I Love to Read",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23d16548a797d3558c28b",
    created_date: "2025-10-17T12:56:54.199000",
    updated_date: "2025-10-17T12:56:54.199000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Vintage Badges",
    description: "Retro circular pins with funny sayings and graphics",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fd612d360_generated_image.png",
        name: "Hello Name Tag",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6f91a68ce_generated_image.png",
        name: "I'm a Star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7fef73cf2_generated_image.png",
        name: "Bad Habits",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c31f7fe9f_generated_image.png",
        name: "Have Nice Forever",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/db7763470_generated_image.png",
        name: "I'm a Hero",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ba8646a2c_generated_image.png",
        name: "Snoopy",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/27ca61fce_generated_image.png",
        name: "Batman",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b60872730_generated_image.png",
        name: "I Love to Read",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23cf4a82372054d1f5fe1",
    created_date: "2025-10-17T12:56:20.640000",
    updated_date: "2025-10-17T12:56:20.640000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Y2K Tech",
    description: "Pink gadgets, flip phones, and 2000s technology",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9bc064221_generated_image.png",
        name: "Flip Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4489a7c8c_generated_image.png",
        name: "Digital Pet",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a0d58a161_generated_image.png",
        name: "Pink Camera",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/97c67ed34_generated_image.png",
        name: "Pink Computer",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e7fd66410_generated_image.png",
        name: "MP3 Player",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/adcfc0a65_generated_image.png",
        name: "Hello Kitty Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f7135677c_generated_image.png",
        name: "Game Console",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a1f123149_generated_image.png",
        name: "CD Player",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23cdf0a2ba70550f6fdfa",
    created_date: "2025-10-17T12:55:59.156000",
    updated_date: "2025-10-17T12:55:59.156000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Y2K Tech",
    description: "Pink gadgets, flip phones, and 2000s technology",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7074a0922_generated_image.png",
        name: "Flip Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/eba7ef77f_generated_image.png",
        name: "Digital Pet",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/982391b64_generated_image.png",
        name: "Pink Camera",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/996115329_generated_image.png",
        name: "Pink Computer",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4f3bce2c7_generated_image.png",
        name: "MP3 Player",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f0fd9dc5c_generated_image.png",
        name: "Hello Kitty Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fa3865b6e_generated_image.png",
        name: "Game Console",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/67d919f2a_generated_image.png",
        name: "CD Player",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23cc5928583d9f6394347",
    created_date: "2025-10-17T12:55:33.092000",
    updated_date: "2025-10-17T12:55:33.092000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Glitter & Sparkle",
    description: "Sparkly hearts, stars, rainbows, and smiley faces",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9dd149d89_generated_image.png",
        name: "Glitter Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ecca12021_generated_image.png",
        name: "Rainbow Smiley",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7cafb32b1_generated_image.png",
        name: "Glitter Star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/69512c2d7_generated_image.png",
        name: "Rainbow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ca58c3a50_generated_image.png",
        name: "Flower Power",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/37272342a_generated_image.png",
        name: "Peace Sign",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3f8ea009a_generated_image.png",
        name: "Butterfly",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/06872d933_generated_image.png",
        name: "Cherries",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23cac950d469378a279d7",
    created_date: "2025-10-17T12:55:08.133000",
    updated_date: "2025-10-17T12:55:08.133000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Glitter & Sparkle",
    description: "Sparkly hearts, stars, rainbows, and smiley faces",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7c6f309ef_generated_image.png",
        name: "Glitter Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e9e0a2b91_generated_image.png",
        name: "Rainbow Smiley",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b02b4fc27_generated_image.png",
        name: "Glitter Star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/11ab4b5da_generated_image.png",
        name: "Rainbow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/08f90e71b_generated_image.png",
        name: "Flower Power",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/05a779494_generated_image.png",
        name: "Peace Sign",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f9f043b8b_generated_image.png",
        name: "Butterfly",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/cd721eff6_generated_image.png",
        name: "Cherries",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23c9200a3a637720f1d4e",
    created_date: "2025-10-17T12:54:42.075000",
    updated_date: "2025-10-17T12:54:42.075000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Y2K Tech",
    description: "Pink gadgets, flip phones, and 2000s technology",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f6bc57fdd_generated_image.png",
        name: "Flip Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/52075a107_generated_image.png",
        name: "Digital Pet",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7baff23bb_generated_image.png",
        name: "Pink Camera",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a883ee7f4_generated_image.png",
        name: "Pink Computer",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/75601fdac_generated_image.png",
        name: "MP3 Player",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1bd75a9cc_generated_image.png",
        name: "Hello Kitty Phone",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f199d50ac_generated_image.png",
        name: "Game Console",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e9c058449_generated_image.png",
        name: "CD Player",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23c56950d469378a276e6",
    created_date: "2025-10-17T12:53:42.026000",
    updated_date: "2025-10-17T12:53:42.026000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Glitter & Sparkle",
    description: "Sparkly hearts, stars, rainbows, and smiley faces",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/575a72200_generated_image.png",
        name: "Glitter Heart",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/2391ace30_generated_image.png",
        name: "Rainbow Smiley",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a1c578b9f_generated_image.png",
        name: "Glitter Star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/455572457_generated_image.png",
        name: "Rainbow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/df7502626_generated_image.png",
        name: "Flower Power",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/56909c073_generated_image.png",
        name: "Peace Sign",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/5538e38f1_generated_image.png",
        name: "Butterfly",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/69924fd2a_generated_image.png",
        name: "Cherries",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f23c1b77d1d57bf717e849",
    created_date: "2025-10-17T12:52:43.652000",
    updated_date: "2025-10-17T12:52:43.652000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Y2K Lucky Girl Collection",
    description:
      "Glossy Y2K aesthetic lucky charms and zodiac signs - horseshoes, clovers, evil eyes, and all 12 zodiac symbols",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e0af3acf2_generated_image.png",
        name: "Horseshoe",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/670e698c1_generated_image.png",
        name: "Clover",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/73be6a825_generated_image.png",
        name: "Yin Yang",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c5d89524b_generated_image.png",
        name: "Evil Eye",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/bf4821105_generated_image.png",
        name: "Cherries",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ad1caf8e5_generated_image.png",
        name: "Flower",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/43df77c37_generated_image.png",
        name: "Sun",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/ba4068c7f_generated_image.png",
        name: "Moon",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9cff2a7fb_generated_image.png",
        name: "Aries",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/61c3d01c8_generated_image.png",
        name: "Taurus",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6784f32db_generated_image.png",
        name: "Gemini",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/74c156284_generated_image.png",
        name: "Cancer",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/bb5c2df4e_generated_image.png",
        name: "Leo",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/db9b61b9d_generated_image.png",
        name: "Virgo",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c07c0d514_generated_image.png",
        name: "Libra",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8a928db87_generated_image.png",
        name: "Scorpio",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e6a660fc5_generated_image.png",
        name: "Sagittarius",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/782f1e112_generated_image.png",
        name: "Capricorn",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/cd5a216c0_generated_image.png",
        name: "Aquarius",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/2539f965c_generated_image.png",
        name: "Pisces",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f22b5a5ac7700db9553e1f",
    created_date: "2025-10-17T11:41:14.282000",
    updated_date: "2025-10-17T11:41:14.282000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Y2K Lucky Girl Collection",
    description:
      "Glossy Y2K aesthetic lucky charms and zodiac signs - horseshoes, clovers, evil eyes, and all 12 zodiac symbols",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6511af8da_generated_image.png",
        name: "Horseshoe",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/26642b000_generated_image.png",
        name: "Clover",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3cea43d14_generated_image.png",
        name: "Yin Yang",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/2966e5557_generated_image.png",
        name: "Evil Eye",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/b93a3510c_generated_image.png",
        name: "Cherries",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3fc31899c_generated_image.png",
        name: "Flower",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/dad0b20f7_generated_image.png",
        name: "Sun",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9343913e1_generated_image.png",
        name: "Moon",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6cb6b0a3a_generated_image.png",
        name: "Aries",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/8b2abf6d7_generated_image.png",
        name: "Taurus",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/244999a99_generated_image.png",
        name: "Gemini",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/9de6dfe43_generated_image.png",
        name: "Cancer",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6a5800c92_generated_image.png",
        name: "Leo",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d7b1c96e9_generated_image.png",
        name: "Virgo",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4f7c8ab3a_generated_image.png",
        name: "Libra",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/5e0421480_generated_image.png",
        name: "Scorpio",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/d1d63f666_generated_image.png",
        name: "Sagittarius",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7fb3b4275_generated_image.png",
        name: "Capricorn",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/11e9351e0_generated_image.png",
        name: "Aquarius",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/75c70a09e_generated_image.png",
        name: "Pisces",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f229834924fe94f7e7a31d",
    created_date: "2025-10-17T11:33:23.850000",
    updated_date: "2025-10-17T11:33:23.850000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Tattoo Flash Collection",
    description:
      "Minimalist black line art tattoo designs - moons, stars, arrows, flowers and mystical symbols",
    theme: "tattoo_flash",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1dfcbbe4b_1.png",
        name: "Moon with rays",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/92eddc373_2.png",
        name: "Arrow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/f1605e5d6_3.png",
        name: "Mystical arrow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e87e57c45_4.png",
        name: "Waves and moon",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1a07808d2_5.png",
        name: "Crescent moon",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/5d148cb5b_6.png",
        name: "Double stars",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/c3a3c4e27_7.png",
        name: "Moon with beads",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/e14bebdd4_8.png",
        name: "Moon orb",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/7300e413f_9.png",
        name: "Sacred geometry star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/3cd02ff64_10.png",
        name: "Cosmic burst",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/4cbe7b6e4_11.png",
        name: "Detailed arrow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6bbe9590c_12.png",
        name: "Moon wreath",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a36bb0646_13.png",
        name: "Cloud chandelier",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/fcb1c9625_14.png",
        name: "Moon dreamcatcher",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/6f0be1d5d_15.png",
        name: "Rose",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/11d6501d9_16.png",
        name: "Sun arrow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a30001e80_17.png",
        name: "Flower star",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a5465ebcf_18.png",
        name: "Crossed arrows",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/a073e59fa_19.png",
        name: "Heart arrow",
      },
      {
        url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/1167b69b4_20.png",
        name: "Dotted moon",
      },
    ],
    thumbnail: null,
    downloads: 0,
    id: "68f0eba0f1ba5803e3f82075",
    created_date: "2025-10-16T12:57:04.043000",
    updated_date: "2025-10-16T12:57:04.043000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Marvel Heroes Collection",
    description: "Your favorite Marvel superheroes in cute sticker form!",
    theme: "marvel",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=200",
        name: "Superhero 1",
      },
      {
        url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=200",
        name: "Superhero 2",
      },
      {
        url: "https://images.unsplash.com/photo-1626278664285-f796b9ee7806?w=200",
        name: "Superhero 3",
      },
    ],
    thumbnail: null,
    downloads: 234,
    id: "68e25c5159252ff87671173e",
    created_date: "2025-10-05T11:53:53.172000",
    updated_date: "2025-10-05T11:53:53.172000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Y2K Aesthetic Pack",
    description: "Nostalgic 2000s vibes with butterflies, stars, and sparkles",
    theme: "y2k",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=200",
        name: "Butterfly",
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200",
        name: "Stars",
      },
      {
        url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200",
        name: "Sparkle",
      },
    ],
    thumbnail: null,
    downloads: 567,
    id: "68e25c5159252ff87671173f",
    created_date: "2025-10-05T11:53:53.172000",
    updated_date: "2025-10-05T11:53:53.172000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Vintage Vibes",
    description: "Classic retro stickers for that timeless look",
    theme: "vintage",
    is_free: true,
    price: 0,
    artist_name: null,
    stickers: [
      {
        url: "https://images.unsplash.com/photo-1533093818801-ada38f5f6e66?w=200",
        name: "Vintage 1",
      },
      {
        url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200",
        name: "Vintage 2",
      },
    ],
    thumbnail: null,
    downloads: 189,
    id: "68e25c5159252ff876711740",
    created_date: "2025-10-05T11:53:53.172000",
    updated_date: "2025-10-05T11:53:53.172000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
  {
    name: "Music Lover's Pack",
    description: "For all the music enthusiasts out there",
    theme: "music",
    is_free: false,
    price: 2.99,
    artist_name: "MusicArtist",
    stickers: [
      {
        url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200",
        name: "Music 1",
      },
      {
        url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200",
        name: "Music 2",
      },
    ],
    thumbnail: null,
    downloads: 92,
    id: "68e25c5159252ff876711741",
    created_date: "2025-10-05T11:53:53.172000",
    updated_date: "2025-10-05T11:53:53.172000",
    created_by_id: "68e25a4bb3cd572cc9ec987c",
    created_by: "georgialandreord@gmail.com",
    is_sample: false,
  },
];

export const BACKGROUND_PATTERN = {
  leopard:
    'url(\'data:image/svg+xml,%3Csvg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000" fill-opacity="0.15"%3E%3Cellipse cx="25" cy="20" rx="8" ry="6" transform="rotate(-20 25 20)"/%3E%3Cellipse cx="28" cy="18" rx="5" ry="4" fill="%23000" fill-opacity="0.08"/%3E%3Cellipse cx="70" cy="30" rx="10" ry="7" transform="rotate(15 70 30)"/%3E%3Cellipse cx="73" cy="28" rx="6" ry="5" fill="%23000" fill-opacity="0.08"/%3E%3Cellipse cx="40" cy="55" rx="9" ry="6" transform="rotate(-30 40 55)"/%3E%3Cellipse cx="42" cy="53" rx="5" ry="4" fill="%23000" fill-opacity="0.08"/%3E%3Cellipse cx="90" cy="70" rx="8" ry="7" transform="rotate(25 90 70)"/%3E%3Cellipse cx="92" cy="68" rx="5" ry="4" fill="%23000" fill-opacity="0.08"/%3E%3Cellipse cx="15" cy="85" rx="7" ry="6" transform="rotate(-15 15 85)"/%3E%3Cellipse cx="17" cy="83" rx="4" ry="3" fill="%23000" fill-opacity="0.08"/%3E%3Cellipse cx="55" cy="95" rx="9" ry="6" transform="rotate(10 55 95)"/%3E%3Cellipse cx="58" cy="93" rx="5" ry="4" fill="%23000" fill-opacity="0.08"/%3E%3Cellipse cx="100" cy="15" rx="8" ry="6" transform="rotate(-25 100 15)"/%3E%3Cellipse cx="102" cy="13" rx="5" ry="4" fill="%23000" fill-opacity="0.08"/%3E%3C/g%3E%3C/svg%3E\')',
  tiger:
    'url(\'data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000" fill-opacity="0.15"%3E%3Cpath d="M0 15 Q10 12 20 15 T40 15 T60 15 T80 15 L80 25 Q70 28 60 25 T40 25 T20 25 T0 25 Z"/%3E%3Cpath d="M0 35 Q12 32 24 35 T48 35 T72 35 T80 35 L80 42 Q68 45 56 42 T32 42 T8 42 T0 42 Z"/%3E%3Cpath d="M0 52 Q8 50 16 52 T32 52 T48 52 T64 52 T80 52 L80 60 Q72 62 64 60 T48 60 T32 60 T16 60 T0 60 Z"/%3E%3Cpath d="M0 70 Q10 68 20 70 T40 70 T60 70 T80 70 L80 78 Q70 80 60 78 T40 78 T20 78 T0 78 Z"/%3E%3C/g%3E%3C/svg%3E\')',
  zebra:
    'url(\'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000" fill-opacity="0.15"%3E%3Cpath d="M-10 0 Q20 5 40 0 T80 0 T110 0 L110 15 Q90 18 70 15 T40 15 T10 15 T-10 15 Z"/%3E%3Cpath d="M-10 20 Q15 24 35 20 T65 20 T95 20 T110 20 L110 32 Q85 36 65 32 T35 32 T5 32 T-10 32 Z"/%3E%3Cpath d="M-10 40 Q18 43 38 40 T68 40 T98 40 T110 40 L110 53 Q82 56 62 53 T32 53 T2 53 T-10 53 Z"/%3E%3Cpath d="M-10 60 Q22 65 45 60 T75 60 T105 60 T110 60 L110 72 Q88 77 65 72 T35 72 T5 72 T-10 72 Z"/%3E%3Cpath d="M-10 80 Q20 83 40 80 T70 80 T100 80 T110 80 L110 93 Q80 96 60 93 T30 93 T0 93 T-10 93 Z"/%3E%3C/g%3E%3C/svg%3E\')',
  dots: 'url(\'data:image/svg+xml,%3Csvg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="15" cy="15" r="3" fill="%23000" fill-opacity="0.12"/%3E%3Ccircle cx="15" cy="15" r="2" fill="%23000" fill-opacity="0.08"/%3E%3C/svg%3E\')',
  stars:
    'url(\'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23FFD700" fill-opacity="0.25"%3E%3Cpath d="M25 15 L27 23 L35 23 L29 28 L31 36 L25 31 L19 36 L21 28 L15 23 L23 23 Z"/%3E%3Cpath d="M75 40 L76.5 45 L82 45 L77.5 48.5 L79 54 L75 50 L71 54 L72.5 48.5 L68 45 L73.5 45 Z"/%3E%3Cpath d="M50 75 L51.5 80 L57 80 L52.5 83.5 L54 89 L50 85 L46 89 L47.5 83.5 L43 80 L48.5 80 Z"/%3E%3Cpath d="M15 65 L16 68 L19 68 L16.5 70 L17.5 73 L15 71 L12.5 73 L13.5 70 L11 68 L14 68 Z"/%3E%3Cpath d="M85 75 L86 78 L89 78 L86.5 80 L87.5 83 L85 81 L82.5 83 L83.5 80 L81 78 L84 78 Z"/%3E%3C/g%3E%3C/svg%3E\')',
  gradient:
    "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
  hearts:
    'url(\'data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M40 60 C40 60 20 45 20 30 C20 20 26 15 33 15 C37 15 39 17 40 22 C41 17 43 15 47 15 C54 15 60 20 60 30 C60 45 40 60 40 60 Z" fill="%23ff69b4" fill-opacity="0.2" stroke="%23ff1493" stroke-width="1.5" stroke-opacity="0.3"/%3E%3C/svg%3E\')',
  palm_trees:
    'url(\'data:image/svg+xml,%3Csvg width="100" height="120" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ff1493" fill-opacity="0.3"%3E%3Cpath d="M50 90 L50 50 M50 50 Q30 40 25 30 M50 50 Q70 40 75 30 M50 50 Q40 35 30 28 M50 50 Q60 35 70 28 M50 50 Q35 45 28 38 M50 50 Q65 45 72 38" stroke="%23ff1493" stroke-width="3" fill="none"/%3E%3C/g%3E%3C/svg%3E\')',
  wavy_zebra:
    'url(\'data:image/svg+xml,%3Csvg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 20 Q20 10 40 20 T80 20 T120 20 T150 20 L150 35 Q130 45 110 35 T70 35 T30 35 T0 35 Z M0 50 Q25 40 50 50 T100 50 T150 50 L150 65 Q125 75 100 65 T50 65 T0 65 Z M0 80 Q20 70 40 80 T80 80 T120 80 T150 80 L150 95 Q130 105 110 95 T70 95 T30 95 T0 95 Z M0 110 Q25 100 50 110 T100 110 T150 110 L150 125 Q125 135 100 125 T50 125 T0 125 Z" fill="%23ff69b4" fill-opacity="0.3"/%3E%3C/svg%3E\')',
  purple_flames:
    'url(\'data:image/svg+xml,%3Csvg width="200" height="350" viewBox="0 0 200 350" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3CradialGradient id="flame1" cx="50%25" cy="50%25"%3E%3Cstop offset="0%25" stop-color="%23ffffff" stop-opacity="0.8"/%3E%3Cstop offset="30%25" stop-color="%23e0b3ff" stop-opacity="0.6"/%3E%3Cstop offset="100%25" stop-color="%235149c9" stop-opacity="0.3"/%3E%3C/radialGradient%3E%3C/defs%3E%3Cellipse cx="100" cy="175" rx="60" ry="140" fill="url(%23flame1)" opacity="0.7"/%3E%3Cellipse cx="40" cy="200" rx="40" ry="100" fill="url(%23flame1)" opacity="0.5"/%3E%3Cellipse cx="160" cy="180" rx="35" ry="90" fill="url(%23flame1)" opacity="0.6"/%3E%3Cellipse cx="100" cy="120" rx="30" ry="60" fill="%23ffffff" opacity="0.8"/%3E%3C/svg%3E\')',
  cherries:
    'url(\'data:image/svg+xml,%3Csvg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3CradialGradient id="cherry" cx="40%25" cy="40%25"%3E%3Cstop offset="0%25" stop-color="%23ff69b4"/%3E%3Cstop offset="100%25" stop-color="%23e04483"/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg opacity="0.3"%3E%3Ccircle cx="50" cy="60" r="15" fill="url(%23cherry)"/%3E%3Ccircle cx="75" cy="65" r="15" fill="url(%23cherry)"/%3E%3Cpath d="M50 45 Q60 20 65 15" stroke="%2322c55e" stroke-width="3" fill="none"/%3E%3Cpath d="M75 50 Q70 25 65 15" stroke="%2322c55e" stroke-width="3" fill="none"/%3E%3C/g%3E%3C/svg%3E\')',
};

//draggable-decoration data
export const FRAME_COLORS = [
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // orange
  "#ef4444", // red
  "#000000", // black
  "#ffffff", // white
];

export const tools = [
  { id: "stickers", icon: Sticker, label: "Stickers" },
  { id: "photos", icon: Palette, label: "Photos" },
  { id: "frames", icon: Frame, label: "Frames" },
  { id: "effects", icon: Sparkles, label: "Effects" },
  { id: "background", icon: Palette, label: "Background" },
];

// custom sticker generation

export const THEMES_DATA = [
  { id: "emoji", name: "Emoji/Expressions" },
  { id: "y2k", name: "Y2K Aesthetic" },
  { id: "vintage", name: "Vintage" },
  { id: "nature", name: "Nature" },
  { id: "food", name: "Food & Drinks" },
  { id: "music", name: "Music" },
  { id: "custom", name: "Custom/Other" },
];

export const PACK_NAME = [
  {
    id: "Chrome Rainbow",
    name: "Chrome Rainbow",
  },
  {
    id: "Colorful Favorites",
    name: "Colorful Favorites",
  },
  {
    id: "Generated Mix Pack",
    name: "Generated Mix Pack",
  },
  {
    id: "Soft Y2K Circles",
    name: "Soft Y2K Circles",
  },
  {
    id: "Vintage Badges",
    name: "Vintage Badges",
  },
  {
    id: "Beach Vibes",
    name: "Beach Vibes",
  },
  {
    id: "Black & White Doodles",
    name: "Black & White Doodles",
  },
  {
    id: "Gummy Candy",
    name: "Gummy Candy",
  },
  {
    id: "Artist Essentials",
    name: "Artist Essentials",
  },
  {
    id: "Retro Nostalgia",
    name: "Retro Nostalgia",
  },
  {
    id: "Cute Kawaii Mix",
    name: "Cute Kawaii Mix",
  },
  {
    id: "Food Doodles",
    name: "Food Doodles",
  },
  {
    id: "Y2K Tech",
    name: "Y2K Tech",
  },
  {
    id: "Glitter & Sparkle",
    name: "Glitter & Sparkle",
  },
  {
    id: "Y2K Lucky Girl Collection",
    name: "Y2K Lucky Girl Collection",
  },
  {
    id: "Tattoo Flash Collection",
    name: "Tattoo Flash Collection",
  },
  {
    id: "Marvel Heroes Collection",
    name: "Marvel Heroes Collection",
  },
  {
    id: "Y2K Aesthetic Pack",
    name: "Y2K Aesthetic Pack",
  },
  {
    id: "Music Lover's Pack",
    name: "Music Lover's Pack",
  },
];

export const STYLES = [
  {
    id: "chrome",
    name: "Chrome/Holographic",
    prompt:
      "glossy metallic chrome, rainbow holographic gradient, liquid metal texture, 3D rendering",
  },
  {
    id: "gummy",
    name: "Gummy/Translucent",
    prompt: "translucent gummy candy texture, shiny gelatin, colorful",
  },
  {
    id: "doodle",
    name: "Hand-drawn Doodle",
    prompt: "hand-drawn sketch, black and white line art, simple doodle style",
  },
  {
    id: "polaroid",
    name: "Polaroid/Vintage",
    prompt: "polaroid frame style, vintage aesthetic, taped edges",
  },
  {
    id: "kawaii",
    name: "Kawaii/Cute",
    prompt:
      "kawaii cute style, pastel colors, big eyes, adorable Japanese aesthetic",
  },
  {
    id: "retro",
    name: "Retro Badge",
    prompt: "vintage retro badge pin style, circular emblem, bold typography",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    prompt:
      "soft watercolor painting style, artistic brush strokes, pastel tones",
  },
  {
    id: "neon",
    name: "Neon Glow",
    prompt:
      "neon glow effect, bright vibrant colors, glowing edges, dark background",
  },
  {
    id: "pixel",
    name: "Pixel Art",
    prompt: "pixel art style, 8-bit retro game aesthetic, blocky pixels",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    prompt: "minimalist flat design, simple shapes, clean lines, modern",
  },
];

export const APP_STYLES: Style[] = [
  {
    id: "chrome",
    name: "Chrome/Holographic",
    prompt:
      "glossy metallic chrome, rainbow holographic gradient, liquid metal texture, 3D rendering",
  },
  {
    id: "gummy",
    name: "Gummy/Translucent",
    prompt: "translucent gummy candy texture, shiny gelatin, colorful",
  },
  {
    id: "doodle",
    name: "Hand-drawn Doodle",
    prompt: "hand-drawn sketch, black and white line art, simple doodle style",
  },
  {
    id: "polaroid",
    name: "Polaroid/Vintage",
    prompt: "polaroid frame style, vintage aesthetic, taped edges",
  },
  {
    id: "kawaii",
    name: "Kawaii/Cute",
    prompt:
      "kawaii cute style, pastel colors, big eyes, adorable Japanese aesthetic",
  },
  {
    id: "retro",
    name: "Retro Badge",
    prompt: "vintage retro badge pin style, circular emblem, bold typography",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    prompt:
      "soft watercolor painting style, artistic brush strokes, pastel tones",
  },
  {
    id: "neon",
    name: "Neon Glow",
    prompt:
      "neon glow effect, bright vibrant colors, glowing edges, dark background",
  },
  {
    id: "pixel",
    name: "Pixel Art",
    prompt: "pixel art style, 8-bit retro game aesthetic, blocky pixels",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    prompt: "minimalist flat design, simple shapes, clean lines, modern",
  },
];

export const STYLE_VISUALS: Record<string, any> = {
  chrome: { image: chrome },
  gummy: { image: gummy },
  doodle: { image: doodle },
  polaroid: { image: polaroid },
  kawaii: { image: kawaii },
  retro: { image: retro },
  watercolor: { image: watercolor },
  neon: { image: neon },
  pixel: { image: pixel },
  minimalist: { image: minimalist },
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    label: 'Starter',
    credits: 500,
    price: 10,
  },
  {
    id: 'pro',
    label: 'Pro',
    credits: 1200,
    price: 20,
    isPopular: true,
    bonus: '+50 Bonus',
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    credits: 30000,
    price: 50,
    bonus: '+300 Bonus',
  },
];


export const MOCK_PACKS: StickerPack[] = [
  {
    id: "1",
    title: "Marvel Heroes Collection",
    description: "Epic sticker pack featuring all your favorite Marvel superheroes. Includes Iron Man, Spider-Man, Thor, and more!",
    thumbnail: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400&h=300&fit=crop",
    purchaseLink: "https://example.com/marvel-pack",
    price: 4.99,
    tags: ["marvel", "heroes", "comics"],
    favoriteUserIds: [],
    socialLinks:[],
    createdById: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Y2K Aesthetic Bundle",
    description: "Nostalgic Y2K vibes with butterfly clips, flip phones, and retro tech stickers.",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    purchaseLink: "https://example.com/y2k-pack",
    price: 2.99,
    tags: ["y2k", "vintage", "aesthetic"],
    favoriteUserIds: [],
    socialLinks:[],
    createdById: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Cute Food Emojis",
    description: "Adorable kawaii food stickers. Perfect for foodies and cute content!",
    thumbnail: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
    purchaseLink: "https://example.com/food-pack",
    price: 0,
    tags: ["food", "cute", "emoji"],
    favoriteUserIds: [],
    socialLinks:[],
    createdById: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Nature & Wildlife",
    description: "Beautiful nature-inspired stickers featuring forests, mountains, and wildlife.",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    purchaseLink: "https://example.com/nature-pack",
    price: 3.49,
    tags: ["nature", "wildlife", "outdoors"],
    favoriteUserIds: [],
    socialLinks:[],
    createdById: "user2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Anime Expressions",
    description: "Express yourself with these cute anime character emotion stickers.",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop",
    purchaseLink: "https://example.com/anime-pack",
    price: 1.99,
    tags: ["anime", "cute", "expressions"],
    favoriteUserIds: [],
    socialLinks:[],
    createdById: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Vintage Music Vibes",
    description: "Retro music stickers with vinyl records, cassettes, and classic instruments.",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    purchaseLink: "https://example.com/music-pack",
    price: 2.49,
    tags: ["music", "vintage", "retro"],
    favoriteUserIds: [],
    socialLinks:[],
    createdById: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const ALL_TAGS = ["all", "marvel", "y2k", "vintage", "music", "nature", "food", "emoji", "anime", "cute"];
