import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IVendor, ISearchParams } from '@/types'

interface VendorSearchDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (vendor: IVendor) => void
}

export default function VendorSearchDialog({
  open,
  onClose,
  onSelect,
}: VendorSearchDialogProps) {
  const [searchParams, setSearchParams] = useState<ISearchParams>({
    searchField: 'name',
    searchValue: '',
    page: 1,
    limit: 10,
  })
  const [vendors, setVendors] = useState<IVendor[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        searchField: searchParams.searchField,
        searchValue: searchParams.searchValue,
        page: searchParams.page.toString(),
        limit: searchParams.limit.toString(),
      })

      const response = await fetch(`/api/vendors/search?${params}`)
      const data = await response.json()

      setVendors(data.data)
      setTotal(data.total)
    } catch (error) {
      console.error('사업자 검색 중 오류 발생:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectVendor = (vendor: IVendor) => {
    onSelect(vendor)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>사업자 찾기</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Select
            value={searchParams.searchField}
            onValueChange={(value: 'name' | 'code') =>
              setSearchParams({ ...searchParams, searchField: value })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="검색 조건" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">사업자명</SelectItem>
              <SelectItem value="code">사업자번호</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="검색어를 입력하세요"
            value={searchParams.searchValue}
            onChange={(e) =>
              setSearchParams({ ...searchParams, searchValue: e.target.value })
            }
            className="flex-1"
          />

          <Button onClick={handleSearch} disabled={loading}>
            검색
          </Button>
        </div>

        <div className="border rounded-md">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">사업자번호</th>
                <th className="px-4 py-2 text-left">사업자명</th>
                <th className="px-4 py-2 text-left">대표자명</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectVendor(vendor)}
                >
                  <td className="px-4 py-2">{vendor.vendorCode}</td>
                  <td className="px-4 py-2">{vendor.vendorName}</td>
                  <td className="px-4 py-2">{vendor.representativeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="text-sm text-gray-500 mt-2">
            총 {total}개의 검색결과
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 