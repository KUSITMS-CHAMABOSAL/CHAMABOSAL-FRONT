# 서비스 지도

## role

| role            | 범위                                    | 예시                                                   |
| --------------- | --------------------------------------- | ------------------------------------------------------ |
| `onboarding`    | 서비스 소개, 인트로, 닉네임, 보살 받기  | `features/onboarding/nicknameForm`                     |
| `room`          | 방 만들기, 초대, 참여, 나가기, 내보내기 | `features/room/createRoom`, `features/room/kickMember` |
| `home`          | 홈 화면 섹션 (widgets 전용)             | `widgets/home/todayBosals`                             |
| `member`        | 멤버 간 상호작용                        | `features/member/pokeMember`                           |
| `certification` | 번뇌 떠올리기 인증, 반응                | `features/certification/submitCertification`           |
| `vote`          | 투표, 이마 톡톡, 방어권                 | `features/vote/castVote`, `features/vote/tapForehead`  |
| `storehouse`    | 곳간 (구매, 착용)                       | `features/storehouse/buyItem`                          |
| `myBosal`       | 내 보살 화면                            | `widgets/myBosal/myRoomPanel`                          |
| `settings`      | 알림 설정, 데이터 삭제                  | `features/settings/notificationSetting`                |

## 비즈니스 상수

| 디자인 문구                       | 상수                                                                   | 위치                              |
| --------------------------------- | ---------------------------------------------------------------------- | --------------------------------- |
| 최대 4명까지 함께할 수 있어요     | `MAX_MEMBERS = 4`                                                      | `entities/room/config`            |
| 참여중인 방이 2개예요             | `MAX_JOINED_ROOMS = 2`                                                 | `entities/room/config`            |
| 2명부터 인증·투표 공양미가 쌓이고 | `MIN_RICE_MEMBERS = 2`                                                 | `entities/room/config`            |
| 수정 및 삭제는 10분이내로만 가능  | `EDIT_WINDOW_MINUTES = 10`                                             | `entities/certification/config`   |
| 한 줄 기록 1~50자, 쓴 금액        | `MEMO_MAX_LENGTH = 50`, `SPENT_AMOUNT_MIN`, `SPENT_AMOUNT_MAX`         | `entities/certification/config`   |
| 인증 사진 10MB                    | `PHOTO_MAX_BYTES`                                                      | `entities/certification/config`   |
| 보살이 3명 이상 모이면 투표       | `MIN_VOTERS = 3`                                                       | `entities/vote/config`            |
| 1/10 번                           | `TAP_GOAL = 10`                                                        | `entities/vote/config`            |
| 닉네임 3/8                        | `NICKNAME_MAX_LENGTH = 8`                                              | `entities/room/config`            |
| 방 이름 0/12                      | `ROOM_NAME_MAX_LENGTH = 12`                                            | `features/room/createRoom/config` |
| 목표 공양미 300~700석, 50석 단위  | `POT_GOAL_MIN`, `POT_GOAL_MAX`, `POT_GOAL_STEP`                        | `entities/room/config`            |
| 목표 공양미 기본 450석            | `DEFAULT_POT_GOAL = 450`                                               | `features/room/createRoom/config` |
| n명이면 약 n일 예상 (하루 적립)   | `DAILY_CERTIFY_RICE = 10`, `DAILY_VOTE_RICE = 5`, `DAILY_TAP_RICE = 5` | `entities/room/config`            |
| 배달 끊기 · 배달 끊기 방          | `ROOM_GOAL_LABEL`, `ROOM_GOAL_TITLE`                                   | `entities/room/config`            |
| 핑크보살이 찾아왔어요             | `BOSAL_COLOR_NAME` (핑크·보라·옥색·노랑)                               | `entities/bosal/config`           |

## 목표 폴더 구조

아직 없는 폴더는 처음 필요할 때 만듭니다.

| 위치        | 구성                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`      | `main.tsx`, `App.tsx`, `bootstrap/`(사용자 식별, 내비게이션 바 하트 버튼, 서버 시간 보정), `providers/`(`TDSMobileAITProvider`, `QueryClientProvider`), `router/`(`routes.tsx`), `layouts/`(`RoomTabLayout`, `PlainLayout`), `styles/`(`index.css`)                                                                                                                                                                                                                                                                                                                           |
| `pages/`    | `intro`(`IntroPage`), `createRoom`(`CreateRoomPage`), `invite`(`InvitePage`), `home`(`HomePage`), `certify`(`CertifyPage`, `CertifyWritePage`, `CertifyEditPage`, `CertifyResultPage`), `potCelebration`(`PotCelebrationPage`), `roomInfo`(`RoomInfoPage`), `vote`(`VotePage`, `TapTapPage`), `storehouse`(`StorehousePage`), `myBosal`(`MyBosalPage`), `settings`(`SettingsPage`), `legal`(`TermsPage`, `PrivacyPage`)                                                                                                                                                       |
| `widgets/`  | `onboarding/joinSteps`(방 만들기·초대 공용, 온보딩 단계 포함), `home/roomSummary`, `home/todayBosals`, `home/entryPopups`(방 홈 진입 팝업 순서), `home/myToday`, `certification/{certifyChoice,certifyForm,certifyResult}`, `room/potCelebration`(한 솥 축하), `room/roomInfo`(방 정보·내보내기 시트), `vote/voteBoard`(`VoteView` 분기), `vote/moktakPractice`(목탁 수행·완료), `vote/foreheadTap`(이마 톡톡 하기), `storehouse/itemShop`, `myBosal/{myRoomPanel,certificationCalendar}`, `settings/{settingsList,legalDocument}`(설정 목록, 이용약관·개인정보처리방침 본문) |
| `features/` | `onboarding/{takeServiceTour,nicknameForm}`, `room/{createRoom,joinRoom,shareInvite,leaveRoom,kickMember,renameNickname,confirmPotSeen,confirmResultSeen,decidePot}`, `member/pokeMember`, `certification/{submitCertification,editCertification,reactCertification,remindCertification}`, `vote/{castVote,tapForehead,strikeMoktak,applyShield}`, `storehouse/{buyItem,equipItem,plantHair,confirmNabalLoss}`, `settings/{notificationSetting,deleteMyData,openExternalLink}`                                                                                                |
| `entities/` | `bosal`(`BosalImage`, `BosalHead`(한 솥 축하 순위 얼굴, 보살 색으로 칠함), `BosalCard`, `BosalStatusBadge`, `BosalGrid`, `assets/`), `room`(`RoomIllustration`, `RicePotGauge`, `roomQueries`, 방 규칙 상수), `member`(`MemberStatRow`), `certification`(`CertificationCard`, `certificationQueries`), `vote`(`voteQueries`, `getVoteView`), `item`(`ItemCard`), `session`(로그인 토큰, 내 정보)                                                                                                                                                                              |
| `shared/`   | `api/`(`client.ts`, `queryClient.ts`), `ui/`(`EmptyState`, `InfoBox`, `GradientScreen`), `lib/`(`appsInToss/`, `cn.ts`, `formatWon.ts`, `formatDateTime.ts`), `hooks/`(`useServerCountdown`, `useFunnel`), `config/`(`env.ts`, `paths.ts`, `deepLinks.ts`), `types/`, `assets/`(`icons/`, `illustrations/`)                                                                                                                                                                                                                                                                   |

`shared/lib/appsInToss/` 래퍼: `auth`, `share`, `clipboard`, `photos`, `haptic`, `notification`, `storage`, `screen`, `backEvent`, `errors`
