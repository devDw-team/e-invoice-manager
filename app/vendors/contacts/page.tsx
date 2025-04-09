'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { contactsApi } from '@/utils/api';
import { IContactWithVendor } from '@/types';

export default function ContactsPage() {
  const router = useRouter();
  
  // 상태 관리
  const [contacts, setContacts] = useState<IContactWithVendor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 검색 조건
  const [searchParams, setSearchParams] = useState({
    status: 'all' as const,
    searchField: 'name' as const,
    searchValue: '',
    page: 1,
    limit: 50,
  });

  // 데이터 조회
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsApi.getContacts(searchParams);
      setContacts(response.data);
      setTotalCount(response.total);
    } catch (error) {
      toast.error('담당자 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색 조건 변경 처리
  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, page: 1 }));
  };

  // 일괄 상태 변경
  const handleBulkStatusUpdate = async (status: '사용' | '미사용') => {
    if (!selectedIds.length) {
      toast.error('선택된 항목이 없습니다.');
      return;
    }

    try {
      await contactsApi.bulkUpdateStatus({
        contactIds: selectedIds,
        status,
      });
      
      toast.success(`${selectedIds.length}건의 상태가 변경되었습니다.`);
      
      fetchContacts();
      setSelectedIds([]);
    } catch (error) {
      toast.error('상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchContacts();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1">
        <div className="p-6 space-y-6">
          {/* 페이지 타이틀 */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">담당자 관리</h1>
            <Button onClick={() => router.push('/vendors/contacts/new')}>
              등록
            </Button>
          </div>

          {/* 검색 영역 */}
          <div className="flex gap-4 items-end">
            <div className="w-40">
              <Select
                value={searchParams.status}
                onValueChange={(value: typeof searchParams.status) =>
                  setSearchParams(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="사용여부" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="used">사용</SelectItem>
                  <SelectItem value="unused">미사용</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <Select
                value={searchParams.searchField}
                onValueChange={(value: typeof searchParams.searchField) =>
                  setSearchParams(prev => ({ ...prev, searchField: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="검색 조건" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">사업자명</SelectItem>
                  <SelectItem value="code">사업자번호</SelectItem>
                  <SelectItem value="branch">지점명</SelectItem>
                  <SelectItem value="email">이메일</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Input
                placeholder="검색어를 입력하세요"
                value={searchParams.searchValue}
                onChange={e =>
                  setSearchParams(prev => ({ ...prev, searchValue: e.target.value }))
                }
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <Button onClick={handleSearch}>검색</Button>
          </div>

          {/* 일괄 처리 영역 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkStatusUpdate('사용')}
              >
                사용
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkStatusUpdate('미사용')}
              >
                미사용
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              총 {totalCount}건
            </div>
          </div>

          {/* 테이블 */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === contacts.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds(contacts.map(contact => contact.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
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
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                      등록된 담당자가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact, index) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(contact.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds(prev => [...prev, contact.id]);
                            } else {
                              setSelectedIds(prev =>
                                prev.filter(id => id !== contact.id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{totalCount - (searchParams.page - 1) * searchParams.limit - index}</TableCell>
                      <TableCell>
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => router.push(`/vendors/contacts/${contact.id}/edit`)}
                        >
                          {contact.vendorName}
                        </button>
                      </TableCell>
                      <TableCell>{contact.vendorCode}</TableCell>
                      <TableCell>{contact.branch || '-'}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.status === '사용' ? '사용' : '미사용'}</TableCell>
                      <TableCell>{contact.createdBy}</TableCell>
                      <TableCell>
                        {new Date(contact.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{contact.updatedBy || '-'}</TableCell>
                      <TableCell>
                        {contact.updatedAt
                          ? new Date(contact.updatedAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center gap-2">
            <Select
              value={searchParams.limit.toString()}
              onValueChange={(value) =>
                setSearchParams(prev => ({
                  ...prev,
                  limit: Number(value),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10개</SelectItem>
                <SelectItem value="50">50개</SelectItem>
                <SelectItem value="100">100개</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
} 