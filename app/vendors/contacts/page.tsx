'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { LNB } from '@/components/layout/lnb';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMockContacts } from '@/_mocks/contacts';
import { IVendorContact } from '@/types';

export default function ContactsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 상태 관리
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [status, setStatus] = useState<'all' | 'used' | 'unused'>('all');
  const [searchField, setSearchField] = useState<'name' | 'code' | 'branch' | 'email'>('name');
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  // 목업 데이터 조회
  const { data: contacts, total } = getMockContacts({
    status,
    searchField,
    searchValue,
    page,
    limit,
  });

  // 체크박스 핸들러
  const handleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map(contact => contact.id));
    }
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 일괄 상태 변경
  const handleBulkStatusChange = (newStatus: '사용' | '미사용') => {
    if (selectedIds.length === 0) {
      toast.error('선택된 항목이 없습니다.');
      return;
    }

    // 실제로는 API 호출이 필요하지만, 목업에서는 토스트 메시지만 표시
    toast.success(`${selectedIds.length}건의 상태가 변경되었습니다.`);
    setSelectedIds([]);
  };

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-gray-400">사업자 관리</span>
            <span className="text-gray-400">&gt;</span>
            <span>담당자 관리</span>
          </div>
          <Button onClick={() => router.push('/vendors/contacts/new')}>등록</Button>
        </div>

        {/* 검색 영역 */}
        <div className="flex gap-4 mb-6">
          <Select
            value={status}
            onValueChange={(value: 'all' | 'used' | 'unused') => setStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="사용여부 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="used">사용</SelectItem>
              <SelectItem value="unused">미사용</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={searchField}
            onValueChange={(value: 'name' | 'code' | 'branch' | 'email') => setSearchField(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="검색 기준 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">사업자명</SelectItem>
              <SelectItem value="code">사업자번호</SelectItem>
              <SelectItem value="branch">지점명</SelectItem>
              <SelectItem value="email">이메일</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="검색어 입력"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-[300px]"
          />
        </div>

        {/* 일괄 처리 영역 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Select onValueChange={(value: '사용' | '미사용') => handleBulkStatusChange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="상태 변경" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="사용">사용</SelectItem>
                <SelectItem value="미사용">미사용</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleBulkStatusChange('사용')}>적용</Button>
          </div>
          <div className="text-sm text-gray-500">
            총 {total}건
          </div>
        </div>

        {/* 테이블 */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedIds.length === contacts.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>No</TableHead>
                <TableHead>사업자명</TableHead>
                <TableHead>사업자번호</TableHead>
                <TableHead>지점명</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>사용여부</TableHead>
                <TableHead>등록자</TableHead>
                <TableHead>등록일</TableHead>
                <TableHead>수정자</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(contact.id)}
                      onCheckedChange={() => handleSelect(contact.id)}
                    />
                  </TableCell>
                  <TableCell>{total - (page - 1) * limit - index}</TableCell>
                  <TableCell
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/vendors/contacts/${contact.id}/edit`)}
                  >
                    {contact.vendorName}
                  </TableCell>
                  <TableCell>{contact.vendorCode}</TableCell>
                  <TableCell>{contact.branch}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.status}</TableCell>
                  <TableCell>{contact.createdBy}</TableCell>
                  <TableCell>{contact.createdAt}</TableCell>
                  <TableCell>{contact.updatedBy}</TableCell>
                  <TableCell>{contact.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이징 */}
        <div className="flex justify-between items-center mt-4">
          <Select
            value={String(limit)}
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="보기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10개</SelectItem>
              <SelectItem value="50">50개</SelectItem>
              <SelectItem value="100">100개</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              이전
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 