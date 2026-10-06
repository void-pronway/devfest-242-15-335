import { useEffect, useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Languages,
  Moon,
  Sun,
  Trash2,
  Upload,
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
    mandatory: "Mandatory",
    optional: "Optional",
    expiry: "Expiry",
    missing: "Missing",
    notProvided: "Not provided",
    expiryNeeded: "Expiry date needed",
    expired: "Expired",
    ok: "OK",
    chooseJson: "Choose requirements.json",
    invalidJson: "Could not load this requirements file.",
    ready: "Requirements loaded",
    waiting: "Waiting for tender requirements",
    waitingDesc:
      "Load requirements.json to begin building and checking the tender package.",
    loaded: "requirements",
    uploadPdfs: "Upload Tender Documents",
    uploadPdfHint:
      "Upload the PDF files that will be checked and included in the package.",
    choosePdfs: "Choose PDF files",
    noFiles: "No PDF files uploaded yet.",
    pages: "pages",
    page: "page",
    matchTo: "Match to requirement",
    unmatched: "Not matched",
    duplicate: "Duplicate file",
    remove: "Remove",
    invalidPdf: "Only PDF files are allowed.",
    brokenPdf: "This PDF could not be read.",
    limitFiles: "Maximum 30 PDF files are allowed.",
    limitSize: "Total PDF size cannot exceed 50 MB.",
    duplicateBlocked: "Only one copy of an identical file can be matched.",
    expiryDate: "Expiry date",
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
    mandatory: "বাধ্যতামূলক",
    optional: "ঐচ্ছিক",
    expiry: "মেয়াদ",
    missing: "অনুপস্থিত",
    notProvided: "দেওয়া হয়নি",
    expiryNeeded: "মেয়াদের তারিখ প্রয়োজন",
    expired: "মেয়াদোত্তীর্ণ",
    ok: "ঠিক আছে",
    chooseJson: "requirements.json নির্বাচন করুন",
    invalidJson: "requirements ফাইলটি লোড করা যায়নি।",
    ready: "চাহিদার তালিকা লোড হয়েছে",
    waiting: "দরপত্রের তথ্যের অপেক্ষায়",
    waitingDesc: "প্যাকেজ তৈরি ও যাচাই শুরু করতে requirements.json লোড করুন।",
    loaded: "টি শর্ত",
    uploadPdfs: "দরপত্রের নথি আপলোড করুন",
    uploadPdfHint:
      "যে PDF নথিগুলো যাচাই ও প্যাকেজে যুক্ত হবে সেগুলো আপলোড করুন।",
    choosePdfs: "PDF নির্বাচন করুন",
    noFiles: "এখনও কোনো PDF আপলোড করা হয়নি।",
    pages: "পৃষ্ঠা",
    page: "পৃষ্ঠা",
    matchTo: "শর্তের সাথে মিলান",
    unmatched: "মেলানো হয়নি",
    duplicate: "ডুপ্লিকেট ফাইল",
    remove: "মুছুন",
    invalidPdf: "শুধু PDF ফাইল গ্রহণ করা হবে।",
    brokenPdf: "PDF ফাইলটি পড়া যায়নি।",
    limitFiles: "সর্বোচ্চ ৩০টি PDF আপলোড করা যাবে।",
    limitSize: "সব PDF মিলিয়ে সর্বোচ্চ ৫০ MB হতে পারবে।",
    duplicateBlocked: "একই ফাইলের কেবল একটি কপি কোনো শর্তের সাথে মেলানো যাবে।",
    expiryDate: "মেয়াদের তারিখ",
    theme: "থিম",
    language: "ভাষা",
  },
};

