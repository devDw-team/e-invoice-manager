import { ChangeEvent, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploaderProps {
  defaultImage?: string
  onImageChange: (file: File | null) => void
  className?: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ['image/gif', 'image/jpeg', 'image/png']

export function ImageUploader({ defaultImage, onImageChange, className }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('파일은 10MB 이하의 파일만 등록 가능합니다. 등록 가능 파일 확장자 : gif, jpg, jpeg, png')
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('파일은 10MB 이하의 파일만 등록 가능합니다. 등록 가능 파일 확장자 : gif, jpg, jpeg, png')
      return false
    }

    return true
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (validateFile(file)) {
      onImageChange(file)
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onImageChange(null)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
        <Image
          src={defaultImage || '/images/seal-default.png'}
          alt="인감 이미지"
          fill
          className="object-contain"
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".gif,.jpg,.jpeg,.png"
        className="hidden"
      />
      <Button onClick={handleClick} variant="outline">
        이미지 업로드
      </Button>
    </div>
  )
} 