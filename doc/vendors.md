# 📄 **[1] 사업자 관리 – 통합 기능명세서**

* * *

## ✅ A. 기능 요약

| 기능 구분 | 설명 |
| --- | --- |
| 목록 조회 | DB 기반 사업자 리스트 조회 및 필터 검색 |
| 신규 등록 | 신규 사업자 정보 입력 후 저장 |
| 정보 수정 | 기존 사업자 정보 편집 및 반영 |
| 일괄 처리 | 청구서 생성 여부 일괄 변경 기능 포함 |

* * *

## ✅ B. 프론트엔드 기능명세서

### 1. 📃 목록 조회 화면 (`app/vendors/page.tsx`)

#### 🔍 검색 조건

| 항목 | 유형 | 기본값 |
| --- | --- | --- |
| 청구서 생성 여부 | 셀렉박스 (`전체`, `사용`, `미사용`) | 전체 |
| 검색 기준 | 셀렉박스 (`사업자명`, `사업자번호`, `대표자`) | 사업자명 |
| 검색어 입력 | 텍스트 | - |

#### 🔘 버튼

| 버튼 | 설명 |
| --- | --- |
| 등록 | 신규 등록 페이지(`/vendors/new`)로 이동 |

#### 🧾 출력 리스트 필드

| 필드 | 설명 |
| --- | --- |
| 체크박스 | 전체 선택 / 개별 선택 |
| No | ID 역순 |
| 사업자명 | 클릭 시 수정 페이지(`/vendors/[id]/edit`) 이동 |
| 사업자번호 | 클릭 시 수정 페이지(`/vendors/[id]/edit`) 이동 |
| 대표자 | 대표자명 |
| 업태 / 종목 | 10자 초과 시 말줄임(...) 처리 |
| 청구서 생성 여부 | 사용/미사용 |
| 수정자 | 관리자 ID |
| 수정일 | `YYYY.MM.DD HH:MM`, 미수정 시 SAP 호출일 표시 |

#### 📦 페이징 및 개수 설정

* 기본 50건 노출
* 10/50/100개 선택 가능

#### ⚙️ 일괄 처리 기능

* 체크된 사업자에 대해 **청구서 생성 여부 일괄 변경 가능**
* 드롭다운(`사용`, `미사용`) + 적용 버튼
* 성공 시 토스트 메시지 출력

* * *

### 2. ✏️ 신규 등록 / 수정 화면 (`app/vendors/[id]/edit.tsx` or `/new.tsx`)

#### 📌 입력 필드

| 필드명 | 입력 UI | 제약조건 |
| --- | --- | --- |
| 청구서 생성 여부 | `Select` | `사용`, `미사용` |
| 사업자명 | `Input` | 국/영문 100자 제한, 필수 |
| 사업자번호 | `Input` | 필수, 수정 불가 (수정 모드 시) |
| 대표자 | `Input` | 100자 제한 |
| 사업장 주소 | `Textarea` | 줄바꿈 지원, 100자 제한 |
| 업태 | `Input` | 100자 제한 |
| 종목 | `Input` | 100자 제한 |

#### 🧠 유효성 검증

* 필수 항목: **사업자명, 사업자번호**
* 100자 초과 입력 불가

#### 📂 버튼 액션

| 버튼 | 설명 |
| --- | --- |
| 목록 | AlertDialog 노출: "작성 내용 반영되지 않음" → [취소] or [나가기] |
| 저장 | |

* 필수 미입력 시 Alert: "사업자명을 입력해주세요"
* 유효 시 컨펌: "작성한 내용으로 저장하시겠습니까?" → 저장 후 토스트 + 목록 이동

* * *

## ✅ C. 백엔드 기능명세서

### 1. 📡 사업자 목록 조회 API

| 항목 | 설명 |
| --- | --- |
| **경로** | `/api/vendors` |
| **Method** | `GET` |
| **Query Params** | |

* `invoiceStatus`: `all` / `사용` / `미사용` (schema의 invoiceStatusEnum 타입 반영)
* `searchField`: `name`, `code`, `ceo`
* `searchValue`: string
* `page`: number (default: 1)
* `limit`: number (default: 50)

#### ✅ 응답 예시

