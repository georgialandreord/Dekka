import { create } from "zustand";

interface ClipboardItem {
  name: string;
  path: string;
  id: string;
  type: "file" | "folder";
  platform: "dropbox" | "google_drive";
}

interface ClipboardStore {
  items: ClipboardItem[];
  addToClipboard: (items: ClipboardItem[]) => void;
  clearClipboard: () => void;
  hasItems: () => boolean;
  getClipboardSummary: () => string;
}

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  items: [],

  addToClipboard: (items: ClipboardItem[]) => {
    set({ items });
  },

  clearClipboard: () => {
    set({ items: [] });
  },

  hasItems: () => {
    return get().items.length > 0;
  },

  getClipboardSummary: () => {
    const items = get().items;
    if (items.length === 0) return "";

    const folders = items.filter((item) => item.type === "folder").length;
    const files = items.filter((item) => item.type === "file").length;

    const parts = [];
    if (folders > 0) parts.push(`${folders} folder${folders > 1 ? "s" : ""}`);
    if (files > 0) parts.push(`${files} file${files > 1 ? "s" : ""}`);

    return parts.join(", ");
  },
}));
