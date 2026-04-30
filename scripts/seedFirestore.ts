import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { DocumentData } from "firebase-admin/firestore";

import {
  seedContactChannels,
  seedProjectCategories,
  seedProjectMediaByProjectId,
  seedProjects,
  seedStudioProfile,
  seedTeamMembers,
} from "../src/data/seed";

type SerializableValue = | string | number | boolean | null | SerializableValue[] | { [key: string]: SerializableValue };

loadEnvFile(".env");
loadEnvFile(".env.local");

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp({
  credential: applicationDefault(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});


const db = getFirestore(app);

async function seedFirestore() {
  console.log("Starting Firestore seed...");

  await upsertDocument("studio_profile/main", seedStudioProfile);

  for (const category of seedProjectCategories) {
    await upsertDocument(`project_categories/${category.id}`, category);
  }

  for (const project of seedProjects) {
    await upsertDocument(`projects/${project.id}`, project);

    const mediaItems = seedProjectMediaByProjectId[project.id] ?? [];
    for (const media of mediaItems) {
      await upsertDocument(`projects/${project.id}/media/${media.id}`, media);
    }
  }

  for (const member of seedTeamMembers) {
    await upsertDocument(`team_members/${member.id}`, member);
  }

  for (const channel of seedContactChannels) {
    await upsertDocument(`contact_channels/${channel.id}`, channel);
  }

  console.log("Firestore seed completed.");
}

async function upsertDocument(path: string, data: unknown) {
  console.log(`Upserting ${path}`);
  await db.doc(path).set(toDocumentData(data), { merge: true });
}

function toDocumentData(data: unknown): DocumentData {
  const cleanedData = removeUndefined(data);

  if (!cleanedData || Array.isArray(cleanedData) || typeof cleanedData !== "object") {
    throw new Error(`Seed payload for document must be an object: ${JSON.stringify(data)}`);
  }

  return cleanedData;
}

function removeUndefined(value: unknown): SerializableValue {
  if (value === undefined) {
    return null;
  }

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => removeUndefined(item));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefined(item)]),
    );
  }

  return String(value);
}

function loadEnvFile(fileName: string) {
  const envPath = resolve(process.cwd(), fileName);
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

seedFirestore().catch((error) => {
  console.error(error);
  process.exit(1);
});
