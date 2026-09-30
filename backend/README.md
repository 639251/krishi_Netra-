# 🌾 KrishiNetra Backend API (SIH 2026)

> **Agro-Meteorological High-Resolution (1 km) Downscaling & Advisory API Engine**
> Built according to system architecture and low-level design specifications in `docs1/`.

---

## 🌟 Key Capabilities

1. **AI Downscaling Engine (1 km Resolution):**
   - Stacking Ensemble combining **Random Forest**, **XGBoost / Gradient Boosted Trees**, and **Spatial Neural Models**.
   - Incorporates 24 Geo-Covariates (SRTM DEM elevation anomaly, environmental lapse rate -6.5°C/km, slope, dominant aspect, orographic wind-slope alignment, ISRO LULC cropland/forest/urban%, NBSS&LUP soil properties, and NDVI).
   - Generates **90% Confidence Uncertainty Intervals** for temperature and rainfall.

2. **Crop-Specific Advisory Rule Engine:**
   - Evaluates physiological thresholds across phenological stages for Indian crops (Rice, Wheat, Cotton, Soybean, Grapes, Sugarcane, Onion, Mustard).
   - Multi-Lingual Natural Language Generation (NLG) in **English**, **Hindi (हिन्दी)**, **Marathi (मराठी)**, and **Tamil (தமிழ்)**.

3. **Multi-Channel Delivery Integrations:**
   - **MSG91 SMS Gateway** adapter with automatic fallback simulation.
   - **Meta WhatsApp Business Cloud API** adapter.
   - **Firebase Cloud Messaging (FCM)** push notification worker.

4. **REST API Gateway (FastAPI):**
   - Auto-generated interactive Swagger OpenAPI docs (`/docs`) and Redoc (`/redoc`).
   - Rate limiting, Bearer JWT authentication, structured logging, and health checking.

---

## 🚀 How to Run the Backend

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Start the Backend API Server
```bash
python backend/main.py
```
Or with `uvicorn` directly:
```bash
uvicorn backend.src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Open API Documentation in Browser
- 📖 **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 📚 **Redoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- 🩺 **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/forecast/{panchayat_id}` | 5-day downscaled forecast with 90% confidence bands |
| `GET` | `/v1/forecast/block/{block_id}` | Intra-block micro-climate comparison |
| `GET` | `/v1/forecast/grid` | Lat/Lon coordinate forecast |
| `GET` | `/v1/advisory/{panchayat_id}` | Multi-lingual actionable crop advisory |
| `GET` | `/v1/compare/{block_id}` | 25 km NWP vs 1 km AI Downscale comparison |
| `GET` | `/v1/stations` | All Automatic Weather Stations (AWS) |
| `GET` | `/v1/stations/{station_id}/readings` | Hourly AWS observation readings |
| `GET` | `/v1/search/panchayat` | Search panchayats by name, state, or GPS |
| `POST` | `/v1/feedback` | Field ground-truth observation feedback |
| `POST` | `/v1/webhooks/register` | Register webhook for real-time alerts |
| `GET` | `/v1/admin/model/status` | ML ensemble weights, R², RMSE, latency metrics |
| `GET` | `/v1/health` | System health check |
| `POST` | `/v1/auth/register` | Register API client |
| `POST` | `/v1/auth/token` | Obtain JWT Bearer access token |

---

## 🧪 Running Automated Tests
```bash
pytest backend/tests
```
