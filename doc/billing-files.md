# 📄 **[2-2] 청구서 파일 관리 – 기능명세서**

* * *

## ✅ A. 기능 개요

| 구분 | 설명 |
| --- | --- |
| 기능 목적 | 발송 완료된 청구서의 HTML/Excel/첨부파일 목록 조회 및 다운로드 제공 |
| 대상 데이터 | `발송 완료 상태`인 청구서 데이터 |
| 주요 기능 | 날짜 및 텍스트 기반 필터링, 파일 종류별 다운로드 지원 |

* * *

## ✅ B. 프론트엔드 기능명세서

### 1. 📃 목록 페이지

#### ✅ 경로

* `/billing/files`

* * *

### 2. 🔍 검색 기능

| 항목 | 설명 |
| --- | --- |
| 검색 기준 선택 | 드롭다운: `발송일`(기본), `청구월` |
| 날짜 선택 방식 | • `발송일`: 연/월/일 (기간 선택)<br>• `청구월`: 연/월 (단일값 선택)<br>• → ShadCN `Calendar` 컴포넌트 사용 |
| 텍스트 검색 | • 셀렉박스: `사업자명`, `사업자번호`, `대표자`, `지점명`<br>• 검색어 입력 필드 |

* * *

### 3. 📄 결과 테이블 필드

| 필드 | 설명 |
| --- | --- |
| No | 최신 생성 순으로 내림차순 정렬 |
| 사업자명 | 텍스트 |
| 사업자번호 | 텍스트 |
| 대표자 | 텍스트 |
| 청구월 | 연/월 포맷 |
| 파일 아이콘 | • HTML 파일 존재 시 HTML 아이콘<br>• Excel 파일 존재 시 Excel 아이콘<br>• 추가 첨부파일 존재 시 `기타(etc)` 아이콘<br>• 각 아이콘 클릭 시 해당 파일 다운로드<br><br>→ **ShadCN** `Table`, `Button`, `Tooltip`, `Icon` 사용 |

* * *

### 4. 📦 페이징 및 개수 설정

| 항목 | 설명 |
| --- | --- |
| 페이지 당 노출 수 | 기본 50건 |
| 옵션 | 10건 / 50건 / 100건 선택 가능 |
| 총 검색 결과 수 | `"총 35건"` 형식으로 표시 |

→ ShadCN `Pagination` 컴포넌트 사용

* * *

### 5. 📁 파일 다운로드

* **각 파일 아이콘** 클릭 시 해당 파일 로컬 저장
* 다운로드 경로는 프론트에서 `/download?fileId={id}` 방식으로 추적

* * *

## ✅ C. 백엔드 기능명세서

### 1. 📡 청구서 파일 목록 조회 API

| 항목 | 설명 |
| --- | --- |
| 경로 | `/api/invoice-files` |
| 메서드 | `GET` |
| 설명 | 발송 완료된 청구서의 파일 메타 정보 리스트 조회 |

#### 📥 Query Parameters

| 이름 | 설명 |
| --- | --- |
| `searchField` | name, code, ceo, branch |
| `searchValue` | 텍스트 검색 |
| `dateType` | 발송일 or 청구월 |
| `fromDate` / `toDate` | 날짜 범위 (발송일 기준) |
| `billingMonth` | 청구월 (YYYY-MM) |
| `page` | 페이지 번호 |
| `limit` | 페이지당 개수 |

#### 📤 Response 예시

```json
{
  "data": [
    {
      "id": 101,
      "vendorName": "코웨이",
      "vendorCode": "1234567890",
      "ceo": "홍길동",
      "billingMonth": "2024-03",
      "hasHtml": true,
      "hasExcel": true,
      "hasEtc": true
    }
  ],
  "total": 35,
  "page": 1,
  "limit": 50
}
```

* * *

### 2. 📡 파일 다운로드 API

| 항목 | 설명 |
| --- | --- |
| 경로 | `/api/invoice-files/[fileId]/download` |
| 메서드 | `GET` |
| 설명 | 파일 ID 기준 실제 파일 바이너리 다운로드 제공 |
| 응답 | `Content-Disposition: attachment; filename=파일명` 헤더 포함 |

* * *

## ✅ D. DB 테이블 요약

### 📌 `invoice_files`

| 컬럼명 | 설명 |
| --- | --- |
| `id` | 파일 ID |
| `invoice_id` | 청구서 ID (FK) |
| `file_type` | `html`, `excel`, `attachment` |
| `file_name` | 실제 파일명 |
| `path` | 서버상 파일 경로 |
| `created_at` | 생성일 |

* * *

## ✅ E. 테스트 체크리스트

| 항목 | 체크 |
| --- | --- |
| [ ] 발송 상태가 `성공`인 청구서만 노출 여부 |  |
| [ ] 발송일/청구월 검색 정확성 |  |
| [ ] 각 파일 아이콘 클릭 시 실제 파일 다운로드 |  |
| [ ] 다운로드 시 올바른 파일명/확장자 유지 |  |
| [ ] 페이지 당 노출 수 변경 기능 작동 여부 |  | 