import { AdminToastProvider } from "@/components/admin/AdminToastProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminToastProvider>{children}</AdminToastProvider>;
}
