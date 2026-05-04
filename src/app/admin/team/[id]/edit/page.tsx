import { AdminTeamMemberFormClient } from "@/components/admin/AdminTeamMemberFormClient";

interface EditTeamMemberPageProps { params: Promise<{ id: string }> }

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;

  return <AdminTeamMemberFormClient memberId={id} />;
}
