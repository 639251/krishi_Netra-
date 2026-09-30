# 📐 High-Level Design (HLD)

> **Agro-Meteorological High-Resolution Downscaling System**

---

## 1. System Context Diagram

```mermaid
graph TB
    subgraph External["🌐 External Systems"]
        IMD["IMD API<br/>(Forecast Data)"]
        ISRO["ISRO Bhuvan<br/>(LULC Maps)"]
        NASA["NASA EarthData<br/>(SRTM DEM)"]
        NBSS["NBSS&LUP<br/>(Soil DB)"]
        AWSN["AWS Network<br/>(Weather Stations)"]
    end

    subgraph System["🏗️ Agro-Met Downscaling System"]
        DIL["📥 Data Integration Layer"]
        AIE["🧠 AI Downscaling Engine"]
        ADV["📋 Advisory Generation"]
        DEL["📤 Delivery & Presentation"]

        DIL --> AIE --> ADV --> DEL
    end

    subgraph Users["👥 End Users"]
        FARMER["🧑‍🌾 Farmers<br/>(SMS / WhatsApp / App)"]
        OFFICIAL["👨‍💼 Officials<br/>(Web Dashboard)"]
        THIRD["🔌 Third-Party<br/>(REST API)"]
    end

    IMD & ISRO & NASA & NBSS & AWSN --> DIL
    DEL --> FARMER & OFFICIAL & THIRD

    style External fill:#e3f2fd,stroke:#1565c0
    style System fill:#e8f5e9,stroke:#2e7d32
    style Users fill:#fff3e0,stroke:#e65100
```

---

## 2. Module Design

### 2.1 Module 1: Data Integration Layer

**Purpose**: Ingest, validate, transform, and align all data sources into a unified format.

```mermaid
graph TB
    subgraph Ingestion["📥 Ingestion Tier"]
        FI["Forecast Ingestion<br/>• GRIB2 Parser<br/>• NetCDF Reader<br/>• API Client"]
        GI["Geospatial Ingestion<br/>• GeoTIFF I/O<br/>• Shapefile Reader<br/>• Raster Operations"]
        SI["Station Data Ingestion<br/>• CSV Parser<br/>• API Client<br/>• Quality Check"]
    end

    subgraph Processing["⚙️ Processing Tier"]
        SP["Spatial<br/>Reproject & Regrid"] --> TP["Temporal<br/>Align & Resample"]
        TP --> MD["Missing Data<br/>Imputation"]
        MD --> FEng["Feature<br/>Engineering"]
    end

    subgraph Storage["💾 Storage Tier"]
        PG[("PostgreSQL<br/>+ PostGIS<br/>(Structured)")]
        OBJ[("Object Store<br/>S3 / MinIO<br/>(Raw Files)")]
        RD[("Redis Cache<br/>(Hot Data)")]
    end

    FI & GI & SI --> SP
    FEng --> PG & OBJ & RD

    style Ingestion fill:#e3f2fd,stroke:#1565c0
    style Processing fill:#fff3e0,stroke:#e65100
    style Storage fill:#e8f5e9,stroke:#2e7d32
```

#### Key Decisions:
- **CRS Standard**: All spatial data reprojected to **EPSG:4326** (WGS84) for consistency
- **Grid Resolution**: Internal computation at **1 km × 1 km** grid (0.01° × 0.01°)
- **Temporal Resolution**: Daily forecasts aligned to **IST (UTC+5:30)** day boundaries
- **Missing Data**: Spatial interpolation (IDW) for elevation gaps; temporal forward-fill for station outages

---

### 2.2 Module 2: AI Downscaling Engine

**Purpose**: Apply trained ML models to predict Panchayat-level weather from block-level forecasts.

#### Training Pipeline (Offline — Weekly/Monthly)

```mermaid
graph TD
    HBF["Historical<br/>Block Forecasts"] --> TDA["Training Data<br/>Assembly"]
    SC["Static<br/>Covariates"] --> TDA
    HAR["Historical<br/>AWS Readings"] --> TDA

    TDA --> RF_T["🌲 Random Forest<br/>Training"]
    TDA --> XGB_T["⚡ XGBoost<br/>Training"]
    TDA --> CNN_T["🧠 CNN U-Net<br/>Training"]

    RF_T & XGB_T & CNN_T --> EVAL["📊 Model Evaluation<br/>• RMSE, MAE, R²<br/>• Cross-Validation<br/>• Spatial CV"]

    EVAL --> REG[("📦 Model Registry<br/>(MLflow)")]

    style TDA fill:#bbdefb,stroke:#1565c0
    style EVAL fill:#c8e6c9,stroke:#2e7d32
    style REG fill:#fff3e0,stroke:#e65100
```

#### Inference Pipeline (Online — Real-time)

