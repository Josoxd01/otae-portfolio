import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  Project,
  ProjectCategory,
  ProjectMedia,
  StudioProfile,
  TeamMember,
} from "@/types/portfolio";

function sortBySortOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function withId<T extends { id: string }>(id: string, data: T) {
  return { ...data, id };
}

function removeUndefinedValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedValues(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefinedValues(item)]),
    ) as T;
  }

  return value;
}

export async function getAdminProjects() {
  const snapshot = await getDocs(collection(db, "projects"));

  return sortBySortOrder(
    snapshot.docs.map((item) => withId(item.id, item.data() as Project)),
  );
}

export async function getAdminProject(projectId: string) {
  const snapshot = await getDoc(doc(db, "projects", projectId));

  if (!snapshot.exists()) {
    return undefined;
  }

  return withId(snapshot.id, snapshot.data() as Project);
}

export async function saveAdminProject(project: Project) {
  const now = new Date().toISOString();
  const projectRef = doc(db, "projects", project.id);

  await setDoc(
    projectRef,
    removeUndefinedValues({
      ...project,
      updatedAt: now,
      createdAt: project.createdAt ?? now,
    }),
    { merge: true },
  );
}

export async function setAdminProjectActive(projectId: string, isActive: boolean) {
  await updateDoc(doc(db, "projects", projectId), {
    isActive,
    updatedAt: new Date().toISOString(),
  });
}

export async function getAdminProjectMedia(projectId: string) {
  const snapshot = await getDocs(collection(db, "projects", projectId, "media"));

  return sortBySortOrder(
    snapshot.docs.map((item) => withId(item.id, item.data() as ProjectMedia)),
  );
}

export async function createAdminProjectMedia(projectId: string, media: Omit<ProjectMedia, "id">) {
  const cleanMedia = removeUndefinedValues(media);
  const mediaRef = await addDoc(collection(db, "projects", projectId, "media"), cleanMedia);
  await updateDoc(mediaRef, { id: mediaRef.id });

  return { ...cleanMedia, id: mediaRef.id };
}

export async function updateAdminProjectMedia(
  projectId: string,
  mediaId: string,
  media: Partial<ProjectMedia>,
) {
  await updateDoc(doc(db, "projects", projectId, "media", mediaId), media);
}

export async function setAdminProjectMediaVisible(
  projectId: string,
  mediaId: string,
  isVisible: boolean,
) {
  await updateAdminProjectMedia(projectId, mediaId, { isVisible });
}

export async function getAdminCategories() {
  const snapshot = await getDocs(collection(db, "project_categories"));

  return sortBySortOrder(
    snapshot.docs.map((item) => withId(item.id, item.data() as ProjectCategory)),
  );
}

export async function getAdminCategory(categoryId: string) {
  const snapshot = await getDoc(doc(db, "project_categories", categoryId));

  if (!snapshot.exists()) {
    return undefined;
  }

  return withId(snapshot.id, snapshot.data() as ProjectCategory);
}

export async function saveAdminCategory(category: ProjectCategory) {
  const now = new Date().toISOString();
  const categoryRef = doc(db, "project_categories", category.id);

  await setDoc(
    categoryRef,
    {
      ...category,
      updatedAt: now,
      createdAt: category.createdAt ?? now,
    },
    { merge: true },
  );
}

export async function setAdminCategoryActive(categoryId: string, isActive: boolean) {
  await updateDoc(doc(db, "project_categories", categoryId), {
    isActive,
    updatedAt: new Date().toISOString(),
  });
}

export async function getAdminStudioProfile() {
  const snapshot = await getDoc(doc(db, "studio_profile", "main"));

  if (!snapshot.exists()) {
    return undefined;
  }

  return snapshot.data() as StudioProfile;
}

export async function saveAdminStudioProfile(studioProfile: StudioProfile) {
  await setDoc(
    doc(db, "studio_profile", "main"),
    {
      ...studioProfile,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function getAdminTeamMembers() {
  const snapshot = await getDocs(collection(db, "team_members"));

  return sortBySortOrder(
    snapshot.docs.map((item) => withId(item.id, item.data() as TeamMember)),
  );
}

export async function getAdminTeamMember(memberId: string) {
  const snapshot = await getDoc(doc(db, "team_members", memberId));

  if (!snapshot.exists()) {
    return undefined;
  }

  return withId(snapshot.id, snapshot.data() as TeamMember);
}

export async function saveAdminTeamMember(member: TeamMember) {
  await setDoc(doc(db, "team_members", member.id), member, { merge: true });
}
