import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { contactsApi, vendorsApi } from '@/utils/api';
import { IVendor } from '@/types';

interface IFormData {
  vendorId: number;
  branch: string;
  email: string;
  status: '사용' | '미사용';
}

interface IVendorSearchParams {
  searchField: 'name' | 'code';
  searchValue: string;
}

export default function ContactCreatePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<IFormData>({
    vendorId: 0,
    branch: '',
    email: '',
    status: '사용',
  });

  const [vendorSearchParams, setVendorSearchParams] = useState<IVendorSearchParams>({
    searchField: 'code',
    searchValue: '',
  });

  const [searchResults, setSearchResults] = useState<IVendor[]>([]);

  // 사업자 검색
  const handleVendorSearch = async () => {
    try {
      const response = await vendorsApi.searchVendors(
        vendorSearchParams.searchField,
        vendorSearchParams.searchValue
      );
      setSearchResults(response.data);
    } catch (error) {
      toast.error('사업자 검색 중 오류가 발생했습니다.');
    }
  };

  // 저장
  const handleSubmit = async () => {
    try {
      // 유효성 검사
      if (!formData.vendorId) {
        toast.error('사업자를 선택해주세요.');
        return;
      }

      if (!formData.email) {
        toast.error('이메일을 입력해주세요.');
        return;
      }

      // API 호출
      await contactsApi.createContact({
        vendorId: formData.vendorId,
        branch: formData.branch,
        email: formData.email,
        status: formData.status,
        createdBy: 'admin', // TODO: 실제 로그인 사용자 ID로 대체
      });

      toast.success('저장이 완료되었습니다.');

      router.push('/vendors/contacts');
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };
} 