"use client";

import { useEffect, useState } from "react";

import type { StudioData } from "@/lib/firestore/studio";

export function useStudioData(initialData: StudioData) {
  const [studioData, setStudioData] = useState(initialData);

  useEffect(() => {
    let isMounted = true;

    async function loadStudioData() {
      try {
        const { getStudioDataFromFirestore } = await import("@/lib/firestore/studio");
        const firestoreData = await getStudioDataFromFirestore();

        if (isMounted) {
          setStudioData(firestoreData);
        }
      } catch (error) {
        console.warn("Firestore Studio data failed. Using local mock fallback.", error);
      }
    }

    loadStudioData();

    return () => {
      isMounted = false;
    };
  }, []);

  return studioData;
}
