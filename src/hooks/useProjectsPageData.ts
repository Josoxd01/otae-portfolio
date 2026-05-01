"use client";

import { useEffect, useState } from "react";

import type { ProjectsPageData } from "@/lib/firestore/projects";

export function useProjectsPageData(initialData: ProjectsPageData) {
  const [projectsPageData, setProjectsPageData] = useState(initialData);

  useEffect(() => {
    let isMounted = true;

    async function loadProjectsPageData() {
      try {
        const { getProjectsPageDataFromFirestore } = await import("@/lib/firestore/projects");
        const firestoreData = await getProjectsPageDataFromFirestore();

        if (isMounted) {
          setProjectsPageData(firestoreData);
        }
      } catch (error) {
        console.warn("Firestore Projects page data failed. Using local mock fallback.", error);
      }
    }

    loadProjectsPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  return projectsPageData;
}
