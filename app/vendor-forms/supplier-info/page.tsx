'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { LNB } from '@/components/layout/lnb'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ISupplierInfo } from '@/types'

const supplierFormSchema = z.object({
  businessNumber: z.string().min(1, '사업자번호를 입력해주세요.'),
  companyName: z.string().min(1, '상호(법인명)를 입력해주세요.').max(100, '상호(법인명)는 100자를 초과할 수 없습니다.'),
  ceo: z.string().min(1, '대표자를 입력해주세요.').max(100, '대표자는 100자를 초과할 수 없습니다.'),
  address: z.string().min(1, '사업장 주소를 입력해주세요.').max(200, '사업장 주소는 200자를 초과할 수 없습니다.'),
  businessType: z.string().min(1, '업태를 입력해주세요.'),
  item: z.string().min(1, '종목을 입력해주세요.'),
})

export default function SupplierInfoPage() {
  const [sealImage, setSealImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ISupplierInfo>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      businessNumber: '',
      companyName: '',
      ceo: '',
      address: '',
      businessType: '',
      item: '',
    },
  })

  const onSubmit = async (data: ISupplierInfo) => {
    if (isSubmitting) return

    const confirmed = window.confirm('작성한 내용으로 저장하시겠습니까?')
    if (!confirmed) return

    setIsSubmitting(true)
    
    try {
      // TODO: API 구현 후 연동
      console.log('Form data:', data)
      console.log('Seal image:', sealImage)
      
      toast.success('공급자 정보가 저장되었습니다.')
    } catch (error) {
      toast.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <LNB />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">공급자 정보 관리</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사업자번호</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상호(법인명)</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={100} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ceo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대표자</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={100} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사업장 주소</FormLabel>
                      <FormControl>
                        <Textarea {...field} maxLength={200} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>업태</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="item"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>종목</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>인감 정보</FormLabel>
                  <ImageUploader
                    defaultImage={form.getValues('sealImageUrl')}
                    onImageChange={setSealImage}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-32"
                >
                  {isSubmitting ? '저장 중...' : '저장'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
} 