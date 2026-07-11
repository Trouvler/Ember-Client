# ember-client - plan.md

기준일: 2026-07-07 (화)

## 작업 흐름

- [ ] GitHub 이슈 등록
- [ ] 이슈 번호 기준 브랜치 생성
- [ ] 작업
- [ ] `pnpm check`
- [ ] PR

브랜치 예시:

- `feature/4-update-plan-checklist`
- `feature/12-map-view`
- `fix/18-result-card`
- `chore/22-eslint-cleanup`

## 프로젝트 기준

- Next.js App Router 기준으로 작업한다.
- 패키지 매니저는 `pnpm`을 사용한다.
- 포맷은 현재 `.prettierrc` 기준을 따른다.
- ESLint는 현재 `eslint.config.mjs` 기준을 따른다.
- VS Code 자동 포맷은 현재 Prettier/ESLint 설정과 충돌하지 않게 맞춘다.

확인 명령어:

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm build`
- `pnpm check`

## 일정 체크리스트

- [x] 7/1 (수) Next.js 프로젝트 생성, 라우팅 구조 확인: `/`, `/analysis/new`, `/analysis/[id]`, `/analysis`, `/dashboard`, `/dashboard/policy`
- [x] 7/2 (목) Kakao Map SDK 키 발급, 지도 렌더링 기본 테스트
- [x] 7/3 (금) 디자인 톤(컬러/폰트) 확정, 랜딩 페이지 와이어프레임
- [x] 7/4 (토) 신고 시뮬레이션 입력 페이지 와이어프레임
- [x] 7/5 (일) 버퍼
- [x] 7/6 (월) 라우팅/디자인 톤 최종 확정, VS Code 기준 Prettier/ESLint 확인
- [ ] 7/7 (화) 통합회의 참여, 이슈 등록 -> 브랜치 생성 -> 작업 흐름 확정 (이슈 등록/브랜치 생성/작업 흐름은 완료 #12~#16, 통합회의 참여 여부는 별도 확인 필요)
- [ ] 7/8 (수) `MapView` 컴포넌트: 지도 클릭 시 `{lat,lng}` 획득, 마커 표시 (카카오맵 SDK 키 미확보로 보류, 임시로 `/analysis/new`에 lat/lng 숫자 입력 사용 중 #14)
- [x] 7/9 (목) 사고 유형 선택 버튼그룹 (`FIRE`/`RESCUE`/`EMERGENCY`) (#14)
- [x] 7/10 (금) API 연동 (`POST /api/dispatch-analyses`), 위치 미선택 시 버튼 비활성화 (#14)
- [x] 7/11 (토) `RiskBadge` 컴포넌트, 결과 카드 UI 초안 (#13, #15)
- [ ] 7/12 (일) 버퍼
- [ ] 7/13 (월) 결과 카드 스타일 다듬기
- [ ] 7/14 (화) 엔드투엔드 확인: 지도 클릭 -> 제출 -> 더미 결과 렌더링 1회 성공
- [x] 7/15 (수) 추천 출동대 테이블 UI (`RecommendedTeamTable`, #13, #16)
- [x] 7/16 (목) `EquipmentTag` 컴포넌트, 추천 장비 리스트 (#13, #15)
- [x] 7/17 (금) `ProbabilityGauge` 컴포넌트 (#13, #15)
- [ ] 7/18 (토) `GET /api/risk-layers` GeoJSON을 Kakao Map 폴리곤으로 렌더링 시도
- [ ] 7/19 (일) 버퍼
- [ ] 7/20 (월) 지도 레이어 마무리, `/analysis/[id]` 라우팅 연결
- [ ] 7/21 (화) 통합회의 참여
- [ ] 7/22 (수) AI 브리핑 카드 UI, `DegradedBanner` 컴포넌트
- [ ] 7/23 (목) 정책 대시보드 페이지 (P1, 시간되면)
- [ ] 7/24 (금) `LoadingSpinner`/`ErrorFallback` 반응형 처리
- [ ] 7/25 (토) 데모 플로우 리허설 준비
- [ ] 7/26 (일) 버퍼
- [ ] 7/27 (월) 데모 플로우 전체 리허설
- [ ] 7/28 (화) 필수 게이트: 신고 입력 -> 브리핑까지 끊김없이 데모 가능한지 확인
- [ ] 7/29 (수) UI 오탈자/디자인 정리, `pnpm check` 통과
- [ ] 7/30 (목) 발표용 스크린샷 세트 제작
- [ ] 7/31 (금) 발표 시나리오 스크립트 논의 참여
- [ ] 8/1 (토) PPT 제작 지원
- [ ] 8/2 (일) 데모 영상 녹화 참여
- [ ] 8/3 (월) 서류 최종 점검 참여
- [ ] 8/4 (화) 최종 제출 지원

## 우선순위

1. P0 무조건 완성: 랜딩(최소), 입력, 결과 상세(`/analysis/[id]`)
2. P0 데모 플로우: 신고 입력 -> 브리핑까지 끊김없이 진행
3. P1 지도 대시보드: 마커만이라도 완성, 폴리곤은 시간 되면
4. P2 정책 대시보드, 분석 이력 목록: 제일 먼저 뺄 후보

## 절대 원칙

- `localStorage`/`sessionStorage` 금지, React state만 사용
- 좌표는 백엔드가 내려주는 `(lng, lat)` 순서 그대로 사용
- `degraded: true`는 에러가 아니며 배너만 표시
- 새 포맷터/린터/상태관리 라이브러리는 추가하지 않음
