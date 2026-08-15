# 궁노리 게임 (GOONGNORI GAME)

경복궁을 캐릭터 "궁이"와 함께 걷는 모바일 웹 기반 게임형 디지털 체험입니다. 한국어·영어·일본어·중국어 4개 언어를 지원하며, 화면 단위로 전환되는 싱글 페이지 앱(언어 선택 → PIN → 궁이 등장 → 이야기)입니다.

빌드 도구 없이 순수 HTML/CSS/JS로만 만들어져 있어, 정적 파일을 올릴 수 있는 곳이면 어디든 배포할 수 있습니다.

## 폴더 구조

```
index.html        모든 화면(언어선택/PIN/궁이등장/이야기)이 담긴 단일 페이지
404.html          잘못된 경로 접근 시 보여주는 페이지
css/style.css     전체 스타일 (디자인 토큰은 파일 상단 :root)
fonts/            자체 호스팅 커스텀 한글 폰트(KMU80, woff2)
js/content.js     비밀번호 · 화면별 문구 설정 (4개 언어)
js/main.js        화면 전환, PIN 검증, 언어 선택 로직
sw.js             오프라인 캐시(서비스 워커)
manifest.json     홈 화면 추가(PWA) 설정
images/00_logo/   파비콘 · PWA 아이콘
images/01_gate/   언어선택 · PIN · 궁이등장 화면 에셋
images/02_chapters/ 장소별(경복궁~경회루) 이야기 화면 이미지
images/03_maps/   이동 중(지도) 화면 배경 6종
sound/login.mp3   PIN 성공 시 재생되는 사운드
```

7개 장소(경복궁~경회루) 이야기(Chapter)·이동중(지도) 화면까지 4개 언어로 전부 채워진 상태입니다.

## 로컬에서 미리보기

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속. (Python이 없다면 `npx serve` 등 정적 서버 아무거나 사용 가능합니다.)

## 비밀번호 변경

비밀번호는 평문이 아니라 SHA-256 해시로 저장되어 있어(개발자 도구로 소스를 봐도 PIN 원문이 드러나지 않도록), 바꿀 때는 새 해시값을 먼저 구해야 합니다.

1. 배포된 사이트(또는 `https://` / `localhost`)에서 브라우저 콘솔을 열고 아래를 실행:

   ```js
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('새비밀번호')).then(b =>
     console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
   ```

2. 출력된 64자리 문자열을 `js/content.js`의 `CONFIG.passwordHash`에 붙여넣기.

## 텍스트·이미지 수정

- **화면 텍스트**: `js/content.js`에 화면별로 블록이 나뉘어 있고(`LANGUAGE_SELECT_TEXT`, `GATE_PIN_TEXT` 등), 각 블록 안에 4개 언어(`ko`/`en`/`ja`/`zh`) 문구가 들어있습니다.
- **사진 추가/교체**: `images/폴더/파일명`을 교체하면 됩니다.
- 자세한 화면 구조·언어 전환 방식 등 개발 관점 설명은 `CLAUDE.md`에, 아직 만들어지지 않은 화면들의 디자인 스펙은 `FIGMA-REDESIGN-SPEC.md`에 정리되어 있습니다.

## 오프라인 지원

`sw.js`가 서비스 워커를 등록해 방문 후에는 오프라인에서도 화면이 뜨도록 캐싱합니다. HTML/CSS/JS는 온라인일 때 항상 최신 버전을 우선 가져오고, 사진·사운드·폰트처럼 용량이 큰 파일은 한 번 받으면 계속 캐시에서 재사용합니다.

캐시 대상 파일 목록(`sw.js`의 `APP_SHELL`)이 바뀌면 `CACHE_NAME`도 함께 올려주세요 — 그래야 재방문자가 옛 캐시에 머무르지 않습니다.

콘텐츠를 수정한 뒤에도 반영이 안 되는 것처럼 보인다면, 브라우저 개발자 도구 → Application → Service Workers에서 등록 해제 후 새로고침하면 됩니다.

## 보안

PIN 입력에는 다음 두 가지 기본 보호가 적용되어 있습니다.

- **시도 횟수 제한**: 5회 연속으로 틀리면 30초간 키패드가 잠깁니다(`js/content.js`의 `maxAttempts`, `lockoutMs`로 조절 가능).
- **비밀번호 해시 저장**: 원문 대신 SHA-256 해시만 코드에 들어있어, 소스를 열어봐도 PIN이 바로 노출되지 않습니다.

**솔직한 한계**: 이 사이트는 서버가 없는 순수 정적 사이트입니다. 즉 "진짜 인증"이 아니라 캐주얼한 접근을 막는 수준의 보호입니다 — 해시와 검증 로직 자체가 브라우저에 그대로 노출되므로, 4자리 숫자(10,000가지) 조합을 기술적으로 파악해 오프라인으로 대입하는 것 자체를 막을 수는 없습니다. 시도 횟수 제한은 "사이트에 실제로 입력하며 시도하는" 방식만 늦출 뿐입니다. 게임 진행용 가벼운 게이트로는 충분하지만, 정말 민감한 정보를 보호해야 한다면 서버 인증 방식으로 바꿔야 합니다.

### 콘텐츠 보호 (우클릭 · 개발자도구 단축키)

일반 방문자가 사진을 쉽게 저장하거나 소스를 들여다보지 못하도록 캐주얼한 저지선을 걸어뒀습니다(`js/main.js`의 `setupContentProtection()`).

- 막히는 것: 우클릭 메뉴, 이미지/텍스트 드래그로 빼내기, iOS 롱프레스 저장 메뉴, F12·Ctrl(⌘)+Shift+I/J/C·Ctrl(⌘+⌥)+U 단축키
- 안 막히는 것: 이미 열려 있는 개발자도구로 보는 것, 브라우저 메뉴에서 직접 들어가는 개발자도구, 네트워크 탭에서 이미지 URL을 확인하는 것

즉 캐주얼한 열람은 막지만, 마음먹고 개발자도구를 여는 사용자까지 막을 수는 없습니다.

### 배포 시 권장 설정

1. **HTTPS 필수** — 비밀번호 해시 계산에 쓰이는 Web Crypto API(`crypto.subtle`)와 오프라인 캐시(서비스 워커) 둘 다 `https` 또는 `localhost`가 아니면 아예 동작하지 않습니다. Netlify/Vercel/GitHub Pages는 기본 제공되니 별도 설정 불필요.
2. **보안 헤더** — 호스팅이 커스텀 헤더를 지원한다면(Netlify `_headers` 파일 등) 아래 정도를 추가하는 것을 권장합니다:

   ```
   /*
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     X-Frame-Options: DENY
     Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

   `index.html`은 인라인 이벤트 속성 없이 전부 `addEventListener`로 되어 있어 `Content-Security-Policy: script-src 'self'`를 걸어도 정상 동작합니다. 다만 `404.html`은 카운트다운용 인라인 `<script>` 블록을 쓰고 있어서, 엄격한 CSP를 적용하려면 그 스크립트만 `js/`로 분리하거나 nonce/hash를 추가해야 합니다.

## 지원 언어 / 브라우저

- 언어: 한국어, English, 日本語, 中文 (Language Select 화면에서 선택)
- 최신 모바일 Safari / Chrome 기준으로 제작·확인했습니다. PC 브라우저에서는 모바일 화면이 가운데 프레임으로 표시됩니다.
