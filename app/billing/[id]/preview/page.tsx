'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IBillingInvoice } from '@/types';
import { format } from 'date-fns';

// 임시 데이터 (백엔드 개발 전까지 사용)
const MOCK_DATA: IBillingInvoice = {
  id: '1',
  vendor: {
    id: '1',
    name: '(주)테스트',
    code: '123-45-67890',
    ceo: '홍길동',
    email: 'test@example.com',
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
};

export default function BillingPreviewPage() {
  const params = useParams();
  const [data] = useState<IBillingInvoice>(MOCK_DATA);

  useEffect(() => {
    // 실제 API 호출은 백엔드 개발 후 구현
    console.log('Load preview data for:', params.id);
  }, [params.id]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">청구서</h1>
          <p className="text-gray-600">{data.billing_month} 청구분</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">공급받는자</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">사업자명</td>
                  <td>{data.vendor.name}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">사업자번호</td>
                  <td>{data.vendor.code}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">대표자</td>
                  <td>{data.vendor.ceo}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">공급자</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-2 font-medium">사업자명</td>
                  <td>(주)우리회사</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">사업자번호</td>
                  <td>123-45-67890</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">대표자</td>
                  <td>김대표</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">청구 내역</h2>
          <table className="w-full border-t border-b">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left">품목</th>
                <th className="py-2 px-4 text-right">수량</th>
                <th className="py-2 px-4 text-right">단가</th>
                <th className="py-2 px-4 text-right">금액</th>
              </tr>
            </thead>
            <tbody>
              {data.details.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4 text-right">{item.quantity}</td>
                  <td className="py-2 px-4 text-right">
                    {item.price.toLocaleString()}원
                  </td>
                  <td className="py-2 px-4 text-right">
                    {item.total.toLocaleString()}원
                  </td>
                </tr>
              ))}
              <tr className="border-t font-bold">
                <td colSpan={3} className="py-2 px-4 text-right">
                  합계
                </td>
                <td className="py-2 px-4 text-right">
                  {data.payment_info.amount.toLocaleString()}원
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 font-medium">납부기한</td>
                <td>{format(new Date(data.payment_info.due_date), 'yyyy년 MM월 dd일')}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">결제방법</td>
                <td>{data.payment_info.payment_method}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-16">
          <p className="text-lg font-semibold mb-4">
            위와 같이 청구하오니 납부하여 주시기 바랍니다.
          </p>
          <p className="mb-8">
            {format(new Date(), 'yyyy년 MM월 dd일')}
          </p>
          <p className="text-xl font-bold">(주)우리회사</p>
        </div>
      </div>
    </div>
  );
} 