import AdminLayout from "./admin-layout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}