```mermaid
graph TD
    NBF["New Block<br/>Forecast"] --> FVA["Feature Vector<br/>Assembly"]
    SFP["Static Features<br/>(Pre-computed)"] --> FVA

    FVA --> RF_I["🌲 RF Infer"]
    FVA --> XGB_I["⚡ XGBoost Infer"]
    FVA --> CNN_I["🧠 CNN Infer"]

    RF_I & XGB_I & CNN_I --> ENS["🎯 Ensemble Average<br/>(Learned Weights)"]

    ENS --> POST["⚙️ Post-Processing<br/>• Bias Correction<br/>• Clip Physical Bounds<br/>• Uncertainty Quantification"]

    style FVA fill:#e3f2fd,stroke:#1565c0
    style ENS fill:#ffe0b2,stroke:#e65100
    style POST fill:#c8e6c9,stroke:#2e7d32
```

#### Key Decisions:
- **Ensemble Strategy**: Weighted stacking with a Ridge meta-learner to combine RF, XGBoost, and CNN
- **Separate Models per Parameter**: Temperature, Rainfall, Humidity, and Wind each have dedicated models (different feature importances)
- **Spatial Cross-Validation**: Training uses Leave-One-Station-Out CV to prevent spatial autocorrelation leakage
- **Model Versioning**: MLflow tracks all experiments; champion model auto-deployed via CI/CD

---

### 2.3 Module 3: Advisory Generation

**Purpose**: Convert raw weather predictions into actionable farming advice.

```mermaid
graph TD
    FORECAST["🌤️ Panchayat Forecast<br/>Temp: 38°C | Rain: 45mm<br/>RH: 85% | Wind: 25km/h"]

    FORECAST --> ENRICH["📚 Context Enrichment"]

    CC2["🌾 Crop Calendar<br/>Crop: Rice<br/>Stage: Flowering<br/>Week: 12"] --> ENRICH
    FP["👤 Farmer Profile<br/>Region: Tamil Nadu<br/>Language: Tamil"] --> ENRICH
    HC["📅 Historical Context<br/>Last 7d Rain: 120mm<br/>Soil: Saturated"] --> ENRICH

    ENRICH --> RULES["⚖️ Rule Engine"]

    RULES --> A1["🟠 Rain > 30mm + Flowering<br/>→ Risk of flower drop.<br/>Apply Borax spray after rain."]
    RULES --> A2["🔴 Temp > 40°C + Humidity < 30%<br/>→ Heat wave. Irrigate immediately.<br/>Mulch around plant base."]
    RULES --> A3["🟡 Wind > 40km/h<br/>→ Secure crop supports.<br/>Do NOT spray pesticide today."]

    A1 & A2 & A3 --> NLG2["🌏 Multi-Lingual NLG<br/>EN / HI / TA / TE / MR / BN"]

    style FORECAST fill:#bbdefb,stroke:#1565c0
    style RULES fill:#ffe0b2,stroke:#e65100
    style NLG2 fill:#e1bee7,stroke:#6a1b9a
```

---

### 2.4 Module 4: Delivery & Presentation

```mermaid
graph TB
    subgraph Dashboard["🖥️ Web Dashboard"]
        MAP["🗺️ Map View<br/>(Mapbox GL)"]
        TABLE["📊 Table View"]
        CHART["📈 Charts<br/>(Recharts)"]
        COMPARE["🔄 Comparison<br/>(Block vs Panchayat)"]
    end

    subgraph Notification["📣 Notification Service"]
        MQ[("Message Queue<br/>Redis / RabbitMQ")]
        SMS_W["📱 SMS Worker<br/>MSG91 API<br/>Bulk Send + DND"]
        WA_W["💬 WhatsApp Worker<br/>Meta Business API<br/>Rich Media"]
        PUSH_W["🔔 Push Notif Worker<br/>FCM / APNs"]
    end

    subgraph REST["🔌 REST API (FastAPI)"]
        EP1["GET /forecast/{'{'}panchayat_id{'}'}"]
        EP2["GET /forecast/block/{'{'}block_id{'}'}"]
        EP3["GET /advisory/{'{'}panchayat_id{'}'}"]
        EP4["GET /compare/{'{'}block_id{'}'}"]
        EP5["POST /feedback"]
        EP6["GET /health"]
    end

    MQ --> SMS_W & WA_W & PUSH_W

    style Dashboard fill:#e3f2fd,stroke:#1565c0
    style Notification fill:#fff3e0,stroke:#e65100
    style REST fill:#e8f5e9,stroke:#2e7d32
```

---

## 3. Database Design — ER Diagram

