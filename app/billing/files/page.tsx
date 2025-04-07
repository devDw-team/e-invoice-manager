import { Metadata } from "next";
import { LNB } from "@/components/layout/lnb";
import InvoiceFileList from "@/components/billing/files/InvoiceFileList";

export const metadata: Metadata = {
  title: "청구서 파일 관리",
  description: "발송 완료된 청구서의 파일 목록을 조회하고 다운로드할 수 있습니다.",
};

export default function BillingFilesPage() {
  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">청구서 파일 관리</h1>
        </div>
        <InvoiceFileList />
      </div>
    </div>
  );
} 