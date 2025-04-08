import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { desc, eq, ilike, and, or } from 'drizzle-orm';
import { IVendorCreate, IPaginationQuery } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query: IPaginationQuery = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 50,
      searchField: (searchParams.get('searchField') as IPaginationQuery['searchField']) || 'name',
      searchValue: searchParams.get('searchValue') || '',
      invoiceStatus: (searchParams.get('invoiceStatus') as IPaginationQuery['invoiceStatus']) || 'all'
    };

    let conditions = [];
    
    // 검색 조건 추가
    if (query.searchValue) {
      if (query.searchField === 'name') {
        conditions.push(ilike(vendors.name, `%${query.searchValue}%`));
      } else if (query.searchField === 'code') {
        conditions.push(ilike(vendors.code, `%${query.searchValue}%`));
      } else if (query.searchField === 'ceo') {
        conditions.push(ilike(vendors.ceo, `%${query.searchValue}%`));
      }
    }

    // 청구서 생성 여부 필터
    if (query.invoiceStatus && query.invoiceStatus !== 'all') {
      conditions.push(eq(vendors.invoiceStatus, query.invoiceStatus));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 전체 개수 조회
    const total = await db.select({ count: vendors.id }).from(vendors)
      .where(whereClause)
      .execute();

    // 페이지네이션 적용하여 데이터 조회
    const data = await db.select().from(vendors)
      .where(whereClause)
      .orderBy(desc(vendors.id))
      .limit(query.limit || 50)
      .offset(((query.page || 1) - 1) * (query.limit || 50))
      .execute();

    return NextResponse.json({
      data,
      total: total[0]?.count || 0,
      page: query.page || 1,
      limit: query.limit || 50
    });
  } catch (error) {
    console.error('Vendors GET Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: IVendorCreate = await request.json();

    // 필수 필드 검증
    if (!body.name || !body.code || !body.modifier) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // 사업자번호 중복 체크
    const existing = await db.select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.code, body.code))
      .execute();

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Business code already exists' },
        { status: 409 }
      );
    }

    // 신규 사업자 등록
    const result = await db.insert(vendors)
      .values({
        name: body.name,
        code: body.code,
        ceo: body.ceo,
        address: body.address,
        businessType: body.businessType,
        item: body.item,
        invoiceStatus: body.invoiceStatus,
        modifier: body.modifier
      })
      .returning()
      .execute();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Vendors POST Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 