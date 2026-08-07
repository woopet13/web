import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import { isAdmin, isSuperAdmin } from '@/lib/auth'

export const metadata = { title: 'Admin — Woopet' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/login')
  const superAdmin = await isSuperAdmin()

  return (
    <div className="flex min-h-screen bg-[#FFF1E8]">
      <AdminSidebar superAdmin={superAdmin} />
      <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
    </div>
  )
}
