import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  JenisKelaminChart,
  SebaranRTChart,
  StatusKependudukanChart,
} from "@/components/dashboard/demografi-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  formatRupiah,
  formatTanggal,
  getKartuKeluargaList,
  getSebaranRT,
  getStatistikDemografi,
  getStatistikKeuangan,
  MOCK_TRANSAKSI,
} from "@/lib/mock-data"
import { ArrowDownCircle, ArrowUpCircle, IdCard, Users, Wallet } from "lucide-react"

export default function SuperAdminDashboardPage() {
  const demografi = getStatistikDemografi()
  const keuangan = getStatistikKeuangan()
  const sebaranRT = getSebaranRT()
  const kkList = getKartuKeluargaList()
  const recentTransaksi = [...MOCK_TRANSAKSI]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 5)

  return (
    <>
      <PageHeader
        title="Dashboard RW"
        description="Ringkasan kondisi demografis dan keuangan seluruh wilayah RW 05."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Kartu Keluarga"
          value={kkList.length}
          description={`Tersebar di ${sebaranRT.length} RT`}
          icon={IdCard}
          variant="primary"
        />
        <StatCard
          title="Total Warga"
          value={demografi.total}
          description={`${demografi.lakiLaki} L · ${demografi.perempuan} P`}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Saldo Kas RW"
          value={formatRupiah(keuangan.saldo)}
          description="Total kas seluruh RT"
          icon={Wallet}
          variant="success"
        />
        <StatCard
          title="Warga Tetap"
          value={demografi.tetap}
          description={`${demografi.domisili} domisili · ${demografi.kontrak} kontrak`}
          icon={Users}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <StatusKependudukanChart data={demografi} />
        <JenisKelaminChart data={demografi} />
        <SebaranRTChart data={sebaranRT} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>5 transaksi keuangan terkini di seluruh RW</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransaksi.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={
                      t.jenis === "masuk"
                        ? "size-9 shrink-0 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"
                        : "size-9 shrink-0 rounded-full bg-destructive/15 text-destructive flex items-center justify-center"
                    }
                  >
                    {t.jenis === "masuk" ? <ArrowUpCircle className="size-4" /> : <ArrowDownCircle className="size-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{t.keterangan}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTanggal(t.tanggal)} · {t.rt ? `RT ${t.rt}` : "RW"}
                    </p>
                  </div>
                </div>
                <p
                  className={
                    t.jenis === "masuk"
                      ? "font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap"
                      : "font-semibold text-destructive whitespace-nowrap"
                  }
                >
                  {t.jenis === "masuk" ? "+" : "-"} {formatRupiah(t.jumlah)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kas</CardTitle>
            <CardDescription>Periode bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Pemasukan</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatRupiah(keuangan.masuk)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground">Pengeluaran</p>
              <p className="text-xl font-bold text-destructive mt-1">{formatRupiah(keuangan.keluar)}</p>
            </div>
            <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-primary">Saldo Akhir</p>
                <Badge className="bg-primary text-primary-foreground">Aktif</Badge>
              </div>
              <p className="text-2xl font-bold text-primary mt-1">{formatRupiah(keuangan.saldo)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
