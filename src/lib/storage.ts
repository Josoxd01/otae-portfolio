import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

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

export async function uploadBlogCoverMedia(blogId: string, file: File) {
  validateProjectCoverFile(file);

  return uploadFile(`blog-media/${blogId}/cover/${Date.now()}-${safeFileName(file.name)}`, file);
}

export async function deleteStorageFile(storagePath: string) {
  await deleteObject(ref(storage, storagePath));
}

export async function deleteStorageFolder(prefix: string) {
  const normalizedPrefix = prefix.trim().replace(/^\/+|\/+$/g, "");

  if (!normalizedPrefix || normalizedPrefix.length < 3) {
    console.warn(`Skipped unsafe storage folder delete for prefix "${prefix}".`);
    return;
  }

  await deleteStorageFolderRef(normalizedPrefix);
}

async function deleteStorageFolderRef(prefix: string) {
  const folderRef = ref(storage, prefix);
  const result = await listAll(folderRef);

  const fileResults = await Promise.allSettled(
    result.items.map((itemRef) => deleteObject(itemRef)),
  );

  fileResults.forEach((deleteResult, index) => {
    if (deleteResult.status === "rejected") {
      console.warn(`Could not delete storage file "${result.items[index].fullPath}".`, deleteResult.reason);
    }
  });

  const folderResults = await Promise.allSettled(
    result.prefixes.map((prefixRef) => deleteStorageFolderRef(prefixRef.fullPath)),
  );

  folderResults.forEach((deleteResult, index) => {
    if (deleteResult.status === "rejected") {
      console.warn(`Could not delete storage folder "${result.prefixes[index].fullPath}".`, deleteResult.reason);
    }
  });
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
