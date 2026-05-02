"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStudioProfile, saveAdminStudioProfile } from "@/lib/admin/portfolio-admin";
import { uploadStudioMedia } from "@/lib/storage";
import type { MediaReference, StudioProfile } from "@/types/portfolio";

type StudioMediaField = "logoMedia" | "heroImage" | "aboutImage";

const mediaFields: Array<{ field: StudioMediaField; label: string; folder: string }> = [
  { field: "logoMedia", label: "Logo", folder: "logo" },
  { field: "heroImage", label: "Imagen principal / oficina", folder: "hero" },
  { field: "aboutImage", label: "Imagen acerca del estudio / equipo", folder: "about" },
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
      const mediaLabel = mediaFields.find((item) => item.field === field)?.label ?? studioProfile.name;
      const updatedProfile = {
        ...studioProfile,
        [field]: {
          assetType: "image",
          altText: studioProfile.name || mediaLabel,
          storagePath: uploaded.storagePath,
          url: uploaded.url,
        } satisfies MediaReference,
      };

      await saveAdminStudioProfile(updatedProfile);
      setStudioProfile(updatedProfile);
      setUploadMessage(`${mediaLabel} actualizada.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploadingField(null);
    }
  }

  function updateField<K extends keyof StudioProfile>(field: K, value: StudioProfile[K]) {
    setStudioProfile((current) => ({ ...current, [field]: value }));
  }

  function updateAboutParagraphs(value: string) {
    const paragraphs = value
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    updateField("aboutParagraphs", paragraphs);
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
              Edita solo el contenido que se usa actualmente en la web pública.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-10 space-y-8">
            <section className="border border-neutral-200 bg-white p-7">
              <SectionHeading
                label="Identidad editorial"
                title="Contenido general"
                description="Textos base que aparecen en la home, footer y página del estudio."
              />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <TextField
                  label="Nombre del estudio"
                  value={studioProfile.name}
                  onChange={(value) => updateField("name", value)}
                />
                <TextField
                  label="Eslogan"
                  value={studioProfile.tagline ?? ""}
                  onChange={(value) => updateField("tagline", value)}
                />
                <TextArea
                  label="Descripción general"
                  rows={5}
                  value={studioProfile.description ?? ""}
                  onChange={(value) => updateField("description", value)}
                />
                <TextArea
                  label="Misión"
                  rows={5}
                  value={studioProfile.mission ?? ""}
                  onChange={(value) => updateField("mission", value)}
                />
              </div>
            </section>

            <section className="border border-neutral-200 bg-white p-7">
              <SectionHeading
                label="Página Estudio"
                title="Relato público"
                description="Contenido usado en la página /estudio."
              />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <TextField
                  label="Etiqueta superior"
                  value={studioProfile.heroLabel ?? ""}
                  onChange={(value) => updateField("heroLabel", value)}
                />
                <TextArea
                  label="Párrafos acerca del estudio"
                  rows={8}
                  value={(studioProfile.aboutParagraphs ?? []).join("\n\n")}
                  onChange={updateAboutParagraphs}
                />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              {mediaFields.map((item) => (
                <MediaCard
                  key={item.field}
                  disabled={uploadingField === item.field}
                  isUploading={uploadingField === item.field}
                  label={item.label}
                  media={studioProfile[item.field]}
                  name={studioProfile.name}
                  sectionLabel={item.folder}
                  onFileChange={(event) => handleMediaUpload(item.field, event)}
                />
              ))}
            </section>
          </div>
        )}
      </form>
    </AdminShell>
  );
}

function SectionHeading({
  description,
  label,
  title,
}: {
  description?: string;
  label: string;
  title: string;
}) {
  return (
    <div>
      <p className="section-label">{label}</p>
      <h2 className="mt-4 font-title text-3xl font-medium">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">{description}</p> : null}
    </div>
  );
}

function MediaCard({
  disabled,
  isUploading,
  label,
  media,
  name,
  onFileChange,
  sectionLabel,
}: {
  disabled: boolean;
  isUploading: boolean;
  label: string;
  media?: MediaReference;
  name: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sectionLabel: string;
}) {
  return (
    <article className="border border-neutral-200 bg-white p-7">
      <div>
        <p className="section-label">{sectionLabel}</p>
        <h2 className="mt-4 font-title text-2xl font-medium">{label}</h2>
      </div>

      {media?.url ? (
        <div className="mt-6 overflow-hidden border border-neutral-200 bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.url}
            alt={name}
            className="h-72 w-full object-cover"
          />
        </div>
      ) : (
        <div className="mt-6 flex h-72 items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
          Sin imagen
        </div>
      )}

      <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-neutral-300">
        {isUploading ? "Subiendo..." : "Subir/reemplazar imagen"}
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          onChange={onFileChange}
        />
      </label>
      <p className="mt-3 text-sm text-neutral-500">JPG, PNG o WebP. Máximo 5 MB.</p>
    </article>
  );
}

function TextField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, onChange, rows, value }: { label: string; onChange: (value: string) => void; rows: number; value: string }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea className="mt-3 w-full resize-y border border-neutral-300 px-4 py-3 text-sm leading-7 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}
