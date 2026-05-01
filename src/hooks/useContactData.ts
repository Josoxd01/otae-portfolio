"use client";

import { useEffect, useState } from "react";

import type { ContactData } from "@/lib/firestore/contact";

export function useContactData(initialData: ContactData) {
  const [contactData, setContactData] = useState(initialData);

  useEffect(() => {
    let isMounted = true;

    async function loadContactData() {
      try {
        const { getContactDataFromFirestore } = await import("@/lib/firestore/contact");
        const firestoreData = await getContactDataFromFirestore();

        if (isMounted) {
          setContactData(firestoreData);
        }
      } catch (error) {
        console.warn("Firestore Contact data failed. Using local mock fallback.", error);
      }
    }

    loadContactData();

    return () => {
      isMounted = false;
    };
  }, []);

  return contactData;
}
