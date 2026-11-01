import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"

type IconName = "arrow" | "assets" | "cash" | "chat" | "company" | "home" | "kpi" | "liabilities" | "logo" | "pie" | "report" | "revenue" | "risk" | "send" | "upload"

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    logo: (
      <>
        <path d="m4.5 11.5 3.1-3.1 2.1 2.1 4.8-5" />
        <path d="M10.8 5.5h3.7v3.7" />
      </>
    ),
    home: (
      <>
        <path d="m3.5 8.2 6.5-5.3 6.5 5.3" />
        <path d="M5.3 7.5v8h9.4v-8" />
      </>
    ),
    company: (
      <>
        <rect x="4.2" y="2.7" width="11.6" height="14.6" rx="1.2" />
        <path d="M7.3 6.1h5.4M7.3 9.3h5.4M7.3 12.5h3.8" />
      </>
    ),
    report: (
      <>
        <path d="M5 2.6h6l4 4v10.8H5z" />
        <path d="M11 2.6v4h4" />
      </>
    ),
    kpi: (
      <>
        <path d="M4 16V9M10 16V3M16 16v-5" />
        <path d="M3 6.5h2M9 9h2M15 7h2" />
      </>
    ),
    chat: (
      <path d="M3.4 9.4a6.2 6.2 0 1 1 3 5.3L3 16l1.2-3.3a6.1 6.1 0 0 1-.8-3.3Z" />
    ),
    risk: (
      <>
        <path d="m10 2.8 7 12.5H3z" />
        <path d="M10 7v4M10 13.5h.01" />
      </>
    ),
    upload: (
      <>
        <path d="M10 13V3.5M6.7 6.8 10 3.5l3.3 3.3" />
        <path d="M4.2 12.5v3.8h11.6v-3.8" />
      </>
    ),
    send: (
      <>
        <path d="M4 10h11M11 6l4 4-4 4" />
      </>
    ),
    arrow: <path d="M5 10h10M11 6l4 4-4 4" />,
    revenue: (
      <>
        <circle cx="10" cy="10" r="6.2" />
        <path d="M12.3 7.4c-.5-.5-1.2-.7-2.1-.7-1.2 0-2 .6-2 1.5 0 2.2 4.1 1.1 4.1 3.5 0 .9-.8 1.6-2.1 1.6-.9 0-1.7-.3-2.3-.8M10.2 5.5v9" />
      </>
    ),
    pie: (
      <>
        <path d="M10 3v7h7a7 7 0 1 1-7-7Z" />
        <path d="M13 3.7A7 7 0 0 1 16.3 7H13Z" />
      </>
    ),
    cash: (
      <>
        <rect x="3" y="5.2" width="14" height="9.6" rx="1.5" />
        <circle cx="10" cy="10" r="2.1" />
        <path d="M5.5 8.1h.01M14.5 11.9h.01" />
      </>
    ),
    assets: (
      <>
        <path d="M3 8.2 10 3l7 5.2" />
        <path d="M4.3 8.2v7.8h11.4V8.2" />
        <path d="M8 16v-5M12 16v-5" />
      </>
    ),
    liabilities: (
      <>
        <path d="M10 3v13.5M6.2 6h7.6" />
        <path d="M4 6l-2 4.6a3 3 0 0 0 6 0Zm12 0-2 4.6a3 3 0 0 0 6 0Z" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.45"
    >
      {paths[name]}
    </svg>
  )
}

const navigation = [
  { name: "Home", icon: "home" },
  { name: "Companies", icon: "company" },
  { name: "Reports", icon: "report" },
  { name: "KPIs", icon: "kpi" },
] as const

const playground = [
  { name: "AI Analyst", icon: "chat" },
  { name: "Risk analysis", icon: "risk" },
] as const

