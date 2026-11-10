---
name: check-security
description: 앱 코드, 의존성, 앱인토스 검수 보안 기준(HTTPS, 외부 코드 실행, 민감정보 저장, 딥링크, 권한)을 읽기 전용 에이전트로 점검합니다. PR 전이나 의존성을 추가한 뒤에 사용합니다. 기본 /security-review와 달리 앱인토스 기준을 함께 봅니다.
argument-hint: "[파일 경로 | ref | all]"
context: fork
agent: Explore
background: false
---

# 보안 점검

참아보살(앱인토스 WebView 미니앱, React + Vite, CSR 전용) 프론트엔드에서 `$ARGUMENTS` 범위를 보안 기준으로 점검하고, 아래 보고 형식으로 결과만 돌려줘요. 한국어로 보고해요.

## 지키는 것

- 파일을 고치거나 만들지 않아요. Bash는 `git`, `pnpm audit`, `pnpm view`, `pnpm ignored-builds`, `cat`·`grep`처럼 읽기만 하는 명령에 써요. 설치·업데이트·빌드·배포 명령은 실행하지 않아요.
- 비밀값을 찾으면 앞 4자만 보여주고 나머지는 `****`로 가려요.
- 명령은 백그라운드로 돌리지 않고 끝날 때까지 기다려요. 마지막 메시지가 보고서 전체여야 하고, 그 뒤에 다른 말을 덧붙이지 않아요.
- 직접 읽은 코드와 문서만 근거로 써요. 추측한 문제는 "의심", 확인할 수 없던 것은 "확인 못 함"에 따로 적어요.

## 순서

1. 범위를 정해요.
   - 파일 경로면 그 파일
   - ref면 `git diff <ref>...HEAD`와 커밋 안 된 변경(`git diff HEAD`)
   - `all`이면 `src/`, `public/`, `index.html`, `vite.config.ts`, `apps-in-toss.config.ts`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.gitignore`
   - 없으면 `git diff main...HEAD`와 커밋 안 된 변경. 변경이 없으면 그렇다고 보고하고 끝내요.
2. `.claude/rules/toss.md`(앱인토스 SDK 규칙)와 `.claude/rules/ui.md`를 읽어요. 같은 규칙을 여기서 새로 정하지 않고 대조만 해요.
3. 범위 안에서 앱 코드 기준을 `Grep`으로 먼저 찾고, 걸린 곳만 읽어 실제 위반인지 확인해요.
4. 의존성 기준을 점검해요. 범위에 의존성 파일이 없으면 `pnpm audit --prod`만 실행해요.
5. `.gitignore`에 `.env`가 빠졌는지, 커밋된 `.env*`가 있는지(`git ls-files`) 항상 확인해요. 빠졌으면 지금 `.env` 파일이 없어도 낮음으로 표에 넣어요.
6. 보고 형식대로 돌려줘요.

## 앱 코드 기준

| 항목                  | 위반 예                                                                                                                    | 근거                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 비밀값                | 하드코딩한 API 키·토큰·비밀번호·인증서, 커밋된 `.env*`, `VITE_` 환경변수에 넣은 비밀값(번들에 그대로 들어감)               | 일반 보안           |
| 외부 코드 실행        | `eval`, `new Function`, 문자열 `setTimeout`, 외부에서 받은 스크립트 삽입                                                   | 앱인토스 체크리스트 |
| XSS                   | `dangerouslySetInnerHTML`, `innerHTML`·`insertAdjacentHTML`, 검증 없이 `href`·`src`에 넣은 사용자 입력(`javascript:` 스킴) | 일반 보안           |
| 통신                  | `http://`, `ws://` 주소. API와 WebSocket은 HTTPS·`wss://`만                                                                | 앱인토스 체크리스트 |
| 토스 도메인 밖 렌더링 | 외부 사이트 `iframe`, `window.location`으로 외부 이동, 자사 앱 설치·자사 서비스 이동 유도                                  | 앱인토스 체크리스트 |
| 딥링크·쿼리           | `intoss-private://` 링크, `deepLinks.ts` 밖의 링크 문자열, 검증 없이 API·라우팅에 쓴 쿼리 값(초대 코드 등)                 | toss.md, 체크리스트 |
| 기기 저장             | `Storage`·`localStorage`·`sessionStorage`·IndexedDB에 토큰·개인정보·결제 정보 저장. toss.md의 저장 대상 밖 값은 확인       | toss.md             |
| 개인정보 노출         | `console.*`·분석 이벤트·에러 메시지에 사용자 정보나 토큰 출력                                                              | 체크리스트          |
| 로그인                | 토스 로그인 외 자체 로그인, 로그인 연결을 끊은 뒤 남는 사용자 데이터                                                       | 체크리스트          |
| 권한                  | `apps-in-toss.config.ts`의 쓰지 않는 권한, 사용자 행동 전에 요청하는 권한, 거부하면 멈추는 기능                            | toss.md, 체크리스트 |
| SDK 과호출            | 짧은 시간 반복 호출, 횟수·간격 제한 없는 재시도                                                                            | toss.md, 체크리스트 |
| 결제(있을 때만)       | 토스페이·인앱 결제 외 결제 수단, 표시 금액과 주문 금액 불일치                                                              | 체크리스트          |
| 빌드 설정             | `vite.config.ts`의 운영 소스맵 공개, `define`에 넣은 비밀값                                                                | 일반 보안           |

## 의존성 기준

- `pnpm audit --prod`는 항상, 범위에 의존성 파일이 있거나 `all`이면 `pnpm audit`도 실행해요. high 이상은 표에, moderate 이하는 "참고"에 적어요. 네트워크 오류로 실패하면 "확인 못 함"이에요.
- `main` 대비 새로 추가되거나 버전이 바뀐 패키지만 `pnpm view <패키지> time.modified maintainers repository scripts`로 출처, 최근 배포, 설치 스크립트를 보고 타이포스쿼팅(유명 패키지와 한두 글자 다른 이름)을 확인해요. 바뀐 패키지가 없으면 건너뛰어요.
- 설치 스크립트는 `pnpm ignored-builds`와 `pnpm-workspace.yaml`의 `allowBuilds`를 대조해요. 허용(`true`)한 패키지에 이유 주석이 없으면 낮음이에요. node_modules를 순회하지 않아요.
- `pnpm-lock.yaml`의 레지스트리 주소 변경, lockfile 없이 바뀐 `package.json`, `index.html`이나 코드의 외부 CDN 스크립트를 봐요.

## 보고 형식

위반은 위험도 순으로 표 하나에 적어요. 기준에 걸린 것은 지금 위험이 작아도 낮음으로 표에 넣어요. 위반이 없으면 표 대신 "위반 없음" 한 줄을 써요. 문제가 없던 항목을 나열하는 요약 문단은 쓰지 않아요.

| 위험도 | 위치 | 문제 | 근거 | 고치는 방법 |
| ------ | ---- | ---- | ---- | ----------- |

- 위험도: 높음(배포 전 반드시 수정), 중간(검수 반려나 사고 가능), 낮음(개선 권장). 위치는 `파일:줄`이에요.
- 위반이 없어도 **의심**, **참고**(moderate 이하 취약점처럼 알아 둘 것), **확인 못 함** 세 절을 항상 쓰고, 없으면 "없음"이라고 써요.
- 마지막 줄에 실행한 명령과 점검한 파일 수를 적어요.
