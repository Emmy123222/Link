import React, { useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableRow } from "./ui/table"
import { TableHeader } from "./ui/table"
import { Button } from "./ui/button"
import { Download } from "lucide-react"
import { useDownloadExcel } from 'react-export-table-to-excel';
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type TableColumn<T> = {
  label: string
  accessor: keyof T | string
  render?: (row: T, rowIndex: number) => React.ReactNode
  className?: string
  colSpan?: number
}

export type TableListProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
  getRowKey?: (row: T, rowIndex: number) => string | number
  emptyText?: string
  footer?: React.ReactNode
}

export function TableList<T extends Record<string, any>>({
  columns,
  data,
  getRowKey,
  emptyText = "No records found",
  footer,
}: TableListProps<T>) {
  const tableRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Users table',
    sheet: 'Users'
  })

  return (
    <div className="bg-white rounded-lg shadow-sm ">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={onDownload}>
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto max-w-[80vw]">
        <Table ref={tableRef}>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-green-50">
              {columns.map((col, idx) => (
                <TableHead
                  key={col.label + idx}
                  colSpan={col.colSpan || 1}
                  className={
                    "px-4 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap " +
                    (col.className || "")
                  }
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={getRowKey ? getRowKey(row, rowIndex) : rowIndex} className="hover:bg-green-50 transition-colors cursor-pointer" onClick={() => {
                  router.push(`${pathname}/${row.id}?type=${searchParams.get("type")}`)
                }}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell key={col.label + colIndex} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap" colSpan={col.colSpan || 1}>
                      {col.render
                        ? col.render(row, rowIndex)
                        : (row[col.accessor as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {footer && (
        <div className="px-4 py-2 border-t bg-green-50 text-sm text-gray-600 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  )
}