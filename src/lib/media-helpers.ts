import type { AssetType } from "@/types/portfolio";

export const maxFileSize = 5 * 1024 * 1024;
export const coverMimeTypes = ["image/jpeg", "image/png", "image/webp"];
export const projectMediaMimeTypes = [...coverMimeTypes, "application/pdf"];

export function validateProjectCoverFile(file: File) {
  validateFile(file, coverMimeTypes, "La portada debe ser JPG, PNG o WebP.");
}

export function validateProjectMediaFile(file: File) {
  validateFile(file, projectMediaMimeTypes, "La media debe ser una imagen JPG, PNG, WebP o PDF.");
}

export function getAssetTypeFromMimeType(mimeType: string): AssetType {
  return mimeType === "application/pdf" ? "pdf" : "image";
}

export function safeFileName(fileName: string) {
  const extension = fileName.split(".").pop();
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const safeBaseName = baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${safeBaseName || "media"}${extension ? `.${extension.toLowerCase()}` : ""}`;
}

function validateFile(file: File, allowedTypes: string[], typeMessage: string) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(typeMessage);
  }

  if (file.size > maxFileSize) {
    throw new Error("El archivo no puede superar 5 MB.");
  }
}
