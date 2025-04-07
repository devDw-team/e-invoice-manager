'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { mockVendors } from '@/_mocks/vendors'
import { IVendor } from '@/types'
import { toast } from 'sonner'
import { LNB } from '@/components/layout/lnb'

export default function VendorsPage() {
  const router = useRouter()
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [invoiceStatus, setInvoiceStatus] = useState<string>('all')
  const [searchField, setSearchField] = useState<string>('name')
  const [searchValue, setSearchValue] = useState<string>('')
  const [limit, setLimit] = useState<number>(50)

  // 체크박스 전체 선택/해제
  const handleSelectAll = (checked: boolean | string) => {
    if (checked === true) {
      setSelectedVendors(mockVendors.map(vendor => vendor.id))
    } else {
      setSelectedVendors([])
    }
  }

  // 개별 체크박스 선택/해제
  const handleSelectOne = (checked: boolean | string, id: string) => {
    if (checked === true) {
      setSelectedVendors(prev => [...prev, id])
    } else {
      setSelectedVendors(prev => prev.filter(vendorId => vendorId !== id))
    }
  }

  // 일괄 처리 - 청구서 생성 여부 변경
  const handleBulkUpdate = (status: '사용' | '미사용') => {
    if (selectedVendors.length === 0) {
      toast.error('선택된 사업자가 없습니다.')
      return
    }
    
    // 실제로는 API 호출
    toast.success('선택한 사업자의 청구서 생성 여부가 변경되었습니다.')
  }

  // 텍스트 말줄임 처리
  const truncateText = (text: string, maxLength: number = 10) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">사업자 관리</h1>
          <Button onClick={() => router.push('/vendors/new')}>등록</Button>
        </div>

        {/* 검색 조건 */}
        <div className="flex gap-4 mb-6">
          <Select value={invoiceStatus} onValueChange={setInvoiceStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="청구서 생성 여부" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="used">사용</SelectItem>
              <SelectItem value="unused">미사용</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchField} onValueChange={setSearchField}>
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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-[300px]"
          />
        </div>

        {/* 일괄 처리 */}
        <div className="flex gap-4 mb-6">
          <Select onValueChange={(value) => handleBulkUpdate(value as '사용' | '미사용')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="청구서 생성 여부 변경" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="사용">사용</SelectItem>
              <SelectItem value="미사용">미사용</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 목록 */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedVendors.length === mockVendors.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>사업자명</TableHead>
                <TableHead>사업자번호</TableHead>
                <TableHead>대표자</TableHead>
                <TableHead>업태 / 종목</TableHead>
                <TableHead>청구서 생성 여부</TableHead>
                <TableHead>수정자</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedVendors.includes(vendor.id)}
                      onCheckedChange={(checked) => handleSelectOne(checked, vendor.id)}
                    />
                  </TableCell>
                  <TableCell>{vendor.id}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => router.push(`/vendors/${vendor.id}/edit`)}
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.name}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => router.push(`/vendors/${vendor.id}/edit`)}
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.code}
                    </button>
                  </TableCell>
                  <TableCell>{vendor.ceo}</TableCell>
                  <TableCell>{truncateText(`${vendor.businessType} / ${vendor.businessItem}`)}</TableCell>
                  <TableCell>{vendor.invoiceStatus}</TableCell>
                  <TableCell>{vendor.modifier}</TableCell>
                  <TableCell>{vendor.modifiedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이징 */}
        <div className="flex justify-end mt-4">
          <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
            <SelectTrigger className="w-[100px]">
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
  )
} 