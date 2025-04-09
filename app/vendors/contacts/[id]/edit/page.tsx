'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { use } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LNB } from '@/components/layout/lnb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { vendorsApi } from '@/utils/api';
import { IVendor, IVendorContact } from '@/types';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ContactEditForm({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showVendorSearch, setShowVendorSearch] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // 사업자 검색 관련 상태 추가
  const [vendorSearchParams, setVendorSearchParams] = useState({
    searchField: 'name' as const,
    searchValue: '',
  });
  const [searchResults, setSearchResults] = useState<IVendor[]>([]);

  const [formData, setFormData] = useState<IVendorContact>({
    id: Number(resolvedParams.id),
    vendorId: 0,
    vendorName: '',
    vendorCode: '',
    branch: '',
    email: '',
    status: '사용',
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch(`/api/vendor-contacts/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('데이터 로딩 중 오류:', error);
        toast.error('담당자 정보를 불러오는데 실패했습니다.');
        router.push('/vendors/contacts');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchContactData();
  }, [resolvedParams.id, router]);

  // 사업자 검색 핸들러 추가
  const handleVendorSearch = async () => {
    try {
      const response = await vendorsApi.searchVendors(
        vendorSearchParams.searchField,
        vendorSearchParams.searchValue.trim()
      );
      
      const vendors = Array.isArray(response) ? response : response.data || [];
      setSearchResults(vendors);
    } catch (error) {
      console.error('사업자 검색 오류:', error);
      toast.error('사업자 검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    }
  };

  // 팝업이 열릴 때 자동으로 검색 실행
  useEffect(() => {
    if (showVendorSearch) {
      handleVendorSearch();
    } else {
      setVendorSearchParams({
        searchField: 'name',
        searchValue: '',
      });
      setSearchResults([]);
    }
  }, [showVendorSearch]);

  const handleVendorSelect = (vendor: IVendor) => {
    setFormData({
      ...formData,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCode: vendor.code,
    });
    setShowVendorSearch(false);
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
      const response = await fetch(`/api/vendor-contacts/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          updatedBy: 'admin', // TODO: 실제 로그인 사용자 ID로 대체
        }),
      });

      if (!response.ok) {
        throw new Error('저장 중 오류가 발생했습니다.');
      }

      toast.success('저장이 완료되었습니다.');
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
          <h1 className="text-2xl font-bold mb-8">담당자 정보 수정</h1>

          {initialLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
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
          )}

          {/* 사업자 찾기 팝업 */}
          <Dialog open={showVendorSearch} onOpenChange={setShowVendorSearch}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>사업자 찾기</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* 검색 영역 */}
                <div className="flex gap-2">
                  <RadioGroup
                    value={vendorSearchParams.searchField}
                    onValueChange={value =>
                      setVendorSearchParams(prev => ({
                        ...prev,
                        searchField: value as typeof vendorSearchParams.searchField,
                      }))
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="name" id="name" />
                      <Label htmlFor="name">사업자명</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="code" id="code" />
                      <Label htmlFor="code">사업자번호</Label>
                    </div>
                  </RadioGroup>

                  <Input
                    value={vendorSearchParams.searchValue}
                    onChange={e =>
                      setVendorSearchParams(prev => ({
                        ...prev,
                        searchValue: e.target.value,
                      }))
                    }
                    onKeyDown={e => e.key === 'Enter' && handleVendorSearch()}
                    placeholder="검색어를 입력하세요"
                    className="flex-1"
                  />

                  <Button onClick={handleVendorSearch}>검색</Button>
                </div>

                {/* 검색 결과 */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>사업자번호</TableHead>
                        <TableHead>사업자명</TableHead>
                        <TableHead>대표자명</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(searchResults) && searchResults.length > 0 ? (
                        searchResults.map((vendor: IVendor) => (
                          <TableRow
                            key={vendor.id}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => handleVendorSelect(vendor)}
                          >
                            <TableCell>{vendor.code}</TableCell>
                            <TableCell>{vendor.name}</TableCell>
                            <TableCell>{vendor.ceo || '-'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            검색 결과가 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 목록 이동 확인 */}
          <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>목록으로 이동</AlertDialogTitle>
                <AlertDialogDescription>
                  목록으로 이동하시겠습니까? 수정 중인 내용은 반영되지 않습니다.
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
                  수정한 내용으로 저장하시겠습니까?
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