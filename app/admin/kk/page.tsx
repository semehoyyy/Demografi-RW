"use client"

import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { KKTable } from "@/components/kk/kk-table"
import { getKartuKeluargaList } from "@/lib/mock-data"
import { IdCard, Users } from "lucide-react"

export default function AdminKKPage() {
  const { user } = useAuth()
  if (!user || !user.rt) return null

  const rt = user.rt
  const kkRT = getKartuKeluargaList().filter((kk) => kk.rt === rt)
  const totalAnggota = kkRT.reduce((s, kk) => s + kk.jumlahAnggota, 0)

  return (
    <>
      <PageHeader title={`Kartu Keluarga RT ${rt}`} description={`Daftar Kartu Keluarga di RT ${rt}.`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard title="Jumlah KK" value={kkRT.length} icon={IdCard} variant="primary" />
        <StatCard
          title="Total Anggota"
          value={totalAnggota}
          description={`Rata-rata ${kkRT.length ? (totalAnggota / kkRT.length).toFixed(1) : 0} orang/KK`}
          icon={Users}
          variant="success"
        />
      </div>

      <KKTable data={kkRT} detailHrefBase="/admin/kk" showRT={false} />
    </>
  )
}
