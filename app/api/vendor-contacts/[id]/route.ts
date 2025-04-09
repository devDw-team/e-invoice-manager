import { NextRequest, NextResponse } from 'next/server';
import { and, eq, not } from 'drizzle-orm';
import { db } from '@/db';
import { vendors, vendorContacts } from '@/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await Promise.resolve(params.id));
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '잘못된 담당자 ID입니다.' },
        { status: 400 }
      );
    }

    const contact = await db
      .select({
        id: vendorContacts.id,
        vendorId: vendorContacts.vendorId,
        vendorName: vendors.name,
        vendorCode: vendors.code,
        branch: vendorContacts.branch,
        email: vendorContacts.email,
        status: vendorContacts.status,
        createdBy: vendorContacts.createdBy,
        createdAt: vendorContacts.createdAt,
        updatedBy: vendorContacts.updatedBy,
        updatedAt: vendorContacts.updatedAt,
      })
      .from(vendorContacts)
      .leftJoin(vendors, eq(vendorContacts.vendorId, vendors.id))
      .where(eq(vendorContacts.id, id))
      .execute();

    if (contact.length === 0) {
      return NextResponse.json(
        { error: '담당자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: '담당자 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await Promise.resolve(params.id));
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '잘못된 담당자 ID입니다.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 필수 필드 검증
    if (!body.vendorId || !body.email || !body.updatedBy) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 체크 (자신 제외)
    const existingContact = await db
      .select()
      .from(vendorContacts)
      .where(
        and(
          eq(vendorContacts.email, body.email),
          not(eq(vendorContacts.id, id))
        )
      )
      .execute();

    if (existingContact.length > 0) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    // 담당자 수정
    await db
      .update(vendorContacts)
      .set({
        vendorId: body.vendorId,
        branch: body.branch || null,
        email: body.email,
        status: body.status,
        updatedBy: body.updatedBy,
        updatedAt: new Date(),
      })
      .where(eq(vendorContacts.id, id))
      .execute();

    return NextResponse.json({
      message: '저장이 완료되었습니다.',
      contactId: id,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: '담당자 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 