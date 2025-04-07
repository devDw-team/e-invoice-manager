'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { IVendor } from '@/types'
import { toast } from 'sonner'
import { useState } from 'react'
import { LNB } from '@/components/layout/lnb'

export default function VendorNewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<IVendor>>({
    invoiceStatus: '사용',
    name: '',
    code: '',
    ceo: '',
    businessType: '',
    businessItem: ''
  })

  const handleChange = (field: keyof IVendor, value: string) => {
    if (value.length > 100) return // 100자 제한

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // 유효성 검사
    if (!formData.name) {
      toast.error('사업자명을 입력해주세요.')
      return
    }
    if (!formData.code) {
      toast.error('사업자번호를 입력해주세요.')
      return
    }

    // 실제로는 API 호출
    toast.success('저장되었습니다.')
    router.push('/vendors')
  }

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">사업자 등록</h1>
          </div>

          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
            {/* 청구서 생성 여부 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">청구서 생성 여부</label>
              <Select
                value={formData.invoiceStatus}
                onValueChange={(value) => handleChange('invoiceStatus', value)}
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
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 사업자번호 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사업자번호 *</label>
              <Input
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 대표자 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">대표자</label>
              <Input
                value={formData.ceo}
                onChange={(e) => handleChange('ceo', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 사업장 주소 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사업장 주소</label>
              <Textarea
                value={formData.businessType}
                onChange={(e) => handleChange('businessType', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 업태 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">업태</label>
              <Input
                value={formData.businessType}
                onChange={(e) => handleChange('businessType', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 종목 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">종목</label>
              <Input
                value={formData.businessItem}
                onChange={(e) => handleChange('businessItem', e.target.value)}
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
              <Button onClick={handleSubmit}>저장</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 