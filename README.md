
1. 루트에서 pnpm install 
2. pnpm -F admin dev







//////////////////////////////////////////////////////////////////


지금은 react-core를 앱이 아니라 공통 모듈 + 템플릿 제공 라이브러리로 보는 게 맞아요.

목표:
react-core는:

공통으로 쓸 React 설정, 라이브러리 버전, UI 구성 요소, 훅, 유틸 등을 포함하고

필요하다면 CLI처럼 generator로 템플릿을 생성하는 도구 역할도 한다

앱을 직접 실행하지는 않는다 (즉, src/main.tsx 같은 엔트리 파일 불필요)

실무에서 권장하는 방식은?
빌드 도구(예: Vite, ESLint, Prettier, Tailwind 플러그인 등)는 devDependencies에 넣는 게 정석!

라이브러리(React, ReactDOM 등)나 런타임에 꼭 필요한 건 dependencies 또는 peerDependencies에 넣는다.
템플릿 패키지라도, devDependencies는 버전 통제, 테스트, 샘플 실행, 일관된 개발 환경 유지 등 실무적으로 꼭 필요한 경우가 많아.

✨ 이 패키지는 어떤 역할?
모든 프로젝트에서 @appabbang/react-core만 devDependencies로 설치

각 프로젝트가 정해진 버전으로 일관되게 개발되도록 함

코드 없음. 말 그대로 버전 컨트롤 메타 패키지

2.  별도 패키지에 버전 정보만 따로 유지
    예: @appabbang/react-deps 라는 dummy 패키지를 만들어

내부엔 아무것도 없고, dependency만 있음

pnpm add @appabbang/react-core --workspace

==========

pnpm add "@appabbang/react-core@workspace:\*" --filter @appabbang/admin
pnpm -F @appabbang/admin dev

==========
우리가 원하는 것:
모든 의존성(런타임 + 개발 도구)을 react-core에서 통합 관리
각 프로젝트는 react-core만 의존성으로 추가하면 모든 도구 사용 가능
개발 도구는 여전히 devDependencies로 관리되어야 함
현재 문제:
react-core를 dependencies로 설치해도 devDependencies의 실행 파일(.bin)은 사용할 수 없음
각 프로젝트에 개발 도구를 직접 추가하면 통합 관리가 깨짐
