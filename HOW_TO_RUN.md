# 🚀 KrishiNetra — How to Run Guide (प्रोजेक्ट कैसे चलाएं)

इस गाइड में **KrishiNetra (SIH 2026)** वेब डैशबोर्ड (`frontend/`) और **FastAPI AI Downscaling Backend** (`backend/`) को अपने सिस्टम पर चलाने के सभी स्टेप्स दिए गए हैं।

---

## 📁 Clean Folder Structure

```
KrishiNetra/
├── backend/            # FastAPI + AI Downscaling Engine + DB + APIs
│   ├── config/
│   ├── src/
│   ├── tests/
│   └── main.py
├── frontend/           # React 19 + Leaflet + TailwindCSS Web Dashboard
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── .env
├── docs1/              # System Design & Documentation
├── run_all.bat         # 1-Click Launch (Backend + Frontend)
├── run_backend.bat     # 1-Click Launch (Backend Only)
├── run.bat             # 1-Click Launch (Frontend Only)
└── HOW_TO_RUN.md
```

---

## ⚡ Option 1: 1-Click Launch (Windows Quick Run)

- 👉 **`run_all.bat` पर Double Click करें** — यह एक साथ **Backend API** और **Frontend Dashboard** दोनों को शुरू करके ब्राउज़र में खोल देगा!
- 👉 **`run_backend.bat`** — केवल Backend API सर्वर शुरू करने के लिए (`http://localhost:8000/docs`)।
- 👉 **`run.bat`** — केवल Frontend Web Dashboard शुरू करने के लिए (`http://localhost:5173`)।

---

## 💻 Option 2: Terminal / Command Prompt Commands (Manual Steps)

### 1. Backend Server शुरू करें (FastAPI + AI Engine)

```bash
# Backend फोल्डर से सर्वर चलाएं
python backend/main.py
```
- 📖 **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🩺 **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### 2. Frontend Server शुरू करें (React 19 Dashboard)

```bash
# Frontend फोल्डर में जाएं
cd frontend

# Dependencies इन्स्टॉल करें
npm install

# Development सर्वर शुरू करें
npm run dev
```
- 🌐 **Web Dashboard URL**: [http://localhost:5173/](http://localhost:5173/)

---

## 🧪 Automated Tests चलाएं

```bash
python -m pytest backend/tests
```
