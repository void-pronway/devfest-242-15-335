# 🇧🇩 Tender Package Builder  
### দরপত্র প্যাকেজ নির্মাতা

A bilingual, browser-based tender document validation and PDF package generation tool built for the **AI DevFest 2026 AI Vibe-Coding Contest**.

The application helps office staff load tender requirements, upload tender documents, match each document to the correct requirement, validate expiry dates and missing documents, detect exact duplicate PDFs, and generate a correctly ordered final tender submission package.

---

## 👤 Participant Information

**Name:** Pronway P. Mitra  
**Registration Number:** 242-15-335  
**Event:** AI DevFest 2026 AI Vibe-Coding Contest  
**Institution:** Daffodil International University  

**GitHub Repository:**  
https://github.com/void-pronway/devfest-242-15-335

**Live Website:**  
https://tender-package-builder.diu.my.id/

---

# 📌 Project Overview

Tender submissions often require many separate PDF documents to be checked, organized, and combined in a specific order.

Doing this manually can create problems such as:

- Missing mandatory documents
- Expired certificates
- Incorrect document ordering
- Duplicate documents
- Accidentally assigning one document to multiple requirements
- Incorrect final page numbering
- Difficulty reviewing the complete tender package

**Tender Package Builder** solves these problems directly in the browser.

The application reads a tender `requirements.json` file, displays all required documents, accepts multiple PDFs, validates the package in real time, and generates one final submission-ready PDF.

---

# ✨ Main Features

## 1. Tender Requirements Loader

The application accepts a `requirements.json` file containing:

- Tender ID
- Tender title
- Procuring entity
- Bidder
- Submission deadline
- Required documents
- Document order
- Mandatory / optional status
- Expiry-date requirements
- English titles
- Bangla titles

Requirements are automatically displayed according to their official tender order.

---

## 2. Tender Information Dashboard

After loading the JSON file, the application displays important tender information including:

- Tender ID
- Tender title
- Procuring entity
- Bidder
- Submission deadline
- Number of requirements

This allows the user to verify the tender before uploading documents.

---

## 3. Multi-PDF Upload

Users can upload multiple PDF files at once.

For every uploaded file, the system displays:

- File name
- File size
- Number of pages
- Matching control
- Duplicate status
- Remove button

The system supports a maximum of:

- **30 PDF files**
- **50 MB total uploaded PDF size**

---

## 4. Invalid File Protection

Only PDF documents are accepted.

If an unsupported file is selected, the application displays a clear validation message.

The application also attempts to read every PDF using `pdf-lib`.

Unreadable or invalid PDF files are rejected safely instead of crashing the application.

---

## 5. PDF Page Count Detection

Each uploaded PDF is analyzed directly inside the browser.

The page count is displayed automatically so users can verify the uploaded document before generating the final package.

---

## 6. One-to-One Requirement Matching

Every uploaded document can be matched to a tender requirement.

The application enforces the following rule:

> One uploaded PDF can match at most one tender requirement, and one tender requirement can have at most one uploaded PDF.

Already-used requirements are disabled inside other matching dropdowns.

Users can also undo or change a match at any time.

---

## 7. Alphabetically Sorted Matching Dropdown

For faster document selection, the requirement options inside the matching dropdown are sorted alphabetically according to the currently selected language.

This does **not** affect the official tender document order.

The requirement status section and generated PDF continue to follow the official `order` value from `requirements.json`.

---

# 🔍 Real-Time Validation

The application immediately evaluates every tender requirement.

Each requirement receives one of the following statuses.

### Missing

A mandatory requirement has no matched file.

**Blocking:** Yes

The package cannot be generated.

---

### Expiry Date Needed

A document requires an expiry date, has been matched, but no expiry date has been entered.

**Blocking:** Yes

---

### Expired

The document expiry date is earlier than the tender submission deadline.

**Blocking:** Yes

---

### Not Provided

An optional requirement has no uploaded document.

**Blocking:** No

The document is simply excluded from the generated package.

---

### OK

The requirement has a correctly matched document.

For documents with expiry dates:

```text
Expiry Date >= Tender Submission Deadline
```

is considered valid.

An expiry date equal to the submission deadline is therefore accepted.

**Blocking:** No

---

# 📅 Expiry Date Validation

When a requirement contains:

```json
"has_expiry": true
```