function App() {
  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en",
  );

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const [titleBangla, setTitleBangla] = useState(true);

  const [data, setData] = useState(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // fileId -> requirementId
  const [matches, setMatches] = useState({});

  // requirementId -> YYYY-MM-DD
  const [expiryDates, setExpiryDates] = useState({});

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

  const hashCounts = useMemo(() => {
    const counts = {};

    uploadedFiles.forEach((file) => {
      counts[file.hash] = (counts[file.hash] || 0) + 1;
    });

    return counts;
  }, [uploadedFiles]);

  async function loadRequirements(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);

      if (!parsed.tender || !Array.isArray(parsed.requirements)) {
        throw new Error("Invalid structure");
      }

      setData(parsed);

      // reset current work if a different requirements file is loaded
      setUploadedFiles([]);
      setMatches({});
      setExpiryDates({});
    } catch {
      setData(null);
      setError(t.invalidJson);
    } finally {
      event.target.value = "";
    }
  }

  async function hashBuffer(arrayBuffer) {
    const digest = await crypto.subtle.digest("SHA-256", arrayBuffer);

    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function uploadPdfFiles(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    setError("");

    if (uploadedFiles.length + selectedFiles.length > 30) {
      setError(t.limitFiles);
      event.target.value = "";
      return;
    }

    const existingSize = uploadedFiles.reduce(
      (total, item) => total + item.size,
      0,
    );

    const newSize = selectedFiles.reduce((total, file) => total + file.size, 0);

    if (existingSize + newSize > 50 * 1024 * 1024) {
      setError(t.limitSize);
      event.target.value = "";
      return;
    }

    const accepted = [];
    const errors = [];

    for (const file of selectedFiles) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        errors.push(`${file.name}: ${t.invalidPdf}`);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();

        const pdf = await PDFDocument.load(buffer);

        const pageCount = pdf.getPageCount();

        const hash = await hashBuffer(buffer);

        accepted.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          pageCount,
          hash,
          bytes: new Uint8Array(buffer),
        });
      } catch {
        errors.push(`${file.name}: ${t.brokenPdf}`);
      }
    }

    setUploadedFiles((current) => [...current, ...accepted]);

    if (errors.length) {
      setError(errors.join(" | "));
    }

    event.target.value = "";
  }

  function removeUploadedFile(fileId) {
    const requirementId = matches[fileId];

    setUploadedFiles((current) => current.filter((file) => file.id !== fileId));

    setMatches((current) => {
      const next = { ...current };
      delete next[fileId];
      return next;
    });

    if (requirementId) {
      setExpiryDates((current) => {
        const next = { ...current };
        delete next[requirementId];
        return next;
      });
    }
  }

  function requirementAlreadyMatched(requirementId, exceptFileId) {
    return Object.entries(matches).some(
      ([fileId, matchedRequirementId]) =>
        fileId !== exceptFileId && matchedRequirementId === requirementId,
    );
  }

  function duplicateAlreadyMatched(file) {
    return uploadedFiles.some(
      (otherFile) =>
        otherFile.id !== file.id &&
        otherFile.hash === file.hash &&
        Boolean(matches[otherFile.id]),
    );
  }

  function changeMatch(file, requirementId) {
    setError("");

    if (!requirementId) {
      const oldRequirementId = matches[file.id];

      setMatches((current) => {
        const next = { ...current };
        delete next[file.id];
        return next;
      });

      if (oldRequirementId) {
        setExpiryDates((current) => {
          const next = { ...current };
          delete next[oldRequirementId];
          return next;
        });
      }

      return;
    }

    if (requirementAlreadyMatched(requirementId, file.id)) {
      return;
    }

    if (duplicateAlreadyMatched(file)) {
      setError(t.duplicateBlocked);
      return;
    }

    const oldRequirementId = matches[file.id];

    setMatches((current) => ({
      ...current,
      [file.id]: requirementId,
    }));

    if (oldRequirementId && oldRequirementId !== requirementId) {
      setExpiryDates((current) => {
        const next = { ...current };
        delete next[oldRequirementId];
        return next;
      });
    }
  }

  function getMatchedFile(requirementId) {
    const entry = Object.entries(matches).find(
      ([, value]) => value === requirementId,
    );

    if (!entry) return null;

    return uploadedFiles.find((file) => file.id === entry[0]) || null;
  }

  function getRequirementStatus(requirement) {
    const matchedFile = getMatchedFile(requirement.id);

    if (!matchedFile) {
      if (requirement.mandatory) {
        return {
          label: t.missing,
          className: "status status-danger",
          blocking: true,
        };
      }

      return {
        label: t.notProvided,
        className: "status status-neutral",
        blocking: false,
      };
    }

    if (requirement.has_expiry) {
      const expiryDate = expiryDates[requirement.id];

      if (!expiryDate) {
        return {
          label: t.expiryNeeded,
          className: "status status-warning",
          blocking: true,
        };
      }

      if (expiryDate < data.tender.submission_deadline) {
        return {
          label: t.expired,
          className: "status status-danger",
          blocking: true,
        };
      }
    }

    return {
      label: t.ok,
      className: "status status-ok",
      blocking: false,
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
              setLanguage((current) => (current === "en" ? "bn" : "en"))
            }
            title={t.language}
          >
            <Languages size={18} />
            <span>{language === "en" ? "বাংলা" : "English"}</span>
          </button>

          <button
            className="theme-button"
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            title={t.theme}
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
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
                <InfoCard label={t.tenderId} value={data.tender.tender_id} />

                <InfoCard label={t.tenderTitle} value={data.tender.title} />

                <InfoCard
                  label={t.entity}
                  value={data.tender.procuring_entity}
                />

                <InfoCard label={t.bidder} value={data.tender.bidder} />

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
                  const status = getRequirementStatus(requirement);

                  const matchedFile = getMatchedFile(requirement.id);

                  return (
                    <article className="requirement-card" key={requirement.id}>
                      <div className="order-number">
                        {String(requirement.order).padStart(2, "0")}
                      </div>

                      <div className="requirement-main">
                        <span className="requirement-id">{requirement.id}</span>

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
                            {requirement.mandatory ? t.mandatory : t.optional}
                          </span>

                          {requirement.has_expiry && (
                            <span className="tag expiry-tag">{t.expiry}</span>
                          )}

                          {matchedFile && (
                            <span className="tag matched-tag">
                              {matchedFile.name}
                            </span>
                          )}
                        </div>

                        {matchedFile && requirement.has_expiry && (
                          <div className="expiry-input-wrap">
                            <label>{t.expiryDate}</label>

                            <input
                              type="date"
                              value={expiryDates[requirement.id] || ""}
                              onChange={(event) =>
                                setExpiryDates((current) => ({
                                  ...current,
                                  [requirement.id]: event.target.value,
                                }))
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className={status.className}>{status.label}</div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">04</span>
                  <h2>{t.uploadPdfs}</h2>
                  <p>{t.uploadPdfHint}</p>
                </div>

                <label className="upload-button">
                  <Upload size={18} />
                  {t.choosePdfs}

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={uploadPdfFiles}
                    hidden
                  />
                </label>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="pdf-empty">{t.noFiles}</div>
              ) : (
                <div className="uploaded-file-list">
                  {uploadedFiles.map((file) => {
                    const isDuplicate = hashCounts[file.hash] > 1;

                    const duplicateLocked =
                      duplicateAlreadyMatched(file) && !matches[file.id];

                    return (
                      <article
                        className={`uploaded-file-card ${
                          isDuplicate ? "duplicate-file" : ""
                        }`}
                        key={file.id}
                      >
                        <div className="file-icon">
                          <FileText size={22} />
                        </div>

                        <div className="file-info">
                          <strong>{file.name}</strong>

                          <div className="file-meta">
                            <span>
                              {file.pageCount}{" "}
                              {file.pageCount === 1 ? t.page : t.pages}
                            </span>

                            <span>{formatFileSize(file.size)}</span>

                            {isDuplicate && (
                              <span className="duplicate-label">
                                <AlertTriangle size={13} />
                                {t.duplicate}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="match-control">
                          <label>{t.matchTo}</label>

                          <select
                            value={matches[file.id] || ""}
                            disabled={duplicateLocked}
                            onChange={(event) =>
                              changeMatch(file, event.target.value)
                            }
                          >
                            <option value="">{t.unmatched}</option>

                            {requirements.map((requirement) => {
                              const used = requirementAlreadyMatched(
                                requirement.id,
                                file.id,
                              );

                              return (
                                <option
                                  key={requirement.id}
                                  value={requirement.id}
                                  disabled={used}
                                >
                                  {requirement.order}.{" "}
                                  {language === "bn"
                                    ? requirement.title_bn
                                    : requirement.title_en}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <button
                          className="remove-button"
                          onClick={() => removeUploadedFile(file.id)}
                          title={t.remove}
                        >
                          <Trash2 size={18} />
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <span>© 2026 Pronway P. Mitra · AI DevFest 2026</span>

        <span>242-15-335</span>
      </footer>
    </div>
  );
}

function InfoCard({ label, value, highlight = false }) {
  return (
    <div className={`info-card ${highlight ? "highlight" : ""}`}>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export default App;
