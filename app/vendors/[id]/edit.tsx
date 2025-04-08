'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { vendorApi } from '@/utils/api';
import { IVendor, IVendorUpdate } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  params: { id: string };
}

export default function VendorEditPage({ params }: Props) {
  const router = useRouter();
  const isNew = params.id === 'new';
  
  const [vendor, setVendor] = useState<Partial<IVendor>>({
    invoiceStatus: '사용',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // 기존 데이터 조회
  useEffect(() => {
    if (!isNew) {
      fetchVendor();
    }
  }, [params.id]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const response = await vendorApi.getVendors({
        searchField: 'code',
        searchValue: params.id,
      });
      if (response.data.length > 0) {
        setVendor(response.data[0]);
      }
    } catch (error) {
      toast.error("사업자 정보를 불러오는데 실패했습니다.");
      router.push('/vendors');
    } finally {
      setLoading(false);
    }
  };

  // 입력값 변경 처리
  const handleChange = (field: keyof IVendor, value: string) => {
    setVendor(prev => ({ ...prev, [field]: value }));
  };

  // 유효성 검증
  const validate = () => {
    if (!vendor.name) {
      toast.warning("사업자명을 입력해주세요.");
      return false;
    }
    if (isNew && !vendor.code) {
      toast.warning("사업자번호를 입력해주세요.");
      return false;
    }
    return true;
  };

  // 저장 처리
  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      if (isNew) {
        await vendorApi.createVendor({
          ...vendor as IVendorUpdate,
          modifier: 'admin', // TODO: 실제 사용자 ID로 대체
        });
      } else {
        await vendorApi.updateVendor(Number(params.id), {
          ...vendor as IVendorUpdate,
          modifier: 'admin', // TODO: 실제 사용자 ID로 대체
        });
      }

      toast.success("저장되었습니다.");
      router.push('/vendors');
    } catch (error) {
      toast.error("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? '사업자 등록' : '사업자 정보 수정'}
      </h1>

      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">
            청구서 생성 여부
          </label>
          <Select
            value={vendor.invoiceStatus}
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

        <div>
          <label className="block text-sm font-medium mb-1">
            사업자명 *
          </label>
          <Input
            value={vendor.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            사업자번호 *
          </label>
          <Input
            value={vendor.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            maxLength={20}
            disabled={!isNew}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            대표자
          </label>
          <Input
            value={vendor.ceo || ''}
            onChange={(e) => handleChange('ceo', e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            사업장 주소
          </label>
          <Textarea
            value={vendor.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            업태
          </label>
          <Input
            value={vendor.businessType || ''}
            onChange={(e) => handleChange('businessType', e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            종목
          </label>
          <Input
            value={vendor.item || ''}
            onChange={(e) => handleChange('item', e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAlert(true)}
          >
            목록
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            저장
          </Button>
        </div>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림</AlertDialogTitle>
            <AlertDialogDescription>
              작성 내용이 반영되지 않습니다. 목록으로 이동하시겠습니까?
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
    </div>
  );
} 