and a PDF is matched to that requirement, an expiry-date input automatically appears.

The entered expiry date is compared against:

```json
tender.submission_deadline
```

If:

```text
expiry date < submission deadline
```

the document becomes:

```text
Expired
```

and final package generation is blocked.

---

# 🧬 Exact Duplicate Detection

The application detects identical PDF files even when their filenames are different.

Each uploaded PDF is processed using the browser's **SHA-256 cryptographic hashing API**.

Example:

```text
experience_cert.pdf
experience_cert (1).pdf
```

If both files contain exactly the same bytes, they receive the same SHA-256 hash and are identified as duplicates.

Duplicate files are clearly marked in the uploaded document list.

Only one identical copy can be matched to a tender requirement.

This prevents the same document from being used as multiple different tender documents.

---

# 🚫 Blocking Validation

The **Generate Package** button remains disabled while any blocking issue exists.

Blocking problems include:

- Missing mandatory document
- Required expiry date not entered
- Expired document

The interface displays the exact requirements that must be fixed before generation can continue.

When all mandatory conditions are satisfied, the package status changes to:

```text
Ready to generate
```

and the generation button becomes available.

---

# 📄 Final PDF Package Generation

The final tender package is created completely inside the browser using **pdf-lib**.

No uploaded tender documents are sent to a backend server.

---

## PDF Cover Page

The first page of the generated package is an automatically generated English cover page.

It includes:

- Tender ID
- Tender title
- Procuring entity
- Bidder
- Submission deadline
- Package generation date
- List of included documents

The document list follows the official tender requirement order.

---

## Document Ordering

After the cover page, matched tender documents are inserted according to:

```json
requirement.order
```

Optional requirements without uploaded documents are skipped.

All pages from each uploaded document retain their original order.

---

## Footer and Page Numbers

Every page in the generated package, including the cover page, receives a footer in this format:

```text
<tender_id> | Page X of Y
```

Example:

```text
T-2026-0417 | Page 5 of 16
```

The total number of pages is calculated automatically after all documents have been inserted.

---

## Content-Safe Footer Placement

Instead of drawing the footer directly over the original PDF content, the application adds extra space below each imported document page.

The original page is moved upward into the new page canvas.

This prevents the generated page-number footer from covering tender document content.

---

## Download Filename

The generated package is automatically downloaded using:

```text
<tender_id>_Package.pdf
```

Example:

```text
T-2026-0417_Package.pdf
```

---

# 🌐 Bangla and English Support

The complete application supports:

- English
- বাংলা

The language can be changed from the navigation bar at any time.

Translated interface elements include:

- Buttons
- Instructions
- Tender sections
- Validation statuses
- Requirement titles
- Upload controls
- Error messages
- Package generation controls

Requirement names automatically use either:

```json
title_en
```

or:

```json
title_bn
```

depending on the selected language.

---

# 🎨 User Interface

The interface was designed for non-technical office workers.

Major UI features include:

- Clean procurement-style dashboard
- Responsive layout
- Two-column requirement view on desktop
- Single-column view on smaller screens
- Scrollable uploaded-document area
- Sticky navigation bar
- Persistent language control
- Persistent theme control
- Clear validation colors
- Bangladesh-inspired animated background
- Responsive mobile layout

---

# 🇧🇩 Bangladesh-Inspired Design

The application uses a subtle animated green and red background inspired by the colors of the Bangladesh flag.

The animation moves slowly to provide visual identity without interfering with document readability or validation statuses.

---

# 🌙 Dark and Light Mode

Users can switch between:

- Dark Mode
- Light Mode

Theme preference is saved using:

```text
localStorage
```

so the selected theme remains active after refreshing the page.

The date picker is also adjusted for both themes so its calendar icon remains visible.

---

# 💾 Local Browser Storage

The application uses `localStorage` only for interface preferences such as:

- Selected language
- Selected theme

Tender PDFs are processed directly in browser memory.

The application does not require:

- Database
- Backend API
- Authentication server
- Cloud document storage

---

# 🔐 Privacy

Tender documents are processed entirely on the user's device.

The application does not upload the selected PDF files to an external document-processing server.

PDF reading, hashing, validation, matching, and package generation occur inside the browser.

---

# 🛠 Technology Stack

The project uses:

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### PDF Processing

- `pdf-lib`

Used for:

