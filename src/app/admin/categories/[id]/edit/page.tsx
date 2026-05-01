import { AdminCategoryFormClient } from "@/components/admin/AdminCategoryFormClient";

interface EditAdminCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminCategoryPage({ params }: EditAdminCategoryPageProps) {
  const { id } = await params;

  return <AdminCategoryFormClient categoryId={id} />;
}
