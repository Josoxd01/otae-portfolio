import { AdminBlogFormClient } from "@/components/admin/AdminBlogFormClient";

interface EditAdminBlogPageProps { params: Promise<{ id: string }> }

export default async function EditAdminBlogPage({ params }: EditAdminBlogPageProps) {
  const { id } = await params;

  return <AdminBlogFormClient blogId={id} />;
}
