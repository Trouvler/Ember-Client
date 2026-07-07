# FSD Architecture Rules

## 레이어 의존성 방향

```
app → views → widgets → entities → shared
```

각 레이어는 **아래 레이어만** import 가능.

`app`은 Next.js App Router 라우팅 전용(레이아웃, 페이지, API 라우트)이며 실제 페이지 조합은 `views`에 위임한다.

## 금지 패턴

| 레이어     | 금지 import                           |
| ---------- | ------------------------------------- |
| `shared`   | `entities`, `widgets`, `views`, `app` |
| `entities` | `widgets`, `views`, `app`             |
| `widgets`  | `views`, `app`                        |
| `views`    | `app`                                 |

## Cross-slice Import 금지

동일 레이어 내 슬라이스 간 import 불가.

```ts
// ❌ 금지
// src/entities/user/api/getUser.ts
import { getTeam } from "@/entities/team/api/getTeam";

// ✅ 허용
// src/widgets/form/ui/LoginForm.tsx
import { getUser } from "@/entities/user/api/getUser";
```

## 위반 탐지 명령

```bash
# shared가 상위 레이어 import하는지
grep -r 'from "@/entities' src/shared/
grep -r 'from "@/widgets' src/shared/
grep -r 'from "@/views' src/shared/

# entities가 상위 레이어 import하는지
grep -r 'from "@/widgets' src/entities/
grep -r 'from "@/views' src/entities/
```

## 새 라이브러리 도입 시

axios, TanStack Query 등 HTTP/데이터 페칭 라이브러리를 도입하면 위치 규칙(예: query 훅은 `model/` 폴더)을 이 파일과 `coding-standards.md`에 추가한다. (`harness-self-improve.md` 참조)
