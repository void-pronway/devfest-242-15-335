import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Languages,
  Moon,
  Sun,
  Upload,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import "./App.css";

const text = {
  en: {
    subtitle: "Tender Document Package Builder",
    loadJson: "Load Requirements",
    loadHint: "Open the requirements.json file from the tender package.",
    tenderInfo: "Tender Information",
    tenderId: "Tender ID",
    tenderTitle: "Tender",
    entity: "Procuring Entity",
    bidder: "Bidder",
    deadline: "Submission Deadline",
    requirements: "Document Requirements",
    requirementsHint:
      "Documents are automatically displayed in the required package order.",
    order: "Order",
    document: "Document",
    requirement: "Requirement",
    expiry: "Expiry",
    status: "Status",
    mandatory: "Mandatory",
    optional: "Optional",
    required: "Required",
    notRequired: "Not required",
    missing: "Missing",
    notProvided: "Not provided",
    chooseJson: "Choose requirements.json",
    invalidJson: "Could not load this requirements file.",
    ready: "Requirements loaded",
    waiting: "Waiting for tender requirements",
    waitingDesc:
      "Load requirements.json to begin building and checking the tender package.",
    loaded: "documents required",
    theme: "Theme",
    language: "Language",
  },

  bn: {
    subtitle: "দরপত্র নথি প্যাকেজ নির্মাতা",
    loadJson: "চাহিদার তালিকা লোড করুন",
    loadHint: "দরপত্র প্যাকেজের requirements.json ফাইলটি খুলুন।",
    tenderInfo: "দরপত্রের তথ্য",
    tenderId: "দরপত্র আইডি",
    tenderTitle: "দরপত্র",
    entity: "ক্রয়কারী প্রতিষ্ঠান",
    bidder: "দরদাতা",
    deadline: "জমাদানের শেষ তারিখ",
    requirements: "প্রয়োজনীয় নথি",
    requirementsHint:
      "নথিগুলো প্যাকেজে প্রয়োজনীয় ক্রম অনুযায়ী স্বয়ংক্রিয়ভাবে দেখানো হয়।",
    order: "ক্রম",
    document: "নথি",
    requirement: "প্রয়োজন",
    expiry: "মেয়াদ",
    status: "অবস্থা",
    mandatory: "বাধ্যতামূলক",
    optional: "ঐচ্ছিক",
    required: "প্রয়োজন",
    notRequired: "প্রয়োজন নেই",
    missing: "অনুপস্থিত",
    notProvided: "দেওয়া হয়নি",
    chooseJson: "requirements.json নির্বাচন করুন",
    invalidJson: "requirements ফাইলটি লোড করা যায়নি।",
    ready: "চাহিদার তালিকা লোড হয়েছে",
    waiting: "দরপত্রের তথ্যের অপেক্ষায়",
    waitingDesc:
      "প্যাকেজ তৈরি ও যাচাই শুরু করতে requirements.json লোড করুন।",
    loaded: "টি নথি প্রয়োজন",
    theme: "থিম",
    language: "ভাষা",
  },
};

