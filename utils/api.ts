import { IVendorCreate, IVendorUpdate, IVendorBulkStatusUpdate } from '@/types';

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// 벤더 API 함수들
export const vendorApi = {
  // 목록 조회
  getVendors: async (params: {
    page?: number;
    limit?: number;
    searchField?: 'name' | 'code' | 'ceo';
    searchValue?: string;
    invoiceStatus?: '사용' | '미사용' | 'all';
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    const response = await fetch(`/api/vendors?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch vendors');
    return response.json();
  },

  // 신규 등록
  createVendor: async (data: IVendorCreate) => {
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create vendor');
    }
    return response.json();
  },

  // 수정
  updateVendor: async (id: number, data: IVendorUpdate) => {
    const response = await fetch(`/api/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update vendor');
    }
    return response.json();
  },

  // 일괄 상태 변경
  bulkUpdateStatus: async (data: IVendorBulkStatusUpdate) => {
    const response = await fetch('/api/vendors/invoice-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to bulk update status');
    }
    return response.json();
  },
}; 