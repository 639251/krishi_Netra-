<div align="center">

# 🌾 KrishiNetra (कृषिनेत्र)
### *AI-Powered Hyper-Local Agro-Meteorological Weather Intelligence Platform*
**Smart India Hackathon (SIH 2026)**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_v0.125-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS_3.4-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Downscaling IMD 25 km Block Numerical Weather Predictions (NWP) to 1 km × 1 km Gram Panchayat Precision Grids using 24 Topological Geo-Covariates & Stacking ML Ensembles.*

---

[🚀 Quick Start](#-quick-start) • [📐 System Architecture](#-system-architecture) • [🧠 AI Downscaling Engine](#-ai-downscaling-engine) • [🔌 REST APIs](#-rest-api-reference) • [📋 Agro-Advisory Engine](#-agro-advisory-engine) • [🧪 Testing](#-automated-tests)

</div>

---

## 🌟 Executive Summary

Standard Numerical Weather Prediction (NWP) models operate at coarse block resolutions (~25 km × 25 km). However, Indian micro-climates vary drastically over short distances due to terrain relief, elevation gradients, valleys, water bodies, and land cover. A single block often contains hilltops experiencing heavy orographic rain and valleys experiencing heat stress.

**KrishiNetra** bridges this critical gap by downscaling weather forecasts to **1 km × 1 km Gram Panchayat grids**, delivering actionable, localized crop advisories directly to farmers in regional languages (**Hindi**, **Marathi**, **Tamil**, and **English**).

---

## 🏛️ System Architecture

```
KrishiNetra/
├── 🧠 backend/                       # FastAPI + AI Downscaling Engine + DB + REST APIs
│   ├── config/                      # System & model hyperparameter configurations
│   ├── src/
│   │   ├── ingestion/               # IMD GFS/WRF, SRTM DEM, ISRO LULC, NBSS&LUP Soil, AWS Stations
│   │   ├── preprocessing/           # EPSG:4326 Reprojection, IST Alignment, 24-Feature Vector Pipeline
│   │   ├── models/                  # Random Forest, XGBoost, Spatial CNN, Ridge Meta Stacking Ensemble
│   │   ├── advisory/                # Phenological Crop Calendars, Rule Engine, Multi-Lingual NLG
│   │   ├── delivery/                # MSG91 SMS Gateway, Meta WhatsApp Cloud API, FCM Push
│   │   ├── db/                      # SQLAlchemy ORM, SQLite/PostgreSQL, Spatial Repositories
│   │   └── api/                     # REST API Gateway (FastAPI, JWT Bearer Auth, Rate Limiter)
│   ├── tests/                       # Pytest Automated Test Suite (14/14 Passed)
│   ├── requirements.txt
│   └── main.py                      # Backend API Server Entrypoint
│
├── 🎨 frontend/                      # Modern React 19 + Leaflet + TailwindCSS Web Dashboard
│   ├── public/                      # Static assets & geojson boundaries
│   ├── src/
│   │   ├── components/              # Interactive Map, Forecast Cards, Advisory Bulletins, Simulators
│   │   ├── services/api.ts          # Unified Frontend-Backend API Client
│   │   ├── types/                   # TypeScript Type Definitions
│   │   └── data/                    # High-Fidelity Data & Translations
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
├── 📖 docs1/                         # Complete System Design Docs (HLD, LLD, APIs, Data Sources)
├── ⚡ run_all.bat                    # 1-Click Full Stack Launcher (Backend + Frontend)
├── ⚡ run_backend.bat                # 1-Click Backend Launcher
├── ⚡ run.bat                        # 1-Click Frontend Launcher
└── 📄 HOW_TO_RUN.md                  # Hindi & English Execution Guide
```

---

## 🧠 AI Downscaling Engine

### 1. 24 Topological Geo-Covariates
The AI engine transforms coarse block forecasts into micro-climate predictions by computing 24 features for every grid point:
- **SRTM DEM Elevation Anomaly:** $\Delta h = h_{\text{panchayat}} - h_{\text{block\_mean}}$
- **Environmental Lapse Rate:** $\Delta T = \Delta h \times (-6.5^\circ\text{C} / 1000\text{m})$
- **Orographic Wind Enhancement:** $F_{\text{oro}} = \text{slope} \times \max(0, \cos(\theta_{\text{wind}} - \theta_{\text{aspect}})) \times \frac{v_{\text{wind}}}{20}$
- **Aspect Circular Encoding:** $\sin(\theta_{\text{aspect}}), \cos(\theta_{\text{aspect}})$
- **ISRO Bhuvan Land Cover:** Cropland %, Dense Forest %, Built-up Urban %, Water Body %
- **NBSS&LUP Soil Properties:** Water retention capacity, thermal conductivity, drainage rate
- **Vegetation Index:** Sentinel-2 / ISRO NDVI (0.1 - 0.95)

### 2. Stacking Ensemble Architecture
- **Random Forest Regressor:** Non-linear micro-temperature and relative humidity modeling.
- **XGBoost / Gradient Boosted Trees:** Extreme rainfall and wind gust regression.
- **Spatial Neural Network (MLP/CNN):** Grid topological correlation patterns.
- **Ridge Meta-Learner:** Dynamically weights base model predictions with physical bounds clipping:
  - Temperature: $[-10^\circ\text{C}, 55^\circ\text{C}]$
  - Rainfall: $[0\text{ mm}, 500\text{ mm}]$
  - **90% Confidence Uncertainty Intervals** generated per parameter.

---

## 🔌 REST API Reference

The backend exposes auto-documented OpenAPI Swagger endpoints at `http://localhost:8000/docs`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/forecast/{panchayat_id}` | 5-Day downscaled forecast with 90% confidence bands |
| `GET` | `/v1/forecast/block/{block_id}` | Intra-block micro-climate variance across Panchayats |
| `GET` | `/v1/forecast/grid?lat=...&lon=...` | Nearest coordinate grid point forecast |
| `GET` | `/v1/advisory/{panchayat_id}` | Actionable crop advisory (`en`, `hi`, `mr`, `ta`) |
| `GET` | `/v1/compare/{block_id}` | 25 km NWP vs 1 km AI Downscale comparison |
| `GET` | `/v1/stations` | All Automatic Weather Stations (AWS) network |
| `GET` | `/v1/stations/{id}/readings` | Real-time observation telemetry |
| `GET` | `/v1/search/panchayat` | Search panchayats by name, state, district, or GPS |
| `POST` | `/v1/delivery/sms` | Live SMS dispatch via MSG91 Gateway |
| `POST` | `/v1/delivery/whatsapp` | WhatsApp Advisory dispatch via Meta Cloud API |
| `POST` | `/v1/feedback` | Ground-truth field observation feedback |
| `GET` | `/v1/admin/model/status` | ML ensemble weights, $R^2 > 0.92$, RMSE, latency |
| `GET` | `/v1/health` | System health check |
| `POST` | `/v1/auth/register` | Register API consumer |
| `POST` | `/v1/auth/token` | Obtain JWT Bearer access token |

---

## 📋 Agro-Advisory Engine

- **Phenological Stage Tracking:** Rice, Wheat, Cotton, Soybean, Grapes, Sugarcane, Onion, Mustard.
- **Scientific Rule Triggers:**
  - *Rain $\ge 20$ mm during Flowering/Grain Filling* $\rightarrow$ **ORANGE Warning:** Drainage alert & Borax foliar spray.
  - *Temp $\ge 38^\circ\text{C}$ & RH $\le 40\%$* $\rightarrow$ **RED Alert:** Severe heat stress, morning micro-irrigation & mulching.
  - *Wind $\le 14$ km/h & Rain $\le 2$ mm* $\rightarrow$ **GREEN Advisory:** Optimal spraying window.
- **Multi-Lingual Natural Language Generation (NLG):** Formats tailored bulletins in **Hindi (हिन्दी)**, **Marathi (मराठी)**, **Tamil (தமிழ்)**, and **English**.

---

## 🚀 Quick Start

### ⚡ 1-Click Launch (Windows)
Double-click **`run_all.bat`** in the project root folder. It will launch both the FastAPI Backend and the React 19 Frontend simultaneously and open your browser:
- 🌐 **Web Dashboard:** [http://localhost:5173](http://localhost:5173)
- 📖 **Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 💻 Manual Launch

#### 1. Start Backend Server
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
python backend/main.py
```

#### 2. Start Frontend Server
```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

---

## 🧪 Automated Tests

KrishiNetra includes a comprehensive automated test suite testing ML models, feature engineering pipelines, rule engines, and REST API endpoints:

```bash
python -m pytest backend/tests
```

**Result:** `14 passed in 23.7s` (100% pass rate).

---

## 👥 Authors & Acknowledgments

- **Team Kosmonyx** — Smart India Hackathon (SIH 2026)
- Meteorological Data & Benchmarks: **India Meteorological Department (IMD)**
- Elevation Datasets: **NASA SRTM 30m DEM**
- Land Cover Maps: **ISRO Bhuvan Portal**
- Soil Properties: **ICAR - NBSS&LUP**

---

<div align="center">
  <sub>Built with ❤️ for Indian Farmers • Jai Jawan, Jai Kisan 🌾</sub>
</div>
