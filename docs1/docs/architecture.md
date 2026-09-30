# 🏗️ System Architecture

> **Agro-Meteorological High-Resolution Downscaling System — Architecture Overview**

---

## 1. Architecture Overview

The system follows a **modular, microservices-based architecture** with four primary layers:

1. **Data Integration Layer** — Ingests and preprocesses all input data
2. **AI Downscaling Engine** — Core ML inference pipeline
3. **Advisory Generation Layer** — Converts predictions to actionable advice
4. **Delivery & Presentation Layer** — User-facing interfaces

```mermaid
graph TB
    subgraph External["🌐 External Data Sources"]
        IMD["IMD API<br/>(Forecast)"]
        SRTM["SRTM/DEM<br/>(Elevation)"]
        LULC["LULC Maps<br/>(Land Use)"]
        SOIL["Soil Maps<br/>(Type Map)"]
        AWS["AWS Stations<br/>(Ground Truth)"]
    end

    subgraph Layer1["📥 Layer 1: Data Integration"]
        subgraph Ingestion["Ingestion Service"]
            GRIB["GRIB/NetCDF Parser"]
            GTIFF["GeoTIFF Reader"]
            SHP["Shapefile Reader"]
            CSV["CSV/JSON Parser"]
        end
        subgraph Preprocessing["Preprocessing Pipeline"]
            QC["QC & Cleaning"] --> SA["Spatial Alignment"]
            SA --> TA["Temporal Alignment"]
            TA --> FE["Feature Engineering"]
        end
    end

    subgraph Layer2["🧠 Layer 2: AI Downscaling Engine"]
        subgraph Models["Model Orchestrator"]
            RF["Random Forest<br/>Regressor"]
            XGB["XGBoost<br/>Regressor"]
            CNN["CNN U-Net<br/>Spatial Model"]
        end
        ENS["Ensemble Combiner<br/>(Weighted Avg)"]
        PP["Post-Processing<br/>• Bias Correction<br/>• Spatial Smoothing<br/>• Uncertainty Bands"]
    end

    subgraph Layer3["📋 Layer 3: Advisory Engine"]
        RE["Rule Engine<br/>(Weather → Farm Action)"]
        CC["Crop Calendar<br/>(Crop Stage Lookup)"]
        NLG["Multi-Lingual NLG<br/>(Hindi, Marathi, Tamil...)"]
    end

    subgraph Layer4["📤 Layer 4: Delivery"]
        SMS["SMS<br/>SMPP Gateway"]
        WA["WhatsApp<br/>Business API"]
        APP["Mobile App<br/>(React Native)"]
        DASH["Web Dashboard<br/>(React.js)"]
        API["REST API<br/>(FastAPI)"]
    end

    subgraph CrossCut["⚙️ Cross-Cutting Concerns"]
        LOG["Logging<br/>(ELK)"]
        MON["Monitoring<br/>(Grafana)"]
        AUTH["Auth &<br/>Security"]
        CACHE["Caching<br/>(Redis)"]
        CFG["Config<br/>Management"]
    end

    IMD --> GRIB
    SRTM --> GTIFF
    LULC --> SHP
    SOIL --> SHP
    AWS --> CSV

    GRIB & GTIFF & SHP & CSV --> QC
    FE --> RF & XGB & CNN
    RF & XGB & CNN --> ENS
    ENS --> PP
    PP --> RE
    RE --> CC --> NLG
    NLG --> SMS & WA & APP & DASH & API

    style External fill:#e3f2fd,stroke:#1565c0
    style Layer1 fill:#e8f5e9,stroke:#2e7d32
    style Layer2 fill:#fff3e0,stroke:#e65100
    style Layer3 fill:#f3e5f5,stroke:#6a1b9a
    style Layer4 fill:#fce4ec,stroke:#b71c1c
    style CrossCut fill:#f5f5f5,stroke:#616161
```

---

## 2. Component Details

### 2.1 Layer 1: Data Integration

