import { IVendor } from '@/types'

export const mockVendors: IVendor[] = [
  {
    id: 1,
    name: '코웨이',
    code: '1234567890',
    ceo: '홍길동',
    businessType: '서비스업',
    item: '렌탈',
    invoiceStatus: '사용',
    modifier: 'admin01',
    modifiedAt: '2024.03.11 14:20',
    address: '서울시 강남구 테헤란로 123'
  },
  {
    id: 2,
    name: '삼성전자',
    code: '2234567890',
    ceo: '김철수',
    businessType: '제조업',
    item: '전자제품',
    invoiceStatus: '사용',
    modifier: 'admin02',
    modifiedAt: '2024.03.12 15:30',
    address: '경기도 수원시 영통구 삼성로 129'
  },
  {
    id: 3,
    name: 'LG전자',
    code: '3234567890',
    ceo: '박영희',
    businessType: '제조업',
    item: '가전제품',
    invoiceStatus: '미사용',
    modifier: 'admin01',
    modifiedAt: '2024.03.13 16:40',
    address: '서울시 영등포구 여의대로 128'
  }
] 