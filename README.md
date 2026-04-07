# PetMediScan Frontend

반려동물 안구/피부질환 진단 모바일 애플리케이션

## 기술 스택

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Styling**: TailwindCSS (Nativewind)
- **State Management**: React Context / Redux (선택)
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Platform**: iOS + Android

## 주요 기능

### 1. 사용자 인증
- 회원가입 / 로그인
- JWT 토큰 기반 인증
- 비밀번호 찾기

### 2. 반려동물 관리
- 반려동물 프로필 등록
  - 이름, 나이, 종 (강아지/고양이)
  - 품종, 생년월일
- 반려동물 목록 조회
- 프로필 수정/삭제

### 3. 진단 기능
- 카메라 촬영 (안구/피부)
- 갤러리에서 이미지 선택
- AI 진단 요청
- 실시간 진단 결과 표시
  - 질환명
  - 신뢰도 (Confidence Score)
  - 질환 설명
  - 대처 방법

### 4. 진단 이력
- 반려동물별 진단 이력 조회
- 날짜별 필터링
- 진단 결과 상세 보기

## 프로젝트 구조

```
pet-frontend/
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── common/       # 버튼, 입력, 카드 등
│   │   └── diagnosis/    # 진단 관련 컴포넌트
│   ├── screens/          # 화면 컴포넌트
│   │   ├── auth/         # 로그인, 회원가입
│   │   ├── pets/         # 반려동물 관리
│   │   ├── diagnosis/    # 진단 화면
│   │   └── history/      # 진단 이력
│   ├── navigation/       # 네비게이션 설정
│   ├── services/         # API 통신
│   ├── contexts/         # Context API
│   ├── utils/            # 유틸리티 함수
│   └── types/            # TypeScript 타입 정의
├── assets/               # 이미지, 폰트
├── App.tsx
└── package.json
```

## API 엔드포인트

### Authentication
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### Pets
- `GET /api/pets` - 반려동물 목록
- `POST /api/pets` - 반려동물 등록
- `PUT /api/pets/:id` - 반려동물 수정
- `DELETE /api/pets/:id` - 반려동물 삭제

### Diagnosis
- `POST /api/diagnosis/eye` - 안구 진단
- `POST /api/diagnosis/skin` - 피부 진단
- `GET /api/diagnosis/history/:petId` - 진단 이력

## 개발 환경 설정

### 1. 사전 요구사항
- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (Android 개발)
- Xcode (iOS 개발, macOS만)

### 2. 설치

```bash
# 의존성 설치
npm install

# Expo 시작
npm start

# iOS 실행
npm run ios

# Android 실행
npm run android
```

### 3. 환경 변수

`.env` 파일 생성:
```env
API_BASE_URL=http://localhost:8080/api
```

## Git Workflow

### Branch 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/mobile-기능명`: 기능 개발

### Commit Convention
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경 (포맷팅)
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 변경
```

### 예시
```bash
git checkout -b feature/mobile-login
# 작업 후
git add .
git commit -m "feat: 로그인 화면 구현"
git push origin feature/mobile-login
# GitHub에서 Pull Request 생성
```

## 팀 구성원

- Mobile 개발자 1: UI/UX 구현
- Mobile 개발자 2: API 통합, 상태 관리

## 참고 자료

- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 공식 문서](https://docs.expo.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Nativewind 문서](https://www.nativewind.dev/)
