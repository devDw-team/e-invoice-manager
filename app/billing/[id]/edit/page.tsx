'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { IBillingInvoice } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { LNB } from '@/components/layout/lnb';

// 임시 데이터 (백엔드 개발 전까지 사용)
const MOCK_DATA: IBillingInvoice = {
  id: '1',
  vendor: {
    id: '1',
    name: '(주)테스트',
    code: '123-45-67890',
    ceo: '홍길동',
    email: 'test@example.com',
    businessType: '서비스업',
    businessItem: '소프트웨어 개발',
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
};

export default function BillingEditPage() {
  const router = useRouter();
  const params = useParams();
  const [data, setData] = useState<IBillingInvoice>(MOCK_DATA);
  const [showStamp, setShowStamp] = useState(true);
  const [paymentGuide, setPaymentGuide] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSave = async () => {
    // 실제 API 호출은 백엔드 개발 후 구현
    console.log('Save data:', data);
    router.push('/billing');
  };

  const handlePreview = () => {
    window.open(`/billing/${params.id}/preview`, '_blank');
  };

  const handleSend = () => {
    if (!data.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    // 실제 발송 로직은 백엔드 개발 후 구현
    console.log('Send invoice:', data);
  };

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">청구서 수정</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => router.push('/billing')}>
                목록
              </Button>
              <Button onClick={handleSave}>저장</Button>
              <Button variant="outline" onClick={handlePreview}>
                미리보기
              </Button>
              <Button onClick={handleSend}>발송</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* 공급받는자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>공급받는자 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>사업자명</Label>
                    <Input value={data.vendor.name} disabled />
                  </div>
                  <div>
                    <Label>사업자번호</Label>
                    <Input value={data.vendor.code} disabled />
                  </div>
                  <div>
                    <Label>대표자</Label>
                    <Input value={data.vendor.ceo} disabled />
                  </div>
                  <div>
                    <Label>이메일</Label>
                    <Input
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 공급자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>공급자 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stamp"
                    checked={showStamp}
                    onCheckedChange={(checked) => setShowStamp(checked as boolean)}
                  />
                  <Label htmlFor="stamp">인감 노출</Label>
                </div>
              </CardContent>
            </Card>

            {/* 이용 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>이용 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>청구월</Label>
                    <Input value={data.billing_month} disabled />
                  </div>
                  <div>
                    <Label>납부기한</Label>
                    <Input value={data.payment_info.due_date} disabled />
                  </div>
                  <div>
                    <Label>결제방법</Label>
                    <Input value={data.payment_info.payment_method} disabled />
                  </div>
                  <div>
                    <Label>청구금액</Label>
                    <Input
                      value={data.payment_info.amount.toLocaleString()}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 결제 안내 */}
            <Card>
              <CardHeader>
                <CardTitle>결제 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={paymentGuide}
                  onChange={(e) => setPaymentGuide(e.target.value)}
                  placeholder="결제 안내 메시지를 입력하세요. (300자 이내)"
                  maxLength={300}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* 첨부 파일 */}
            <Card>
              <CardHeader>
                <CardTitle>첨부 파일</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>기본 첨부 파일</Label>
                  <div className="flex gap-2 mt-2">
                    {data.attachments.map((file) => (
                      <Button
                        key={file.name}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url)}
                      >
                        {file.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>추가 첨부 파일</Label>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + selectedFiles.length > 5) {
                        alert('최대 5개까지만 첨부할 수 있습니다.');
                        return;
                      }
                      setSelectedFiles([...selectedFiles, ...files]);
                    }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    최대 5개까지 첨부 가능
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 