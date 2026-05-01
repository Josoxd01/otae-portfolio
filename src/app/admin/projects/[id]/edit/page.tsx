import { AdminProjectFormClient } from "@/components/admin/AdminProjectFormClient";

interface EditAdminProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminProjectPage({ params }: EditAdminProjectPageProps) {
  const { id } = await params;

  return <AdminProjectFormClient projectId={id} />;
}
