import { integer, pgTable, serial, text, timestamp, varchar, json, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 상태 ENUM 타입 정의
export const invoiceStatusEnum = pgEnum('invoice_status', ['사용', '미사용']);
export const contactStatusEnum = pgEnum('contact_status', ['사용', '미사용']);
export const billingStatusEnum = pgEnum('billing_status', ['미발송', '성공', '실패']);
export const fileTypeEnum = pgEnum('file_type', ['html', 'excel', 'attachment']);

// 사업자(거래처) 테이블
export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(), // 사업자번호
  ceo: varchar('ceo', { length: 100 }), // 대표자
  address: text('address'), // 사업장 주소
  businessType: varchar('business_type', { length: 100 }), // 업태
  item: varchar('item', { length: 100 }), // 종목
  invoiceStatus: invoiceStatusEnum('invoice_status').notNull().default('사용'),
  modifier: varchar('modifier', { length: 50 }).notNull(), // 수정자 ID
  modifiedAt: timestamp('modified_at').default(sql`CURRENT_TIMESTAMP`).$defaultFn(() => new Date()),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 담당자 테이블 (1:1 관계)
export const vendorContacts = pgTable('vendor_contacts', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').notNull().references(() => vendors.id).unique(), // 사업자 FK (unique로 1:1 관계 설정)
  branch: varchar('branch', { length: 30 }), // 지점명
  email: varchar('email', { length: 100 }).notNull(), // 이메일
  status: contactStatusEnum('status').notNull().default('사용'),
  createdBy: varchar('created_by', { length: 50 }).notNull(), // 등록자 ID
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar('updated_by', { length: 50 }), // 수정자 ID
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$defaultFn(() => new Date()),
});

// 청구서 테이블
export const billingInvoices = pgTable('billing_invoices', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').notNull().references(() => vendors.id), // 사업자 FK
  formId: integer('form_id').notNull().references(() => vendorForms.id), // 청구서 양식 FK
  email: varchar('email', { length: 100 }).notNull(), // 발송 이메일
  billingMonth: varchar('billing_month', { length: 7 }).notNull(), // 청구월 (YYYY.MM)
  paymentInfo: text('payment_info'), // 결제 정보
  details: json('details').notNull(), // 청구대금 상세 (JSON)
  formSnapshot: json('form_snapshot').notNull(), // 양식 설정값 스냅샷
  attachments: json('attachments'), // 첨부파일 목록 (JSON)
  status: billingStatusEnum('status').notNull().default('미발송'),
  sentAt: timestamp('sent_at'), // 최근 발송일
  createdBy: varchar('created_by', { length: 50 }).notNull(), // 등록자 ID
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar('updated_by', { length: 50 }), // 수정자 ID
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$defaultFn(() => new Date()),
});

// 청구서 발송 이력 테이블
export const billingLogs = pgTable('billing_logs', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => billingInvoices.id), // 청구서 FK
  sentAt: timestamp('sent_at').notNull().default(sql`CURRENT_TIMESTAMP`), // 발송일
  status: billingStatusEnum('status').notNull(),
  errorMessage: text('error_message'), // 실패 시 에러 메시지
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 공급자 정보 테이블 (단일행 테이블)
export const supplierInfo = pgTable('supplier_info', {
  id: serial('id').primaryKey(),
  businessNumber: varchar('business_number', { length: 20 }).notNull(), // 사업자번호
  companyName: varchar('company_name', { length: 100 }).notNull(), // 상호(법인명)
  ceo: varchar('ceo', { length: 100 }).notNull(), // 대표자
  address: text('address').notNull(), // 사업장 주소
  businessType: varchar('business_type', { length: 100 }).notNull(), // 업태
  item: varchar('item', { length: 100 }).notNull(), // 종목
  sealImagePath: varchar('seal_image_path', { length: 255 }), // 인감 이미지 파일 경로
  updatedBy: varchar('updated_by', { length: 50 }).notNull(), // 수정자
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$defaultFn(() => new Date()),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 청구서 양식 관리 테이블
export const vendorForms = pgTable('vendor_forms', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id').notNull().references(() => vendors.id), // 사업자 FK
  invoiceItems: json('invoice_items').notNull(), // 선택 항목들의 상태를 JSON으로 저장
  callcenterInfo: text('callcenter_info'), // 고객센터 안내 정보
  paymentDescription: text('payment_description'), // 결제 안내 문구 (300자 제한)
  createdBy: varchar('created_by', { length: 50 }).notNull(), // 등록자
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar('updated_by', { length: 50 }), // 수정자
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$defaultFn(() => new Date()),
});

// 청구서 파일 관리 테이블 (N:1 관계)
export const invoiceFiles = pgTable('invoice_files', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => billingInvoices.id), // 청구서 FK
  fileType: fileTypeEnum('file_type').notNull(), // 파일 종류
  fileName: varchar('file_name', { length: 255 }).notNull(), // 실제 파일명
  path: varchar('path', { length: 255 }).notNull(), // 서버상 파일 경로
  size: integer('size').notNull(), // 파일 크기 (bytes)
  mimeType: varchar('mime_type', { length: 100 }), // 파일의 MIME 타입
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$defaultFn(() => new Date()),
});