function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en",
  );

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const [titleBangla, setTitleBangla] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const t = text[language];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTitleBangla((current) => !current);
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  const requirements = useMemo(() => {
    if (!data?.requirements) return [];

    return [...data.requirements].sort(
      (a, b) => Number(a.order) - Number(b.order),
    );
  }, [data]);

  async function loadRequirements(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);

      if (
        !parsed.tender ||
        !Array.isArray(parsed.requirements)
      ) {
        throw new Error("Invalid requirements structure");
      }

      setData(parsed);
    } catch {
      setData(null);
      setError(t.invalidJson);
    } finally {
      event.target.value = "";
    }
  }

  function getRequirementStatus(requirement) {
    if (requirement.mandatory) {
      return {
        label: t.missing,
        className: "status status-danger",
      };
    }

    return {
      label: t.notProvided,
      className: "status status-neutral",
    };
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <FileText size={22} />
          </div>

          <div>
            <div className="animated-title">
              <span
                key={titleBangla ? "bn-title" : "en-title"}
                className="title-text"
              >
                {titleBangla
                  ? "দরপত্র প্যাকেজ নির্মাতা"
                  : "Tender Package Builder"}
              </span>
            </div>

            <p>{t.subtitle}</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() =>
              setLanguage((current) =>
                current === "en" ? "bn" : "en",
              )
            }
            title={t.language}
          >
            <Languages size={18} />
            <span>
              {language === "en" ? "বাংলা" : "English"}
            </span>
          </button>

          <button
            className="theme-button"
            onClick={() =>
              setTheme((current) =>
                current === "dark" ? "light" : "dark",
              )
            }
            title={t.theme}
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>
        </div>
      </header>

      <main className="main">
        <section className="upload-panel">
          <div>
            <span className="eyebrow">01</span>
            <h1>{t.loadJson}</h1>
            <p>{t.loadHint}</p>
          </div>

          <label className="upload-button">
            <Upload size={19} />
            {t.chooseJson}

            <input
              type="file"
              accept=".json,application/json"
              onChange={loadRequirements}
              hidden
            />
          </label>
        </section>

        {error && (
          <div className="alert error-alert">
            <AlertTriangle size={19} />
            {error}
          </div>
        )}

        {!data ? (
          <section className="empty-state">
            <div className="empty-icon">
              <FileText size={34} />
            </div>

            <h2>{t.waiting}</h2>
            <p>{t.waitingDesc}</p>
          </section>
        ) : (
          <>
            <section className="section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">02</span>
                  <h2>{t.tenderInfo}</h2>
                </div>

                <div className="loaded-badge">
                  <CheckCircle2 size={16} />
                  {t.ready}
                </div>
              </div>

              <div className="tender-grid">
                <InfoCard
                  label={t.tenderId}
                  value={data.tender.tender_id}
                />

                <InfoCard
                  label={t.tenderTitle}
                  value={data.tender.title}
                />

                <InfoCard
                  label={t.entity}
                  value={data.tender.procuring_entity}
                />

                <InfoCard
                  label={t.bidder}
                  value={data.tender.bidder}
                />

                <InfoCard
                  label={t.deadline}
                  value={data.tender.submission_deadline}
                  highlight
                />
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">03</span>
                  <h2>{t.requirements}</h2>
                  <p>{t.requirementsHint}</p>
                </div>

                <strong className="requirement-count">
                  {requirements.length} {t.loaded}
                </strong>
              </div>

              <div className="requirement-list">
                {requirements.map((requirement) => {
                  const status =
                    getRequirementStatus(requirement);

                  return (
                    <article
                      className="requirement-card"
                      key={requirement.id}
                    >
                      <div className="order-number">
                        {String(requirement.order).padStart(
                          2,
                          "0",
                        )}
                      </div>

                      <div className="requirement-main">
                        <span className="requirement-id">
                          {requirement.id}
                        </span>

                        <h3>
                          {language === "bn"
                            ? requirement.title_bn
                            : requirement.title_en}
                        </h3>

                        <div className="requirement-meta">
                          <span
                            className={
                              requirement.mandatory
                                ? "tag mandatory"
                                : "tag optional"
                            }
                          >
                            {requirement.mandatory
                              ? t.mandatory
                              : t.optional}
                          </span>

                          {requirement.has_expiry && (
                            <span className="tag expiry-tag">
                              {t.expiry}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={status.className}>
                        {status.label}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <span>
          © 2026 Pronway P. Mitra · AI DevFest 2026
        </span>

        <span>242-15-335</span>
      </footer>
    </div>
  );
}

function InfoCard({ label, value, highlight = false }) {
  return (
    <div
      className={`info-card ${highlight ? "highlight" : ""}`}
    >
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export default App;