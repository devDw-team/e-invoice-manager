'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { contactsApi, vendorsApi } from '@/utils/api';
import { IVendor } from '@/types';

interface Props {
  params: {
    id: string;
  };
}

export default function ContactEditPage({ params }: Props) {
  const router = useRouter();
  const contactId = Number(params.id);

  // 상태 관리
  const [formData, setFormData] = useState({
    vendorId: 0,
    vendorName: '',
    vendorCode: '',
    branch: '',
    email: '',
    status: '사용' as const,
  });
  const [vendorSearchOpen, setVendorSearchOpen] = useState(false);
  const [vendorSearchParams, setVendorSearchParams] = useState({
    searchField: 'name' as const,
    searchValue: '',
  });
  const [searchResults, setSearchResults] = useState<IVendor[]>([]);
  const [loading, setLoading] = useState(false);

  // 담당자 정보 조회
  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await contactsApi.getContacts();
      const contact = response.data.find((c: any) => c.id === contactId);
      if (contact) {
        setFormData({
          vendorId: contact.vendorId,
          vendorName: contact.vendorName,
          vendorCode: contact.vendorCode,
          branch: contact.branch || '',
          email: contact.email,
          status: contact.status,
        });
      }
    } catch (error) {
      toast.error('담당자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 사업자 검색
  const handleVendorSearch = async () => {
    try {
      const response = await vendorsApi.searchVendors(
        vendorSearchParams.searchField,
        vendorSearchParams.searchValue
      );
      setSearchResults(response.data);
    } catch (error) {
      toast.error('사업자 검색 중 오류가 발생했습니다.');
    }
  };

  // 사업자 선택
  const handleVendorSelect = (vendor: IVendor) => {
    setFormData(prev => ({
      ...prev,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCode: vendor.code,
    }));
    setVendorSearchOpen(false);
  };

  // 저장
  const handleSubmit = async () => {
    try {
      // 유효성 검사
      if (!formData.vendorId) {
        toast.error('사업자를 선택해주세요.');
        return;
      }

      if (!formData.email) {
        toast.error('이메일을 입력해주세요.');
        return;
      }

      // API 호출
      await contactsApi.updateContact({
        id: contactId,
        vendorId: formData.vendorId,
        branch: formData.branch,
        email: formData.email,
        status: formData.status,
        updatedBy: 'admin', // TODO: 실제 로그인 사용자 ID로 대체
      });

      toast.success('저장이 완료되었습니다.');

      router.push('/vendors/contacts');
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    if (contactId) {
      fetchContact();
    }
  }, [contactId]);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {/* 사업자 정보 */}
        <div className="space-y-2">
          <Label>사업자 정보</Label>
          <div className="flex gap-2">
            <Input
              value={formData.vendorName}
              placeholder="사업자명"
              readOnly
            />
            <Input
              value={formData.vendorCode}
              placeholder="사업자번호"
              readOnly
            />
            <Button
              variant="outline"
              onClick={() => setVendorSearchOpen(true)}
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
            onChange={e =>
              setFormData(prev => ({ ...prev, branch: e.target.value }))
            }
            maxLength={30}
          />
        </div>

        {/* 이메일 */}
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input
            value={formData.email}
            onChange={e =>
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            maxLength={100}
            required
          />
        </div>

        {/* 사용여부 */}
        <div className="space-y-2">
          <Label>사용여부</Label>
          <RadioGroup
            value={formData.status}
            onValueChange={value =>
              setFormData(prev => ({
                ...prev,
                status: value as typeof formData.status,
              }))
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
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => router.push('/vendors/contacts')}>
          목록
        </Button>
        <Button onClick={handleSubmit}>저장</Button>
      </div>

      {/* 사업자 검색 팝업 */}
      <Dialog open={vendorSearchOpen} onOpenChange={setVendorSearchOpen}>
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
                  {searchResults.map(vendor => (
                    <TableRow
                      key={vendor.id}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleVendorSelect(vendor)}
                    >
                      <TableCell>{vendor.code}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.ceo || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 