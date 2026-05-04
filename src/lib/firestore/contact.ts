import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore/lite";

import { app } from "@/lib/firebase";
import type { ContactChannel, StudioProfile } from "@/types/portfolio";

export interface ContactData {
  contactChannels: ContactChannel[];
  studioProfile: StudioProfile;
}

function sortBySortOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function withId<T extends { id: string }>(id: string, data: T) {
  return { ...data, id };
}

export async function getContactDataFromFirestore(): Promise<ContactData> {
  const db = getFirestore(app);

  const [studioSnapshot, channelsSnapshot] = await Promise.all([
    getDoc(doc(db, "studio_profile", "main")),
    getDocs(query(collection(db, "contact_channels"), where("isActive", "==", true))),
  ]);

  if (!studioSnapshot.exists()) {
    throw new Error("studio_profile/main does not exist in Firestore.");
  }

  return {
    contactChannels: sortBySortOrder(
      channelsSnapshot.docs.map((item) => withId(item.id, item.data() as ContactChannel)),
    ),
    studioProfile: studioSnapshot.data() as StudioProfile,
  };
}
