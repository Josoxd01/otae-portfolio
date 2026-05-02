"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStudioProfile, saveAdminStudioProfile } from "@/lib/admin/portfolio-admin";
import { uploadStudioMedia } from "@/lib/storage";
import type { MediaReference, StudioProfile } from "@/types/portfolio";

type StudioMediaField = "logoMedia" | "heroMedia" | "heroImage" | "aboutImage";

const mediaFields: Array<{ field: StudioMediaField; label: string; folder: string }> = [
  { field: "logoMedia", label: "Logo", folder: "logo" },
  { field: "heroMedia", label: "Hero media", folder: "hero" },
  { field: "heroImage", label: "Hero image", folder: "hero" },
  { field: "aboutImage", label: "About image", folder: "about" },
];

export function AdminStudioPageClient() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<StudioMediaField | null>(null);
  const [studioProfile, setStudioProfile] = useState<StudioProfile>(() => ({
    name: "OTAE",
  }));
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStudioProfile() {
      try {
        const data = await getAdminStudioProfile();

        if (isMounted && data) {
          setStudioProfile(data);
        }
      } catch (error) {
        console.warn("Could not load studio profile.", error);
        setErrorMessage("No se pudo cargar el perfil del estudio.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStudioProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    try {
      await saveAdminStudioProfile(studioProfile);
      setUploadMessage("Perfil del estudio guardado.");
    } catch (error) {
      console.warn("Could not save studio profile.", error);
      setErrorMessage("No se pudo guardar el perfil del estudio.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMediaUpload(field: StudioMediaField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setErrorMessage("");
    setUploadMessage("");
    setUploadingField(field);

    try {
      const uploaded = await uploadStudioMedia(field, file);
      const updatedProfile = {
        ...studioProfile,
        [field]: {
          assetType: "image",
          altText: studioProfile[field]?.altText ?? mediaFields.find((item) => item.field === field)?.label,
          storagePath: uploaded.storagePath,
          url: uploaded.url,
        } satisfies MediaReference,
      };

      await saveAdminStudioProfile(updatedProfile);
      setStudioProfile(updatedProfile);
      setUploadMessage(`${mediaFields.find((item) => item.field === field)?.label} actualizado.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploadingField(null);
    }
  }

  function updateMediaAltText(field: StudioMediaField, value: string) {
    setStudioProfile((current) => ({
      ...current,
      [field]: current[field]
        ? {
            ...current[field],
            altText: value,
          }
        : {
            assetType: "image",
            altText: value,
            url: "",
          },
    }));
  }

  return (
    <AdminShell>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">Admin / Estudio</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              Perfil del estudio
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
              Gestiona las imágenes institucionales del estudio. Los textos completos se editarán
              en una siguiente fase del CMS.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {uploadMessage ? (
          <p className="mt-8 border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
            {uploadMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mt-10 text-sm text-neutral-500">Cargando perfil del estudio...</p>
        ) : (
          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            {mediaFields.map((item) => {
              const media = studioProfile[item.field];

              return (
                <article key={item.field} className="border border-neutral-200 bg-white p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="section-label">{item.folder}</p>
                      <h2 className="mt-4 font-title text-2xl font-medium">{item.label}</h2>
                    </div>
                    <span className="text-xs text-neutral-400">{item.field}</span>
                  </div>

                  {media?.url ? (
                    <div className="mt-6 overflow-hidden border border-neutral-200 bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={media.url}
                        alt={media.altText ?? item.label}
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mt-6 flex h-72 items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                      Sin imagen
                    </div>
                  )}

                  <label className="mt-5 block">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                      Alt text
                    </span>
                    <input
                      className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none"
                      value={media?.altText ?? ""}
                      onChange={(event) => updateMediaAltText(item.field, event.target.value)}
                    />
                  </label>

                  <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950">
                    {uploadingField === item.field ? "Subiendo..." : "Subir/reemplazar imagen"}
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploadingField === item.field}
                      onChange={(event) => handleMediaUpload(item.field, event)}
                    />
                  </label>
                  <p className="mt-3 text-sm text-neutral-500">JPG, PNG o WebP. Máximo 5 MB.</p>
                </article>
              );
            })}
          </section>
        )}
      </form>
    </AdminShell>
  );
}
