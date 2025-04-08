'use client';

import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IBillingInvoice } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

const columns: ColumnDef<IBillingInvoice>[] = [
  {
    accessorKey: 'id',
    header: 'No',
  },
  {
    accessorKey: 'vendor.name',
    header: '사업자명',
    cell: ({ row }) => (
      <Button
        variant="link"
        className="p-0 h-auto font-normal"
        onClick={() => {
          // 수정 페이지로 이동 로직은 부모 컴포넌트에서 처리
          row.original.id;
        }}
      >
        {row.original.vendor.name}
      </Button>
    ),
  },
  {
    accessorKey: 'vendor',
    header: '사업자 정보',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div>{row.original.vendor.code}</div>
        <div>{row.original.vendor.ceo}</div>
        <div>{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'billing_month',
    header: '청구월',
  },
  {
    accessorKey: 'attachments',
    header: '첨부파일',
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.attachments.map((file) => (
          <Button
            key={file.name}
            variant="outline"
            size="sm"
            onClick={() => window.open(file.url)}
          >
            <Download className="w-4 h-4 mr-2" />
            {file.type.toUpperCase()}
          </Button>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'updated_by',
    header: '수정 정보',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div>{row.original.updated_by}</div>
        <div>{format(new Date(row.original.updated_at), 'yyyy-MM-dd HH:mm')}</div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: '발송 여부',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === 'success' ? 'default' : status === 'fail' ? 'destructive' : 'secondary';
      const label = status === 'success' ? '성공' : status === 'fail' ? '실패' : '미발송';
      
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: 'sent_at',
    header: '발송일',
    cell: ({ row }) => (
      row.original.sent_at ? format(new Date(row.original.sent_at), 'yyyy-MM-dd HH:mm') : '-'
    ),
  },
];

interface Props {
  data: IBillingInvoice[];
  onRowClick: (id: string) => void;
}

export function BillingTable({ data, onRowClick }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 