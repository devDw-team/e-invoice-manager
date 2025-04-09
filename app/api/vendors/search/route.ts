import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { createVendorsQuery, getPaginationValues } from '@/utils/db';

// GET: 사업자 검색
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      searchField: searchParams.get('searchField') as 'name' | 'code',
      searchValue: searchParams.get('searchValue') || '',
      page: Number(searchParams.get('page')) || undefined,
      limit: Number(searchParams.get('limit')) || 10, // 기본값 10개
    };

    // 필수 검색 조건 체크
    if (!params.searchField || !params.searchValue) {
      return NextResponse.json(
        { error: '검색 조건이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 쿼리 조건 및 페이지네이션 설정
    const whereClause = createVendorsQuery(params);
    const { limit, offset, page } = getPaginationValues(params.page, params.limit);

    // 전체 데이터 수 조회
    const totalCount = await db
      .select({ count: vendors.id })
      .from(vendors)
      .where(whereClause || undefined)
      .execute();

    // 데이터 조회
    const vendorList = await db
      .select({
        id: vendors.id,
        code: vendors.code,
        name: vendors.name,
        ceo: vendors.ceo,
        invoiceStatus: vendors.invoiceStatus,
      })
      .from(vendors)
      .where(whereClause || undefined)
      .limit(limit)
      .offset(offset)
      .execute();

    return NextResponse.json({
      data: vendorList,
      total: totalCount[0]?.count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error searching vendors:', error);
    return NextResponse.json(
      { error: '사업자 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 