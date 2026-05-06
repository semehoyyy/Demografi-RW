"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { Warga, StatusKependudukan } from "@/lib/types"
import { RT_LIST } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Pencil, Search, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"

interface WargaTableProps {
  data: Warga[]
  detailHrefBase: string
  showRT?: boolean
  canManage?: boolean
  onAdd?: () => void
}

export function WargaTable({ data, detailHrefBase, showRT = true, canManage = true, onAdd }: WargaTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [rtFilter, setRtFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const pageSize = 8

  const filtered = useMemo(() => {
    return data.filter((w) => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        w.nama.toLowerCase().includes(q) ||
        w.nik.includes(q) ||
        w.alamat.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || w.statusKependudukan === statusFilter
      const matchRT = rtFilter === "all" || w.rt === rtFilter
      return matchSearch && matchStatus && matchRT
    })
  }, [data, search, statusFilter, rtFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, NIK, atau alamat..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Tetap">Tetap</SelectItem>
              <SelectItem value="Domisili">Domisili</SelectItem>
              <SelectItem value="Kontrak">Kontrak</SelectItem>
            </SelectContent>
          </Select>
          {showRT ? (
            <Select
              value={rtFilter}
              onValueChange={(v) => {
                setRtFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="RT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua RT</SelectItem>
                {RT_LIST.map((rt) => (
                  <SelectItem key={rt} value={rt}>
                    RT {rt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          {canManage ? (
            <Button onClick={onAdd ?? (() => toast.info("Form tambah warga akan dibuka"))}>
              <UserPlus className="size-4" />
              Tambah Warga
            </Button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIK</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Alamat</TableHead>
              {showRT ? <TableHead>RT</TableHead> : null}
              <TableHead>Status</TableHead>
              {canManage ? <TableHead className="w-[80px] text-right">Aksi</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 7 : 6} className="text-center text-muted-foreground py-12">
                  Tidak ada data warga yang cocok dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-mono text-xs">{w.nik}</TableCell>
                  <TableCell className="font-medium">{w.nama}</TableCell>
                  <TableCell>{w.jenisKelamin}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{w.alamat}</TableCell>
                  {showRT ? <TableCell>RT {w.rt}</TableCell> : null}
                  <TableCell>
                    <StatusBadge status={w.statusKependudukan} />
                  </TableCell>
                  {canManage ? (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`${detailHrefBase}/${w.id}`}>
                              <Eye className="size-4" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Edit data warga")}>
                            <Pencil className="size-4" />
                            Edit Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => toast.warning(`Konfirmasi hapus ${w.nama}`)}
                          >
                            <Trash2 className="size-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Menampilkan {pageData.length} dari {filtered.length} warga
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function StatusBadge({ status }: { status: StatusKependudukan }) {
  const styles: Record<StatusKependudukan, string> = {
    Tetap: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    Domisili: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
    Kontrak: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  }
  return (
    <Badge variant="outline" className={styles[status]}>
      {status}
    </Badge>
  )
}
