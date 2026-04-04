# Phase 3.5 - UI 디자인 개선 및 최적화 완료 (Corporate Blue / Vault UI)

## 작업 개요
* **목표**: TenSec Check의 서비스 정체성(신뢰성, 공신력)에 걸맞은 프리미엄 'Corporate Blue' 기반 디자인 시스템 도입. 모바일 레이아웃 최적화 및 OpenGraph(OG) 이미지 생성 이슈 해결.
* **진행 기간**: 2026.04.04

## 작업 내역

### 1. 디자인 시스템 재구축 (Corporate Blue & Vault UI)
* **컬러 팔레트 교체**:
  * 기존의 다크 모드 기반에서 밝고 명료한 느낌의 **Corporate Blue (`#154C8A`)** 톤으로 Primary Color 조정.
  * 보조 컬러(`primary-light`)를 `#2664A8`로 맞춰 너무 강렬하지 않으면서도 신뢰감을 주는 색감으로 확립.
* **No-Line Rule (선 없는 디자인)**:
  * 1px Border 위주의 디자인에서 벗어나 `background-color`의 Tonal Layering과 은은한 Shadow를 사용하여 영역을 구분짓는 'Vault UI' 패턴 적용.
  * Card, Button, Modal, Upload Section 등 전반적인 공통 컴포넌트에서 Border 제거 및 Shadow 적용.

### 2. 모바일 반응형 페이지 개선
* **Landing Page ('이용 방법' 섹션)**:
  * 기존 데스크탑 너비에서만 노출(`hidden sm:block`)되던 이용 방법 영역을 모바일 환경에서도 노출되도록 `layout` 수정.
  * 모바일에서는 가독성을 위해 Flex Direction을 세로(Stack)로 전환시켜, 가장 중요한 이슈인 "대법원 인터넷등기소에서 정식으로 발급된 PDF여야 함"을 모바일 사용자도 시각적으로 명확히 인지할 수 있게 보완.

### 3. OG Image (소셜 공유 썸네일) 트러블슈팅
* **오류 현상**: 카카오톡 등에서 공유 시 썸네일 노출이 안 되거나, 회색 빈 상자로 나오는 문제 발생.
* **원인 및 해결 1 (Canonical URL)**: Vercel 특유의 임시 주소(`VERCEL_URL`)로 이미지 노출을 시도하다 보니 문제가 됨. 수익화 전까지 주력으로 사용할 URL인 `https://tensec-check.vercel.app`을 기본 `BASE_URL`로 하드코딩.
* **원인 및 해결 2 (CJK 한글 폰트 미지원)**: Next.js의 동적 이미지 생성 라이브러리(`@vercel/og`)에는 한글 언어팩이 없어서 한글 단어가 입력되면 내부적으로 에러를 일으키거나 깨짐 현상이 발생. `opengraph-image.tsx` 렌더링 시 **Pretendard TTF 폰트**를 외부 CDN에서 비동기로 Fetching 하여 삽입해주는 로직을 작성함으로써 정상 표출 보장 완수.
* **문구수정**: 향후 플랜을 고려하여 "회원가입 없음" → "간편 로그인" 으로 텍스트 교체.

## 향후 과제 (Next Steps)
* **수익화 및 V2 고도화 (Phase 4)**: 본격적인 수익화 파이프라인 설계 전초 단계. OCR 지원, 특약사항 권리 분석 도입 검토.
* 유저 피드백 기반 UI/UX 터치 타겟 사이즈 재점검 및 폰트 Tving 등 상세 QA 진행.
