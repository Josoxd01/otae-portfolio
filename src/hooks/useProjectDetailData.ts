"use client";

import { useEffect, useState } from "react";

import type {
  ContactChannel,
  Project,
  ProjectCategory,
  ProjectMedia,
  StudioProfile,
} from "@/types/portfolio";

export interface ProjectDetailPageData {
  categories: ProjectCategory[];
  contactChannels: ContactChannel[];
  project: Project;
  projectMedia: ProjectMedia[];
  studioProfile: StudioProfile;
}

export function useProjectDetailData(slug: string, initialData: ProjectDetailPageData) {
  const [projectDetailData, setProjectDetailData] = useState(initialData);

  useEffect(() => {
    let isMounted = true;

    async function loadProjectDetailData() {
      try {
        const {
          getProjectBySlugFromFirestore,
          getProjectCategoriesFromFirestore,
          getProjectMediaFromFirestore,
        } = await import("@/lib/firestore/projects");
        const firestoreProject = await getProjectBySlugFromFirestore(slug);

        if (!firestoreProject) {
          return;
        }

        const [categories, projectMedia] = await Promise.all([
          getProjectCategoriesFromFirestore(),
          getProjectMediaFromFirestore(firestoreProject.id),
        ]);

        if (isMounted) {
          setProjectDetailData((currentData) => ({
            ...currentData,
            categories,
            project: firestoreProject,
            projectMedia,
          }));
        }
      } catch (error) {
        console.warn("Firestore Project detail data failed. Using local mock fallback.", error);
      }
    }

    loadProjectDetailData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return projectDetailData;
}