| Component | Responsibility | Input | Output |
|-----------|---------------|-------|--------|
| **IMD Forecast Fetcher** | Pull latest block-level forecasts via API/FTP | GRIB2/NetCDF files | Structured forecast DataFrame |
| **DEM Processor** | Extract elevation, slope, aspect for each grid point | SRTM GeoTIFF (30m) | Elevation features per Panchayat |
| **LULC Processor** | Classify land use categories per grid point | ISRO LULC maps | One-hot encoded land features |
| **Soil Data Processor** | Extract soil type, depth, texture | NBSS&LUP soil maps | Soil feature vectors |
| **AWS Data Fetcher** | Pull historical & real-time station data | IMD AWS network CSV | Ground truth training data |
| **Feature Engineer** | Combine all features into ML-ready matrix | All above | Feature matrix (X) + Target (y) |

### 2.2 Layer 2: AI Downscaling Engine

| Component | Responsibility | Algorithm | When Used |
|-----------|---------------|-----------|-----------| 
| **Random Forest** | Primary regression model; robust to noise | Ensemble of 500 decision trees | Temperature, Humidity |
| **XGBoost** | Gradient boosting for high accuracy | 200 boosting rounds, depth=8 | Rainfall, Wind Speed |
| **CNN (U-Net)** | Spatial pattern learning from gridded data | Modified U-Net with skip connections | Spatial interpolation |
| **Ensemble Combiner** | Weighted average of all models | Stacking with Ridge meta-learner | Final prediction |
| **Post-Processor** | Bias correction, physical consistency checks | Quantile mapping + physics constraints | All parameters |

### 2.3 Layer 3: Advisory Generation

| Component | Responsibility | Example |
|-----------|---------------|---------|
| **Rule Engine** | Maps weather conditions to farming actions | Rain > 30mm → "Postpone harvesting" |
| **Crop Calendar** | Knows what growth stage each crop is in | Rice in Kharif, Week 12 → "Flowering stage" |
| **Alert Generator** | Creates severity-based alerts | Temp > 42°C → "Heat wave alert: Protect nursery" |
| **NLG Module** | Generates natural language in regional scripts | Hindi: "कल भारी बारिश की संभावना, कटाई स्थगित करें" |

### 2.4 Layer 4: Delivery

| Channel | Technology | Target Users | Latency |
|---------|-----------|-------------|---------|
| **SMS** | SMPP Gateway (MSG91/Kaleyra) | Feature phone users | < 5 min |
| **WhatsApp** | WhatsApp Business API | Smartphone users | < 2 min |
| **Mobile App** | React Native | Tech-savvy farmers, extension workers | Real-time |
| **Web Dashboard** | React.js + Mapbox GL | Officials, researchers, media | Real-time |
| **REST API** | FastAPI | Third-party integrations | < 100ms |

---

## 3. Data Flow

```mermaid
flowchart TD
    A["🛰️ IMD Releases Block Forecast<br/>(6AM, 12PM daily)"] --> B["⚡ Webhook / Scheduled Trigger"]
    B --> C["📄 Parse GRIB2 File<br/>Extract: Temp, Rain, Humidity, Wind"]
    B --> LOG["📝 Log: Ingest Timestamp"]

    C --> D{"🔄 For Each Panchayat<br/>in Block"}

    D --> E["📊 Feature Assembly<br/>1. Get Elevation<br/>2. Get Land Use<br/>3. Get Soil Type<br/>4. Compute Derived Features"]
    CACHE[("💾 Static Feature<br/>Cache<br/>(Pre-computed)")] -.-> E

    E --> F["🧠 ML Ensemble Predict<br/>• Local Temp<br/>• Local Rain<br/>• Local RH<br/>• Local Wind"]

    F --> G["⚙️ Post-Processing<br/>• Bias Correction<br/>• Physical Bounds Clipping<br/>• Uncertainty Bands"]

    G --> H[("🗄️ Store in PostGIS DB<br/>forecast_panchayat<br/>├── panchayat_id<br/>├── date, temp, rain<br/>├── confidence<br/>└── geometry")]

    H --> I["📋 Advisory Engine<br/>Weather + Crop Stage + Context<br/>→ Actionable Advice<br/>in Regional Language"]

    I --> J["📱 SMS Delivery"]
    I --> K["💬 WhatsApp Delivery"]
    I --> L["🖥️ Dashboard Update"]

    style A fill:#bbdefb,stroke:#1565c0
    style F fill:#ffe0b2,stroke:#e65100
    style H fill:#c8e6c9,stroke:#2e7d32
    style I fill:#e1bee7,stroke:#6a1b9a
```

---

## 4. Infrastructure Architecture