- Reading PDFs
- Counting pages
- Importing PDF pages
- Creating the cover page
- Creating the combined tender package
- Adding page-number footers
- Downloading the final PDF

### Icons

- `lucide-react`

### Duplicate Detection

Browser Web Crypto API:

```javascript
crypto.subtle.digest("SHA-256", ...)
```

### Local Preferences

Browser:

```javascript
localStorage
```

---

# 🏗 Architecture

The project uses a frontend-only architecture.

```text
requirements.json
       │
       ▼
 React Application
       │
       ├── Tender Information
       ├── Requirement Validation
       ├── PDF Upload
       ├── SHA-256 Duplicate Detection
       ├── Requirement Matching
       ├── Expiry Validation
       │
       ▼
 Browser Memory
       │
       ▼
     pdf-lib
       │
       ▼
Final Tender Package PDF
       │
       ▼
 Browser Download
```

No backend server is required.

---

# 📂 Expected Requirements JSON Structure

Example:

```json
{
  "tender": {
    "tender_id": "T-2026-0417",
    "title": "Supply of IT Equipment",
    "procuring_entity": "Directorate of Sample Services",
    "bidder": "Meghna Tech Solutions Ltd.",
    "submission_deadline": "2026-10-20"
  },
  "requirements": [
    {
      "id": "R01",
      "order": 1,
      "title_en": "Trade License",
      "title_bn": "ট্রেড লাইসেন্স",
      "mandatory": true,
      "has_expiry": true
    }
  ]
}
```

---

# 🔄 Application Workflow

```text
1. Open Tender Package Builder
        ↓
2. Load requirements.json
        ↓
3. Review Tender Information
        ↓
4. Review Required Documents
        ↓
5. Upload Tender PDFs
        ↓
6. Match PDFs to Requirements
        ↓
7. Enter Required Expiry Dates
        ↓
8. Resolve Missing / Expired Documents
        ↓
9. Verify Package Status
        ↓
10. Generate Final PDF
        ↓
11. Download <tender_id>_Package.pdf
```

---

# 🧪 Sample Package Verification

The provided contest sample tender was tested using:

```text
Tender ID: T-2026-0417
Tender: Supply of IT Equipment
Bidder: Meghna Tech Solutions Ltd.
Submission Deadline: 2026-10-20
```

The successfully generated sample package contains:

```text
1. Cover Page
2. Trade License
3. TIN Certificate
4. VAT Registration Certificate
5. Bank Solvency Certificate
6. Experience Certificate
7. Technical Proposal
8. Financial Proposal
9. Signed Declaration
```

Optional documents that were not supplied are excluded automatically.

The verified sample package contains a total of:

```text
16 pages
```

including the generated cover page.

---

# 📁 Submission Artifacts

The repository includes the required generated sample package:

```text
output/T-2026-0417_Package.pdf
```

The repository also includes a screenshot showing document validation statuses:

```text
screenshots/status.png
```

These demonstrate successful package generation and validation using the provided sample tender data.

---

# 🚀 Running the Project Locally

## Requirements

A compatible version of:

```text
Node.js
npm
```

is required.

The development environment used during the contest included:

```text
Node.js v24.19.0
npm 11.17.0
```

---

## Clone the Repository

```bash
git clone https://github.com/void-pronway/devfest-242-15-335.git
```

Enter the project directory:

```bash
cd devfest-242-15-335
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Then open the local URL displayed by Vite.

Usually:

```text
http://localhost:5173
```

---

# 🏭 Production Build

Create a production build using:

```bash
npm run build
```

The generated production files are placed inside:

```text
dist/
```

A local production preview can be started with:

```bash
npm run preview
```

---

# ☁️ Deployment

The application is designed to be deployed as a static frontend application.

For Render Static Site deployment:

```text
Repository:
https://github.com/void-pronway/devfest-242-15-335

Branch:
main

Build Command:
npm install && npm run build

