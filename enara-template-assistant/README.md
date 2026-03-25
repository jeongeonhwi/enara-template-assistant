# E나라도움 우수템플릿 도우미

E나라도움 공모 신청서를 더 빠르게 작성할 수 있도록, 사업 핵심정보를 입력하면 신청서 문안 초안을 자동으로 구성해주는 MVP입니다.

## 1) 기술 스택
- Frontend: React + Vite
- Backend: FastAPI
- 배포 권장: 프론트엔드 정적 배포 + 백엔드 Web Service 배포

## 2) 로컬 실행
### 백엔드
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 프론트엔드
```bash
cd frontend
npm install
# Windows PowerShell
$env:VITE_API_BASE="http://localhost:8000"
npm run dev
```

## 3) 핵심 기능
- 사업 필요성 / 목표 / 추진 내용 / 예산 방향 / 기대효과 자동 초안 생성
- 제출 전 체크리스트 제공
- E나라도움 문항 구조에 맞춘 확장 가능 아키텍처

## 4) 다음 단계 추천
- 문항별 저장/불러오기
- 실제 우수사례 학습 프롬프트 연결
- 사용자 로그인 / 프로젝트별 버전관리
- DOCX 또는 HWP 내보내기
- 평가기준 기반 점수 피드백

## 5) 배포 예시
### 백엔드(Render Web Service)
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 프론트엔드(Render Static Site 또는 Vercel)
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- 환경변수: `VITE_API_BASE=https://여기에-백엔드-주소`

## 6) PyCharm 작업 순서
1. 프로젝트 압축을 풀고 PyCharm에서 폴더 열기
2. `backend`를 Python Interpreter와 연결
3. `frontend`는 터미널에서 `npm install`
4. 백엔드/프론트엔드 동시 실행
5. GitHub 업로드 후 Render/Vercel 연동
