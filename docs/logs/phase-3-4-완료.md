# Phase 3-4 완료 로그

**작성일**: 2026-04-04
**작업자**: Claude Code + 사용자
**상태**: 완료

---

## 완료 항목

- [x] Vercel Hobby 플랜 배포 (https://tensec-check.vercel.app)
- [x] 환경변수 프로덕션 설정 (`GEMINI_API_KEY`)
- [x] 도메인: Vercel 기본 URL 사용 (`tensec-check.vercel.app`)
- [x] `/api/health` 헬스 체크 엔드포인트 정상 응답 확인
- [x] Rate Limiting: IP당 10회/일 (Upstash Redis + `@upstash/ratelimit`)

---

## 상세 내용

### 배포

- Vercel Hobby 플랜 (Edge Runtime 25초 제한 → `generateContentStream`으로 기 대응)
- GitHub `saigonkim/tensec-check` repo 연동, `master` 브랜치 자동 배포
- 헬스 체크: `{"status":"ok","timestamp":"..."}` 정상 응답 확인

### Rate Limiting 구현 (`src/proxy.ts`)

**Next.js 16 Breaking Change 대응**:
- `middleware.ts` → `proxy.ts` (파일명 변경)
- `export function middleware` → `export function proxy` (함수명 변경)

**구성**:
- 라이브러리: `@upstash/redis` + `@upstash/ratelimit`
- 알고리즘: Sliding Window, 10회/일 per IP
- 적용 대상: `/api/analyze` 요청만 (`matcher` 설정)
- 초과 시: `429` + `RATE_LIMIT` 에러코드 → 클라이언트 `ERROR_MESSAGES` 매핑으로 한국어 안내
- 응답 헤더: `X-RateLimit-Remaining` (잔여 횟수, 디버깅용)
- 로컬 개발: `KV_REST_API_URL` 미설정 시 자동 비활성화

**Vercel Storage 변경 사항 대응**:
- Vercel이 자체 KV 제품을 마켓플레이스 방식으로 전환
- Storage → Upstash for Redis 연동으로 대체
- 주입 환경변수: `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- `Redis.fromEnv()`로 환경변수 자동 인식

### 트러블슈팅

| 이슈 | 원인 | 해결 |
|------|------|------|
| Vercel Storage에 KV 없음 | Vercel이 자체 KV → 마켓플레이스 전환 | Upstash for Redis 마켓플레이스 사용 |
| 환경변수명 불일치 | Upstash 직접 연동 시 `KV_REST_API_*` 주입 | `Redis.fromEnv()` 사용으로 자동 해결 |
| 토큰 노출 | Rotate Secrets로 재발급 후 Redeploy | 코드 수정 불필요 (환경변수만 갱신) |

---

## 다음 단계 (3-5)

- [ ] Vercel Analytics 대시보드 활성화
- [ ] Gemini API 비용 알림 (Google Cloud Console 예산 설정)
