---
name: figma-to-component
description: Figma URL이나 시안을 TDS 우선, FSD 구조에 맞는 컴포넌트와 화면으로 구현합니다. 디자인을 코드로 옮기는 요청에 사용합니다.
argument-hint: "<Figma URL 또는 스크린샷>"
---

# Figma를 컴포넌트로

Figma가 주는 코드는 참고용 시안입니다. 목표는 시안과 같아 보이면서 팀 규칙을 지키는 코드입니다.

## 1. 디자인 읽기

1. Figma MCP가 없으면 스크린샷 기준으로 진행하고, 수치를 확인할 수 없다고 보고합니다.
2. URL에서 `fileKey`와 `nodeId`를 뽑고(`-`를 `:`로 변환) `create_session`을 호출합니다.
3. `figma-design-to-code` 스킬을 먼저 로드합니다. 플러그인이 없으면 MCP 리소스 `skill://figma/figma-design-to-code/SKILL.md`를 읽습니다.
4. `get_design_context`로 코드와 스크린샷을 받습니다. 이 스크린샷이 구현의 시각 기준입니다. 응답이 sparse로 표시되면 하위 노드를 나눠 다시 요청합니다.

## 2. 매핑표부터 만들기

코드를 쓰기 전에 아래 표를 채워 보여줍니다. 판단이 필요한 줄이 있으면 사용자에게 확인합니다.

| Figma 요소        | 판단 기준                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| UI 요소           | TDS 존재 여부를 `node_modules/@toss/tds-mobile/dist/esm/index.d.ts`에서 확인, 사용법은 아래 TDS 문서                         |
| 글자              | TDS `Paragraph`의 `typography` 토큰 우선(`Txt`는 export되지 않음). 크기를 하드코딩하면 사용자 글자 크기 설정이 반영되지 않음 |
| 색상              | TDS 컴포넌트 기본값 우선. 직접 칠해야 하면 아래 색상 규칙                                                                    |
| 상단 바, 뒤로가기 | 토스가 그리므로 구현하지 않음. 시안에 있어도 제외하고 보고                                                                   |
| 하단 CTA, 탭바    | `FixedBottomCTA`, safe area 반영                                                                                             |
| 이미지, 아이콘    | 응답의 안내대로 내려받아 슬라이스 `assets/` 또는 `shared/assets/`에 저장. 시안 스크린샷을 에셋으로 쓰지 않음                 |
| 문구 속 규칙      | "최대 4명" 같은 값은 `config/` 상수로 분리                                                                                   |
| 상태              | 시안에 없는 loading, empty, error, disabled는 만들지 말고 목록으로 질문                                                      |

TDS 문서는 https://tossmini-docs.toss.im/tds-mobile/llms.txt 에서 찾습니다. 문서가 기억과 다르면 문서를 따릅니다.

**글자 토큰:** 30 `t1`, 26 `t2`, 24 `st5`, 22 `t3`, 20 `t4`, 17 `t5`, 15 `t6`, 13 `t7`, 11 `st13`입니다. 나머지는 `Paragraph`의 타입을 봅니다.

**색상:** TDS가 CSS 변수를 제공합니다. `bg-(--adaptiveBlue50)`, `color="var(--adaptiveGreyOpacity700)"`처럼 쓰고 hex를 코드에 쓰지 않습니다. 이름은 `@toss/tds-colors`의 `adaptive` 값에서 확인합니다. 시안 색이 어떤 변수에도 없을 때만 `src/app/styles/index.css`의 `@theme` 토큰 추가를 사용자에게 제안합니다.

## 3. 구현

1. 위치는 `find-code-location` 스킬로 정합니다. 화면 전체면 `pages`는 배치만 하고 `widgets`, `features`, `entities`로 나눕니다.
2. 절대 좌표를 flex, grid로 바꾸고, 시안에서 눌리는 요소를 실제 동작으로 연결합니다.
3. 고정 너비는 화면 폭에 맞춥니다. 긴 닉네임처럼 늘어나는 글자는 `min-w-0`, `truncate`를 검토합니다.
4. 서버 데이터가 필요하지만 스펙이 없으면 props로 받게 두고 스펙을 요청합니다.
5. 애니메이션이 있으면 Figma의 `figma-implement-motion` 스킬을 참고하고 `transform`, `opacity` 위주로 만듭니다.

## 4. 시안과 대조

1. `pnpm dev`로 띄워 Figma 프레임과 같은 폭으로 렌더링하고, 등장 애니메이션이 끝난 뒤 스크린샷을 찍습니다. 아직 붙일 페이지가 없으면 복사본에서 띄우고 `App.tsx`를 바꾸지 않습니다.
2. 눈으로만 보지 말고 글자 크기, 색, 요소 크기와 간격을 브라우저에서 측정해 시안 수치와 비교합니다. TDS가 정한 구조(시트의 좌우 여백, 손잡이 등)는 유지하고 보고합니다.
3. 에셋마다 파일이 비어 있지 않은지, 코드의 위치와 렌더링 크기가 맞는지 확인합니다. Figma 임시 URL이 코드에 남으면 실패입니다.
4. `pnpm lint`, `pnpm exec tsc -b`를 실행하고 `visual-aesthetics-qa` 스킬로 마무리합니다.

## 결과 보고

만든 파일, 쓴 TDS 컴포넌트, 직접 만든 요소와 이유, 시안과 일부러 다르게 한 부분(토스가 그리는 상단 바 등), 추가로 필요한 질문, 실기기에서 확인하지 못한 것을 적습니다.
