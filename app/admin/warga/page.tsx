"use client"

import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { WargaTable } from "@/components/warga/warga-table"
import { MOCK_WARGA, getStatistikDemografi } from "@/lib/mock-data"
import { Users, UserCheck, UserMinus } from "lucide-react"

export default function AdminWargaPage() {
  const { user } = useAuth()
  if (!user || !user.rt) return null

  const rt = user.rt
  const wargaRT = MOCK_WARGA.filter((w) => w.rt === rt)
  const stats = getStatistikDemografi(rt)

  return (
    <>
      <PageHeader title={`Data Warga RT ${rt}`} description={`Kelola data warga di lingkup RT ${rt} saja.`} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Warga" value={stats.total} icon={Users} variant="primary" />
        <StatCard title="Warga Tetap" value={stats.tetap} icon={UserCheck} variant="success" />
        <StatCard
          title="Pendatang"
          value={stats.domisili + stats.kontrak}
          description={`${stats.domisili} domisili · ${stats.kontrak} kontrak`}
          icon={UserMinus}
          variant="warning"
        />
      </div>

      <WargaTable data={wargaRT} detailHrefBase="/admin/warga" showRT={false} />
    </>
  )
}