Publish Directory:
dist
```

No environment variables or secrets are required.

---

# 📱 Browser Support

The application is designed primarily for the latest version of:

```text
Google Chrome
```

It uses browser APIs including:

- File API
- Blob API
- Web Crypto API
- Object URLs
- Local Storage

---

# 📏 Application Limits

The current implementation supports:

```text
Maximum PDF files: 30
Maximum combined PDF size: 50 MB
```

Very large PDF packages may require more browser memory because all document processing happens locally.

---

# ✅ Implemented Core Requirements

The project implements the main contest requirements:

- Load `requirements.json`
- Display tender information
- Sort requirements by official order
- Upload multiple PDFs
- Show PDF filenames
- Show page counts
- Reject invalid files
- Remove uploaded files
- Match PDFs to requirements
- One-to-one document matching
- Undo/change matching
- Expiry-date entry
- Real-time status validation
- Missing status
- Expiry Date Needed status
- Expired status
- Not Provided status
- OK status
- SHA-256 exact duplicate detection
- Duplicate matching protection
- Blocking validation before generation
- Ordered final PDF generation
- English cover page
- Correct document ordering
- Original PDF page preservation
- Optional-document skipping
- `Page X of Y` footer on every page
- Download using tender ID filename
- Bangla interface
- English interface
- Responsive interface
- Public static deployment support

---

# ⭐ Additional Features

Beyond the essential workflow, the application also includes:

- Dark mode
- Light mode
- Persistent theme preference
- Persistent language preference
- Sticky navigation bar
- Animated bilingual application title
- Alphabetically sorted matching dropdown
- Scrollable uploaded-file section
- Responsive two-column requirement layout
- Human-readable KB / MB file sizes
- Bangladesh-inspired animated background
- Content-safe PDF footer placement
- Clear blocking-problem summary
- Professional status color system

---

# 🧩 Bonus Features Not Implemented

The following optional bonus features were intentionally not prioritized over the core tender validation workflow:

- PDF index page
- Digital seal/signature
- Checklist CSV/Excel export
- Save and reopen tender workspace
- Bangla-generated PDF cover/index
- Automatic filename-to-requirement matching
- External AI API integration

The project prioritizes correctness and reliability of the required features.

---

# ⚠️ Known Limitations

### Browser Memory

PDF files are processed completely inside the browser.

Very large PDF files may therefore require significant browser memory.

---

### Password-Protected PDFs

Encrypted or unsupported PDF documents may not be readable by `pdf-lib`.

Such documents are rejected with an error rather than causing the application to fail.

---

### Session Data

Uploaded PDFs and document matches are held in browser memory.

Refreshing or closing the page clears the current tender-document workspace.

Theme and language preferences remain because they are stored in `localStorage`.

---

### Generated PDF Language

The generated tender cover page is currently English.

The web application itself supports both Bangla and English.

---

# 🤖 AI Usage

AI-assisted development tools were used during the contest for:

- React component planning
- UI development guidance
- CSS improvements
- Tender validation logic
- Duplicate-detection design
- PDF-generation logic
- Debugging
- Code review
- Responsive-design improvements
- README preparation

The participant reviewed, integrated, tested, and remained responsible for all code included in the repository.

---

# 💡 Most Useful AI Prompt

One of the most useful prompts used during development was:

> Build the Tender Package Builder as a frontend-only React application. Load the provided requirements.json, display tender requirements in their required order, support multi-PDF upload with page counts, enforce one-to-one requirement matching, detect exact duplicate files using SHA-256, validate required expiry dates against the tender submission deadline, show live Missing / Expiry Date Needed / Expired / Not Provided / OK statuses, prevent package generation while blocking problems exist, and generate one correctly ordered PDF with an English cover and `<tender_id> | Page X of Y` footer on every page. Keep all PDF processing in the browser and provide complete Bangla and English UI support.

---

# 🧠 Design Philosophy

The application was built around three priorities:

### Correctness

Tender documents must be validated and ordered correctly before package generation.

### Simplicity

A non-technical office worker should be able to understand the workflow without training.

### Privacy

Tender files should remain inside the browser rather than being uploaded unnecessarily to an external server.

---

# 🔒 Security

The project contains:

- No API keys
- No authentication secrets
- No database credentials
- No backend credentials
- No participant-controlled server storage

All core processing occurs client-side.

---

# 📜 License

This project is released under the **MIT License**.

See:

```text
LICENSE
```

for the complete license text.

---

# 👨‍💻 Author

**Pronway P. Mitra**

Registration Number:

```text
242-15-335
```

Built for:

**AI DevFest 2026 AI Vibe-Coding Contest**

Daffodil International University

---

## 🇧🇩 দরপত্র ব্যবস্থাপনাকে আরও সহজ, নির্ভুল ও ব্যবহারবান্ধব করার জন্য তৈরি।