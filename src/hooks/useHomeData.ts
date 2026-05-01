"use client";

import { useEffect, useState } from "react";

import type { HomeData } from "@/lib/firestore/home";

export function useHomeData(initialData: HomeData) {
  const [homeData, setHomeData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        const { getHomeDataFromFirestore } = await import("@/lib/firestore/home");
        const firestoreData = await getHomeDataFromFirestore();

        if (isMounted) {
          setHomeData(firestoreData);
        }
      } catch (error) {
        console.warn("Firestore Home data failed. Using local mock fallback.", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { homeData, isLoading };
}
