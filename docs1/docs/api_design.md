# 🔌 API Design

> **REST API Specification for the Agro-Meteorological Downscaling System**

---

## 1. API Overview

| Property | Detail |
|----------|--------|
| **Base URL** | `https://api.agromet-downscale.gov.in/v1` |
| **Protocol** | HTTPS (TLS 1.3) |
| **Format** | JSON |
| **Authentication** | Bearer Token (JWT) |
| **Rate Limit** | 1,000 requests/minute per API key |
| **Versioning** | URL-based (`/v1/`, `/v2/`) |
| **Documentation** | Auto-generated via FastAPI OpenAPI (Swagger) |

---

## 2. Authentication

```bash
# Step 1: Register and get API key
POST /auth/register
{
  "name": "State Agriculture Dept",
  "email": "contact@agridept.gov.in",
  "organization": "Maharashtra Agriculture Department",
  "purpose": "Integration with Kisan portal"
}

# Step 2: Get JWT token
POST /auth/token
{
  "api_key": "ak_live_xxxxxxxxxxxxxxxx",
  "secret": "sk_live_xxxxxxxxxxxxxxxx"
}

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}

# Step 3: Use token in requests
curl -H "Authorization: Bearer eyJhbGciOi..." \
  https://api.agromet-downscale.gov.in/v1/forecast/MH_PUNE_MULSHI_TAMHINI
```

---

## 3. Endpoint Reference

### 3.1 Forecast Endpoints

#### `GET /forecast/{panchayat_id}`

Get downscaled weather forecast for a specific Panchayat.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `panchayat_id` | path | Yes | Panchayat identifier |
| `date` | query | No | Forecast date (YYYY-MM-DD), default: today |
| `days` | query | No | Number of forecast days (1-5), default: 3 |
| `include_uncertainty` | query | No | Include confidence intervals (default: false) |
| `include_block` | query | No | Include original block forecast for comparison |

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "panchayat": {
      "id": "MH_PUNE_MULSHI_TAMHINI",
      "name": "Tamhini",
      "block": "Mulshi",
      "district": "Pune",
      "state": "Maharashtra",
      "elevation_m": 650,
      "latitude": 18.4521,
      "longitude": 73.4287
    },
    "forecasts": [
      {
        "date": "2026-09-26",
        "lead_days": 1,
        "parameters": {
          "temp_max": { "value": 27.3, "unit": "°C" },
          "temp_min": { "value": 21.8, "unit": "°C" },
          "rainfall": { "value": 22.5, "unit": "mm" },
          "humidity": { "value": 85.2, "unit": "%" },
          "wind_speed": { "value": 12.4, "unit": "km/h" }
        },
        "confidence": 0.87,
        "uncertainty": {
          "temp_max": { "lower": 25.8, "upper": 28.9 },
          "rainfall": { "lower": 15.0, "upper": 35.0 }
        },
        "block_forecast": {
          "temp_max": 32.0,
          "rainfall": 15.0,
          "humidity": 78.0
        }
      }
    ],
    "model_version": "v2.3.1",
    "generated_at": "2026-09-25T06:30:00+05:30"
  }
}
```

---

#### `GET /forecast/block/{block_id}`

Get forecasts for all Panchayats within a block (comparison view).

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "block": {
      "id": "MH_PUNE_MULSHI",
      "name": "Mulshi",
      "district": "Pune",
      "panchayat_count": 15
    },
    "block_forecast": {
      "date": "2026-09-26",
      "temp_max": 32.0,
      "rainfall": 15.0
    },
    "panchayat_forecasts": [
      {
        "panchayat_id": "MH_PUNE_MULSHI_TAMHINI",
        "name": "Tamhini Ghat",
        "elevation_m": 650,
        "temp_max": 27.3,
        "rainfall": 22.5,
        "deviation_from_block": { "temp_max": -4.7, "rainfall": +7.5 }
      },
      {
        "panchayat_id": "MH_PUNE_MULSHI_PAUD",
        "name": "Paud",
        "elevation_m": 580,
        "temp_max": 31.2,
        "rainfall": 14.8,
        "deviation_from_block": { "temp_max": -0.8, "rainfall": -0.2 }
      }
    ],
    "statistics": {
      "temp_max_range": [27.3, 34.1],
      "rainfall_range": [8.0, 22.5],
      "max_deviation_temp": 6.8,
      "max_deviation_rain": 14.5
    }
  }
}
```

---

#### `GET /forecast/grid`

Get forecast for a specific lat/lon coordinate (nearest grid point).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | query | Yes | Latitude |
| `lon` | query | Yes | Longitude |
| `date` | query | No | Forecast date |

---

### 3.2 Advisory Endpoints

#### `GET /advisory/{panchayat_id}`

