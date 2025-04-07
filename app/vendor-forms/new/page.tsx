'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockVendors } from '@/_mocks/vendor-forms';
import { IVendor, IVendorForm } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { LNB } from '@/components/layout/lnb';

const DEFAULT_FORM: Omit<IVendorForm, 'id' | 'vendorName' | 'vendorCode' | 'ceo' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'> = {
  invoiceItems: {
    paymentInfo: true,
    membership: true,
    barcode: false,
    orderNumber: true,
    productGroup: true,
    modelName: true,
    contractDate: true,
    mandatoryPeriod: true,
    contractPeriod: true,
    supplyPrice: true,
    vat: true,
    rentalFee: true,
    installationAddress: true,
    defaultInterest: true,
    note: false,
    asCharge: false,
    consumableReplacementCost: false,
    penaltyFee: false,
    branchName: false,
    contact: false,
  },
  callCenterInfo: '',
  paymentDescription: '',
};

const INVOICE_ITEM_LABELS: Record<string, string> = {
  orderNumber: '주문번호',
  productGroup: '제품군',
  modelName: '모델명',
  contractDate: '계약일',
  mandatoryPeriod: '의무사용기간',
  contractPeriod: '약정기간',
  supplyPrice: '공급가액',
  vat: '부가세',
  rentalFee: '렌탈료',
  installationAddress: '설치처 주소',
  membership: '멤버십',
  defaultInterest: '연체이자',
  note: '비고',
  barcode: '바코드 번호',
  asCharge: 'A/S 대금',
  consumableReplacementCost: '소모품 교체비',
  penaltyFee: '위약금',
  branchName: '관리지국명',
  contact: '연락처',
  paymentInfo: '결제 정보',
};

export default function VendorFormNewPage() {
  const router = useRouter();
  const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleSave = () => {
    if (!selectedVendor) {
      toast.error("'사업자 찾기'를 통해 사업자 정보를 입력해주세요.");
      return;
    }

    // 여기에 저장 로직 구현
    toast.success('청구서 양식이 저장되었습니다.');
    router.push('/vendor-forms');
  };

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">청구서 양식 등록</h1>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">목록</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>목록으로 이동</AlertDialogTitle>
                    <AlertDialogDescription>
                      목록으로 이동하시겠습니까? 작성 중인 내용은 반영되지 않습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={() => router.push('/vendor-forms')}>
                      나가기
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleSave}>저장</Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* 공급받는자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>공급받는자 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">사업자 찾기</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>사업자 선택</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {mockVendors.map((vendor) => (
                          <div
                            key={vendor.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded"
                            onClick={() => {
                              setSelectedVendor(vendor);
                              const dialogClose = document.querySelector('[data-dialog-close]');
                              if (dialogClose instanceof HTMLElement) {
                                dialogClose.click();
                              }
                            }}
                          >
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-sm text-gray-500">{vendor.code}</div>
                            </div>
                            <div className="text-sm text-gray-500">{vendor.ceo}</div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {selectedVendor && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">사업자명</label>
                        <Input value={selectedVendor.name} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">사업자번호</label>
                        <Input value={selectedVendor.code} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">대표자</label>
                        <Input value={selectedVendor.ceo} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">업태</label>
                        <Input value={selectedVendor.businessType} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">종목</label>
                        <Input value={selectedVendor.businessItem} disabled />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 공급자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>공급자 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seal"
                      checked={true}
                      onCheckedChange={(checked) => {
                        // 인감 정보 처리
                      }}
                    />
                    <label htmlFor="seal">인감 정보</label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="callcenter"
                        checked={!!form.callCenterInfo}
                        onCheckedChange={(checked) => {
                          setForm({
                            ...form,
                            callCenterInfo: checked ? '1588-XXXX, example.com' : '',
                          });
                        }}
                      />
                      <label htmlFor="callcenter">고객센터 안내 정보</label>
                    </div>
                    <Input
                      value={form.callCenterInfo}
                      onChange={(e) => setForm({ ...form, callCenterInfo: e.target.value })}
                      placeholder="고객센터 번호, 홈페이지 등"
                      disabled={!form.callCenterInfo}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 결제/선납금 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>결제/선납금 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payment"
                      checked={form.invoiceItems.paymentInfo}
                      onCheckedChange={(checked) => {
                        setForm({
                          ...form,
                          invoiceItems: {
                            ...form.invoiceItems,
                            paymentInfo: !!checked,
                          },
                        });
                      }}
                    />
                    <label htmlFor="payment">결제 정보</label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="paymentDesc"
                        checked={!!form.paymentDescription}
                        onCheckedChange={(checked) => {
                          setForm({
                            ...form,
                            paymentDescription: checked ? '매월 자동 결제됩니다.' : '',
                          });
                        }}
                      />
                      <label htmlFor="paymentDesc">결제 안내 정보</label>
                    </div>
                    <Textarea
                      value={form.paymentDescription}
                      onChange={(e) => setForm({ ...form, paymentDescription: e.target.value })}
                      placeholder="결제 안내 문구를 입력하세요 (300자 이내)"
                      maxLength={300}
                      disabled={!form.paymentDescription}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 청구대금 상세 항목 */}
            <Card>
              <CardHeader>
                <CardTitle>청구대금 상세 항목</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(form.invoiceItems).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => {
                          setForm({
                            ...form,
                            invoiceItems: {
                              ...form.invoiceItems,
                              [key]: !!checked,
                            },
                          });
                        }}
                      />
                      <label htmlFor={key}>{INVOICE_ITEM_LABELS[key] || key}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 