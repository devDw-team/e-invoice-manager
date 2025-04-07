"use client";

import { useState } from "react";
import { IInvoiceFileSearchParams } from "@/types";
import InvoiceFileSearch from "./InvoiceFileSearch";
import InvoiceFileTable from "./InvoiceFileTable";

export default function InvoiceFileList() {
  const [searchParams, setSearchParams] = useState<IInvoiceFileSearchParams>({
    searchField: "name",
    searchValue: "",
    dateType: "sent",
    page: 1,
    limit: 50,
  });

  // 실제 API 연동 전까지 사용할 더미 데이터
  const mockData = {
    data: [
      {
        id: 101,
        vendorName: "코웨이",
        vendorCode: "1234567890",
        ceo: "홍길동",
        billingMonth: "2024-03",
        hasHtml: true,
        hasExcel: true,
        hasEtc: true,
      },
    ],
    total: 35,
    page: 1,
    limit: 50,
  };

  const handleSearch = (params: Partial<IInvoiceFileSearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setSearchParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <InvoiceFileSearch
        searchParams={searchParams}
        onSearch={handleSearch}
      />
      <InvoiceFileTable
        data={mockData.data}
        total={mockData.total}
        page={searchParams.page}
        limit={searchParams.limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
} 