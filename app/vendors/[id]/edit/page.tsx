'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { IVendor } from '@/types'
import { toast } from 'sonner'
import { LNB } from '@/components/layout/lnb'
import { vendorApi } from '@/utils/api'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function VendorEditPage({ params }: Props) {
  const router = useRouter()
  const { id } = use(params)
  const isEdit = id !== 'new'
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<IVendor>>({
    invoiceStatus: '사용',
    name: '',
    code: '',
    ceo: '',
    businessType: '',
    item: '',
    address: ''
  })

  // 기존 데이터 조회
  useEffect(() => {
    if (isEdit) {
      fetchVendor()
    }
  }, [isEdit, id])

  const fetchVendor = async () => {
    try {
      setLoading(true)
      const response = await vendorApi.getVendors({
        searchField: 'code',
        searchValue: id,
      })
      if (response.data.length > 0) {
        setFormData(response.data[0])
      } else {
        toast.error('존재하지 않는 사업자입니다.')
        router.push('/vendors')
      }
    } catch (error) {
      toast.error('사업자 정보를 불러오는데 실패했습니다.')
      router.push('/vendors')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof IVendor, value: string) => {
    if (field === 'code' && isEdit) return // 수정 모드에서는 사업자번호 변경 불가
    if (value.length > 100) return // 100자 제한

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.name) {
      toast.error('사업자명을 입력해주세요.')
      return
    }
    if (!formData.code) {
      toast.error('사업자번호를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      if (isEdit) {
        if (!formData.name || !formData.invoiceStatus) {
          toast.error('필수 정보가 누락되었습니다.')
          return
        }
        await vendorApi.updateVendor(Number(id), {
          id: Number(id),
          name: formData.name,
          invoiceStatus: formData.invoiceStatus,
          ceo: formData.ceo ?? '',
          address: formData.address ?? '',
          businessType: formData.businessType ?? '',
          item: formData.item ?? '',
          modifier: 'admin', // TODO: 실제 사용자 ID로 대체
        })
      } else {
        await vendorApi.createVendor({
          ...formData as any, // TODO: 타입 수정 필요
          modifier: 'admin', // TODO: 실제 사용자 ID로 대체
        })
      }
      toast.success('저장되었습니다.')
      router.push('/vendors')
    } catch (error: any) {
      if (error.message === 'Business code already exists') {
        toast.error('이미 등록된 사업자번호입니다.')
      } else {
        toast.error('저장에 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{isEdit ? '사업자 수정' : '사업자 등록'}</h1>
          </div>

          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
            {/* 청구서 생성 여부 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">청구서 생성 여부</label>
              <Select
                value={formData.invoiceStatus ?? '사용'}
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
                value={formData.name ?? ''}
                onChange={(e) => handleChange('name', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 사업자번호 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사업자번호 *</label>
              <Input
                value={formData.code ?? ''}
                onChange={(e) => handleChange('code', e.target.value)}
                maxLength={20}
                disabled={isEdit}
              />
            </div>

            {/* 대표자 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">대표자</label>
              <Input
                value={formData.ceo ?? ''}
                onChange={(e) => handleChange('ceo', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 사업장 주소 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">사업장 주소</label>
              <Textarea
                value={formData.address ?? ''}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            {/* 업태 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">업태</label>
              <Input
                value={formData.businessType ?? ''}
                onChange={(e) => handleChange('businessType', e.target.value)}
                maxLength={100}
              />
            </div>

            {/* 종목 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">종목</label>
              <Input
                value={formData.item ?? ''}
                onChange={(e) => handleChange('item', e.target.value)}
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