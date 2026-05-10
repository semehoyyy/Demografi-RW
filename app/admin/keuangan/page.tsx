"use client"

import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/layout/page-header"
import { KeuanganSummary } from "@/components/keuangan/keuangan-summary"
import { TransaksiTable } from "@/components/keuangan/transaksi-table"
import { Button } from "@/components/ui/button"
import { getStatistikKeuangan } from "@/lib/mock-data"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function AdminKeuanganPage() {
  const { user } = useAuth()
  if (!user || !user.rt) return null

  const rt = user.rt
  const stats = getStatistikKeuangan(rt)

  return (
    <>
      <PageHeader
        title={`Keuangan RT ${rt}`}
        description={`Kelola arus kas pemasukan dan pengeluaran khusus RT ${rt}.`}
        actions={
          <Button onClick={() => toast.info("Form tambah laporan keuangan akan dibuka")}>
            <Plus className="size-4" />
            Tambah Laporan
          </Button>
        }
      />

      <KeuanganSummary saldo={stats.saldo} masuk={stats.masuk} keluar={stats.keluar} />

      <TransaksiTable data={stats.transaksi} showRT={false} />
    </>
  )
}
