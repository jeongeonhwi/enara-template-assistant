import { useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const initialForm = {
  organization: 'OO사회적협동조합',
  project_name: '취약계층 디지털 역량 강화 사업',
  target: '취약계층 청년 및 중장년 120명',
  problem: '디지털 행정 서비스 이용률은 높아졌지만 정보격차로 인해 실제 접근성이 낮음',
  goal: '디지털 활용 역량 향상과 공공서비스 접근성 개선',
  execution_plan: '기초 교육-심화 교육-현장 실습-사후 멘토링의 4단계 운영',
  expected_effect: '참여자의 서비스 이용률 향상, 재참여 의지 확대, 지역 협력체계 구축',
  budget: '강사비, 운영비, 홍보비, 교재비, 성과확산비로 편성',
  keywords: '디지털격차, 역량강화, 지역연계'
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const keywordArray = useMemo(
    () => form.keywords.split(',').map(v => v.trim()).filter(Boolean),
    [form.keywords]
  )

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/api/generate-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, keywords: keywordArray })
      })
      if (!response.ok) throw new Error('초안 생성에 실패했습니다.')
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Gov Grant Writing Assistant</p>
          <h1>E나라도움 우수템플릿 도우미</h1>
          <p className="hero-copy">
            공모 신청서 핵심 정보만 넣으면 사업 필요성, 목표, 추진내용, 예산 방향, 성과관리 문안을 빠르게 초안화합니다.
          </p>
        </div>
        <div className="hero-card">
          <div className="metric"><strong>5개</strong><span>자동 생성 섹션</span></div>
          <div className="metric"><strong>1분</strong><span>초안 작성 시간</span></div>
          <div className="metric"><strong>체크리스트</strong><span>제출 전 검토 지원</span></div>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>사업 정보 입력</h2>
          <form onSubmit={onSubmit} className="form-grid">
            {[
              ['organization', '기관명'],
              ['project_name', '사업명'],
              ['target', '대상자'],
              ['goal', '핵심 목표'],
              ['keywords', '키워드(쉼표 구분)']
            ].map(([name, label]) => (
              <label key={name} className="field">
                <span>{label}</span>
                <input name={name} value={form[name]} onChange={onChange} />
              </label>
            ))}

            {[
              ['problem', '문제 정의'],
              ['execution_plan', '추진 계획'],
              ['expected_effect', '기대 효과'],
              ['budget', '예산 개요']
            ].map(([name, label]) => (
              <label key={name} className="field field-full">
                <span>{label}</span>
                <textarea name={name} value={form[name]} onChange={onChange} rows="4" />
              </label>
            ))}

            <button className="primary" disabled={loading}>
              {loading ? '생성 중...' : '우수템플릿 초안 만들기'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel result-panel">
          <h2>생성 결과</h2>
          {!result ? (
            <div className="empty">왼쪽 정보를 입력하고 초안을 생성해보세요.</div>
          ) : (
            <>
              <div className="summary-box">
                <h3>한 줄 요약</h3>
                <p>{result.summary}</p>
              </div>

              {Object.entries(result.sections).map(([title, content]) => (
                <article key={title} className="draft-section">
                  <h3>{title}</h3>
                  <pre>{content}</pre>
                </article>
              ))}

              <article className="draft-section">
                <h3>제출 전 체크리스트</h3>
                <ul>
                  {result.checklist.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
