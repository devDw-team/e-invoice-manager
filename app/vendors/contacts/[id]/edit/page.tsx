'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
import { LNB } from '@/components/layout/lnb';

export default function ContactEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // 폼 상태 관리
  const [formData, setFormData] = useState<IVendorContactFormData>({
    vendorId: 0,
    branch: '',
    email: '',
    status: '사용',
  });

  // 유효성 검사
  const validateForm = () => {
    if (!formData.vendorId) {
      toast.error("'사업자 찾기'를 통해 사업자 정보를 입력해주세요.");
      return false;
    }
    if (!formData.email) {
      toast.error('이메일을 입력해주세요.');
      return false;
    }
    if (formData.branch && formData.branch.length > 30) {
      toast.error('지점명은 30자를 초과할 수 없습니다.');
      return false;
    }
    return true;
  };

  // 저장 처리
  const handleSave = () => {
    if (!validateForm()) return;
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    // 실제로는 API 호출이 필요하지만, 목업에서는 토스트 메시지만 표시
    toast.success('저장이 완료되었습니다.');
    router.push('/vendors/contacts');
  };

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">담당자 정보 수정</h1>

          <div className="space-y-6">
            {/* 사업자 선택 */}
            <div className="space-y-2">
              <Label>사업자 선택</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="사업자 찾기를 클릭하세요"
                  value={formData.vendorId ? '테스트 사업자' : ''}
                  readOnly
                  className="bg-gray-100"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    // 실제로는 사업자 검색 팝업을 띄워야 함
                    setFormData({ ...formData, vendorId: 123 });
                  }}
                >
                  사업자 찾기
                </Button>
              </div>
            </div>

            {/* 사업자번호 */}
            <div className="space-y-2">
              <Label>사업자번호</Label>
              <Input
                value={formData.vendorId ? '123-45-67890' : ''}
                readOnly
                className="bg-gray-100"
              />
            </div>

            {/* 지점명 */}
            <div className="space-y-2">
              <Label>지점명</Label>
              <Input
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                maxLength={30}
                placeholder="지점명 입력 (선택)"
              />
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                maxLength={30}
                placeholder="이메일 입력 (필수)"
                required
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
              <Button variant="outline" onClick={() => setShowExitDialog(true)}>
                목록
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </div>
          </div>

          {/* 나가기 확인 다이얼로그 */}
          <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>목록으로 이동</AlertDialogTitle>
                <AlertDialogDescription>
                  목록으로 이동하시겠습니까? 작성(수정) 중인 내용은 반영되지 않습니다.
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

          {/* 저장 확인 다이얼로그 */}
          <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>저장 확인</AlertDialogTitle>
                <AlertDialogDescription>
                  작성한 내용으로 저장하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSave}>
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