"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { DragEvent, MouseEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import {
  deleteAdminTeamMember,
  getAdminTeamMembers,
  setAdminTeamMemberActive,
  updateAdminTeamMemberSortOrders,
} from "@/lib/admin/portfolio-admin";
import { deleteStorageFile } from "@/lib/storage";
import type { TeamMember } from "@/types/portfolio";

const pageSizeOptions = [10, 20, 50];

export function AdminTeamPageClient() {
  const router = useRouter();
  const [deletingMemberId, setDeletingMemberId] = useState("");
  const [draggedMemberId, setDraggedMemberId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(members.length / pageSize));
  const paginatedMembers = members.slice((page - 1) * pageSize, page * pageSize);

  async function loadMembers() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      setMembers(await getAdminTeamMembers());
    } catch (error) {
      console.warn("Could not load team members.", error);
      setErrorMessage("No se pudo cargar el equipo.");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleMember(member: TeamMember) {
    await setAdminTeamMemberActive(member.id, !member.isActive);
    await loadMembers();
  }

  async function handleDrop(targetMemberId: string) {
    if (!draggedMemberId || draggedMemberId === targetMemberId || isSavingOrder) {
      setDraggedMemberId("");
      return;
    }

    const fromIndex = members.findIndex((member) => member.id === draggedMemberId);
    const toIndex = members.findIndex((member) => member.id === targetMemberId);

    if (fromIndex < 0 || toIndex < 0) {
      setDraggedMemberId("");
      return;
    }

    const previousMembers = members;
    const reorderedMembers = moveMember(members, fromIndex, toIndex).map((member, index) => ({
      ...member,
      sortOrder: index + 1,
    }));

    setMembers(reorderedMembers);
    setDraggedMemberId("");
    setErrorMessage("");
    setIsSavingOrder(true);

    try {
      await updateAdminTeamMemberSortOrders(
        reorderedMembers.map((member) => ({
          id: member.id,
          sortOrder: member.sortOrder,
        })),
      );
    } catch (error) {
      console.warn("Could not save team order.", error);
      setMembers(previousMembers);
      setErrorMessage("No se pudo guardar el nuevo orden del equipo.");
    } finally {
      setIsSavingOrder(false);
    }
  }

  async function deleteMember(member: TeamMember) {
    if (deletingMemberId) {
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este miembro del equipo? Esta acción no se puede deshacer.",
    );

    if (!confirmed) {
      return;
    }

    setDeletingMemberId(member.id);
    setErrorMessage("");

    try {
      if (member.photoMedia?.storagePath) {
        await deleteStorageFile(member.photoMedia.storagePath);
      }

      await deleteAdminTeamMember(member.id);

      const reorderedMembers = members
        .filter((item) => item.id !== member.id)
        .map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        }));

      setMembers(reorderedMembers);
      await updateAdminTeamMemberSortOrders(
        reorderedMembers.map((item) => ({
          id: item.id,
          sortOrder: item.sortOrder,
        })),
      );
    } catch (error) {
      console.warn("Could not delete team member.", error);
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo eliminar el miembro del equipo.",
      );
    } finally {
      setDeletingMemberId("");
    }
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, memberId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", memberId);
    setDraggedMemberId(memberId);
  }

  function handleDragOver(event: DragEvent<HTMLTableRowElement>) {
    if (draggedMemberId) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }
  }

  function handleActionClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  function updatePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label">Admin / Equipo</p>
          <h1 className="mt-7 font-title text-4xl font-medium leading-tight">Equipo</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
            Administra perfiles, orden, visibilidad y fotografías de los miembros del estudio.
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex cursor-pointer items-center justify-center bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Nuevo miembro
        </Link>
      </div>

      <section className="mt-10 overflow-hidden border border-neutral-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {isSavingOrder ? "Guardando orden..." : `${members.length} miembros`}
            </p>
            {errorMessage ? <p className="mt-1 text-sm text-red-600">{errorMessage}</p> : null}
          </div>
          <label className="flex items-center gap-3 text-sm text-neutral-500">
            Registros por página
            <select
              className="cursor-pointer border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 transition hover:border-neutral-950 focus:border-neutral-950 focus:outline-none"
              value={pageSize}
              onChange={(event) => updatePageSize(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-neutral-500">Cargando equipo...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="bg-neutral-950 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white">
                    <th className="w-24 px-5 py-4">Orden</th>
                    <th className="px-5 py-4">Miembro</th>
                    <th className="px-5 py-4">Rol</th>
                    <th className="w-36 px-5 py-4">Estado</th>
                    <th className="w-44 px-5 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {paginatedMembers.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-sm text-neutral-500" colSpan={5}>
                        Todavía no hay miembros.
                      </td>
                    </tr>
                  ) : (
                    paginatedMembers.map((member) => (
                      <tr
                        key={member.id}
                        className={`cursor-pointer align-middle transition hover:bg-neutral-50 ${
                          draggedMemberId === member.id ? "bg-neutral-50" : ""
                        }`}
                        onClick={() => router.push(`/admin/team/${member.id}/edit`)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(member.id)}
                      >
                        <td className="px-5 py-5">
                          <button
                            type="button"
                            className="flex cursor-grab items-center gap-3 text-left active:cursor-grabbing"
                            aria-label={`Reordenar ${member.name}`}
                            draggable={!isSavingOrder}
                            onClick={handleActionClick}
                            onDragStart={(event) => handleDragStart(event, member.id)}
                            onDragEnd={() => setDraggedMemberId("")}
                          >
                            <DragHandleIcon />
                            <span className="font-title text-2xl font-medium tabular-nums text-neutral-950">
                              {member.sortOrder}
                            </span>
                          </button>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden border border-neutral-200 bg-neutral-100">
                              {member.photoMedia?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={member.photoMedia.url}
                                  alt={member.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div>
                              <h2 className="font-title text-xl font-medium text-neutral-950">
                                {member.name}
                              </h2>
                              <p className="mt-1 text-sm text-neutral-500">{member.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 text-sm text-neutral-500">
                          {member.role ?? "Sin cargo"}
                        </td>
                        <td className="px-5 py-5">
                          <StatusBadge isActive={member.isActive} />
                        </td>
                        <td className="px-5 py-5" onClick={handleActionClick}>
                          <div className="flex justify-end gap-2">
                            <IconLink
                              href={`/admin/team/${member.id}/edit`}
                              label="Editar"
                              icon={<EditIcon />}
                            />
                            <IconButton
                              label={member.isActive ? "Desactivar" : "Activar"}
                              icon={member.isActive ? <EyeOffIcon /> : <EyeIcon />}
                              onClick={() => toggleMember(member)}
                            />
                            <IconButton
                              danger
                              disabled={deletingMemberId === member.id}
                              label="Eliminar"
                              icon={<TrashIcon />}
                              onClick={() => deleteMember(member)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">
                Página {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="cursor-pointer border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="cursor-pointer border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </AdminShell>
  );
}

function moveMember(members: TeamMember[], fromIndex: number, toIndex: number) {
  const nextMembers = [...members];
  const [movedMember] = nextMembers.splice(fromIndex, 1);
  nextMembers.splice(toIndex, 0, movedMember);

  return nextMembers;
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        isActive
          ? "border-neutral-950 bg-neutral-950 text-white"
          : "border-neutral-200 text-neutral-400"
      }`}
    >
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}

function IconButton({
  danger,
  disabled,
  icon,
  label,
  onClick,
}: {
  danger?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <span className="group relative">
      <button
        type="button"
        className={`flex h-10 w-10 cursor-pointer items-center justify-center border transition disabled:cursor-not-allowed disabled:opacity-50 ${
          danger
            ? "border-red-200 text-red-700 hover:border-red-700"
            : "border-neutral-200 text-neutral-500 hover:border-neutral-950 hover:text-neutral-950"
        }`}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </button>
      <Tooltip label={label} />
    </span>
  );
}

function IconLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="group relative">
      <Link
        href={href}
        className="flex h-10 w-10 cursor-pointer items-center justify-center border border-neutral-200 text-neutral-500 transition hover:border-neutral-950 hover:text-neutral-950"
        aria-label={label}
      >
        {icon}
      </Link>
      <Tooltip label={label} />
    </span>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap bg-neutral-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
      {label}
    </span>
  );
}

function DragHandleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24">
      <path
        d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m4 16.5-.5 4 4-.5L19 8.5 15.5 5 4 16.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="m13.8 6.7 3.5 3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M3.5 12s3-5.5 8.5-5.5S20.5 12 20.5 12s-3 5.5-8.5 5.5S3.5 12 3.5 12Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.8 6.9A8.8 8.8 0 0 1 12 6.5c5.5 0 8.5 5.5 8.5 5.5a15 15 0 0 1-2.2 2.9M6.7 8.5A15 15 0 0 0 3.5 12s3 5.5 8.5 5.5c1 0 1.9-.2 2.7-.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 7h14M10 11v6M14 11v6M8 7l.5-2h7L16 7M7 7l1 13h8l1-13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}
