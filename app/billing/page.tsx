'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BillingSearchForm } from '@/components/billing/BillingSearchForm';
import { BillingTable } from '@/components/billing/BillingTable';
import { IBillingInvoice, ISearchParams } from '@/types';
import { LNB } from '@/components/layout/lnb';

// 임시 데이터 (백엔드 개발 전까지 사용)
const MOCK_DATA: IBillingInvoice[] = [
  {
    id: '1',
    vendor: {
      id: '1',
      name: '(주)테스트',
      code: '123-45-67890',
      ceo: '홍길동',
      email: 'test@example.com',
      businessType: '서비스업',
      businessItem: 'IT 서비스',
      invoiceStatus: '사용',
      modifier: 'admin',
      modifiedAt: '2024-03-01T00:00:00Z'
    },
    email: 'invoice@example.com',
    billing_month: '2024-03',
    payment_info: {
      amount: 1000000,
      due_date: '2024-03-31',
      payment_method: '계좌이체',
    },
    details: {
      order_number: 'ORD-2024-001',
      items: [
        {
          name: '서비스 이용료',
          quantity: 1,
          price: 1000000,
          total: 1000000,
        },
      ],
      contact: '02-1234-5678',
    },
    attachments: [
      {
        name: '청구서.html',
        url: '/files/invoice-1.html',
        type: 'html',
      },
      {
        name: '청구서.xlsx',
        url: '/files/invoice-1.xlsx',
        type: 'excel',
      },
    ],
    status: 'not_sent',
    sent_at: null,
    created_by: 'admin',
    updated_by: 'admin',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
  // 더 많은 목업 데이터 추가 가능
];

export default function BillingPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<Partial<ISearchParams>>({});
  const [data] = useState<IBillingInvoice[]>(MOCK_DATA);

  const handleSearch = (params: Partial<ISearchParams>) => {
    setSearchParams(params);
    // 실제 API 호출은 백엔드 개발 후 구현
    console.log('Search params:', params);
  };

  const handleRowClick = (id: string) => {
    router.push(`/billing/${id}/edit`);
  };

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">청구서 발송 관리</h1>
        
        <BillingSearchForm onSearch={handleSearch} />
        
        <BillingTable 
          data={data} 
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
} 