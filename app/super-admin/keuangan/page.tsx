"use client"

import { PageHeader } from "@/components/layout/page-header"
import { KeuanganSummary } from "@/components/keuangan/keuangan-summary"
import { TransaksiTable } from "@/components/keuangan/transaksi-table"
import { Button } from "@/components/ui/button"
import { getStatistikKeuangan } from "@/lib/mock-data"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function SuperAdminKeuanganPage() {
  const stats = getStatistikKeuangan()

  return (
    <>
      <PageHeader
        title="Keuangan RW"
        description="Pantau dan kelola arus kas pemasukan dan pengeluaran seluruh wilayah RW."
        actions={
          <Button onClick={() => toast.info("Form tambah laporan keuangan akan dibuka")}>
            <Plus className="size-4" />
            Tambah Laporan
          </Button>
        }
      />

      <KeuanganSummary saldo={stats.saldo} masuk={stats.masuk} keluar={stats.keluar} />

      <TransaksiTable data={stats.transaksi} />
    </>
  )
}
