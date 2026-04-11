/**
 * Alex Logo Service
 *
 * Utility for converting local image files to base64 data URIs.
 *
 * @module logoService
 */

import * as fs from "fs-extra";
import * as path from "path";

/**
 * Convert a local image file to base64 data URI.
 */
export function fileToBase64DataUri(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };

  const mimeType = mimeTypes[ext] || "image/png";
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString("base64");

  return `data:${mimeType};base64,${base64}`;
}
