# 🧾 최종 통합 기능명세서 – 청구서 양식 등록/수정

* **등록 페이지**: `app/invoice-template/new/page.tsx`
    
* **수정 페이지**: `app/invoice-template/[id]/edit/page.tsx`
    
* **공통 기술 스택**:
    
    * **Next.js App Router**
        
    * **TailwindCSS**
        
    * **ShadCN UI** (모든 컴포넌트 최우선 사용)
        
    * **Next.js Route Handlers**
        
    * **Drizzle ORM (PostgreSQL)**
        

* * *

## ✅ 기능별 명세

* * *

### 1. **사업자 정보 입력 + 사업자 찾기 팝업**

#### 📍 프론트엔드

* **컴포넌트**:
    
    * 메인: `BusinessInfoSection.tsx`
        
    * 팝업: `components/BusinessSearchModal.tsx`
        
* **UI 요소**:
    
    * ShadCN `Input`: 사업자명, 사업자번호, 대표자명, 업태/업종
        
    * ShadCN `Button`: 사업자 찾기
        
    * `Modal` 형태 팝업:
        
        * 검색 조건: ShadCN `Select`
            
        * 키워드 입력: ShadCN `Input`
            
        * 검색: ShadCN `Button`
            
        * 결과: 테이블 + `선택` 버튼
            
        * 페이지네이션 포함
            

#### 📍 백엔드

* **사업자 번호 조회**:
    
    * `GET /api/business-info?regnum=...`
        
* **사업자 목록 검색**:
    
    * `GET /api/business-info/search?type=name&keyword=...`
        
* **응답 구조**:
    
    ```ts
    {
      name: string;
      regnum: string;
      ceo: string;
      type: string;
      items: string;
      address: string;
    }
    ```
    

* * *

### 2. **공급자 정보 입력 (체크박스 기반)**

#### 📍 프론트엔드

* **컴포넌트**: `SupplierInfoSection.tsx`
    
* **UI 요소**:
    
    * ShadCN `Checkbox`:
        
        * 인감 정보 (`includeSealInfo`)
            
        * 고객센터 안내 정보 (`includeContactInfo`)
            
    * ShadCN `Textarea`: 고객센터 안내 문구 (체크 시만 표시)
        
    * 글자 수 제한: 1000자
        

#### 📍 백엔드

* **API 필드**:
    
    ```ts
    include_seal_info: boolean;
    include_contact_info: boolean;
    contact_info: text;
    ```
    

* * *

### 3. **결제/납입 정보 입력**

#### 📍 프론트엔드

* **컴포넌트**: `PaymentSection.tsx`
    
* **UI 요소**:
    
    * ShadCN `Select`: 결제방식, 납입방법
        
    * ShadCN `Textarea`: 설명 입력 (1000자 제한)
        

#### 📍 백엔드

* **API 필드**:
    
    ```ts
    payment_method: varchar(50);
    deposit_method: varchar(50);
    payment_note: text;
    ```
    

* * *

### 4. **결제/선납금 정보 안내 (체크박스 + 설명)**

#### 📍 프론트엔드

* **컴포넌트**: `PaymentGuideSection.tsx`
    
* **UI 요소**:
    
    * ShadCN `Checkbox`:
        
        * 결제정보, 결제안내 정보, 선납금 정보
            
    * ShadCN `Textarea`: 선택 시만 입력 가능 (최대 300자)
        

#### 📍 백엔드

* **API 필드**:
    
    ```ts
    include_payment_info: boolean;
    include_payment_guide: boolean;
    include_prepaid_info: boolean;
    payment_guide: varchar(300);
    ```
    

* * *

### 5. **청구대금 상세 항목 설정 (카테고리 + 개별 항목)**

#### 📍 프론트엔드

* **컴포넌트**: `BillingDetailsSection.tsx`
    
* **UI 구성**: 테이블 형태, 3개 카테고리 그룹화
    
    * **계약정보**:
        
        * 주문번호, 품목(제품금), 제품명(모델명), 계약일(설치일), 의무사용기간, 약정기간, 공급가액, 부가세, 당월 렌탈료
            
    * **제품 관리**:
        
        * 멤버십, A/S 대금, 소모품 교체비, 연체이자, 위약금
            
    * **기타**:
        
        * 설치지 주소, 바코드 번호, 관리지국명, 관리지국 연락처, 비고
            
* **ShadCN `Checkbox`** 사용
    
* **선택 항목만 저장됨**
    

#### 📍 백엔드

* **API 필드**:
    
    ```ts
    billing_fields: text[]; // 항목 키 배열
    ```
    
* **항목 예시**:
    
    ```ts
    [
      "orderNumber", "productName", "contractDate", "membership", "lateFee", "installationAddress"
    ]
    ```
    

* * *

### 6. **저장 및 수정**

#### 📍 프론트엔드

* **저장 버튼**: `저장` 클릭 시 전체 Form 데이터 API 전송
    
* **이동 버튼**: `목록` 클릭 시 `router.push('/invoice-template')`
    

#### 📍 백엔드

* **등록**: `POST /api/invoice-template`
    
* **수정**: `PATCH /api/invoice-template/:id`
    
* **파일 경로**:
    
    * 등록: `app/api/invoice-template/route.ts`
        
    * 수정: `app/api/invoice-template/[id]/route.ts`
        

* * *

## ✅ 전체 저장 필드 요약 (DB 컬럼 기준)

```ts
// 사업자 정보
name: string;
regnum: string;
ceo: string;
type: string;
items: string;

// 공급자 정보
include_seal_info: boolean;
include_contact_info: boolean;
contact_info: text;

// 결제/납입 정보
payment_method: string;
deposit_method: string;
payment_note: text;

// 결제/선납금 안내
include_payment_info: boolean;
include_payment_guide: boolean;
include_prepaid_info: boolean;
payment_guide: varchar(300);

// 청구대금 상세 항목
billing_fields: text[];

// 시스템 필드
created_at: timestamp;
updated_at: timestamp;
```

* * *

## ✅ 테스트 체크리스트

| 항목 | 확인 |
| --- | --- |
| 사업자 찾기 팝업 → 정보 자동입력 | ✅ |
| 체크박스 기반 조건부 UI 노출 | ✅ |
| 각 입력 필드에 기본값 자동 입력 여부 | ✅ |
| 입력 글자 수 제한 적용 여부 (1000자/300자 등) | ✅ |
| 선택 항목만 저장 및 수정 반영 | ✅ |
| 저장 후 목록으로 정상 이동 | ✅ |

* * *

## ✅ 후속 가능 작업 (선택)

* 🧩 컴포넌트 구조도 및 공통/전용 분리 제안
    
* ✅ QA 테스트 시나리오 표
    
* 📊 ERD 설계 및 연동된 스키마
    
* 🧾 PDF 출력 포맷 명세