"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminTeamMember, saveAdminTeamMember } from "@/lib/admin/portfolio-admin";
import { uploadTeamMemberPhoto } from "@/lib/storage";
import type { TeamMember } from "@/types/portfolio";

interface AdminTeamMemberFormClientProps {
  memberId: string;
}

export function AdminTeamMemberFormClient({ memberId }: AdminTeamMemberFormClientProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMember() {
      try {
        const data = await getAdminTeamMember(memberId);

        if (isMounted) {
          setMember(data ?? null);
        }
      } catch (error) {
        console.warn("Could not load team member.", error);
        setErrorMessage("No se pudo cargar el miembro del equipo.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMember();

    return () => {
      isMounted = false;
    };
  }, [memberId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!member) {
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      await saveAdminTeamMember(member);
      router.push("/admin/team");
    } catch (error) {
      console.warn("Could not save team member.", error);
      setErrorMessage("No se pudo guardar el miembro del equipo.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !member) {
      return;
    }

    setErrorMessage("");
    setUploadMessage("");
    setIsUploading(true);

    try {
      const uploaded = await uploadTeamMemberPhoto(member.id, file);
      const updatedMember: TeamMember = {
        ...member,
        photoMedia: {
          assetType: "image",
          altText: member.photoMedia?.altText || member.name,
          storagePath: uploaded.storagePath,
          title: member.photoMedia?.title || `Foto de ${member.name}`,
          url: uploaded.url,
        },
      };

      await saveAdminTeamMember(updatedMember);
      setMember(updatedMember);
      setUploadMessage("Foto actualizada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la foto.");
    } finally {
      setIsUploading(false);
    }
  }

  function updatePhotoAltText(value: string) {
    setMember((current) =>
      current
        ? {
            ...current,
            photoMedia: current.photoMedia
              ? { ...current.photoMedia, altText: value }
              : { assetType: "image", altText: value, url: "" },
          }
        : current,
    );
  }

  return (
    <AdminShell>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">Admin / Equipo</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              {member?.name ?? "Miembro del equipo"}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
              Sube o reemplaza la foto pública del miembro. Solo se aceptan JPG, PNG y WebP.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving || isLoading || !member}
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
          <p className="mt-10 text-sm text-neutral-500">Cargando miembro...</p>
        ) : member ? (
          <section className="mt-10 grid gap-8 border border-neutral-200 bg-white p-7 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              {member.photoMedia?.url ? (
                <div className="overflow-hidden border border-neutral-200 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photoMedia.url}
                    alt={member.photoMedia.altText ?? member.name}
                    className="h-[520px] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[520px] items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                  Sin foto
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="section-label">Perfil</p>
                <h2 className="mt-4 font-title text-3xl font-medium">{member.name}</h2>
                <p className="mt-3 text-sm text-neutral-500">{member.role ?? "Sin cargo"}</p>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                  Alt text de la foto
                </span>
                <input
                  className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none"
                  value={member.photoMedia?.altText ?? ""}
                  onChange={(event) => updatePhotoAltText(event.target.value)}
                />
              </label>

              <label className="inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-neutral-300">
                {isUploading ? "Subiendo..." : "Subir/reemplazar foto"}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploading}
                  onChange={handlePhotoUpload}
                />
              </label>
              <p className="text-sm leading-7 text-neutral-500">
                Ruta: team-media/{member.id}/photo/. Tamaño máximo: 5 MB.
              </p>
            </div>
          </section>
        ) : (
          <p className="mt-10 text-sm text-neutral-500">No se encontró el miembro solicitado.</p>
        )}
      </form>
    </AdminShell>
  );
}
