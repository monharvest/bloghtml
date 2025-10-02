import type { Metadata } from "next"
import AdminPanelDB from "@/components/admin-panel-db"

export const metadata: Metadata = {
  title: "Admin Panel - Blog Management",
  description: "Create and manage blog posts with database storage",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminPanelDB />
    </div>
  )
}
