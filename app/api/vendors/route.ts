import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { eq, like } from 'drizzle-orm';
import { IVendorCreate, IPaginationQuery } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchField = searchParams.get('searchField') as 'name' | 'code';
    const searchValue = searchParams.get('searchValue') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const query = db
      .select()
      .from(vendors)
      .$dynamic();

    if (searchValue) {
      if (searchField === 'name') {
        query.where(like(vendors.name, `%${searchValue}%`));
      } else if (searchField === 'code') {
        query.where(like(vendors.code, `%${searchValue}%`));
      }
    }

    const results = await query
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching vendors:', error);
    return NextResponse.json(
      { error: 'Failed to search vendors' },
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