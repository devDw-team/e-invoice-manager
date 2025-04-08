'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LNB } from '@/components/layout/lnb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { IVendorContactFormData } from '@/types';
import VendorSearchDialog from '@/components/vendors/VendorSearchDialog';
import { IVendor, IVendorContact } from '@/types';

export default function ContactNewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showVendorSearch, setShowVendorSearch] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const [formData, setFormData] = useState<IVendorContact>({
    vendorId: 0,
    vendorName: '',
    vendorCode: '',
    branch: '',
    email: '',
    status: '사용',
  });

  const handleVendorSelect = (vendor: IVendor) => {
    setFormData({
      ...formData,
      vendorId: vendor.id,
      vendorName: vendor.vendorName,
      vendorCode: vendor.vendorCode,
    });
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.vendorId) {
      toast.error("'사업자 찾기'를 통해 사업자 정보를 입력해주세요.");
      return;
    }
    if (!formData.email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }
    if (formData.branch && formData.branch.length > 30) {
      toast.error('지점명은 30자를 초과할 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/vendor-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('저장 중 오류가 발생했습니다.');
      }

      router.push('/vendors/contacts');
    } catch (error) {
      console.error('저장 중 오류:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">담당자 신규 등록</h1>

          <div className="space-y-6">
            {/* 사업자 선택 */}
            <div className="space-y-2">
              <Label>사업자 정보</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.vendorName}
                  placeholder="사업자명"
                  readOnly
                  className="bg-gray-50"
                />
                <Input
                  value={formData.vendorCode}
                  placeholder="사업자번호"
                  readOnly
                  className="bg-gray-50"
                />
                <Button
                  type="button"
                  onClick={() => setShowVendorSearch(true)}
                  disabled={loading}
                >
                  사업자 찾기
                </Button>
              </div>
            </div>

            {/* 지점명 */}
            <div className="space-y-2">
              <Label>지점명</Label>
              <Input
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="지점명 입력 (선택, 30자 이내)"
                maxLength={30}
                disabled={loading}
              />
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="이메일 주소 입력"
                type="email"
                required
                disabled={loading}
              />
            </div>

            {/* 사용여부 */}
            <div className="space-y-2">
              <Label>사용여부</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value: '사용' | '미사용') =>
                  setFormData({ ...formData, status: value })
                }
                className="flex gap-4"
                disabled={loading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="사용" id="use" />
                  <Label htmlFor="use">사용</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="미사용" id="unuse" />
                  <Label htmlFor="unuse">미사용</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowExitAlert(true)}
                disabled={loading}
              >
                목록
              </Button>
              <Button
                onClick={() => setShowSaveAlert(true)}
                disabled={loading}
              >
                저장
              </Button>
            </div>
          </div>

          {/* 사업자 찾기 팝업 */}
          <VendorSearchDialog
            open={showVendorSearch}
            onClose={() => setShowVendorSearch(false)}
            onSelect={handleVendorSelect}
          />

          {/* 목록 이동 확인 */}
          <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>목록으로 이동</AlertDialogTitle>
                <AlertDialogDescription>
                  목록으로 이동하시겠습니까? 작성 중인 내용은 반영되지 않습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={() => router.push('/vendors/contacts')}>
                  나가기
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 저장 확인 */}
          <AlertDialog open={showSaveAlert} onOpenChange={setShowSaveAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>저장 확인</AlertDialogTitle>
                <AlertDialogDescription>
                  작성한 내용으로 저장하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  저장
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
} 