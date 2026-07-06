# PR Template

Ember-Client 프로젝트의 PR 작성 기준. `.github/PULL_REQUEST_TEMPLATE.md`와 동일한 구조를 그대로 따른다.

## 제목 포맷

```
type: 한국어로 간결하게 (70자 이내)
```

## 본문 템플릿 (정확히 따를 것)

```markdown
## Summary

- {변경사항을 bullet point로 작성}

## Checks

- [ ] `pnpm check`

## Notes

- {참고사항, 없으면 `-`}
```

## 생성 명령

```bash
gh pr create --base develop --title "type: 한국어 설명" --body "$(cat <<'EOF'
## Summary

- ...

## Checks

- [ ] `pnpm check`

## Notes

- -
EOF
)"
```

## 제목 예시

```
feat: 로그인 폼 유효성 검사 추가
fix: 토큰 만료 시 무한 리다이렉트 수정
test: auth 관련 단위 테스트 추가
chore: Vitest 테스트 환경 구성
design: 메인 배너 모바일 레이아웃 수정
```
