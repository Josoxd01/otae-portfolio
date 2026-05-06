import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/lib/firebase";
import {
  getAssetTypeFromMimeType,
  safeFileName,
  validateProjectCoverFile,
  validateProjectMediaFile,
} from "@/lib/media-helpers";
import type { AssetType, ProjectMediaRole, StudioProfile } from "@/types/portfolio";

interface UploadedProjectMedia {
  assetType: AssetType;
  mimeType: string;
  storagePath: string;
  url: string;
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

export async function deleteStorageFile(storagePath: string) {
  await deleteObject(ref(storage, storagePath));
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
    assetType: getAssetTypeFromMimeType(file.type),
    mimeType: file.type,
    storagePath,
    url,
  };
}