Get agricultural advisory for a Panchayat.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `panchayat_id` | path | Yes | Panchayat identifier |
| `crop` | query | No | Specific crop (rice/wheat/cotton/soybean/etc.) |
| `language` | query | No | Language code (en/hi/mr/ta/te/bn/gu/kn/ml/pa) |
| `date` | query | No | Advisory date, default: today |

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "panchayat_id": "MH_PUNE_MULSHI_TAMHINI",
    "date": "2026-09-26",
    "weather_summary": {
      "temp_max": 27.3,
      "rainfall": 22.5,
      "condition": "Moderate to heavy rain expected"
    },
    "advisories": [
      {
        "id": "adv_20260926_001",
        "severity": "orange",
        "crop": "rice",
        "crop_stage": "flowering",
        "action_type": "harvesting",
        "title": "Heavy Rain Alert — Rice Flowering Stage",
        "message": "Moderate to heavy rain (22mm) expected tomorrow during the critical flowering stage. Risk of flower drop and grain discoloration. Ensure proper field drainage. Apply 0.2% Borax foliar spray after rain stops to improve grain setting.",
        "valid_from": "2026-09-26T00:00:00+05:30",
        "valid_until": "2026-09-27T18:00:00+05:30"
      },
      {
        "id": "adv_20260926_002",
        "severity": "yellow",
        "crop": "rice",
        "crop_stage": "flowering",
        "action_type": "pest_management",
        "title": "Pest Watch — Post-Rain Conditions",
        "message": "High humidity (85%) after rain creates favourable conditions for Blast disease. Monitor fields closely. If symptoms appear, apply Tricyclazole (0.06%) spray.",
        "valid_from": "2026-09-27T06:00:00+05:30",
        "valid_until": "2026-09-29T18:00:00+05:30"
      }
    ],
    "language": "en"
  }
}
```

---

### 3.3 Station Endpoints

#### `GET /stations`

List all weather stations with latest readings.

#### `GET /stations/{station_id}/readings`

Get historical readings for a specific station.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `station_id` | path | Yes | Station identifier |
| `start_date` | query | No | Start date (YYYY-MM-DD) |
| `end_date` | query | No | End date (YYYY-MM-DD) |
| `parameter` | query | No | Specific parameter to retrieve |

---

### 3.4 Search & Lookup Endpoints

#### `GET /search/panchayat`

Search for Panchayats by name or location.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | query | No | Search by name |
| `state` | query | No | Filter by state |
| `district` | query | No | Filter by district |
| `lat` | query | No | Search by coordinates |
| `lon` | query | No | Search by coordinates |
| `radius_km` | query | No | Search radius (with lat/lon) |

---

### 3.5 Admin & Health Endpoints

#### `GET /health`

System health check.

```json
{
  "status": "healthy",
  "components": {
    "database": "healthy",
    "redis": "healthy",
    "ml_model": "healthy",
    "last_forecast_update": "2026-09-25T06:45:00+05:30"
  },
  "version": "1.2.0",
  "uptime_seconds": 864000
}
```

#### `GET /admin/model/status`

Current model performance metrics (admin only).

#### `POST /feedback`

Submit feedback on forecast accuracy (for continuous improvement).

```json
{
  "panchayat_id": "MH_PUNE_MULSHI_TAMHINI",
  "date": "2026-09-25",
  "parameter": "rainfall",
  "forecast_value": 22.5,
  "actual_value": 28.0,
  "reporter": "Krishi Vigyan Kendra, Mulshi",
  "notes": "Measured at KVK rain gauge"
}
```

---

## 4. Error Responses

```json
// 400 Bad Request
{
  "status": "error",
  "error": {
    "code": "INVALID_DATE",
    "message": "Date must be in YYYY-MM-DD format",
    "field": "date"
  }
}

// 401 Unauthorized
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired access token"
  }
}

// 404 Not Found
{
  "status": "error",
  "error": {
    "code": "PANCHAYAT_NOT_FOUND",
    "message": "No Panchayat found with ID 'INVALID_ID'"
  }
}

// 429 Too Many Requests
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit of 1000 requests/minute exceeded",
    "retry_after": 30
  }
}

// 503 Service Unavailable
{
  "status": "error",
  "error": {
    "code": "MODEL_UNAVAILABLE",
    "message": "ML model is being updated. Please retry in 5 minutes."
  }
}
```

---

## 5. Webhook Notifications

For real-time forecast delivery, clients can register webhooks:

```bash
POST /webhooks/register
{
  "url": "https://your-server.com/webhook/forecast",
  "events": ["forecast.new", "alert.severe"],
  "panchayat_ids": ["MH_PUNE_MULSHI_TAMHINI", "MH_PUNE_MULSHI_PAUD"],
  "secret": "your_webhook_secret"
}
```

When a new forecast is generated, the system sends:
```json
POST https://your-server.com/webhook/forecast
X-Webhook-Signature: sha256=xxxxxx

{
  "event": "forecast.new",
  "timestamp": "2026-09-25T06:30:00+05:30",
  "data": {
    "panchayat_id": "MH_PUNE_MULSHI_TAMHINI",
    "date": "2026-09-26",
    "temp_max": 27.3,
    "rainfall": 22.5,
    "severity": "orange"
  }
}
```

---

## 6. SDK Examples

### Python
```python
from agromet import AgroMetClient

client = AgroMetClient(api_key="ak_live_xxx")

# Get forecast
forecast = client.forecast.get("MH_PUNE_MULSHI_TAMHINI", days=3)
print(f"Tomorrow's max temp: {forecast[0].temp_max}°C")
print(f"Tomorrow's rainfall: {forecast[0].rainfall}mm")

# Get advisory
advisory = client.advisory.get(
    "MH_PUNE_MULSHI_TAMHINI",
    crop="rice",
    language="hi"
)
for adv in advisory.advisories:
    print(f"[{adv.severity}] {adv.message}")
```

### cURL
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.agromet-downscale.gov.in/v1/forecast/MH_PUNE_MULSHI_TAMHINI?days=3"
```

### JavaScript
```javascript
const response = await fetch(
  'https://api.agromet-downscale.gov.in/v1/advisory/MH_PUNE_MULSHI_TAMHINI?crop=rice&language=hi',
  { headers: { 'Authorization': 'Bearer YOUR_TOKEN' } }
);
const data = await response.json();
```

---

*Document Version: 1.0 | Last Updated: September 2026*
