import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, not } from 'drizzle-orm';
import { db } from '@/db';
import { vendors, vendorContacts } from '@/db/schema';
import { createContactsQuery, getPaginationValues } from '@/utils/db';
import { IContactCreateBody, IContactUpdateBody } from '@/types';

// GET: 담당자 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      status: searchParams.get('status') as 'all' | 'used' | 'unused' | undefined,
      searchField: searchParams.get('searchField') as 'name' | 'code' | 'branch' | 'email' | undefined,
      searchValue: searchParams.get('searchValue') || undefined,
      page: Number(searchParams.get('page')) || undefined,
      limit: Number(searchParams.get('limit')) || undefined,
    };

    // 쿼리 조건 및 페이지네이션 설정
    const whereClause = createContactsQuery(params);
    const { limit, offset, page } = getPaginationValues(params.page, params.limit);

    // 전체 데이터 수 조회
    const totalCount = await db
      .select({ count: vendorContacts.id })
      .from(vendorContacts)
      .leftJoin(vendors, eq(vendorContacts.vendorId, vendors.id))
      .where(whereClause || undefined)
      .execute();

    // 데이터 조회
    const contacts = await db
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
      .where(whereClause || undefined)
      .orderBy(desc(vendorContacts.createdAt))
      .limit(limit)
      .offset(offset)
      .execute();

    return NextResponse.json({
      data: contacts,
      total: totalCount[0]?.count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: '담당자 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 담당자 등록
export async function POST(request: NextRequest) {
  try {
    const body: IContactCreateBody = await request.json();

    // 필수 필드 검증
    if (!body.vendorId || !body.email || !body.createdBy) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 체크
    const existingContact = await db
      .select()
      .from(vendorContacts)
      .where(eq(vendorContacts.email, body.email))
      .execute();

    if (existingContact.length > 0) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    // 담당자 등록
    const [newContact] = await db
      .insert(vendorContacts)
      .values({
        vendorId: body.vendorId,
        branch: body.branch || null,
        email: body.email,
        status: body.status || '사용',
        createdBy: body.createdBy,
      })
      .returning()
      .execute();

    return NextResponse.json({
      message: '저장이 완료되었습니다.',
      contactId: newContact.id,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: '담당자 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 담당자 수정
export async function PUT(request: NextRequest) {
  try {
    const body: IContactUpdateBody = await request.json();

    // 필수 필드 검증
    if (!body.id || !body.vendorId || !body.email || !body.updatedBy) {
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
          not(eq(vendorContacts.id, body.id))
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
      .where(eq(vendorContacts.id, body.id))
      .execute();

    return NextResponse.json({
      message: '저장이 완료되었습니다.',
      contactId: body.id,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: '담당자 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 