# 서비스 지도

## role

| role            | 범위                                    | 예시                                                   |
| --------------- | --------------------------------------- | ------------------------------------------------------ |
| `onboarding`    | 인트로, 닉네임, 보살 받기               | `features/onboarding/nicknameForm`                     |
| `room`          | 방 만들기, 초대, 참여, 나가기, 내보내기 | `features/room/createRoom`, `features/room/kickMember` |
| `home`          | 홈 화면 섹션 (widgets 전용)             | `widgets/home/todayBosals`                             |
| `member`        | 멤버 간 상호작용                        | `features/member/pokeMember`                           |
| `certification` | 번뇌 떨구기 인증, 반응                  | `features/certification/submitCertification`           |
| `vote`          | 투표, 이마 톡톡, 방어권                 | `features/vote/castVote`, `features/vote/tapForehead`  |
| `storehouse`    | 곳간 (구매, 착용)                       | `features/storehouse/buyItem`                          |
| `myBosal`       | 내 보살 화면                            | `widgets/myBosal/myRoomPanel`                          |
| `settings`      | 알림 설정, 데이터 삭제                  | `features/settings/notificationSetting`                |

## 비즈니스 상수

| 디자인 문구                   | 상수                                                  | 위치                                      |
| ----------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| 최대 4명까지 함께할 수 있어요 | `MAX_MEMBERS = 4`                                     | `entities/room/config`                    |
| 참여중인 방이 2개에요         | `MAX_ROOMS = 2`                                       | `entities/room/config`                    |
| 공양미 한 솥 300석, +30석     | `POT_CAPACITY`, `POT_REWARD`                          | `entities/room/config`                    |
| 9분동안 수정 및 삭제          | `EDIT_WINDOW_MINUTES = 10` 🔖 (남은 시간 표시로 추정) | `entities/certification/config`           |
| 보살이 3명 이상 모이면 투표   | `MIN_VOTERS = 3`                                      | `entities/vote/config`                    |
| 1/10 번                       | `TAP_GOAL = 10`                                       | `entities/vote/config`                    |
| 닉네임 3/8                    | `NICKNAME_MAX_LENGTH = 8`                             | `features/onboarding/nicknameForm/config` |

## 목표 폴더 구조

아직 없는 폴더는 처음 필요할 때 만듭니다.

| 위치        | 구성                                                                                                                                                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/`      | `main.tsx`, `App.tsx`, `bootstrap/`(사용자 식별, 내비게이션 바 하트 버튼, 서버 시간 보정), `providers/`(`TDSMobileAITProvider`, `QueryClientProvider`), `router/`(`routes.tsx`, `guards/`), `layouts/`(`RoomTabLayout`, `PlainLayout`), `styles/`(`index.css`)                                                                       |
| `pages/`    | `intro`(`IntroPage`), `createRoom`(`CreateRoomPage`), `invite`(`InvitePage`), `home`(`HomePage`), `certify`(`CertifyPage`, `CertifyResultPage`), `vote`(`VotePage`, `TapTapPage`), `storehouse`(`StorehousePage`), `myBosal`(`MyBosalPage`), `legal`(`TermsPage`, `PrivacyPage`)                                                     |
| `widgets/`  | `onboarding/joinSteps`(방 만들기·초대 공용), `home/roomSummary`, `home/todayBosals`, `home/myToday`, `certification/certifyResult`, `vote/voteBoard`(`VoteView` 분기), `storehouse/itemShop`, `myBosal/myRoomPanel`                                                                                                                  |
| `features/` | `onboarding/nicknameForm`, `room/{createRoom,joinRoom,shareInvite,leaveRoom,kickMember,renameNickname}`, `member/pokeMember`, `certification/{submitCertification,editCertification,reactCertification}`, `vote/{castVote,tapForehead,applyShield}`, `storehouse/{buyItem,equipItem}`, `settings/{notificationSetting,deleteMyData}` |
| `entities/` | `bosal`(`BosalImage`, `BosalCard`, `BosalStatusBadge`, `BosalGrid`, `assets/`), `room`(`RoomIllustration`, `RicePotGauge`, `roomQueries`, 방 규칙 상수), `member`(`MemberStatRow`), `certification`(`CertificationCard`), `vote`(`VoteCandidateCard`, `getVoteView`), `item`(`ItemCard`), `session`(로그인 토큰, 내 정보)            |
| `shared/`   | `api/`(`client.ts`, `queryClient.ts`), `ui/`(`EmptyState`, `InfoBox`, `GradientScreen`, `MonthCalendar`), `lib/`(`appsInToss/`, `cn.ts`, `formatWon.ts`, `formatDateTime.ts`), `hooks/`(`useServerCountdown`, `useFunnel`), `config/`(`env.ts`, `paths.ts`, `deepLinks.ts`), `types/`, `assets/`(`icons/`, `illustrations/`)         |

`shared/lib/appsInToss/` 래퍼: `auth`, `share`, `photos`, `haptic`, `notification`, `storage`, `screen`, `backEvent`, `errors`
