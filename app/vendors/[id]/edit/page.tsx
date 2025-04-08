'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { IVendor } from '@/types'
import { toast } from 'sonner'
import { LNB } from '@/components/layout/lnb'
import { vendorApi } from '@/utils/api'
import { use } from 'react'
import { invoiceStatusEnum } from '@/db/schema'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function VendorEditPage({ params }: Props) {
  const router = useRouter()
  const { id } = use(params)
  const [vendor, setVendor] = useState<IVendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await vendorApi.getVendor(parseInt(id))
        setVendor(data)
      } catch (error) {
        toast.error("사업자 정보를 불러오는데 실패했습니다.")
        router.push('/vendors')
      } finally {
        setLoading(false)
      }
    }

    fetchVendor()
  }, [id, router])

  const handleSubmit = async () => {
    if (!vendor) return

    try {
      await vendorApi.updateVendor(vendor.id, vendor)
      toast.success("사업자 정보가 수정되었습니다.")
      router.push('/vendors')
    } catch (error) {
      toast.error("사업자 정보 수정에 실패했습니다.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LNB />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex min-h-screen">
        <LNB />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <p>사업자 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">사업자 수정</h1>
          </div>

          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
            {/* 청구서 생성 여부 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">청구서 생성 여부</label>
              <Select
                value={vendor.invoiceStatus}
                onValueChange={(value: typeof invoiceStatusEnum.enumValues[number]) => setVendor({ ...vendor, invoiceStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="사용">사용</SelectItem>
                  <SelectItem value="미사용">미사용</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 사업자명 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사업자명 *</label>
              <Input
                value={vendor.name}
                onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
                maxLength={100}
              />
            </div>

            {/* 사업자번호 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사업자번호 *</label>
              <Input
                value={vendor.code}
                onChange={(e) => setVendor({ ...vendor, code: e.target.value })}
                maxLength={20}
                disabled
              />
            </div>

            {/* 대표자 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">대표자</label>
              <Input
                value={vendor.ceo}
                onChange={(e) => setVendor({ ...vendor, ceo: e.target.value })}
                maxLength={100}
              />
            </div>

            {/* 사업장 주소 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사업장 주소</label>
              <Textarea
                value={vendor.address}
                onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
              />
            </div>

            {/* 업태 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">업태</label>
              <Input
                value={vendor.businessType}
                onChange={(e) => setVendor({ ...vendor, businessType: e.target.value })}
                maxLength={100}
              />
            </div>

            {/* 종목 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">종목</label>
              <Input
                value={vendor.item}
                onChange={(e) => setVendor({ ...vendor, item: e.target.value })}
                maxLength={100}
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-4 pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">목록</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>작성 내용 반영되지 않음</AlertDialogTitle>
                    <AlertDialogDescription>
                      작성 중인 내용이 저장되지 않습니다. 목록으로 이동하시겠습니까?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={() => router.push('/vendors')}>
                      나가기
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 