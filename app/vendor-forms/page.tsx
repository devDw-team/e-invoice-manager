'use client';

import { useState } from 'react';
import { mockVendorForms } from '@/_mocks/vendor-forms';
import { IVendorSearchParams, IVendorForm } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LNB } from '@/components/layout/lnb';

const ITEMS_PER_PAGE = [10, 50, 100];
const INVOICE_ITEMS = [
  { id: 'paymentInfo', label: '결제 정보' },
  { id: 'membership', label: '멤버십' },
  { id: 'barcode', label: '바코드' },
  { id: 'orderNumber', label: '주문번호' },
  { id: 'productGroup', label: '제품군' },
];

export default function VendorFormsPage() {
  const [searchParams, setSearchParams] = useState<IVendorSearchParams>({
    invoiceStatus: 'all',
    searchField: 'name',
    searchValue: '',
    page: 1,
    limit: 50,
  });

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // 목업 데이터 필터링
  const filteredForms = mockVendorForms.filter(form => {
    if (selectedItems.length > 0) {
      return selectedItems.some(item => form.invoiceItems[item as keyof typeof form.invoiceItems]);
    }
    return true;
  });

  const paginatedForms = filteredForms.slice(
    (searchParams.page - 1) * searchParams.limit,
    searchParams.page * searchParams.limit
  );

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">청구서 양식 관리</h1>
          <Button asChild>
            <Link href="/vendor-forms/new">신규 등록</Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>검색 조건</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {INVOICE_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(i => i !== item.id));
                        }
                      }}
                    />
                    <label htmlFor={item.id}>{item.label}</label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Select
                  value={searchParams.searchField}
                  onValueChange={(value: 'name' | 'code' | 'ceo') =>
                    setSearchParams({ ...searchParams, searchField: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="검색 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">사업자명</SelectItem>
                    <SelectItem value="code">사업자번호</SelectItem>
                    <SelectItem value="ceo">대표자</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="검색어를 입력하세요"
                  value={searchParams.searchValue}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, searchValue: e.target.value })
                  }
                  className="flex-1"
                />

                <Button onClick={() => setSearchParams({ ...searchParams, page: 1 })}>
                  검색
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">사업자명</th>
                  <th className="px-6 py-3">사업자번호</th>
                  <th className="px-6 py-3">대표자</th>
                  <th className="px-6 py-3">설정 항목</th>
                  <th className="px-6 py-3">등록자</th>
                  <th className="px-6 py-3">등록일</th>
                  <th className="px-6 py-3">수정자</th>
                  <th className="px-6 py-3">수정일</th>
                </tr>
              </thead>
              <tbody>
                {paginatedForms.map((form, index) => (
                  <tr key={form.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      <Link href={`/vendor-forms/${form.id}/edit`} className="text-blue-600 hover:underline">
                        {form.vendorName} 청구서
                      </Link>
                    </td>
                    <td className="px-6 py-4">{form.vendorCode}</td>
                    <td className="px-6 py-4">{form.ceo}</td>
                    <td className="px-6 py-4">
                      {INVOICE_ITEMS.map(item => (
                        <span key={item.id} className="mr-2">
                          {item.label}: {form.invoiceItems[item.id as keyof typeof form.invoiceItems] ? 'O' : 'X'}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4">{form.createdBy}</td>
                    <td className="px-6 py-4">{form.createdAt}</td>
                    <td className="px-6 py-4">{form.updatedBy}</td>
                    <td className="px-6 py-4">{form.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-4">
            <div>
              총 {filteredForms.length}건
            </div>
            <div className="flex gap-4 items-center">
              <Select
                value={searchParams.limit.toString()}
                onValueChange={(value) =>
                  setSearchParams({ ...searchParams, limit: Number(value), page: 1 })
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="보기" />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}건
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({ ...searchParams, page: searchParams.page - 1 })}
                  disabled={searchParams.page === 1}
                >
                  이전
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({ ...searchParams, page: searchParams.page + 1 })}
                  disabled={searchParams.page * searchParams.limit >= filteredForms.length}
                >
                  다음
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 