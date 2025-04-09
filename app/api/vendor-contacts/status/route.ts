import { NextRequest, NextResponse } from 'next/server';
import { inArray } from 'drizzle-orm';
import { db } from '@/db';
import { vendorContacts } from '@/db/schema';
import { IBulkStatusUpdateBody } from '@/types';

// PUT: 담당자 일괄 상태 변경
export async function PUT(request: NextRequest) {
  try {
    const body: IBulkStatusUpdateBody = await request.json();

    // 필수 필드 검증
    if (!body.contactIds?.length || !body.status) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 상태 일괄 변경
    const result = await db
      .update(vendorContacts)
      .set({
        status: body.status,
        updatedAt: new Date(),
      })
      .where(inArray(vendorContacts.id, body.contactIds))
      .execute();

    return NextResponse.json({
      message: `${body.contactIds.length}건의 상태가 변경되었습니다.`,
      updatedCount: body.contactIds.length,
    });
  } catch (error) {
    console.error('Error updating contacts status:', error);
    return NextResponse.json(
      { error: '담당자 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 