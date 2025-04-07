import { IVendorContact, IVendorContactsResponse } from '@/types';

const mockContacts: IVendorContact[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  vendorName: `테스트 사업자 ${index + 1}`,
  vendorCode: `1234567${String(index + 1).padStart(3, '0')}`,
  branch: `${['강남', '서초', '송파', '종로', '마포'][index % 5]}지점`,
  email: `vendor${index + 1}@example.com`,
  status: index % 3 === 0 ? '미사용' : '사용',
  createdBy: `admin${(index % 5) + 1}`,
  createdAt: new Date(2024, 2, index + 1).toLocaleString(),
  updatedBy: `admin${(index % 3) + 1}`,
  updatedAt: new Date(2024, 2, index + 1).toLocaleString(),
}));

export const getMockContacts = (params: {
  status?: 'all' | 'used' | 'unused';
  searchField?: 'name' | 'code' | 'branch' | 'email';
  searchValue?: string;
  page?: number;
  limit?: number;
}): IVendorContactsResponse => {
  const {
    status = 'all',
    searchField = 'name',
    searchValue = '',
    page = 1,
    limit = 50,
  } = params;

  let filteredContacts = [...mockContacts];

  // 상태 필터링
  if (status !== 'all') {
    filteredContacts = filteredContacts.filter(
      contact => contact.status === (status === 'used' ? '사용' : '미사용')
    );
  }

  // 검색어 필터링
  if (searchValue) {
    filteredContacts = filteredContacts.filter(contact => {
      switch (searchField) {
        case 'name':
          return contact.vendorName.includes(searchValue);
        case 'code':
          return contact.vendorCode.includes(searchValue);
        case 'branch':
          return contact.branch.includes(searchValue);
        case 'email':
          return contact.email.includes(searchValue);
        default:
          return true;
      }
    });
  }

  const total = filteredContacts.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  return {
    data: paginatedContacts,
    total,
    page,
    limit,
  };
}; 