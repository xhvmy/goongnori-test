# 궁노리 Figma 리디자인 스펙 정리

Figma: "궁노리 게임형 UI — Gungnori Game UI" · `▶️ Prototype Flow` 캔버스 (node `196:2`)
KO 프레임 기준으로 정리. EN/JA/ZH는 같은 레이아웃에 텍스트만 번역된 버전 (4벌 다 존재).

## 화면 구조 요약

**화면 단위 전환** 싱글 페이지 앱: Language → Gate(PIN) → Gate 등장 → (Chapter ↔ 이동중맵) ×7 → Closing → Loading. 라이트 크림 톤(`--color-bg-canvas #fbf6ee`, `--color-accent-primary #3a6d67`)이 기본 테마이며, 캐릭터 궁이는 원형 아바타(정면 얼굴, 44~112px)로 대사창마다 등장한다. 진행 표시는 스탬프 1/7 카운터 + 맵 화면의 완료/진행중/잠김 노드로 이루어진다.

## 디자인 토큰 (Figma 변수)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg-canvas` | `#fbf6ee` | 화면 배경 |
| `--color-bg-surface` / `-raised` | `white` | 카드/버튼/키패드 배경 |
| `--color-border-default` | `#e4d5bb` | 테두리, 잠김 노드 |
| `--color-text-primary` | `#241f19` | 본문 텍스트 |
| `--color-text-secondary` | `#5c5346` | 보조 텍스트 |
| `--color-text-on-accent` | `white` | 액센트 위 텍스트 |
| `--color-accent-primary` | `#3a6d67` | CTA 버튼, 아바타 배경 |
| `--color-node-completed` / `--color-accent-stamp` | `#b8801a` | 완료 스탬프/노드 |
| `--color-node-current` | `#e85d3e` | 맵 위 현재 위치 |
| `--radius-lg` | `24px` / `--radius-full` `999px` | 카드 / 필버튼 |
| `--spacing-md/lg` | `16px` / `24px` | 버튼 패딩 |

폰트: 제목 `KMU80_VF Sungkok Semi-Serif`, CTA `KMU80_TTF Sungkok Serif`, 본문 `Noto Serif KR`, 숫자키/라벨 `Jua`, 숫자 `Nunito SemiBold`, JA 헤더 `Zen Maru Gothic`, ZH 헤더 `ZCOOL KuaiLe`.

## 화면 목록 (플로우 순서)

1. **Language Select** (`67:55`) — 배경 경복궁 사진+70% 스크림, 로고, "언어를 선택해 주세요"(4개 언어 서브타이틀), 언어 버튼 4행(한국어/English/日本語/中文), 필카드 스타일.
2. **Gate Screen — PIN** (`5:4`) — 귀갑문 패턴 배경, 궁이 실루엣 아이콘, "궁이와의 약속" 제목, 대사 카드("열쇠에 새겨진 네 자리 숫자를…"), PIN 슬롯 4칸, 3×4 키패드(0-9, ⌫).
3. **Gate 등장** (`49:25`) — 배경사진+스크림, 궁이 전신 일러스트, 대사("전하! 소인은 궁이라 하옵니다…"), CTA "소인과 함께 떠나요!".
4. **Chapter Screen** ×7 (경복궁/흥례문/영제교/근정전/사정전/수정전/경회루, 대표 `133:3`) — 상단 헤더(‹ 뒤로, "N·장소명", 스탬프 mini N/7), 히어로 이미지, 궁이 원형 아바타+대사 카드, 소제목, 본문 2~3단락, 보조 이미지, CTA "다음 이야기로 · [다음장소]".
5. **이동 중 (맵)** ×6, 챕터 사이 구간 (대표 `185:49` 흥례문행) — 헤더("OO으로 가는 길" + "STAMP N/7 완료"), 손그림풍 지도 이미지, 장소별 핀(완료=골드/현재=빨강+궁이아바타/잠김=베이지) + 라벨, 범례(완료/진행중/잠김), CTA "도착했어요!".
6. **Closing Screen** (`162:18`) — 궁이 아바타, "여정을 모두 마쳤어요!", 스탬프 7개(전부 완료 골드), 요약 문구, 작별 인사 대사 카드, CTA "처음부터 다시 보기".
7. **Loading** (`233:299`) — 귀갑문 배경, 궁이 아바타(우는 표정 변형)+원형 Progress Ring, 텍스트 카드("궁이가 열심히 준비하고 있어요 / 잠시만 기다려 주시어요...").

## 다국어

KO/EN/JA/JA/ZH 4벌 모두 동일 구조로 이미 그려져 있음 — 텍스트만 다르고 레이아웃 spec은 위 7종과 동일. 장소명은 EN은 로마자(Heungnyemun 등), JA/ZH는 각 언어 한자 표기 사용.

## 참고

- Chapter/이동중 화면은 장소 수(7개) × 2(챕터+이동중, 마지막 장소 제외 이동중 6개) 만큼 반복되는 **하나의 템플릿**이라 컴포넌트화하면 화면 수 대비 코드량은 작음.
- 이 문서는 구현 순서를 정한 게 아니라 스펙 정리만 한 것. 다음 단계(어느 화면부터 코드화할지)는 아직 미정.

