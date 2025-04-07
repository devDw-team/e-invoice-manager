"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileIcon, FileSpreadsheet, FileText } from "lucide-react";
import { IInvoiceFile } from "@/types";

interface InvoiceFileTableProps {
  data: IInvoiceFile[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function InvoiceFileTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: InvoiceFileTableProps) {
  const totalPages = Math.ceil(total / limit);

  const handleDownload = (fileId: number, fileType: string) => {
    // TODO: 실제 다운로드 구현
    console.log(`Downloading ${fileType} file with ID: ${fileId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          총 {total}건
        </div>
        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="페이지당 개수" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10건</SelectItem>
            <SelectItem value="50">50건</SelectItem>
            <SelectItem value="100">100건</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">No</TableHead>
              <TableHead>사업자명</TableHead>
              <TableHead>사업자번호</TableHead>
              <TableHead>대표자</TableHead>
              <TableHead>청구월</TableHead>
              <TableHead className="text-center">파일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">
                  {total - (page - 1) * limit - index}
                </TableCell>
                <TableCell>{item.vendorName}</TableCell>
                <TableCell>{item.vendorCode}</TableCell>
                <TableCell>{item.ceo}</TableCell>
                <TableCell>{item.billingMonth}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <TooltipProvider>
                      {item.hasHtml && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(item.id, "html")}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>HTML 파일 다운로드</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {item.hasExcel && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(item.id, "excel")}
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excel 파일 다운로드</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {item.hasEtc && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(item.id, "etc")}
                            >
                              <FileIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>첨부파일 다운로드</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          이전
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              onClick={() => onPageChange(p)}
              className="w-10"
            >
              {p}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
} 