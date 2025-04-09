import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/db';
import { vendors, vendorContacts } from '@/db/schema';
import { IContactSearchParams, IVendorSearchParams } from '@/types';

// 담당자 목록 조회 쿼리 생성 함수
export const createContactsQuery = (params: IContactSearchParams) => {
  const conditions = [];
  
  // 사용여부 필터
  if (params.status && params.status !== 'all') {
    conditions.push(eq(vendorContacts.status, params.status === 'used' ? '사용' : '미사용'));
  }

  // 검색 조건 필터
  if (params.searchField && params.searchValue) {
    switch (params.searchField) {
      case 'name':
        conditions.push(ilike(vendors.name, `%${params.searchValue}%`));
        break;
      case 'code':
        conditions.push(ilike(vendors.code, `%${params.searchValue}%`));
        break;
      case 'branch':
        conditions.push(ilike(vendorContacts.branch, `%${params.searchValue}%`));
        break;
      case 'email':
        conditions.push(ilike(vendorContacts.email, `%${params.searchValue}%`));
        break;
    }
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
};

// 사업자 검색 쿼리 생성 함수
export const createVendorsQuery = (params: IVendorSearchParams) => {
  const conditions = [];

  if (params.searchField && params.searchValue) {
    switch (params.searchField) {
      case 'name':
        conditions.push(ilike(vendors.name, `%${params.searchValue}%`));
        break;
      case 'code':
        conditions.push(ilike(vendors.code, `%${params.searchValue}%`));
        break;
    }
  }

  // 사용 중인 사업자만 검색
  conditions.push(eq(vendors.invoiceStatus, '사용'));

  return conditions.length > 0 ? and(...conditions) : undefined;
};

// 페이지네이션 처리 함수
export const getPaginationValues = (page?: number, limit?: number) => {
  const currentPage = page && page > 0 ? page : 1;
  const itemsPerPage = limit && limit > 0 ? limit : 50;
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    limit: itemsPerPage,
    offset,
    page: currentPage,
  };
}; 