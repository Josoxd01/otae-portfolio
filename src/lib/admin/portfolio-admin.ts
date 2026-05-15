import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  collection,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  createBlog,
  hideBlog,
  publishBlog,
  updateBlog,
  updateBlogStatus,
} from "@/lib/firestore/blogs";
import { removeUndefinedValues, sortBySortOrder, sortProjects } from "@/lib/portfolio-helpers";
import { deleteStorageFile } from "@/lib/storage";
import type {
  Blog,
  BlogStatus,
  Project,
  ProjectCategory,
  ProjectMedia,
  StudioProfile,
  TeamMember,
} from "@/types/portfolio";

function withId<T extends { id: string }>(id: string, data: T) {
  return { ...data, id };
}

export async function getAdminBlogs() {
  const snapshot = await getDocs(collection(db, "blogs"));

  return sortBlogsByDate(
    snapshot.docs.map((item) => withId(item.id, item.data() as Blog)),
  );
}

export async function getAdminBlog(blogId: string) {
  const snapshot = await getDoc(doc(db, "blogs", blogId));

  if (!snapshot.exists()) {
    return null;
  }

  return withId(snapshot.id, snapshot.data() as Blog);
}

export async function saveAdminBlog(blog: Blog) {
  const existingBlog = blog.id ? await getAdminBlog(blog.id) : null;

  if (existingBlog) {
    await updateBlog(blog.id, blog);
    return;
  }

  await createBlog(blog);
}

export async function setAdminBlogStatus(blogId: string, status: BlogStatus) {
  await updateBlogStatus(blogId, status);
}

export async function publishAdminBlog(blogId: string) {
  await publishBlog(blogId);
}

export async function hideAdminBlog(blogId: string) {
  await hideBlog(blogId);
}

export async function deleteAdminBlog(blogId: string) {
  const blog = await getAdminBlog(blogId);

  if (blog?.coverMedia?.storagePath) {
    await deleteStoragePaths([blog.coverMedia.storagePath]);
  }

  await deleteDoc(doc(db, "blogs", blogId));
}

function sortBlogsByDate(items: Blog[]) {
  return [...items].sort((firstBlog, secondBlog) => {
    const firstDate = firstBlog.publishedAt ?? firstBlog.createdAt ?? "";
    const secondDate = secondBlog.publishedAt ?? secondBlog.createdAt ?? "";

    return secondDate.localeCompare(firstDate);
  });
}

export async function getAdminProjects() {
  const snapshot = await getDocs(collection(db, "projects"));

  return sortProjects(
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

export async function hideAdminProject(projectId: string) {
  await setAdminProjectActive(projectId, false);
}

export async function deleteAdminProject(projectId: string) {
  const project = await getAdminProject(projectId);
  const media = await getAdminProjectMedia(projectId);
  const storagePaths = [
    project?.coverMedia?.storagePath,
    ...media.map((item) => item.storagePath),
  ].filter((path): path is string => Boolean(path));

  await deleteStoragePaths(storagePaths);

  const batch = writeBatch(db);
  media.forEach((item) => {
    batch.delete(doc(db, "projects", projectId, "media", item.id));
  });
  batch.delete(doc(db, "projects", projectId));
  await batch.commit();
}

export async function updateAdminProjectSortOrders(projects: Array<Pick<Project, "id" | "sortOrder">>) {
  const batch = writeBatch(db);
  const updatedAt = new Date().toISOString();

  projects.forEach((project) => {
    batch.update(doc(db, "projects", project.id), {
      sortOrder: project.sortOrder,
      updatedAt,
    });
  });

  await batch.commit();
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

export async function updateAdminProjectMediaSortOrders(
  projectId: string,
  mediaItems: Array<Pick<ProjectMedia, "id" | "sortOrder">>,
) {
  const batch = writeBatch(db);

  mediaItems.forEach((media) => {
    batch.update(doc(db, "projects", projectId, "media", media.id), {
      sortOrder: media.sortOrder,
    });
  });

  await batch.commit();
}

export async function deleteAdminProjectMedia(projectId: string, mediaId: string) {
  await deleteDoc(doc(db, "projects", projectId, "media", mediaId));
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

export async function updateAdminCategorySortOrders(
  categories: Array<Pick<ProjectCategory, "id" | "sortOrder">>,
) {
  const batch = writeBatch(db);
  const updatedAt = new Date().toISOString();

  categories.forEach((category) => {
    batch.update(doc(db, "project_categories", category.id), {
      sortOrder: category.sortOrder,
      updatedAt,
    });
  });

  await batch.commit();
}

export async function setAdminCategoryActive(categoryId: string, isActive: boolean) {
  await updateDoc(doc(db, "project_categories", categoryId), {
    isActive,
    updatedAt: new Date().toISOString(),
  });
}

export async function hideAdminCategory(categoryId: string) {
  await setAdminCategoryActive(categoryId, false);
}

export interface CategoryUsage {
  blogCount: number;
  projectCount: number;
}

export async function getAdminCategoryUsage(categoryId: string): Promise<CategoryUsage> {
  const [
    projectsByCategory,
    projectsByPrimaryCategory,
    blogsByCategory,
  ] = await Promise.all([
    getDocs(query(collection(db, "projects"), where("categoryIds", "array-contains", categoryId))),
    getDocs(query(collection(db, "projects"), where("primaryCategoryId", "==", categoryId))),
    getDocs(query(collection(db, "blogs"), where("categoryIds", "array-contains", categoryId))),
  ]);

  const projectIds = new Set<string>();
  projectsByCategory.docs.forEach((item) => projectIds.add(item.id));
  projectsByPrimaryCategory.docs.forEach((item) => projectIds.add(item.id));

  return {
    blogCount: blogsByCategory.size,
    projectCount: projectIds.size,
  };
}

export async function deleteAdminCategory(categoryId: string) {
  const category = await getAdminCategory(categoryId);

  if (category?.coverMedia?.storagePath) {
    await deleteStoragePaths([category.coverMedia.storagePath]);
  }

  await deleteDoc(doc(db, "project_categories", categoryId));
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
    removeUndefinedValues({
      ...studioProfile,
      updatedAt: new Date().toISOString(),
    }),
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
  await setDoc(
    doc(db, "team_members", member.id),
    removeUndefinedValues(member),
    { merge: true },
  );
}

export async function updateAdminTeamMemberSortOrders(
  members: Array<Pick<TeamMember, "id" | "sortOrder">>,
) {
  const batch = writeBatch(db);

  members.forEach((member) => {
    batch.update(doc(db, "team_members", member.id), {
      sortOrder: member.sortOrder,
    });
  });

  await batch.commit();
}

export async function deleteAdminTeamMember(memberId: string) {
  await deleteDoc(doc(db, "team_members", memberId));
}

export async function setAdminTeamMemberActive(memberId: string, isActive: boolean) {
  await updateDoc(doc(db, "team_members", memberId), { isActive });
}

async function deleteStoragePaths(paths: string[]) {
  const uniquePaths = Array.from(new Set(paths));

  const results = await Promise.allSettled(
    uniquePaths.map((path) => deleteStorageFile(path)),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.warn(`Could not delete storage file "${uniquePaths[index]}".`, result.reason);
    }
  });
}
