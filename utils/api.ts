import { IVendorCreate, IVendorUpdate, IVendorBulkStatusUpdate, IVendor } from '@/types';
import { IContactSearchParams, IContactCreateBody, IContactUpdateBody, IBulkStatusUpdateBody } from '@/types';

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const API_BASE_URL = '/api';

// 에러 처리 유틸리티
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
  }
  return data;
};

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

  getVendor: async (id: number): Promise<IVendor> => {
    const response = await fetch(`/api/vendors/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch vendor')
    }
    return response.json()
  },
};

// 담당자 API
export const contactsApi = {
  // 목록 조회
  getContacts: async (params?: Partial<IContactSearchParams>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}/vendor-contacts?${searchParams.toString()}`);
    return handleResponse(response);
  },

  // 담당자 등록
  createContact: async (data: IContactCreateBody) => {
    const response = await fetch(`${API_BASE_URL}/vendor-contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 담당자 수정
  updateContact: async (data: IContactUpdateBody) => {
    const response = await fetch(`${API_BASE_URL}/vendor-contacts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // 일괄 상태 변경
  bulkUpdateStatus: async (data: IBulkStatusUpdateBody) => {
    const response = await fetch(`${API_BASE_URL}/vendor-contacts/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// 사업자 검색 API
export const vendorsApi = {
  searchVendors: async (searchField: 'name' | 'code', searchValue: string, page = 1, limit = 10) => {
    const searchParams = new URLSearchParams({
      searchField,
      searchValue,
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await fetch(`/api/vendors?${searchParams.toString()}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search vendors');
    }
    return response.json();
  },
}; 