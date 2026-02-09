// Color utility functions for the cloud storage interface
// Provides easy access to file type colors, action colors, and semantic colors

export type FileType =
  | "document"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "pdf"
  | "text"
  | "spreadsheet"
  | "presentation";

export type ActionType =
  | "upload"
  | "download"
  | "share"
  | "sync"
  | "delete"
  | "edit";

export type StatusType = "success" | "warning" | "error" | "info";

// File type color mapping
export const fileTypeColors: Record<FileType, string> = {
  document: "var(--file-document)",
  image: "var(--file-image)",
  video: "var(--file-video)",
  audio: "var(--file-audio)",
  archive: "var(--file-archive)",
  code: "var(--file-code)",
  pdf: "var(--file-document)",
  text: "var(--file-document)",
  spreadsheet: "var(--file-document)",
  presentation: "var(--file-document)",
};

// Action color mapping
export const actionColors: Record<ActionType, string> = {
  upload: "var(--action-upload)",
  download: "var(--action-download)",
  share: "var(--action-share)",
  sync: "var(--action-sync)",
  delete: "var(--destructive)",
  edit: "var(--action-upload)",
};

// Status color mapping
export const statusColors: Record<
  StatusType,
  { bg: string; fg: string; light: string }
> = {
  success: {
    bg: "var(--success)",
    fg: "var(--success-foreground)",
    light: "var(--success-light)",
  },
  warning: {
    bg: "var(--warning)",
    fg: "var(--warning-foreground)",
    light: "var(--warning-light)",
  },
  error: {
    bg: "var(--destructive)",
    fg: "var(--destructive-foreground)",
    light: "var(--destructive-light)",
  },
  info: {
    bg: "var(--primary)",
    fg: "var(--primary-foreground)",
    light: "var(--primary-light)",
  },
};

// Helper function to get file type color
export function getFileTypeColor(fileType: FileType): string {
  return fileTypeColors[fileType] || fileTypeColors.document;
}

// Helper function to get action color
export function getActionColor(action: ActionType): string {
  return actionColors[action] || actionColors.upload;
}

// Helper function to get status colors
export function getStatusColors(status: StatusType) {
  return statusColors[status] || statusColors.info;
}

// Helper function to determine file type from file extension
export function getFileTypeFromExtension(extension: string): FileType {
  const ext = extension.toLowerCase().replace(".", "");

  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "ico",
  ];
  const videoExtensions = [
    "mp4",
    "avi",
    "mov",
    "wmv",
    "flv",
    "webm",
    "mkv",
    "m4v",
  ];
  const audioExtensions = ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a"];
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"];
  const codeExtensions = [
    "js",
    "ts",
    "jsx",
    "tsx",
    "html",
    "css",
    "scss",
    "less",
    "py",
    "java",
    "cpp",
    "c",
    "php",
    "rb",
    "go",
    "rs",
  ];
  const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf", "odt"];
  const spreadsheetExtensions = ["xls", "xlsx", "csv", "ods"];
  const presentationExtensions = ["ppt", "pptx", "odp"];

  if (imageExtensions.includes(ext)) return "image";
  if (videoExtensions.includes(ext)) return "video";
  if (audioExtensions.includes(ext)) return "audio";
  if (archiveExtensions.includes(ext)) return "archive";
  if (codeExtensions.includes(ext)) return "code";
  if (documentExtensions.includes(ext)) return "document";
  if (spreadsheetExtensions.includes(ext)) return "spreadsheet";
  if (presentationExtensions.includes(ext)) return "presentation";

  return "document";
}

// Helper function to get contrast color for text on colored backgrounds
export function getContrastColor(backgroundColor: string): string {
  // Simple heuristic - for now, return white for most cases
  // In a real implementation, you'd calculate actual luminance
  return "white";
}

// Color palette for custom folder themes
export const folderThemeColors = {
  professional: [
    "var(--file-document)",
    "var(--file-image)",
    "var(--file-video)",
    "var(--file-audio)",
  ],
  warm: [
    "oklch(0.67 0.17 258.326)", // Primary Blue
    "oklch(0.7 0.18 258.326)", // Lighter Blue
    "oklch(0.65 0.16 258.326)", // Medium Blue
    "oklch(0.62 0.15 258.326)", // Darker Blue
  ],
  cool: [
    "oklch(0.5 0.15 200)", // Blue
    "oklch(0.45 0.18 180)", // Teal
    "oklch(0.6 0.12 220)", // Sky blue
    "oklch(0.55 0.16 160)", // Green-blue
  ],
  neutral: [
    "oklch(0.4 0.02 264)", // Dark gray
    "oklch(0.6 0.02 264)", // Medium gray
    "oklch(0.8 0.02 264)", // Light gray
    "oklch(0.3 0.01 264)", // Very dark gray
  ],
};

// Get a random theme color for folder customization
export function getRandomThemeColor(
  theme: keyof typeof folderThemeColors = "professional",
): string {
  const colors = folderThemeColors[theme];
  if (!colors || colors.length === 0) {
    return "var(--file-document)";
  }
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex]!;
}
