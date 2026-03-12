import { useState, useEffect, useRef } from "react";

const API_BASE_URL = "http://localhost:8080";

const Logo = ({ size = 32, color = "#6366f1" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30 25V75C30 77.7614 32.2386 80 35 80H55C68.8071 80 80 68.8071 80 55V45C80 31.1929 68.8071 20 55 20H35C32.2386 20 30 22.2386 30 25Z"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M30 45L45 55L30 65"
      stroke="#6366f1"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="55" cy="50" r="8" fill="#6366f1" />
  </svg>
);

const tones = [
  { label: "Professional", value: "professional", desc: "Formal & Polished" },
  { label: "Casual", value: "casual", desc: "Relaxed & Direct" },
  { label: "Friendly", value: "friendly", desc: "Warm & Helpful" },
  { label: "Assertive", value: "assertive", desc: "Clear & Concise" },
];

export default function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const spinRef = useRef(null);

  useEffect(() => {
    if (loading) {
      spinRef.current = setInterval(() => {
        setSpinDeg((d) => d + 6);
      }, 16);
    } else {
      clearInterval(spinRef.current);
    }
    return () => clearInterval(spinRef.current);
  }, [loading]);

  const generateEmailReply = async () => {
    if (!emailContent.trim()) {
      setError("Please paste an email to generate a reply.");
      return;
    }
    setLoading(true);
    setError("");
    setGeneratedReply("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, tone }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.text();
      if (data) setGeneratedReply(data);
      else throw new Error("No response received from the server.");
    } catch (err) {
      setError(
        `Unable to generate reply. Please ensure the backend is running at ${API_BASE_URL}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = generatedReply;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
    document.body.removeChild(ta);
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f7f4; }
        ::selection { background: #e0e7ff; }
        textarea:focus { outline: none; }
        button:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .fade-in { animation: fadeIn 0.35s ease forwards; }
        .loader { animation: spin 0.8s linear infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.navBrand}>
            <Logo size={28} color="#1e1b4b" />
            <span style={styles.navLogo}>DraftAI</span>
          </div>
          <button style={styles.navLink} onClick={() => setShowDocs(true)}>
            Documentation
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={styles.main}>
        {/* HERO */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>React + Spring Boot</div>
          <h1 style={styles.heroTitle}>
            Professional communication,{" "}
            <span style={styles.heroAccent}>reimagined.</span>
          </h1>
          <p style={styles.heroSub}>
            Turn complex email threads into clear, well-structured replies in seconds. DraftAI analyzes
            the context of your conversation, understands intent, and generates a response that matches your preferred tone — whether professional, friendly, casual, or assertive.
          </p>
          <br />
          <p className={styles.heroSub}>
            Simply paste your email thread, choose the tone that fits your communication style,
            and let AI craft a polished reply that saves time while maintaining clarity and
            professionalism in every message.
          </p>
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {/* INPUT */}
          <section style={styles.inputSection}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderLeft}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span style={styles.cardHeaderLabel}>Context Thread</span>
                </div>
                <button
                  style={styles.clearBtn}
                  onClick={() => { setEmailContent(""); setGeneratedReply(""); setError(""); }}
                >
                  Clear Thread
                </button>
              </div>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste the email thread here..."
                style={styles.textarea}
              />
            </div>

            {/* TONES */}
            <div style={styles.toneSection}>
              <h3 style={styles.toneTitle}>Response Tone</h3>
              <div style={styles.toneGrid}>
                {tones.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    style={{
                      ...styles.toneBtn,
                      ...(tone === t.value ? styles.toneBtnActive : {}),
                    }}
                  >
                    <span style={{
                      ...styles.toneBtnLabel,
                      color: tone === t.value ? "#4338ca" : "#1e293b",
                    }}>{t.label}</span>
                    <span style={styles.toneBtnDesc}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* GENERATE */}
            <button
              onClick={generateEmailReply}
              disabled={loading || !emailContent.trim()}
              style={{
                ...styles.generateBtn,
                ...(loading || !emailContent.trim() ? styles.generateBtnDisabled : styles.generateBtnActive),
              }}
            >
              {loading ? (
                <>
                  <svg className="loader" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Synthesizing...
                </>
              ) : (
                <>
                  Generate Reply
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
                  </svg>
                </>
              )}
            </button>
          </section>

          {/* OUTPUT */}
          <aside style={styles.outputSection}>
            <div style={{ ...styles.card, ...styles.outputCard }}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderLeft}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span style={styles.cardHeaderLabel}>AI Draft</span>
                </div>
                {generatedReply && (
                  <button onClick={handleCopy} style={styles.copyBtn}>
                    {copied ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              <div style={styles.outputBody}>
                {loading ? (
                  <div style={styles.outputState}>
                    <div style={styles.spinner} className="loader" />
                    <p style={styles.outputStateText}>Processing Thread...</p>
                  </div>
                ) : generatedReply ? (
                  <div className="fade-in" style={styles.replyText}>
                    {generatedReply}
                  </div>
                ) : (
                  <div style={styles.outputState}>
                    <div style={styles.emptyIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" />
                      </svg>
                    </div>
                    <h4 style={styles.emptyTitle}>Awaiting Analysis</h4>
                    <p style={styles.emptyText}>
                      Drafts will appear here after you input context and select a tone profile.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div style={styles.errorBox}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <Logo size={20} color="#94a3b8" />
            <span style={styles.footerLogo}>DraftAI</span>
          </div>
          <p style={styles.footerCopy}>© 2026 DARSH TANK · BUILT FOR EFFICIENCY</p>
        </div>
      </footer>

      {/* DOCS MODAL */}
      {showDocs && (
        <div style={styles.modalOverlay} onClick={() => setShowDocs(false)}>
          <div className="fade-in" style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={styles.modalHeaderLeft}>
                <div style={styles.modalIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <h2 style={styles.modalTitle}>System Architecture</h2>
                  <p style={styles.modalSubtitle}>DRAFTAI ENGINEERING OVERVIEW</p>
                </div>
              </div>
              <button style={styles.modalClose} onClick={() => setShowDocs(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              <section style={styles.docSection}>
                <div style={styles.docSectionHeader}>
                  <div style={styles.docAccent} />
                  <h3 style={styles.docSectionTitle}>Platform Ecosystem</h3>
                </div>
                <p style={styles.docText}>
                  DraftAI is a cohesive ecosystem built to eliminate the cognitive load of professional drafting.
                  The architecture is decoupled into three specialized layers that work in harmony:
                </p>
                <div style={styles.docCardGrid}>
                  {[
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                      title: "Frontend Interface",
                      desc: "A React 19 SPA optimized for speed. Leveraging Framer Motion for high-fidelity UI and Tailwind CSS for rapid styling.",
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>,
                      title: "Spring Boot Core",
                      desc: "The Java intelligence layer. Manages API security, prompt templates, and non-blocking I/O via Spring WebFlux.",
                    },
                    {
                      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
                      title: "Browser Sync",
                      desc: "A Chrome extension bridge that injects DraftAI capabilities directly into native email providers like Gmail.",
                    },
                  ].map((item) => (
                    <div key={item.title} style={styles.docCard}>
                      <div style={styles.docCardIcon}>{item.icon}</div>
                      <h4 style={styles.docCardTitle}>{item.title}</h4>
                      <p style={styles.docCardDesc}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section style={styles.pipelineSection}>
                <h3 style={styles.pipelineTitle}>The AI Pipeline</h3>
                <div style={styles.pipelineSteps}>
                  {[
                    { n: "1", label: "Context Extraction", desc: "The system parses email threads to identify intent, urgency, and key facts." },
                    { n: "2", label: "Persona Mapping", desc: "Applies linguistic constraints based on selected tones (Professional, Friendly, etc.)." },
                    { n: "3", label: "Neural Synthesis", desc: "Utilizes Gemini 2.0 Flash for multi-stage reasoning and natural language generation." },
                  ].map((step) => (
                    <div key={step.n} style={styles.pipelineStep}>
                      <div style={styles.pipelineNum}>{step.n}</div>
                      <div>
                        <p style={styles.pipelineStepLabel}>{step.label}</p>
                        <p style={styles.pipelineStepDesc}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div style={styles.docMeta}>
                <div>
                  <h4 style={styles.docMetaTitle}>Security Framework</h4>
                  <p style={styles.docText}>All communications are encrypted using TLS 1.3. API keys are managed via secure environment variables, ensuring zero exposure in client-side bundles.</p>
                  <div style={styles.docMetaList}>
                    {["End-to-End Encryption", "Stateless Architecture"].map((item) => (
                      <div key={item} style={styles.docMetaItem}>
                        <div style={styles.docMetaDot} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={styles.docMetaTitle}>Developer Roadmap</h4>
                  <p style={styles.docText}>Next phase focuses on local LLM acceleration and multi-agent drafting capabilities for complex enterprise workflows.</p>
                  <span style={styles.versionBadge}>v1.2.0-STABLE</span>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.modalCloseBtn} onClick={() => setShowDocs(false)}>
                Close Documentation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f8f7f4",
    fontFamily: "'Manrope', sans-serif",
    color: "#1e293b",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e2e8f0",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 28px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  navLogo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800,
    fontSize: 20,
    color: "#1e1b4b",
    letterSpacing: "-0.5px",
  },
  navLink: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#64748b",
    fontFamily: "'Manrope', sans-serif",
    transition: "color 0.15s",
    padding: "4px 0",
  },
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "48px 28px",
  },
  hero: {
    marginBottom: 48,
  },
  heroBadge: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#6366f1",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: 100,
    padding: "4px 12px",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-1.5px",
    lineHeight: 1.1,
    marginBottom: 16,
  },
  heroAccent: {
    color: "#6366f1",
  },
  heroSub: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 1.65,
    maxWidth: 560,
    fontWeight: 400,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "14px 20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardHeaderLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#94a3b8",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    color: "#94a3b8",
    fontFamily: "'Manrope', sans-serif",
    transition: "color 0.15s",
    padding: 0,
  },
  textarea: {
    width: "100%",
    height: 280,
    padding: "20px 24px",
    fontSize: 14,
    color: "#334155",
    background: "transparent",
    border: "none",
    resize: "none",
    fontFamily: "'Manrope', sans-serif",
    lineHeight: 1.7,
    display: "block",
  },
  toneSection: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  toneTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    letterSpacing: "-0.2px",
  },
  toneGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  toneBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s",
    fontFamily: "'Manrope', sans-serif",
  },
  toneBtnActive: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.1)",
  },
  toneBtnLabel: {
    fontSize: 13,
    fontWeight: 700,
    display: "block",
    letterSpacing: "-0.2px",
  },
  toneBtnDesc: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 3,
    display: "block",
    fontWeight: 400,
  },
  generateBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: 16,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Manrope', sans-serif",
    transition: "all 0.15s",
    letterSpacing: "-0.2px",
  },
  generateBtnActive: {
    background: "#6366f1",
    color: "#ffffff",
    boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
  },
  generateBtnDisabled: {
    background: "#e2e8f0",
    color: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  outputSection: {
    display: "flex",
    flexDirection: "column",
  },
  outputCard: {
    minHeight: 400,
    display: "flex",
    flexDirection: "column",
  },
  copyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    padding: "7px 14px",
    background: "#6366f1",
    color: "#ffffff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "'Manrope', sans-serif",
    transition: "all 0.15s",
    letterSpacing: "-0.1px",
  },
  outputBody: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    minHeight: 320,
  },
  outputState: {
    height: "100%",
    minHeight: 240,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e0e7ff",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
  },
  outputStateText: {
    fontSize: 13,
    fontWeight: 500,
    color: "#94a3b8",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#64748b",
  },
  emptyText: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 1.6,
    maxWidth: 200,
    fontWeight: 400,
  },
  replyText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
    fontWeight: 400,
  },
  errorBox: {
    margin: "0 16px 16px",
    padding: "12px 16px",
    borderRadius: 12,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: 12,
    fontWeight: 500,
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  footer: {
    borderTop: "1px solid #e2e8f0",
    marginTop: 80,
  },
  footerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  footerBrand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    opacity: 0.4,
  },
  footerLogo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: 14,
    color: "#64748b",
  },
  footerCopy: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: 700,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    textAlign: "center",
  },
  // MODAL
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(15,23,42,0.65)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    background: "#ffffff",
    width: "100%",
    maxWidth: 860,
    maxHeight: "88vh",
    borderRadius: 28,
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    padding: "28px 32px",
    borderBottom: "1px solid #f1f5f9",
    background: "#fafbff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  modalIcon: {
    width: 48,
    height: 48,
    background: "#6366f1",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
  },
  modalTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 22,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  modalSubtitle: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginTop: 2,
  },
  modalClose: {
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#64748b",
    transition: "all 0.15s",
  },
  modalBody: {
    overflowY: "auto",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: 36,
  },
  docSection: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  docSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  docAccent: {
    width: 4,
    height: 22,
    background: "#6366f1",
    borderRadius: 100,
  },
  docSectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  docText: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.7,
    fontWeight: 400,
  },
  docCardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 14,
    marginTop: 8,
  },
  docCard: {
    padding: "20px",
    borderRadius: 16,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  docCardIcon: {
    width: 38,
    height: 38,
    background: "#ffffff",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
    marginBottom: 14,
    color: "#64748b",
  },
  docCardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
    letterSpacing: "-0.2px",
  },
  docCardDesc: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 1.65,
    fontWeight: 400,
  },
  pipelineSection: {
    background: "#0f172a",
    borderRadius: 20,
    padding: "28px 32px",
  },
  pipelineTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: 24,
    letterSpacing: "-0.3px",
    fontStyle: "italic",
  },
  pipelineSteps: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  pipelineStep: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
  },
  pipelineNum: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#6366f1",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  pipelineStepLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#a5b4fc",
    marginBottom: 4,
  },
  pipelineStepDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 1.6,
  },
  docMeta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    paddingBottom: 8,
  },
  docMetaTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 10,
    fontFamily: "'Playfair Display', Georgia, serif",
    letterSpacing: "-0.3px",
  },
  docMetaList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 12,
  },
  docMetaItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  docMetaDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
    flexShrink: 0,
  },
  versionBadge: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#64748b",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: 100,
    padding: "4px 12px",
    marginTop: 12,
  },
  modalFooter: {
    padding: "20px 32px",
    background: "#f8fafc",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "center",
  },
  modalCloseBtn: {
    padding: "12px 32px",
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: 14,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Manrope', sans-serif",
    letterSpacing: "-0.2px",
    transition: "all 0.15s",
  },
};