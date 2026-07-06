# Ember Client

Next.js 프론트엔드 클라이언트.

## 스택

TypeScript · Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Vitest + RTL · pnpm

## 명령어

```bash
pnpm dev            # 개발 서버
pnpm build          # 빌드
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test:run       # 테스트 (1회)
pnpm test:coverage  # 커버리지
pnpm check          # lint + format:check + typecheck + test:run + build (CI와 동일)
```

## 폴더 구조

```
src/
├── app/         # 페이지, 레이아웃, API 라우트 (Next.js 라우팅 전용)
├── views/       # 페이지 단위 UI 조합
├── widgets/     # 독립 UI 블록
├── entities/    # 도메인 모델
└── shared/      # 공통 api, hooks, lib, ui, utils
```

`@/` → `src/` · 레이어: `app → views → widgets → entities → shared` (현재는 `app`만 존재, 기능 추가 시 하위 레이어부터 생성)

## 규칙

@.claude/rules/fsd-architecture.md
@.claude/rules/git-workflow.md
@.claude/rules/coding-standards.md
@.claude/rules/harness-self-improve.md

## 하네스 자가 개선

작업 중 다음 상황이 발생하면 **즉시** `.claude/` 파일을 수정한다:

- 훅이 잡지 못하는 위반을 2번 이상 발견
- 에이전트 워크플로우에서 누락된 단계 확인
- 규칙 파일에 없는 패턴이 반복적으로 등장

수정 후 반드시:

1. 변경 사항 검증 (문법 및 동작 확인, .sh 파일은 `bash -n`으로 검사)
2. `.claude/HARNESS_CHANGELOG.md`에 항목 추가
3. 사용자에게 "하네스를 개선했어요 [파일]: [이유]. 커밋할게요." 알림 후 커밋
