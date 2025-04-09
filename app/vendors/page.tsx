'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { mockVendors } from '@/_mocks/vendors'
import { IVendor } from '@/types'
import { toast } from 'sonner'
import { LNB } from '@/components/layout/lnb'
import { vendorApi } from '@/utils/api'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VendorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 상태 관리
  const [vendors, setVendors] = useState<IVendor[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  
  // 검색 조건
  const [searchField, setSearchField] = useState<'name' | 'code' | 'ceo'>('name')
  const [searchValue, setSearchValue] = useState('')
  const [invoiceStatus, setInvoiceStatus] = useState<'all' | '사용' | '미사용'>('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)

  // 데이터 조회
  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await vendorApi.getVendors({
        page,
        limit,
        searchField,
        searchValue,
        invoiceStatus,
      })
      
      if (Array.isArray(response)) {
        setVendors(response)
        setTotal(response.length)
      } else if (response && Array.isArray(response.data)) {
        setVendors(response.data)
        setTotal(response.total || 0)
      } else {
        setVendors([])
        setTotal(0)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      toast.error("사업자 목록을 불러오는데 실패했습니다.")
      setVendors([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  // 일괄 상태 변경
  const handleBulkStatusUpdate = async (newStatus: '사용' | '미사용') => {
    if (selectedIds.length === 0) {
      toast.warning("선택된 사업자가 없습니다.")
      return
    }

    try {
      await vendorApi.bulkUpdateStatus({
        vendorIds: selectedIds,
        invoiceStatus: newStatus,
        modifier: 'admin', // TODO: 실제 사용자 ID로 대체
      })

      toast.success("선택된 사업자의 상태가 변경되었습니다.")

      fetchVendors()
      setSelectedIds([])
    } catch (error) {
      toast.error("상태 변경에 실패했습니다.")
    }
  }

  // 검색 조건 변경 시 데이터 재조회
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      if (!mounted) return
      await fetchVendors()
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [page, limit, searchField, searchValue, invoiceStatus])

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">사업자 관리</h1>
          <Button onClick={() => router.push('/vendors/new')}>등록</Button>
        </div>

        {/* 검색 조건 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>검색 조건</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={invoiceStatus} onValueChange={(value: any) => setInvoiceStatus(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="청구서 생성 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="사용">사용</SelectItem>
                    <SelectItem value="미사용">미사용</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchField} onValueChange={(value: any) => setSearchField(value)}>
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
              <div className="flex gap-4">
                <Select onValueChange={(value: '사용' | '미사용') => handleBulkStatusUpdate(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="청구서 생성 여부 변경" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사용">사용</SelectItem>
                    <SelectItem value="미사용">미사용</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 목록 */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedIds.length === vendors.length}
                    onCheckedChange={(checked) => {
                      setSelectedIds(checked ? vendors.map(v => v.id) : [])
                    }}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    데이터를 불러오는 중입니다...
                  </TableCell>
                </TableRow>
              ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    등록된 사업자가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(vendor.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIds(
                            checked
                              ? [...selectedIds, vendor.id]
                              : selectedIds.filter(id => id !== vendor.id)
                          )
                        }}
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
                    <TableCell>{vendor.code}</TableCell>
                    <TableCell>{vendor.ceo}</TableCell>
                    <TableCell>
                      {vendor.businessType && vendor.item
                        ? `${vendor.businessType} / ${vendor.item}`
                        : vendor.businessType || vendor.item}
                    </TableCell>
                    <TableCell>{vendor.invoiceStatus}</TableCell>
                    <TableCell>{vendor.modifier}</TableCell>
                    <TableCell>
                      {vendor.modifiedAt ? format(new Date(vendor.modifiedAt), 'yyyy.MM.dd HH:mm') : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
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