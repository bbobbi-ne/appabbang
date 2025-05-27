
이 문서는 모노레포에서 사용하는 `tsconfig.base.json`, `vite.base.json`, `internal-package.json` 설정 파일들의 각 옵션에 대한 설명을 제공합니다.

---

## 🔧 tsconfig.base.json

> 전체 프로젝트 공통 설정

```json
{
  "compilerOptions": {
    "esModuleInterop": true,         // CommonJS 모듈을 ESModule처럼 import 가능하게 함
    "skipLibCheck": true,            // node_modules 타입 검사 생략하여 속도 향상
    "target": "ES2022",             // 컴파일 결과의 JS 타겟 버전
    "lib": ["ES2022"],              // 사용할 내장 라이브러리 정의
    "allowJs": true,                 // JS 파일도 컴파일 대상 포함
    "resolveJsonModule": true,       // JSON 파일을 import 가능하게 함
    "moduleDetection": "force",     // import/export 기준으로 모듈 여부 판단
    "verbatimModuleSyntax": true,   // import 시 확장자 유지
    "isolatedModules": true,        // 각 파일을 개별 모듈로 취급

    "incremental": true,             // 증분 빌드 활성화
    "disableSourceOfProjectReferenceRedirect": true, // 참조된 프로젝트 소스 직접 읽지 않음
    "tsBuildInfoFile": "${configDir}/.cache/tsbuildinfo.json", // 증분 빌드 캐시 위치

    "strict": true,                  // 모든 strict 모드 활성화
    "noUncheckedIndexedAccess": true, // 인덱스 접근 시 undefined 포함 여부 검사
    "checkJs": true,                 // JS 파일도 타입 검사

    "module": "es2022",             // 출력 모듈 시스템
    "moduleResolution": "bundler", // Vite/Webpack 등 번들러 기준으로 모듈 해석
    "noEmit": true                   // TSC가 파일을 출력하지 않음 (ts만 타입 검사용)
  },
  "exclude": ["node_modules", "build", "dist"]
}
```

---

## 🧱 internal-package.json

> 내부 패키지(예: `packages/ui`, `packages/utils` 등)를 위한 설정

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "composite": true,               // 프로젝트 참조를 위해 필요
    "declaration": true,            // .d.ts 타입 선언 파일 생성
    "declarationMap": true,         // declaration 파일에 소스 맵 포함
    "sourceMap": true,              // JS에 대한 .map 파일 생성
    "emitDeclarationOnly": true,    // 선언 파일만 생성하고 JS는 생략
    "noEmit": false,                // emit 수행 허용
    "outDir": "${configDir}/dist"   // 출력 디렉토리 설정
  }
}
```

---

## ⚡ vite.base.json

> Vite 기반 프론트엔드 앱(ts + react)을 위한 설정

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "allowImportingTsExtensions": true, // .ts 확장자 import 허용
    "declaration": true,                // 타입 선언 파일 생성
    "declarationMap": true,             // 선언 소스맵 포함
    "inlineSources": false,             // 소스 내용을 declaration에 인라인하지 않음
    "jsx": "react-jsx",                // JSX 변환 방식 설정 (React 17+)
    "module": "ESNext",                // 최신 모듈 시스템
    "moduleResolution": "bundler",     // Vite 등 번들러 기준 모듈 해석
    "noFallthroughCasesInSwitch": true, // switch 문에서 fallthrough 방지
    "noUnusedLocals": true,             // 사용하지 않는 지역 변수 오류
    "noUnusedParameters": true,         // 사용하지 않는 매개변수 오류
    "preserveWatchOutput": true         // watch 모드 출력 유지
  },
  "exclude": ["node_modules"]
}
```