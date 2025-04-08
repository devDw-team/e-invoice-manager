import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { IVendorUpdate } from '@/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const body: IVendorUpdate = await request.json();

    // 필수 필드 검증
    if (!body.name || !body.modifier) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // 사업자 존재 여부 확인
    const existing = await db.select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.id, id))
      .execute();

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // 사업자 정보 수정
    const result = await db.update(vendors)
      .set({
        name: body.name,
        ceo: body.ceo,
        address: body.address,
        businessType: body.businessType,
        item: body.item,
        invoiceStatus: body.invoiceStatus,
        modifier: body.modifier,
        modifiedAt: new Date()
      })
      .where(eq(vendors.id, id))
      .returning()
      .execute();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Vendor PUT Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 