```mermaid
graph TB
    subgraph Cloud["☁️ Cloud Infrastructure (AWS / NIC Cloud)"]
        subgraph K8s["Kubernetes Cluster"]
            API_POD["API Pods<br/>(x3, auto-scale → 10)"]
            ML_POD["ML Inference<br/>Worker Pods (x5)"]
            INGEST_POD["Data Ingestion<br/>Worker Pods (x3)"]
            DASH_POD["Dashboard<br/>Pods (x2)"]
        end

        subgraph Data["Data Layer"]
            PG[("PostgreSQL<br/>+ PostGIS<br/>(Primary + Replica)")]
            REDIS[("Redis Cluster<br/>(Cache + Queue)")]
            S3[("S3 Bucket<br/>(Models, Raw Data)")]
            MLFLOW[("MLflow<br/>Model Registry")]
        end

        subgraph Monitor["Monitoring & Observability"]
            PROM["Prometheus<br/>(Metrics)"]
            GRAF["Grafana<br/>(Dashboards)"]
            ELK["ELK Stack<br/>(Logs)"]
        end
    end

    LB["🌐 Load Balancer<br/>+ WAF + DDoS Protection"] --> API_POD
    LB --> DASH_POD

    API_POD --> PG
    API_POD --> REDIS
    ML_POD --> PG
    ML_POD --> REDIS
    ML_POD --> S3
    INGEST_POD --> PG
    INGEST_POD --> S3

    API_POD --> PROM
    ML_POD --> PROM
    PROM --> GRAF

    style Cloud fill:#e3f2fd,stroke:#1565c0
    style K8s fill:#e8f5e9,stroke:#2e7d32
    style Data fill:#fff3e0,stroke:#e65100
    style Monitor fill:#f3e5f5,stroke:#6a1b9a
```

---

## 5. Security Architecture

| Layer | Security Measure | Implementation |
|-------|-----------------|----------------|
| **Network** | VPC with private subnets | All services in private subnet; only API & Dashboard public |
| **Authentication** | JWT + OAuth2 | API keys for M2M; SSO for dashboard |
| **Authorization** | RBAC | Roles: Admin, Operator, Viewer, API Consumer |
| **Data** | Encryption at rest + transit | AES-256 at rest; TLS 1.3 in transit |
| **API** | Rate limiting + API keys | 1000 req/min per key; DDOS protection via CDN |
| **Secrets** | Vault/KMS | No secrets in code; rotated every 90 days |
| **Audit** | Comprehensive logging | All access logged with user, timestamp, action |

```mermaid
graph LR
    subgraph Public["Public Zone"]
        USER["👤 User / Client"]
    end

    subgraph DMZ["DMZ"]
        CDN["CloudFront CDN<br/>+ WAF"]
        LB2["Load Balancer<br/>TLS Termination"]
    end

    subgraph Private["Private Subnet (VPC)"]
        API2["FastAPI<br/>(JWT Auth)"]
        WORKER["Celery Workers"]
        DB2[("PostgreSQL<br/>Encrypted at Rest")]
        VAULT["HashiCorp Vault<br/>(Secrets)"]
    end

    USER -->|HTTPS/TLS 1.3| CDN
    CDN --> LB2
    LB2 --> API2
    API2 -->|RBAC| WORKER
    API2 --> DB2
    API2 -.->|Secret Fetch| VAULT

    style Public fill:#ffcdd2,stroke:#b71c1c
    style DMZ fill:#fff9c4,stroke:#f57f17
    style Private fill:#c8e6c9,stroke:#2e7d32
```

---

## 6. Scalability & Performance

| Metric | Requirement | Design Decision |
|--------|------------|-----------------|
| **Panchayats Served** | 2.5 lakh+ | Horizontal scaling of worker pods |
| **Forecast Latency** | < 30 min from IMD release | Pre-computed static features; parallel inference |
| **API Response Time** | < 100ms (p99) | Redis caching; pre-computed results |
| **SMS Delivery** | 1 Crore+ messages/day | Distributed SMS gateway; bulk API |
| **Data Storage** | 5+ years of forecasts | Partitioned PostgreSQL; cold storage on S3 |
| **Model Retraining** | Weekly | Automated pipeline with MLflow |
| **Concurrent Users** | 10,000+ dashboard users | CDN + load-balanced React app |

---

*Document Version: 2.0 | Last Updated: September 2026*