## Figma 컴포넌트 인벤토리 (2026-07-31 정리)

코드 작업 시 아래 컴포넌트 = 코드 컴포넌트로 1:1 매핑하면 됨. 전부 `Color`/`Spacing`/`Radius` variable에 바인딩되어 있어 라이트/다크 모드 값도 이미 구조상 존재(다크는 아직 화면에 안 씀).

| Figma 컴포넌트 | 위치(페이지) | Variant/override | 실사용 화면 |
|---|---|---|---|
| `Button` | 🔘 Components — Button | Property(Primary/Secondary) × State(Default/Pressed/Disabled) | 모든 CTA |
| `Map Node` | 🗺️ Components — Map Node | State(Locked/Current/Completed) | 이동중 지도 핀 |
| `궁이 / Avatar` | 🦊 Components — 궁이 | **Expression(Default/Crying)** — 이번에 추가 | 대사카드, Loading |
| `궁이 / Silhouette` | 🦊 Components — 궁이 | 없음 | Gate PIN 화면 |
| `궁이`(View) | 🦊 Components — 궁이 | View(Front/Side/Back) | Gate 등장 전신 일러스트 |
| `PIN Key` | 🔘 Components — Button | Type(Number/Backspace/Blank) — 이번에 추가 | Gate PIN 키패드 (텍스트 override로 0-9) |
| `Language Row` | 🔘 Components — Button | 없음 — 이번에 추가 | Language Select (Label 텍스트+폰트 override) |
| `Legend` | 🧭 Components — Layout | 없음 — 이번에 추가 | 이동중 화면 범례 (칩 3개 Label 텍스트 override) |
| `Chapter Header` | 🧭 Components — Layout | 없음 — 이번에 추가 | Chapter Screen 헤더 (Title, Stamp mini Count override) — 28개 인스턴스로 교체 완료 |
| `En-route Header` | 🧭 Components — Layout | 없음 — 이번에 추가 | 이동중 화면 헤더 (Title, Subtitle override) — 24개 인스턴스로 교체 완료 |

### 이번에 고친 버그
- Loading 화면 궁이 얼굴이 가려지던 문제 — 1차로 `Face Fade` 그라디언트 높이를 줄였다가, 근본 원인(우는 표정 이미지는 로브/옷깃이 이미 원 안에 자연스럽게 들어맞아서 fade 자체가 불필요 + fade의 티얼색과 로브의 진한 초록색이 미묘하게 달라 경계선처럼 보임)을 찾아 `Expression=Crying` 컴포넌트에서 **Face Fade 노드를 완전히 제거**. 컴포넌트 하나만 고쳐서 KO/EN/JA/ZH 4개 인스턴스 전부에 반영됨.
- Fade를 지우고 나니 몸통/옷깃이 원 아래쪽에서 뚝 끊겨 보이는 문제가 새로 드러남. crop 크기·fade 길이를 여러 번 조정했지만("얼굴이 둥둥 뜬다" ↔ "몸이 잘려 보인다") 만족스럽지 않았음 — **근본 원인은 소스 에셋 자체가 얼굴만 있는 반신 크롭이라 원형 프레임 안에서 몸이 끝나는 지점을 자연스럽게 처리할 여지가 없었던 것**.
- **최종 해결**: 사용자가 궁이 우는 표정의 **전신 일러스트**(`우는표정 2`, `🦊 Components — 궁이` 페이지)를 새로 그려서 제공 → `Expression=Crying`(`325:2`)의 얼굴 이미지를 이 전신 아트로 교체하고, `Expression=Default`(`23:2`)가 쓰는 것과 동일한 크롭 좌표(`x:8.8, y:8.085, w:80.465, h:125.895` — 이미지가 원형 프레임보다 크게 걸쳐서 원 밖으로 자연스럽게 빠져나가는 구도)를 그대로 적용. 두 표정의 프레이밍이 완전히 통일되고, 그라디언트/크롭 트릭 없이 그냥 clip만으로 자연스럽게 해결됨. 기존 반신 크롭 이미지(`우는표정 1`, node `247:491`)는 삭제.
- PIN 키패드 ⌫(백스페이스) 키가 폰트에 없는 글리프라 네모 박스(tofu)로 깨져 보이던 것 — 코드(`index.html`)에서 쓰는 것과 동일한 SVG 백스페이스 아이콘으로 교체. `PIN Key`(Type=Backspace) 컴포넌트 하나만 고쳐서 4개 언어 전부 반영됨.

### 폰트 — 해결됨
`Chapter Header`/`En-route Header`의 Title 폰트를 사용자가 Figma 데스크톱 UI에서 직접 KMU80(VF Sungkok Semi-Serif / TTF Sungkok Serif)으로 수동 교체 완료. (원인은 MCP 플러그인 스크립트 실행 환경이 로컬 커스텀 폰트에 접근 불가한 구조적 제약이었음 — 실제 코드 구현에는 영향 없음, `WebFonts/woff2`로 `@font-face` 등록하면 정상 작동.)
