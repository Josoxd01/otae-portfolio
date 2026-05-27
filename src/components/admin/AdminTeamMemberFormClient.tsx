"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/AdminToastProvider";
import { validateAdminTeamMember } from "@/lib/admin/admin-validations";
import {
  getAdminTeamMember,
  getAdminTeamMembers,
  saveAdminTeamMember,
} from "@/lib/admin/portfolio-admin";
import { uploadTeamMemberPhoto } from "@/lib/storage";
import type { TeamMember } from "@/types/portfolio";

interface AdminTeamMemberFormClientProps {
  memberId?: string;
}

export function AdminTeamMemberFormClient({ memberId }: AdminTeamMemberFormClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(memberId));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [member, setMember] = useState<TeamMember>(() => createEmptyMember());
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMember() {
      try {
        const [members, data] = await Promise.all([
          getAdminTeamMembers(),
          memberId ? getAdminTeamMember(memberId) : Promise.resolve(undefined),
        ]);

        if (isMounted && data) {
          setMember(data);
        } else if (isMounted && !memberId) {
          setMember((current) => ({
            ...current,
            sortOrder: getNextMemberSortOrder(members),
          }));
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
    setErrorMessage("");
    setIsSaving(true);

    try {
      const normalizedMember = normalizeMember(member, Boolean(memberId));
      validateAdminTeamMember(normalizedMember);
      await saveAdminTeamMember(normalizedMember);
      toast.success(memberId ? "Miembro actualizado." : "Miembro creado.");
      router.push("/admin/team");
    } catch (error) {
      console.warn("Could not save team member.", error);
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el miembro del equipo.");
      toast.error("No se pudo guardar. Intentalo nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    const currentMemberId = member.id || slugify(member.name);

    if (!file || !currentMemberId) {
      setErrorMessage("Escribe el nombre del miembro antes de subir la foto.");
      return;
    }

    setErrorMessage("");
    setUploadMessage("");
    setIsUploading(true);

    try {
      const uploaded = await uploadTeamMemberPhoto(currentMemberId, file);
      const updatedMember = normalizeMember(
        {
          ...member,
          id: currentMemberId,
          photoMedia: {
            assetType: "image",
            altText: member.name,
            storagePath: uploaded.storagePath,
            title: `Foto de ${member.name}`,
            url: uploaded.url,
          },
        },
        Boolean(memberId),
      );

      await saveAdminTeamMember(updatedMember);
      setMember(updatedMember);
      setUploadMessage("Foto actualizada.");
      toast.success("Foto actualizada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo subir la foto.");
      toast.error("No se pudo subir la foto.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleNameChange(value: string) {
    setMember((current) => ({
      ...current,
      name: value,
      id: memberId ? current.id : slugify(value),
    }));
  }

  function updateField<K extends keyof TeamMember>(field: K, value: TeamMember[K]) {
    setMember((current) => ({ ...current, [field]: value }));
  }

  const title = memberId ? "Editar miembro" : "Nuevo miembro";
  const canUploadPhoto = Boolean(member.id || member.name);

  return (
    <AdminShell>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">Admin / Equipo</p>
            <h1 className="mt-7 font-title text-4xl font-medium leading-tight">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
              Edita el perfil público, estado y fotografía del miembro.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving || isLoading || !member.name}
          >
            {isSaving ? "Guardando..." : "Guardar miembro"}
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
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <section className="border border-neutral-200 bg-white p-7">
              <p className="section-label">Foto</p>
              <h2 className="mt-4 font-title text-3xl font-medium">Imagen pública</h2>

              {member.photoMedia?.url ? (
                <div className="mt-6 overflow-hidden border border-neutral-200 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photoMedia.url}
                    alt={member.name}
                    className="h-[520px] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-6 flex h-[520px] items-center justify-center border border-neutral-200 bg-neutral-100 text-sm text-neutral-400">
                  Sin foto
                </div>
              )}

              <label className="mt-5 inline-flex cursor-pointer items-center justify-center border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-neutral-300">
                {isUploading ? "Subiendo..." : "Subir/reemplazar foto"}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploading || !canUploadPhoto}
                  onChange={handlePhotoUpload}
                />
              </label>
              <p className="mt-3 text-sm leading-7 text-neutral-500">
                JPG, PNG o WebP. Máximo 5 MB. Para miembros nuevos, escribe primero el nombre.
              </p>
            </section>

            <section className="border border-neutral-200 bg-white p-7">
              <p className="section-label">Perfil</p>
              <h2 className="mt-4 font-title text-3xl font-medium">Datos del miembro</h2>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <TextField label="Nombre" value={member.name} onChange={handleNameChange} required />
                <TextField
                  label="Rol / cargo"
                  value={member.role ?? ""}
                  onChange={(value) => updateField("role", value)}
                />
                <label className="block lg:col-span-2">
                  <FieldLabel>Biografía breve</FieldLabel>
                  <textarea
                    className="mt-3 w-full resize-y border border-neutral-300 px-4 py-3 text-sm leading-7 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                    rows={5}
                    value={member.bio ?? ""}
                    onChange={(event) => updateField("bio", event.target.value)}
                  />
                </label>
                <SwitchField
                  checked={member.isActive}
                  label="Activo"
                  onChange={(value) => updateField("isActive", value)}
                />
                <p className="flex min-h-[54px] items-center border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-7 text-neutral-500">
                  El orden se gestiona desde el listado de equipo.
                </p>
                <TextField
                  label="LinkedIn"
                  value={member.linkedinUrl ?? ""}
                  onChange={(value) => updateField("linkedinUrl", value)}
                />
              </div>
            </section>
          </div>
        )}
      </form>
    </AdminShell>
  );
}

function createEmptyMember(): TeamMember {
  return {
    id: "",
    name: "",
    sortOrder: 1,
    isActive: false,
  };
}

function getNextMemberSortOrder(members: TeamMember[]) {
  const maxSortOrder = members.reduce(
    (maxOrder, member) => Math.max(maxOrder, member.sortOrder ?? 0),
    0,
  );

  return maxSortOrder > 0 ? maxSortOrder + 1 : 1;
}

function normalizeMember(member: TeamMember, keepExistingId: boolean): TeamMember {
  const id = keepExistingId && member.id ? member.id : member.id || slugify(member.name);

  return {
    ...member,
    id,
    photoMedia: member.photoMedia?.url
      ? {
          assetType: "image",
          altText: member.name,
          storagePath: member.photoMedia.storagePath,
          title: member.photoMedia.title || `Foto de ${member.name}`,
          url: member.photoMedia.url,
        }
      : undefined,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TextField({
  label,
  onChange,
  required,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        className="mt-3 w-full border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SwitchField({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      className="mt-3 flex h-[54px] w-full cursor-pointer items-center justify-between gap-4 border border-neutral-300 px-4 text-left text-sm transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="font-medium text-neutral-800">{label}</span>
      <span className={`relative h-6 w-11 border transition ${checked ? "border-neutral-950 bg-neutral-950" : "border-neutral-300 bg-neutral-100"}`}>
        <span className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 bg-white transition ${checked ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">{children}</span>;
}
