import type {
  ContactChannel,
  Project,
  ProjectCategory,
  StudioProfile,
} from "@/types/portfolio";

export interface HomeData {
  activeProjects: Project[];
  contactChannels: ContactChannel[];
  featuredProjects: Project[];
  projectCategories: ProjectCategory[];
  studioProfile: StudioProfile;
}

function sortBySortOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function withId<T extends { id: string }>(id: string, data: T) {
  return { ...data, id };
}

export async function getHomeDataFromFirestore(): Promise<HomeData> {
  const [{ collection, doc, getDoc, getDocs, getFirestore, query, where }, { app }] = await Promise.all([import("firebase/firestore/lite"), import("@/lib/firebase")]);

  const db = getFirestore(app);

  const [studioSnapshot, projectsSnapshot, categoriesSnapshot, channelsSnapshot] =
    await Promise.all([
      getDoc(doc(db, "studio_profile", "main")),
      getDocs(query(collection(db, "projects"), where("isActive", "==", true))),
      getDocs(query(collection(db, "project_categories"), where("isActive", "==", true))),
      getDocs(query(collection(db, "contact_channels"), where("isActive", "==", true))),
    ]);

  if (!studioSnapshot.exists()) {
    throw new Error("studio_profile/main does not exist in Firestore.");
  }

  const activeProjects = sortBySortOrder(
    projectsSnapshot.docs.map((item) => withId(item.id, item.data() as Project)),
  );
  const projectCategories = sortBySortOrder(
    categoriesSnapshot.docs.map((item) => withId(item.id, item.data() as ProjectCategory)),
  );
  const contactChannels = sortBySortOrder(
    channelsSnapshot.docs.map((item) => withId(item.id, item.data() as ContactChannel)),
  );

  return {
    activeProjects,
    contactChannels,
    featuredProjects: activeProjects.filter((project) => project.isFeatured),
    projectCategories,
    studioProfile: studioSnapshot.data() as StudioProfile,
  };
}