function Sidebar({
  active,
  companyCount,
  reportCount,
  onNavigate,
}: {
  active: string
  companyCount: number
  reportCount: number
  onNavigate: (page: string) => void
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="logo" size={18} />
        </span>
        <span>InvestorAI</span>
      </div>

      <nav aria-label="Primary navigation">
        <div className="nav-list">
          {navigation.map((item) => (
            <button
              className={`nav-item ${active === item.name ? "active" : ""}`}
              key={item.name}
              onClick={() => onNavigate(item.name)}
              type="button"
            >
              <Icon name={item.icon} />
              {item.name}
            </button>
          ))}
        </div>

        <p className="nav-label">Playground</p>
        <div className="nav-list">
          {playground.map((item) => (
            <button
              className={`nav-item ${active === item.name ? "active" : ""}`}
              key={item.name}
              onClick={() => onNavigate(item.name)}
              type="button"
            >
              <Icon name={item.icon} />
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-stats">
        <div>
          <span>Companies</span>
          <strong>{companyCount}</strong>
        </div>
        <div>
          <span>Reports analyzed</span>
          <strong>{reportCount}</strong>
        </div>
      </div>
    </aside>
  )
}

function MetricCard({
  accent,
  children,
  description,
  icon,
  title,
}: {
  accent: string
  children: React.ReactNode
  description: string
  icon: IconName
  title: string
}) {
  return (
    <article className="metric-card">
      <div className="metric-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="metric-icon" style={{ backgroundColor: accent }}>
          <Icon name={icon} size={19} />
        </span>
      </div>
      {children}
    </article>
  )
}

function ValueBar({
  label,
  value,
  width = "100%",
}: {
  label: string
  value: string
  width?: string
}) {
  return (
    <div className="value-row">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="bar-track">
        <span style={{ width }} />
      </div>
    </div>
  )
}

// ---------- Backend data model ----------

type MetricField =
  | "revenue"
  | "net_income"
  | "operating_income"
  | "cash_flow"
  | "total_assets"
  | "total_liabilities"

type MetricRow = {
  company: string
  year: string
  revenue: string | null
  net_income: string | null
  operating_income: string | null
  cash_flow: string | null
  total_assets: string | null
  total_liabilities: string | null
  risk_factors: string | null
  growth_drivers: string | null
}

type CompanyProfile = {
  id: string
  name: string
  years: string[]
  latest: MetricRow
  growthDrivers: string[]
  risks: string[]
}

function parseNumericValue(raw: string | null | undefined): number | null {
  if (!raw) return null
  let cleaned = raw.replace(/[$,\s]/g, "")
  let negative = false
  if (cleaned.startsWith("(") && cleaned.endsWith(")")) {
    negative = true
    cleaned = cleaned.slice(1, -1)
  }
  const num = Number.parseFloat(cleaned)
  if (Number.isNaN(num)) return null
  return negative ? -num : num
}

function splitLines(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function buildCompanies(rows: MetricRow[]): CompanyProfile[] {
  const byCompany = new Map<string, MetricRow[]>()
  for (const row of rows) {
    const list = byCompany.get(row.company) ?? []
    list.push(row)
    byCompany.set(row.company, list)
  }

  return Array.from(byCompany.entries())
    .map(([name, companyRows]) => {
      const sorted = [...companyRows].sort((a, b) => a.year.localeCompare(b.year))
      const latest = sorted[sorted.length - 1]
      return {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || name,
        name,
        years: sorted.map((row) => row.year),
        latest,
        growthDrivers: splitLines(latest.growth_drivers),
        risks: splitLines(latest.risk_factors),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

async function askAnalyst(
  question: string,
  company?: string,
  year?: string,
): Promise<string> {
  const payload: Record<string, unknown> = { question }
  if (company) {
    payload.company = company
    if (year) payload.year = Number.parseInt(year, 10)
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || `Server error (${response.status})`)
  }

  const data = await response.json()
  return data.answer || "No response received."
}

function Analyst({ companies }: { companies: CompanyProfile[] }) {
  const [scope, setScope] = useState("All companies")
  const [question, setQuestion] = useState("")
  const [message, setMessage] = useState(
    "Hello, I'm your AI Financial Analyst. Ask me about revenue trends, risk analysis, growth drivers and more.",
  )
  const [busy, setBusy] = useState(false)

  const ask = async (text: string) => {
    const clean = text.trim()
    if (!clean || busy) return
    setQuestion("")
    setBusy(true)
    setMessage("Thinking...")
    try {
      const company = scope === "All companies" ? undefined : scope
      const year = company
        ? companies.find((item) => item.name === company)?.latest.year
        : undefined
      setMessage(await askAnalyst(clean, company, year))
    } catch (err) {
      setMessage(`Sorry, I ran into an error: ${(err as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    ask(question)
  }

  return (
    <section className="analyst" aria-label="AI Analyst">
      <div className="analyst-topbar">
        <span>AI Analyst</span>
        <div className="company-switcher">
          {["All companies", ...companies.map((company) => company.name)].map(
            (company) => (
              <button
                className={scope === company ? "selected" : ""}
                key={company}
                onClick={() => setScope(company)}
                type="button"
              >
                {company}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="analyst-body">
        <div className="analyst-message">{message}</div>
        <div className="suggestions">
          {["Compare net income", "Top risks", "Growth drivers"].map(
            (suggestion) => (
              <button
                disabled={busy}
                key={suggestion}
                onClick={() => ask(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ),
          )}
        </div>
        <form className="analyst-input" onSubmit={submit}>
          <input
            aria-label="Ask the AI analyst"
            disabled={busy}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about revenue, risks, growth..."
            value={question}
          />
          <button aria-label="Send question" disabled={busy} type="submit">
            <Icon name="send" size={19} />
          </button>
        </form>
      </div>
    </section>
  )
}

function CompanyChat({ company }: { company: CompanyProfile }) {
  const [question, setQuestion] = useState("")
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    {
      role: "bot",
      text: `Ask me anything about ${company.name}’s growth drivers, risk factors, strategy, or ${company.latest.year} report.`,
    },
  ])

  const ask = async (text: string) => {
    const clean = text.trim()
    if (!clean || busy) return
    setMessages((current) => [...current, { role: "user", text: clean }])
    setQuestion("")
    setBusy(true)
    try {
      const answer = await askAnalyst(clean, company.name, company.latest.year)
      setMessages((current) => [...current, { role: "bot", text: answer }])
    } catch (err) {
      setMessages((current) => [
        ...current,
        { role: "bot", text: `Sorry, I ran into an error: ${(err as Error).message}` },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="company-chat">
      <div className="company-chat-heading">
        <span className="metric-icon">
          <Icon name="chat" size={19} />
        </span>
        <div>
          <h2>Ask about {company.name}</h2>
          <p>Answers based on the latest analyzed annual report</p>
        </div>
      </div>
      <div className="company-chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <p className={message.role === "user" ? "question" : ""} key={index}>
            {message.text}
          </p>
        ))}
        {busy && <p>Thinking...</p>}
      </div>
      <div className="company-chat-prompts">
        <button
          disabled={busy}
          onClick={() => ask("What are the top growth drivers?")}
          type="button"
        >
          Top growth drivers
        </button>
        <button
          disabled={busy}
          onClick={() => ask("What are the biggest risks?")}
          type="button"
        >
          Biggest risks
        </button>
      </div>
      <form
        className="company-chat-input"
        onSubmit={(event) => {
          event.preventDefault()
          ask(question)
        }}
      >
        <input
          aria-label={`Ask about ${company.name}`}
          disabled={busy}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={`Ask a question about ${company.name}...`}
          value={question}
        />
        <button aria-label="Send question" disabled={busy} type="submit">
          <Icon name="send" />
        </button>
      </form>
    </section>
  )
}

function CompaniesPage({
  companies,
  onBack,
  onRequestUpload,
  onSelect,
  selected,
}: {
  companies: CompanyProfile[]
  onBack: () => void
  onRequestUpload: () => void
  onSelect: (id: string) => void
  selected: CompanyProfile | null
}) {
  if (selected) {
    return (
      <div className="company-detail">
        <button className="back-button" onClick={onBack} type="button">
          <span className="back-arrow">←</span> All companies
        </button>
        <div className="company-detail-head">
          <span className="company-monogram">{selected.name.slice(0, 1)}</span>
          <div>
            <div className="company-title-line">
              <h1>{selected.name}</h1>
              <span>{selected.latest.year}</span>
            </div>
            <p>
              Annual report analysis · {selected.years.length} year
              {selected.years.length === 1 ? "" : "s"} on file
            </p>
          </div>
        </div>

        <div className="company-insights">
          <section className="insight-card growth">
            <div className="insight-heading">
              <span>
                <Icon name="kpi" />
              </span>
              <div>
                <p>Company analysis</p>
                <h2>Top Growth Drivers</h2>
              </div>
            </div>
            <div className="insight-list">
              {selected.growthDrivers.length > 0 ? (
                selected.growthDrivers.map((driver, index) => (
                  <article key={driver}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{driver}</p>
                  </article>
                ))
              ) : (
                <p className="empty-metric">No growth drivers parsed for this report.</p>
              )}
            </div>
          </section>

          <section className="insight-card risks">
            <div className="insight-heading">
              <span>
                <Icon name="risk" />
              </span>
              <div>
                <p>Company analysis</p>
                <h2>Top Risk Factors</h2>
              </div>
            </div>
            <div className="insight-list">
              {selected.risks.length > 0 ? (
                selected.risks.map((risk, index) => (
                  <article key={risk}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{risk}</p>
                  </article>
                ))
              ) : (
                <p className="empty-metric">No high-risk factors identified for this period.</p>
              )}
            </div>
          </section>
        </div>
        <CompanyChat company={selected} key={selected.id} />
      </div>
    )
  }

  return (
    <div className="companies-page">
      <div className="companies-intro">
        <div>
          <h2>Select a company</h2>
          <p>
            Open a company to review its top growth drivers, risk factors, and
            report-based AI analysis.
          </p>
        </div>
        <button
          className="primary-button add-company-button"
          onClick={onRequestUpload}
          type="button"
        >
          Ingest report
        </button>
      </div>

      {companies.length === 0 ? (
        <p className="empty-metric">
          No companies yet — ingest a PDF annual report to get started.
        </p>
      ) : (
        <div className="company-grid">
          {companies.map((company) => (
            <button
              className="company-card"
              key={company.id}
              onClick={() => onSelect(company.id)}
              type="button"
            >
              <div className="company-card-top">
                <span className="company-monogram">
                  {company.name.slice(0, 1)}
                </span>
                <span className="company-arrow">
                  <Icon name="arrow" />
                </span>
              </div>
              <h3>{company.name}</h3>
              <p>
                {company.years.length} report
                {company.years.length === 1 ? "" : "s"} analyzed
              </p>
              <div className="company-card-meta">
                <span>Latest: {company.latest.year}</span>
                <span>{company.growthDrivers.length} growth drivers</span>
                <span>{company.risks.length} risks</span>
              </div>
            </button>
          ))}
          <button
            className="company-card company-card-new"
            onClick={onRequestUpload}
            type="button"
          >
            <span>+</span>
            <h3>Add another company</h3>
            <p>Ingest a new annual report</p>
          </button>
        </div>
      )}
    </div>
  )
}

function MetricValues({
  companies,
  field,
  emptyLabel,
}: {
  companies: CompanyProfile[]
  field: MetricField
  emptyLabel: string
}) {
  const entries = companies
    .map((company) => ({
      company,
      raw: company.latest[field],
      value: parseNumericValue(company.latest[field]),
    }))
    .filter(
      (entry): entry is { company: CompanyProfile; raw: string; value: number } =>
        entry.raw != null && entry.value != null,
    )

  if (entries.length === 0) {
    return <p className="empty-metric">No {emptyLabel} reported yet.</p>
  }

  const max = Math.max(...entries.map((entry) => Math.abs(entry.value)), 1)

  return (
    <>
      {entries.map((entry) => (
        <ValueBar
          key={entry.company.id}
          label={`${entry.company.name} (${entry.company.latest.year})`}
          value={entry.raw}
          width={`${Math.max(4, Math.min(100, (Math.abs(entry.value) / max) * 100))}%`}
        />
      ))}
    </>
  )
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

export default function App() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [metrics, setMetrics] = useState<MetricRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [activePage, setActivePage] = useState("Home")
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  const companies = buildCompanies(metrics)
  const selectedCompany =
    companies.find((company) => company.id === selectedCompanyId) ?? null

  const loadMetrics = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const response = await fetch("/api/metrics")
      if (!response.ok) throw new Error(`Server error (${response.status})`)
      const data = (await response.json()) as MetricRow[]
      setMetrics(data)
    } catch (err) {
      setLoadError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  const openFilePicker = () => fileInput.current?.click()

  const uploadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadMessage("Please select a PDF financial report.")
      return
    }

    setUploading(true)
    setUploadMessage(`Uploading ${file.name}...`)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message || data.detail || `Server error (${response.status})`)
      }
      setUploadMessage(
        data.metrics_saved
          ? `Ingested ${file.name} and extracted metrics.`
          : `Ingested ${file.name}, but metric extraction failed${
              data.metrics_error ? `: ${data.metrics_error}` : "."
            }`,
      )
      await loadMetrics()
    } catch (err) {
      setUploadMessage(`Upload failed: ${(err as Error).message}`)
    } finally {
      setUploading(false)
    }
  }

  const exportMetrics = () => {
    const header = [
      "Company",
      "Year",
      "Revenue",
      "Net income",
      "Operating income",
      "Operating cash flow",
      "Total assets",
      "Total liabilities",
    ]
    const lines = [header.map(csvEscape).join(",")]
    for (const row of metrics) {
      lines.push(
        [
          row.company,
          row.year,
          row.revenue,
          row.net_income,
          row.operating_income,
          row.cash_flow,
          row.total_assets,
          row.total_liabilities,
        ]
          .map((value) => csvEscape(value ?? ""))
          .join(","),
      )
    }

    const link = document.createElement("a")
    link.href = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/csv" }),
    )
    link.download = "investor-intelligence-metrics.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={activePage}
        companyCount={companies.length}
        reportCount={metrics.length}
        onNavigate={(page) => {
          setActivePage(page)
          if (page !== "Companies") setSelectedCompanyId(null)
        }}
      />
      <main className="dashboard">
        {!selectedCompany && (
          <header className="page-header">
            <div>
              <h1>
                {activePage === "Companies"
                  ? "Companies"
                  : "Investor Intelligence"}
              </h1>
              <p>
                {activePage === "Companies"
                  ? "Company-level growth drivers, risk factors, and AI-powered report analysis."
                  : "Real-time corporate insights and KPI extraction from annual reports."}
              </p>
            </div>
            {activePage === "Home" && (
              <div className="header-actions">
                <button
                  className="primary-button"
                  disabled={uploading}
                  onClick={openFilePicker}
                  type="button"
                >
                  {uploading ? "Ingesting..." : "Ingest report"}
                </button>
                <button
                  className="secondary-button"
                  disabled={metrics.length === 0}
                  onClick={exportMetrics}
                  type="button"
                >
                  Export
                </button>
              </div>
            )}
          </header>
        )}

        <input
          accept=".pdf"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) uploadFile(file)
            event.target.value = ""
          }}
          ref={fileInput}
          type="file"
        />

        {activePage === "Companies" ? (
          <CompaniesPage
            companies={companies}
            onBack={() => setSelectedCompanyId(null)}
            onRequestUpload={openFilePicker}
            onSelect={setSelectedCompanyId}
            selected={selectedCompany}
          />
        ) : (
          <>
            {uploadMessage && <p className="empty-metric">{uploadMessage}</p>}
            {loadError && (
              <p className="empty-metric">Could not load metrics: {loadError}</p>
            )}

            <section className="hero-card">
              <div className="upload-panel">
                <div className="company-tags">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        setActivePage("Companies")
                        setSelectedCompanyId(company.id)
                      }}
                      type="button"
                    >
                      {company.name} {company.latest.year}
                    </button>
                  ))}
                  <button onClick={() => setActivePage("Companies")} type="button">
                    {companies.length === 0 ? "View companies" : "Add company"}
                  </button>
                </div>
                <h2>
                  Drop in an annual report. Get
                  <br className="desktop-break" /> the numbers.
                </h2>
                <p>
                  Upload a PDF and the platform extracts revenue, income and
                  cash flow, then lets you ask questions about it.
                </p>
                <button
                  className="browse-button"
                  disabled={uploading}
                  onClick={openFilePicker}
                  type="button"
                >
                  <Icon name="upload" size={17} />
                  {uploading ? "Uploading..." : "Browse PDF"}
                </button>
                <div className="steps" aria-label="Report processing steps">
                  {[
                    ["1", "Upload"],
                    ["2", "Extract"],
                    ["3", "Review"],
                    ["4", "Ask"],
                  ].map(([number, label], index) => (
                    <div key={number}>
                      <span className={`step-number step-${index + 1}`}>
                        {number}
                      </span>
                      <small>{label}</small>
                    </div>
                  ))}
                </div>
              </div>
              <Analyst companies={companies} />
            </section>

            <section className="metrics-section">
              <h2>Key metrics</h2>
              {loading ? (
                <p className="empty-metric">Loading metrics...</p>
              ) : (
                <div className="metrics-grid">
                  <MetricCard
                    accent="#e1eff7"
                    description="Total company revenue"
                    icon="revenue"
                    title="Revenue"
                  >
                    <MetricValues
                      companies={companies}
                      emptyLabel="revenue"
                      field="revenue"
                    />
                  </MetricCard>
                  <MetricCard
                    accent="#e4efdc"
                    description="Net profitability after expenses"
                    icon="kpi"
                    title="Net income"
                  >
                    <MetricValues
                      companies={companies}
                      emptyLabel="net income"
                      field="net_income"
                    />
                  </MetricCard>
                  <MetricCard
                    accent="#fbe9cf"
                    description="Earnings from operations"
                    icon="pie"
                    title="Operating income"
                  >
                    <MetricValues
                      companies={companies}
                      emptyLabel="operating income"
                      field="operating_income"
                    />
                  </MetricCard>
                  <MetricCard
                    accent="#e8e2fa"
                    description="Cash flow from operations"
                    icon="cash"
                    title="Operating cash flow"
                  >
                    <MetricValues
                      companies={companies}
                      emptyLabel="operating cash flow"
                      field="cash_flow"
                    />
                  </MetricCard>
                  <MetricCard
                    accent="#e1eff7"
                    description="Total economic resources"
                    icon="assets"
                    title="Total assets"
                  >
                    <MetricValues
                      companies={companies}
                      emptyLabel="total assets"
                      field="total_assets"
                    />
                  </MetricCard>
                  <MetricCard
                    accent="#fbe9cf"
                    description="Total outstanding obligations"
                    icon="liabilities"
                    title="Total liabilities"
                  >
                    <MetricValues
                      companies={companies}
                      emptyLabel="total liabilities"
                      field="total_liabilities"
                    />
                  </MetricCard>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
