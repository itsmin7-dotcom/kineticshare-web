# KineticShare Agent Working Guidelines

본 문서는 KineticShare-Web 프로젝트에서 에이전트가 코드를 작성하거나 수정할 때 반드시 준수해야 하는 최상위 작업 규약(Rules)을 정의합니다. 향후 모든 코드 작성 및 의사 결정의 기준점이 됩니다.

## 1. UI/UX 테마 강제 (Design System)
모든 컴포넌트와 화면은 다음의 시각적 원칙을 엄격히 준수해야 합니다.
- **Tailwind CSS 기반 글래스모피즘(Glassmorphism):** 배경 투명도 혼합(`bg-white/10`, `bg-black/40`), 블러 효과(`backdrop-blur-md`, `blur-3xl`), 빛나는 테두리(`border-white/10`, `border-primary/30`) 등의 속성을 조합하여 세련된 애플 스타일의 미니멀리즘과 사이버틱함을 동시에 연출합니다.
- **벤토 그리드(Bento Grid) 레이아웃:** 복잡한 정보와 뷰는 `grid`와 `col-span`을 활용하여 모서리가 둥근 벤토 박스(카드) 형태로 깔끔하게 분할하고 모듈화합니다.

## 2. 라우팅 및 상태 관리 (Routing & State)
- **화면 전환 렌더링:** `react-router-dom` 등 외부 라이브러리에 의존하지 않고, 오직 `App.jsx`의 `currentView` 상태(`'dashboard' | 'developer' | 'bounty' | 'assetDetail'`) 및 `userRole` 상태(`'provider' | 'buyer' | 'validator'`)를 기반으로 조건부 컴포넌트 렌더링을 수행합니다.
- **글로벌 모달 처리 (React Portal):** 모달 폼이나 오버레이 창을 띄울 때는 벤토 그리드나 부모 컴포넌트의 오버플로우(overflow) 속성에 갇히지 않도록, 반드시 `react-dom`의 `createPortal`을 사용하여 문서 최상단(`document.body`)에 렌더링해야 합니다.

## 3. 코드 안전성 및 보존 (Safety & Stability)
- **보존 최우선:** 정상적으로 작동하고 있는 기존의 코드, 상태 로직, 컴포넌트, 주석 등을 임의로 축소하거나 삭제하지 않습니다.
- **사전 검증:** 신규 기능이나 뷰를 추가할 경우, 이것이 기존의 복잡한 상태(State) 생명주기 및 렌더링 로직(예: Hooks 룰, Early Return)과 충돌을 일으키지 않는지 머릿속으로 시뮬레이션하고 최우선으로 검증해야 합니다.