```mermaid
erDiagram
    STATES ||--o{ DISTRICTS : contains
    STATES {
        int state_id PK
        string name
        geometry geometry
    }

    DISTRICTS ||--o{ BLOCKS : contains
    DISTRICTS {
        int district_id PK
        int state_id FK
        string name
        geometry geometry
    }

    BLOCKS ||--o{ PANCHAYATS : contains
    BLOCKS {
        int block_id PK
        int district_id FK
        string name
        geometry geometry
    }

    BLOCKS ||--o{ BLOCK_FORECASTS : has
    BLOCK_FORECASTS {
        int id PK
        int block_id FK
        date date
        float temp_max
        float temp_min
        float rainfall
        float humidity
        float wind_speed
        string source
    }

    PANCHAYATS ||--o{ PANCHAYAT_FORECASTS : has
    PANCHAYATS {
        int panchayat_id PK
        int block_id FK
        string name
        float elevation_m
        string lulc_class
        string soil_type
        float slope_deg
        float aspect
        geometry geometry
    }

    PANCHAYAT_FORECASTS {
        int id PK
        int panchayat_id FK
        date date
        float temp_max
        float temp_min
        float rainfall
        float humidity
        float wind_speed
        float confidence
        string model_version
        datetime created_at
    }

    PANCHAYATS ||--o{ ADVISORIES : receives
    ADVISORIES {
        int id PK
        int panchayat_id FK
        date date
        string advisory_text
        string language
        string severity
        string crop
        string action_type
        string delivered_via
        datetime created_at
    }

    PANCHAYATS ||--o{ AWS_STATIONS : hosts
    AWS_STATIONS ||--o{ STATION_READINGS : records
    AWS_STATIONS {
        int station_id PK
        string name
        float lat
        float lon
        float elevation
        int panchayat_id FK
        geometry geometry_point
    }

    STATION_READINGS {
        int id PK
        int station_id FK
        datetime datetime
        float temp_max
        float temp_min
        float rainfall
        float humidity
        float wind_speed
        int quality_flag
    }

    MODEL_REGISTRY {
        int model_id PK
        string parameter
        string algorithm
        string version
        float rmse
        float mae
        float r_squared
        datetime trained_at
        string artifact_path
        boolean is_champion
    }
```

---

## 4. Technology Architecture

| Layer | Component | Technology | Justification |
|-------|-----------|-----------|---------------|
| **Compute** | ML Training | GPU instances (V100/A100) | XGBoost & CNN training require GPU acceleration |
| **Compute** | ML Inference | CPU instances (auto-scaled) | Inference is lightweight; horizontal scaling |
| **Compute** | API Server | FastAPI on Uvicorn (ASGI) | Async, high-throughput Python web framework |
| **Compute** | Task Queue | Celery + Redis | Distributed task execution for batch processing |
| **Storage** | Relational DB | PostgreSQL 15 + PostGIS 3.3 | Spatial queries, ACID compliance, mature ecosystem |
| **Storage** | Object Store | AWS S3 / MinIO | Raw data files (GRIB2, GeoTIFF) storage |
| **Storage** | Cache | Redis 7 | Hot data caching; task broker for Celery |
| **Storage** | Model Store | MLflow | Model versioning, experiment tracking |
| **Frontend** | Dashboard | React 18 + Mapbox GL JS | Interactive maps with vector tiles |
| **Frontend** | Mobile | React Native | Cross-platform mobile app |
| **Messaging** | SMS | MSG91 / Kaleyra SMPP | Bulk SMS delivery with DND compliance |
| **Messaging** | WhatsApp | Meta Business API | Rich media advisory delivery |
| **Container** | Runtime | Docker + Kubernetes | Container orchestration; auto-scaling |
| **CI/CD** | Pipeline | GitHub Actions / Jenkins | Automated testing and deployment |
| **Monitoring** | Metrics | Prometheus + Grafana | System metrics and dashboards |
| **Monitoring** | Logs | ELK Stack | Centralized logging and analysis |

---

## 5. Non-Functional Requirements

| Requirement | Target | Design Approach |
|-------------|--------|-----------------|
| **Availability** | 99.9% uptime | Multi-AZ deployment; health checks; auto-restart |
| **Latency** | < 30 min end-to-end | Pre-computed features; parallel inference |
| **Throughput** | 2.5 lakh Panchayats / forecast cycle | Batch processing with Celery workers |
| **Scalability** | Linear with Panchayat count | Stateless workers; horizontal scaling |
| **Data Freshness** | Forecasts within 30 min of IMD release | Webhook triggers; priority queue |
| **Accuracy** | RMSE < 2°C (temp), < 5mm (rain) | Ensemble models; continuous retraining |
| **Security** | Gov. of India security standards | Encryption, RBAC, audit logs |
| **Disaster Recovery** | RPO: 1 hour, RTO: 4 hours | Cross-region replicas; automated failover |

---

## 6. Integration Points

| External System | Integration Method | Frequency | Data Volume |
|----------------|-------------------|-----------|-------------|
| **IMD Forecast API** | REST API / FTP pull | 2x/day (6AM, 12PM IST) | ~50 MB/cycle |
| **NASA SRTM** | One-time download + annual update | Annual | ~100 GB (India) |
| **ISRO Bhuvan (LULC)** | API / Manual download | Annual | ~20 GB |
| **NBSS&LUP (Soil)** | Manual download | One-time | ~5 GB |
| **IMD AWS Network** | API pull | Hourly | ~10 MB/hour |
| **MSG91 (SMS)** | REST API push | Per forecast cycle | ~1 Cr messages |
| **WhatsApp Business** | REST API push | Per forecast cycle | ~50 lakh messages |
| **PMFBY Portal** | REST API push | Daily | ~1 MB/day |

---

*Document Version: 2.0 | Last Updated: September 2026*
