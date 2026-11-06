---
name: issue-and-pr
description: 이슈와 브랜치를 만들거나 현재 브랜치의 변경으로 PR 제목과 본문을 작성할 때 사용합니다. PR 생성은 사용자가 요청할 때만 합니다.
argument-hint: "[base 브랜치, 기본 main]"
---

# 이슈와 PR

## 이슈와 브랜치

- 이슈는 `.github/ISSUE_TEMPLATE/issue.yml` 템플릿으로 만듭니다. 제목은 `[Type] 작업 내용`입니다(`[Feat] 앱 골격 구성`).
- 브랜치 유형은 `commit` 스킬의 type을 소문자로, 작업 내용은 영문 kebab-case로만 씁니다(`router-layout`). 한글이 들어가면 자동 생성이 실패합니다.
- 이슈를 열면 워크플로가 `{type}/{이슈번호}-{작업내용}` 브랜치를 `main`에서 만듭니다. 브랜치를 직접 만들지 않습니다.
- 이슈 1개 = 브랜치 1개 = PR 1개가 기본입니다.

## 현재 브랜치

- 브랜치: !`git branch --show-current`
- 커밋: !`git log main..HEAD --oneline`
- 변경 규모: !`git diff main...HEAD --stat`
- 커밋 안 된 변경: !`git status --short`

인자로 base 브랜치를 받으면 `main` 대신 그 브랜치 기준으로 다시 확인합니다.

## PR 순서

1. 커밋 안 된 변경이 있으면 PR에 포함되지 않는다고 먼저 알립니다.
2. `pnpm lint`와 `pnpm build`가 통과해야 올립니다.
3. 브랜치 이름에서 이슈 번호를 찾아 `Closes #번호`로 씁니다.
4. `git diff main...HEAD`를 기준으로 `.github/PULL_REQUEST_TEMPLATE.md` 항목을 빠짐없이 채웁니다.
5. 제목은 `<type>: <설명>` 형식으로 제안합니다.
6. 사용자가 생성을 요청하면 본문을 임시 파일로 쓰고 `gh pr create --title "<제목>" --body-file <파일>`로 만듭니다.

## 지키는 것

- 체크리스트는 실제로 실행하거나 확인한 항목만 체크합니다. WIP가 아니면 `작업 진행 중`은 체크하지 않습니다.
- UI 변경이 있으면 스크린샷을 첨부합니다. 실기기에서 보지 못한 동작은 리뷰 요구사항에 적습니다.
- 변경 사항은 파일 나열이 아니라 무엇이 왜 바뀌었는지로 씁니다.
- 본문에 AI 도구 표기를 남기지 않습니다.
