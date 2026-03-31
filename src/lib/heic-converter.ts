import { heicTo } from "heic-to";

/**
 * Converts HEIC images to PNG format
 * @param file - The file to convert
 * @returns Converted File object, or original file if not HEIC
 */
export async function convertHeicToPng(file: File): Promise<File> {
  const isHeic =
    file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");

  if (!isHeic) {
    return file;
  }

  try {
    const convertedBlob = await heicTo({
      blob: file,
      type: "image/png",
    });

    const convertedFile = new File(
      [convertedBlob],
      file.name.replace(/\.heic$/i, ".png"),
      { type: "image/png" },
    );

    return convertedFile;
  } catch (err) {
    console.error("HEIC conversion failed:", err);
    throw new Error(`Failed to convert HEIC file: ${file.name}`);
  }
}

/**
 * Processes an array of files and converts HEIC files to PNG
 * @param files - Array of files to process
 * @returns Array of processed files
 */
export async function processHeicFiles(files: File[]): Promise<File[]> {
  const processedFiles = await Promise.all(
    files.map((file) => convertHeicToPng(file)),
  );
  return processedFiles;
}
