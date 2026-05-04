import { collection, getDocs, getFirestore, query, where } from "firebase/firestore/lite";

import { app } from "@/lib/firebase";
import type { Project, ProjectCategory, ProjectMedia } from "@/types/portfolio";

export interface ProjectsPageData {
  categories: ProjectCategory[];
  projectMediaByProjectId: Record<string, ProjectMedia[]>;
  projects: Project[];
}

export interface ProjectDetailData {
  categories: ProjectCategory[];
  project: Project;
  projectMedia: ProjectMedia[];
}

function sortBySortOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function withId<T extends { id: string }>(id: string, data: T) {
  return { ...data, id };
}

export async function getProjectsPageDataFromFirestore(): Promise<ProjectsPageData> {
  const db = getFirestore(app);

  const [projectsSnapshot, categoriesSnapshot] = await Promise.all([
    getDocs(query(collection(db, "projects"), where("isActive", "==", true))),
    getDocs(query(collection(db, "project_categories"), where("isActive", "==", true))),
  ]);

  const projects = sortBySortOrder(
    projectsSnapshot.docs.map((item) => withId(item.id, item.data() as Project)),
  );
  const categories = sortBySortOrder(
    categoriesSnapshot.docs.map((item) => withId(item.id, item.data() as ProjectCategory)),
  );

  const mediaEntries = await Promise.all(
    projects.map(async (project) => {
      const mediaSnapshot = await getDocs(
        query(collection(db, "projects", project.id, "media"), where("isVisible", "==", true)),
      );

      return [
        project.id,
        sortBySortOrder(
          mediaSnapshot.docs.map((item) => withId(item.id, item.data() as ProjectMedia)),
        ),
      ] as const;
    }),
  );

  return {
    categories,
    projectMediaByProjectId: Object.fromEntries(mediaEntries),
    projects,
  };
}

export async function getProjectBySlugFromFirestore(slug: string): Promise<Project | undefined> {
  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "projects"), where("slug", "==", slug), where("isActive", "==", true)),
  );
  const project = snapshot.docs[0];

  return project ? withId(project.id, project.data() as Project) : undefined;
}

export async function getProjectMediaFromFirestore(projectId: string): Promise<ProjectMedia[]> {
  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "projects", projectId, "media"), where("isVisible", "==", true)),
  );

  return sortBySortOrder(snapshot.docs.map((item) => withId(item.id, item.data() as ProjectMedia)));
}

export async function getProjectCategoriesFromFirestore(): Promise<ProjectCategory[]> {
  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "project_categories"), where("isActive", "==", true)),
  );

  return sortBySortOrder(snapshot.docs.map((item) => withId(item.id, item.data() as ProjectCategory)));
}

export async function getProjectDetailDataFromFirestore(slug: string): Promise<ProjectDetailData | undefined> {
  const project = await getProjectBySlugFromFirestore(slug);

  if (!project) {
    return undefined;
  }

  const [categories, projectMedia] = await Promise.all([
    getProjectCategoriesFromFirestore(),
    getProjectMediaFromFirestore(project.id),
  ]);

  return { categories, project, projectMedia };
}
