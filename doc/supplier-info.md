# 📄 **[1-5] 공급자 정보 관리 – 기능명세서**

* * *

## ✅ A. 기능 요약

| 기능 구분 | 설명 |
| --- | --- |
| 정보 조회 | 기존 공급자 정보 로딩 및 기본값 표시 |
| 정보 입력 | 텍스트 필드 기반 항목 수정 가능 |
| 이미지 업로드 | 인감 이미지 등록/수정, 파일 확장자 및 용량 제한 |
| 유효성 검증 | 필수값 미입력 시 얼럿 메시지 표시 |
| 저장 | 저장 전 컨펌 다이얼로그, 저장 후 토스트 메시지 |

* * *

## ✅ B. 프론트엔드 기능명세서

### 1. 📄 입력 항목 및 UI 구성 (`/vendor-forms/supplier-info`)

| 항목 | UI 요소 | 제약 및 특징 |
| --- | --- | --- |
| 사업자번호 | `Input` | 텍스트 입력, 디폴트값 있음, 수정 가능 |
| 상호(법인명) | `Input` | 필수 입력, 100자 제한 |
| 인감 정보 | `ImageUploader` | 이미지 업로드 컴포넌트 사용 |
| 대표자 | `Input` | 필수 입력, 100자 제한 |
| 사업장 주소 | `Textarea` | 필수 입력, 줄바꿈 지원, 200자 제한 |
| 업태 | `Input` | 필수 입력 |
| 종목 | `Input` | 필수 입력 |

* * *

### 2. 🖼 인감 정보 업로드

* **기본 상태**: 디폴트 이미지 로딩
    
* **업로드 조건**:
    
    * 허용 확장자: `gif`, `jpg`, `jpeg`, `png`
        
    * 최대 용량: `10MB`
        

#### ❌ 업로드 실패 조건 시

| 상황 | 얼럿 메시지 |
| --- | --- |
| 확장자 제한 위반 | `"파일은 10MB 이하의 파일만 등록 가능합니다. 등록 가능 파일 확장자 : gif, jpg, jpeg, png [확인]"` |
| 용량 초과 | 위와 동일 메시지 |

* * *

### 3. 💾 저장 동작

| 조건 | 처리 |
| --- | --- |
| 필수 필드 미입력 | 각각의 항목에 대해 얼럿 메시지 출력 |
| 입력 완료 | 컨펌 다이얼로그 노출 |
| "작성한 내용으로 저장하시겠습니까?" → [취소] / [저장] |  |
| 저장 성공 | `"공급자 정보가 저장되었습니다."` (토스트) |
| 저장 실패 | 서버 오류 또는 네트워크 장애 시 Alert 표시 |

* * *

### 4. ⚠️ 유효성 체크 항목 및 메시지

| 필드 | 메시지 |
| --- | --- |
| 사업자번호 | "사업자번호를 입력해주세요. [확인]" |
| 상호 | "상호(법인명)를 입력해주세요. [확인]" |
| 대표자 | "대표자를 입력해주세요. [확인]" |
| 사업장 주소 | "사업장 주소를 입력해주세요. [확인]" |
| 업태 | "업태를 입력해주세요. [확인]" |
| 종목 | "종목을 입력해주세요. [확인]" |

* * *

## ✅ C. 백엔드 기능명세서

### 1. 📡 공급자 정보 조회 API

| 경로 | `/api/vendor-forms/supplier-info` |
| --- | --- |
| Method | `GET` |
| 설명 | 저장된 공급자 정보를 조회 (1건 고정 리소스) |

#### 📤 Response

```json
{
  "businessNumber": "123-45-67890",
  "companyName": "코웨이(주)",
  "ceo": "홍길동",
  "address": "서울시 구로구...",
  "businessType": "제조업",
  "item": "정수기 제조",
  "sealImageUrl": "/uploads/seal_default.png"
}
```

* * *

### 2. 📡 공급자 정보 저장 API

| 경로 | `/api/vendor-forms/supplier-info` |
| --- | --- |
| Method | `PUT` |
| 설명 | 공급자 기본 정보 + 인감 이미지 업데이트 |

#### 📥 Request (FormData 기반)

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `businessNumber` | string | 사업자번호 |
| `companyName` | string | 상호 |
| `ceo` | string | 대표자명 |
| `address` | string | 사업장 주소 |
| `businessType` | string | 업태 |
| `item` | string | 종목 |
| `sealImage` | file | 인감 이미지 (선택 시만 첨부) |

#### 📤 Response

```json
{
  "message": "저장되었습니다."
}
```

* * *

### 3. 🗃 DB 테이블: `supplier_info` (단일행 테이블)

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | number | PK |
| `business_number` | string | 사업자번호 |
| `company_name` | string | 상호 |
| `ceo` | string | 대표자 |
| `address` | string | 사업장 주소 |
| `business_type` | string | 업태 |
| `item` | string | 종목 |
| `seal_image_path` | string | 업로드된 이미지 파일 경로 |
| `updated_by` | string | 수정자 |
| `updated_at` | datetime | 수정 시점 |

* * *

## ✅ D. 테스트 체크리스트

| 항목 | 체크 |
| --- | --- |
| [ ] 기존 공급자 정보 자동 로딩 여부 |  |
| [ ] 필수값 미입력 시 Alert 노출 여부 |  |
| [ ] 인감 이미지 확장자/용량 제한 체크 |  |
| [ ] 저장 클릭 → Confirm → API 호출 여부 |  |
| [ ] 저장 성공 후 토스트 및 목록 복귀 확인 |  | 