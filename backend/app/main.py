from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

app = FastAPI(
    title="E나라도움 우수템플릿 도우미 API",
    version="0.1.0",
    description="공모 신청서 초안 생성 및 점검용 백엔드"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DraftRequest(BaseModel):
    organization: str = Field(..., description="수행기관명")
    project_name: str
    target: str
    problem: str
    goal: str
    execution_plan: str
    expected_effect: str
    budget: str
    keywords: List[str] = []

class DraftResponse(BaseModel):
    summary: str
    sections: dict
    checklist: List[str]


def bulletize(text: str) -> List[str]:
    lines = [line.strip(" -•\t") for line in text.splitlines() if line.strip()]
    return lines if lines else [text.strip()]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate-template", response_model=DraftResponse)
def generate_template(payload: DraftRequest):
    keywords = ", ".join(payload.keywords) if payload.keywords else "지역사회, 성과관리, 지속가능성"
    project_summary = (
        f"{payload.organization}은(는) '{payload.project_name}' 사업을 통해 {payload.target}을(를) 대상으로 "
        f"{payload.problem} 문제를 해결하고, {payload.goal}를 달성하고자 합니다. "
        f"핵심 실행전략은 {payload.execution_plan}이며, 기대효과는 {payload.expected_effect}입니다."
    )

    sections = {
        "1. 사업 필요성": (
            f"- 현재 문제상황: {payload.problem}\n"
            f"- 정책적 필요성: 본 사업은 대상자 수요와 현장 문제를 기반으로 설계되었으며, 공공재정 투입의 타당성을 확보합니다.\n"
            f"- 차별성: 키워드({keywords})를 중심으로 기존 사업 대비 실행력과 측정 가능성을 강화합니다."
        ),
        "2. 사업 목표": (
            f"- 최종목표: {payload.goal}\n"
            f"- 세부목표 1: 대상자의 참여 접근성 향상\n"
            f"- 세부목표 2: 정량·정성 성과지표 기반 운영체계 구축\n"
            f"- 세부목표 3: 사업 종료 후 확산 가능한 모델 확보"
        ),
        "3. 추진 내용 및 방법": (
            f"- 추진전략: {payload.execution_plan}\n"
            f"- 운영방식: 월별 실행계획, 담당자 지정, 결과점검 회의를 통한 관리\n"
            f"- 협력체계: 지자체·유관기관·민간협력기관 연계\n"
            f"- 홍보 및 모집: 온라인/오프라인 병행"
        ),
        "4. 예산 편성 방향": (
            f"- 예산 개요: {payload.budget}\n"
            f"- 편성 원칙: 사업목표 직접 기여, 집행 가능성, 증빙 명확성, 성과 연계성\n"
            f"- 유의사항: 과다 산정 항목, 목적 외 사용 가능성, 증빙 취약 항목 사전 점검"
        ),
        "5. 기대효과 및 성과관리": (
            f"- 기대효과: {payload.expected_effect}\n"
            f"- 정량지표 예시: 참여자 수, 재참여율, 만족도, 연계기관 수\n"
            f"- 정성지표 예시: 우수사례 발굴, 현장 적용성, 제도 개선 기여도\n"
            f"- 사후관리: 결과보고서 및 차년도 개선안 도출"
        )
    }

    checklist = [
        "공모 목적과 사업 필요성이 첫 문단에서 바로 연결되는지 확인",
        "사업 목표가 정량지표와 연결되는지 확인",
        "예산 항목이 실행계획과 1:1로 대응되는지 확인",
        "기대효과가 단순 활동 나열이 아닌 변화 중심으로 작성되었는지 확인",
        "E나라도움 제출 전 증빙·첨부파일 명칭을 일관되게 정리"
    ]

    return DraftResponse(summary=project_summary, sections=sections, checklist=checklist)
