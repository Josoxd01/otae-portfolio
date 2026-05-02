import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/lib/firebase";
import type { AssetType, ProjectMediaRole, StudioProfile } from "@/types/portfolio";

const maxFileSize = 5 * 1024 * 1024;
const coverMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const projectMediaMimeTypes = [...coverMimeTypes, "application/pdf"];

interface UploadedProjectMedia {
  assetType: AssetType;
  mimeType: string;
  storagePath: string;
  url: string;
}

export function validateProjectCoverFile(file: File) {
  validateFile(file, coverMimeTypes, "La portada debe ser JPG, PNG o WebP.");
}

export function validateProjectMediaFile(file: File) {
  validateFile(file, projectMediaMimeTypes, "La media debe ser una imagen JPG, PNG, WebP o PDF.");
}

export async function uploadProjectCoverMedia(projectId: string, file: File) {
  validateProjectCoverFile(file);

  return uploadProjectFile(projectId, file, "cover");
}

export async function uploadProjectMedia(
  projectId: string,
  file: File,
  role: ProjectMediaRole,
) {
  validateProjectMediaFile(file);

  return uploadProjectFile(projectId, file, role);
}

export async function uploadCategoryCoverMedia(categoryId: string, file: File) {
  validateProjectCoverFile(file);

  return uploadFile(`category-media/${categoryId}/cover/${Date.now()}-${safeFileName(file.name)}`, file);
}

export async function uploadStudioMedia(
  field: Extract<keyof StudioProfile, "logoMedia" | "heroMedia" | "heroImage" | "aboutImage">,
  file: File,
) {
  validateProjectCoverFile(file);

  const folderByField = {
    logoMedia: "logo",
    heroMedia: "hero",
    heroImage: "hero",
    aboutImage: "about",
  } satisfies Record<typeof field, string>;

  return uploadFile(`studio-media/${folderByField[field]}/${Date.now()}-${safeFileName(file.name)}`, file);
}

export async function uploadTeamMemberPhoto(memberId: string, file: File) {
  validateProjectCoverFile(file);

  return uploadFile(`team-media/${memberId}/photo/${Date.now()}-${safeFileName(file.name)}`, file);
}

function validateFile(file: File, allowedTypes: string[], typeMessage: string) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(typeMessage);
  }

  if (file.size > maxFileSize) {
    throw new Error("El archivo no puede superar 5 MB.");
  }
}

async function uploadProjectFile(
  projectId: string,
  file: File,
  folder: string,
): Promise<UploadedProjectMedia> {
  return uploadFile(`project-media/${projectId}/${folder}/${Date.now()}-${safeFileName(file.name)}`, file);
}

async function uploadFile(storagePath: string, file: File): Promise<UploadedProjectMedia> {
  const fileRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(fileRef, file, { contentType: file.type });
  const url = await getDownloadURL(snapshot.ref);

  return {
    assetType: file.type === "application/pdf" ? "pdf" : "image",
    mimeType: file.type,
    storagePath,
    url,
  };
}

function safeFileName(fileName: string) {
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