```json
{
  "data": [
    {
      "id": 123,
      "name": "코웨이",
      "code": "1234567890",
      "ceo": "홍길동",
      "address": "서울시 중구 을지로 123",
      "businessType": "서비스업",
      "item": "렌탈",
      "invoiceStatus": "사용",
      "modifier": "admin01",
      "modifiedAt": "2024.03.11 14:20",
      "createdAt": "2024.03.10 09:30"
    }
  ],
  "total": 112,
  "page": 1,
  "limit": 50
}
```

* * *

### 2. 📡 신규 등록 API

| 항목 | 설명 |
| --- | --- |
| **경로** | `/api/vendors` |
| **Method** | `POST` |
| **Request Body** | |

```typescript
{
  name: string;        // 필수, 100자 제한
  code: string;        // 필수, 20자 제한, unique
  ceo?: string;        // 선택, 100자 제한
  address?: string;    // 선택
  businessType?: string; // 선택, 100자 제한
  item?: string;       // 선택, 100자 제한
  invoiceStatus: "사용" | "미사용"; // 필수, 기본값 "사용"
  modifier: string;    // 필수, 50자 제한
}
```

* * *

### 3. 📡 수정 API

| 항목 | 설명 |
| --- | --- |
| **경로** | `/api/vendors/{id}` |
| **Method** | `PUT` |
| **Request Body** | |

```typescript
{
  id: number;         // 필수, path parameter로 전달
  name: string;       // 필수, 100자 제한
  ceo?: string;       // 선택, 100자 제한
  address?: string;   // 선택
  businessType?: string; // 선택, 100자 제한
  item?: string;      // 선택, 100자 제한
  invoiceStatus: "사용" | "미사용"; // 필수
  modifier: string;   // 필수, 50자 제한
}
```

* * *

### 4. 📡 청구서 생성 여부 일괄 변경 API

| 항목 | 설명 |
| --- | --- |
| **경로** | `/api/vendors/invoice-status` |
| **Method** | `PUT` |
| **Request Body** | |

```typescript
{
  vendorIds: number[];  // 변경할 사업자 ID 배열
  invoiceStatus: "사용" | "미사용";  // schema의 invoiceStatusEnum 타입 반영
  modifier: string;     // 수정자 ID (50자 제한)
}
```

* * *

## 🗃 DB 테이블 구조 (`vendors`)

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | serial | PK, auto increment |
| `name` | varchar(100) | 사업자명 (NOT NULL) |
| `code` | varchar(20) | 사업자번호 (NOT NULL, UNIQUE) |
| `ceo` | varchar(100) | 대표자명 |
| `address` | text | 사업장 주소 |
| `business_type` | varchar(100) | 업태 |
| `item` | varchar(100) | 종목 |
| `invoice_status` | enum | `사용` / `미사용` (NOT NULL, DEFAULT '사용') |
| `modifier` | varchar(50) | 수정자 ID (NOT NULL) |
| `modified_at` | timestamp | 최종 수정 시각 (DEFAULT CURRENT_TIMESTAMP) |
| `created_at` | timestamp | 생성 시각 (DEFAULT CURRENT_TIMESTAMP) |

주요 변경사항:
1. 스키마의 정확한 필드 타입과 길이 제한 반영
2. NOT NULL 제약조건 명시
3. 응답/요청 데이터에 누락된 필드 추가 (address, createdAt 등)
4. enum 타입의 정확한 값 반영 ('사용'/'미사용')
5. API 엔드포인트 구조 개선 (PUT 메서드의 경우 리소스 ID를 path parameter로 변경)
6. 각 필드의 제약조건 상세 명시

* * *

## ✅ D. 테스트 체크리스트

| 항목 | 체크 |
| --- | --- |
| [ ] 검색 조건 필터 기능 정상 동작 | |
| [ ] 사업자명 클릭 시 수정 페이지로 이동 | |
| [ ] 100자 제한 초과 시 입력 차단 | |
| [ ] 목록 → AlertDialog 정상 출력 | |
| [ ] 저장 → 유효성 체크 및 API 요청 확인 | |
| [ ] 일괄 변경 → 선택 항목 DB 반영 확인 | | 