import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { IVendorBulkStatusUpdate } from '@/types';

export async function PUT(request: NextRequest) {
  try {
    const body: IVendorBulkStatusUpdate = await request.json();

    // 필수 필드 검증
    if (!body.vendorIds?.length || !body.invoiceStatus || !body.modifier) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // 일괄 상태 변경
    const result = await db.update(vendors)
      .set({
        invoiceStatus: body.invoiceStatus,
        modifier: body.modifier,
        modifiedAt: new Date()
      })
      .where(inArray(vendors.id, body.vendorIds))
      .returning()
      .execute();

    return NextResponse.json({
      updatedCount: result.length,
      updatedVendors: result
    });
  } catch (error) {
    console.error('Vendors Bulk Update Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 