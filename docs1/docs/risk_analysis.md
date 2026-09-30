# 🔒 Risk Analysis

> **Risk Assessment, Mitigation Strategies, and Contingency Plans**

---

## 1. Risk Matrix

```
                          IMPACT
            ┌────────┬────────┬────────┬────────┐
            │  Low   │ Medium │  High  │Critical│
    ┌───────┼────────┼────────┼────────┼────────┤
    │ High  │   🟡   │   🟠   │  🔴    │  🔴   │
    │       │        │  R5,R9 │  R3    │  R1    │
P   ├───────┼────────┼────────┼────────┼────────┤
R   │Medium │   🟢   │   🟡   │  🟠    │  🔴   │
O   │       │  R10   │  R6,R7 │ R2,R4  │  R8    │
B   ├───────┼────────┼────────┼────────┼────────┤
A   │ Low   │   🟢   │   🟢   │  🟡    │  🟠   │
B   │       │        │  R11   │  R12   │        │
    ├───────┼────────┼────────┼────────┼────────┤
    │V.Low  │   🟢   │   🟢   │  🟢    │  🟡   │
    │       │        │        │  R13   │        │
    └───────┴────────┴────────┴────────┴────────┘
```

---

## 2. Risk Register

### R1: IMD Data Access Delay 🔴

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R1 |
| **Category** | Data |
| **Probability** | High |
| **Impact** | Critical |
| **Description** | MoU with IMD for historical and real-time data access takes longer than expected due to bureaucratic processes. This blocks the entire project. |
| **Trigger** | MoU not signed within 2 months of project start |
| **Mitigation** | 1. Initiate MoU process before project formally starts 2. Use ECMWF ERA5 reanalysis data (open access) as interim training data 3. Use open IMD data available on data.gov.in 4. Engage senior MoES officials for expedited approval |
| **Contingency** | Switch to ERA5 + GPM + open satellite data for proof of concept; integrate IMD data when available |
| **Owner** | Project Manager |

---

### R2: ML Model Accuracy Below Target 🟠

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R2 |
| **Category** | Technical |
| **Probability** | Medium |
| **Impact** | High |
| **Description** | The ML model fails to achieve RMSE < 2°C for temperature or < 5mm for rainfall on the test set. |
| **Trigger** | After Phase 2, model RMSE is 20%+ above target |
| **Mitigation** | 1. Start with simple models, progressively add complexity 2. Try alternative algorithms (LightGBM, Transformer, DeepKriging) 3. Add more features (satellite NDVI, soil moisture) 4. Increase training data duration 5. Use transfer learning from global climate models |
| **Contingency** | Accept higher RMSE for initial version; focus on high-variation areas first; use physics-based corrections |
| **Owner** | ML Engineer |

---

### R3: Insufficient Ground Truth Data 🔴

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R3 |
| **Category** | Data |
| **Probability** | High |
| **Impact** | High |
| **Description** | AWS station network is too sparse in pilot area. Some blocks may have zero stations within them, making local validation impossible. |
| **Trigger** | <3 AWS stations per block in pilot district |
| **Mitigation** | 1. Deploy 20 temporary low-cost IoT stations in pilot area 2. Use citizen science data (farmer self-reporting via app) 3. Use satellite-derived products (GPM rainfall, MODIS LST) as proxy ground truth 4. Choose pilot district with dense AWS network |
| **Contingency** | Use satellite data as primary ground truth; reduce spatial granularity from 1km to 5km |
| **Owner** | Data Engineer + Field Team |

---

### R4: Cloud Infrastructure Costs Exceed Budget 🟠

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R4 |
| **Category** | Financial |
| **Probability** | Medium |
| **Impact** | High |
| **Description** | GPU training costs, database storage, and SMS delivery costs exceed the ₹4.5 Crore budget. |
| **Trigger** | Monthly cloud spend exceeds ₹8 lakhs |
| **Mitigation** | 1. Use NIC Cloud (government cloud with subsidized rates) 2. Use spot/preemptible GPU instances for training 3. Optimize model inference to run on CPU only 4. Implement data archival strategy for old forecasts 5. Negotiate government SMS rates |
| **Contingency** | Request supplementary budget from MoES; reduce scope to priority states |
| **Owner** | Project Manager + DevOps |

---

### R5: Low Farmer Adoption 🟠

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R5 |
| **Category** | Social |
| **Probability** | High |
| **Impact** | Medium |
| **Description** | Farmers don't engage with the advisory system due to digital literacy barriers, language issues, or distrust of government weather data. |
| **Trigger** | <30% of pilot farmers read/use advisories after 3 months |
| **Mitigation** | 1. Partner with Krishi Vigyan Kendras (KVKs) for awareness 2. Deliver via WhatsApp (familiar platform) and SMS (no smartphone needed) 3. Use simple, actionable language in local dialect 4. Include voice messages in local language 5. Demonstrate accuracy through visible correct predictions |
| **Contingency** | Pivot to B2G model (sell to government agencies for internal use); focus on extension workers as primary users |
| **Owner** | Field Coordinator + Agri Expert |

---

### R6: Data Quality Issues 🟡

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R6 |
| **Category** | Data |
| **Probability** | Medium |
| **Impact** | Medium |
| **Description** | AWS station data has significant quality issues (sensor drift, missing readings, incorrect timestamps), degrading model training. |
| **Trigger** | >30% of station data flagged as suspect during QC |
| **Mitigation** | 1. Implement robust QC pipeline with multi-level checks 2. Use spatial consistency checks (compare with neighbors) 3. Maintain exclusion list for unreliable stations 4. Cross-validate with satellite observations |
| **Contingency** | Reduce training data to high-quality stations only; weight training samples by data quality score |
| **Owner** | Data Engineer |

---

### R7: Geopolitical Data Sensitivity 🟡

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R7 |
| **Category** | Legal/Compliance |
| **Probability** | Medium |
| **Impact** | Medium |
| **Description** | High-resolution spatial data for border areas or sensitive regions may have restrictions from Survey of India. |
| **Trigger** | Legal notice about restricted area data usage |
| **Mitigation** | 1. Consult Survey of India guidelines before processing border areas 2. Exclude restricted areas from initial deployment 3. Use only government-approved administrative boundaries 4. Get security clearance for the system |
| **Contingency** | Mask/exclude sensitive border areas; deploy only in interior districts |
| **Owner** | Project Manager + Legal |

---

### R8: System Downtime During Critical Weather 🔴

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R8 |
| **Category** | Operational |
| **Probability** | Medium |
| **Impact** | Critical |
| **Description** | System goes down during a critical weather event (cyclone, heavy rainfall) when farmers need advisories most. |
| **Trigger** | API unavailability during severe weather event |
| **Mitigation** | 1. Multi-AZ deployment with automatic failover 2. Pre-compute and cache forecasts for severe weather events 3. Have fallback SMS channel that doesn't depend on API 4. 99.9% uptime SLA with provider 5. Dedicated on-call during monsoon season |
| **Contingency** | Manual advisory dissemination through KVKs and block-level officers; pre-positioned generic severe weather advisories |
| **Owner** | DevOps + Operations |

---

### R9: Model Concept Drift 🟠

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R9 |
| **Category** | Technical |
| **Probability** | High |
| **Impact** | Medium |
| **Description** | Climate change or land use changes cause the trained model to degrade over time. Relationships learned from historical data no longer hold. |
| **Trigger** | Model RMSE degrades by >15% over 6 months |
| **Mitigation** | 1. Automated drift detection (compare prediction errors over rolling window) 2. Monthly model retraining with latest data 3. Annual LULC update to capture land use changes 4. Monitor for climate trend changes in covariates |
| **Contingency** | Automatic rollback to last known good model; alert team for investigation |
| **Owner** | ML Engineer + MLOps |

---

### R10: SMS/WhatsApp Delivery Failures 🟢

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R10 |
| **Category** | Operational |
| **Probability** | Medium |
| **Impact** | Low |
| **Description** | SMS gateway fails or WhatsApp API rate limits prevent timely advisory delivery. |
| **Trigger** | Delivery rate drops below 85% |
| **Mitigation** | 1. Multi-provider SMS setup (MSG91 + backup provider) 2. Staggered sending to avoid rate limits 3. Priority queue for severe weather alerts 4. IVR (voice call) fallback for critical alerts |
| **Contingency** | Switch to backup SMS provider; direct call to gram panchayat sarpanch for critical alerts |
| **Owner** | Backend Dev |

---

### R11: Team Attrition 🟢

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R11 |
| **Category** | HR |
| **Probability** | Low |
| **Impact** | Medium |
| **Description** | Key team members (especially ML engineers) leave during the project. |
| **Trigger** | >2 critical team members resign within a quarter |
| **Mitigation** | 1. Comprehensive documentation of all code and decisions 2. Code reviews to ensure knowledge sharing 3. At least 2 people familiar with each module 4. Competitive compensation and project ownership |
| **Contingency** | Engage consulting firm for interim support; extend timeline for Phase 3-4 |
| **Owner** | Project Manager |

---

### R12: Scalability Bottleneck 🟡

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R12 |
| **Category** | Technical |
| **Probability** | Low |
| **Impact** | High |
| **Description** | System cannot scale to handle 2.5 lakh Panchayats within the 30-minute latency window. |
| **Trigger** | Full India forecast cycle takes >60 minutes |
| **Mitigation** | 1. Horizontal scaling of inference workers 2. Pre-compute static features (compute once, cache forever) 3. Batch processing with parallel workers 4. Optimize model inference (ONNX runtime) 5. Database query optimization with proper indexing |
| **Contingency** | Increase infrastructure; shard by state/region; accept 1-hour latency for low-priority areas |
| **Owner** | DevOps + Backend Dev |

---

### R13: Regulatory Changes 🟢

| Attribute | Detail |
|-----------|--------|
| **Risk ID** | R13 |
| **Category** | Legal |
| **Probability** | Very Low |
| **Impact** | High |
| **Description** | New data protection regulations (DPDP Act implementation) impose restrictions on farmer data collection or weather data sharing. |
| **Trigger** | New regulation published affecting the project |
| **Mitigation** | 1. Follow privacy-by-design principles from the start 2. Minimize personal data collection (only phone number, location) 3. Anonymize all data in analytics 4. Legal review of data policies quarterly |
| **Contingency** | Modify data collection to comply; switch to opt-in model; work with legal team on compliance |
| **Owner** | Project Manager + Legal |

---

## 3. Risk Summary Table

| ID | Risk | Prob | Impact | Score | Status |
|----|------|------|--------|-------|--------|
| R1 | IMD Data Access Delay | High | Critical | 🔴 | Active — MoU initiated |
| R2 | Model Accuracy Below Target | Medium | High | 🟠 | Monitoring |
| R3 | Insufficient Ground Truth | High | High | 🔴 | Active — Station audit underway |
| R4 | Budget Overrun | Medium | High | 🟠 | Monitoring |
| R5 | Low Farmer Adoption | High | Medium | 🟠 | Active — KVK partnership planned |
| R6 | Data Quality Issues | Medium | Medium | 🟡 | QC pipeline being built |
| R7 | Geopolitical Data Sensitivity | Medium | Medium | 🟡 | Legal review pending |
| R8 | Downtime During Critical Weather | Medium | Critical | 🔴 | Multi-AZ architecture planned |
| R9 | Model Concept Drift | High | Medium | 🟠 | Retraining pipeline planned |
| R10 | SMS Delivery Failures | Medium | Low | 🟢 | Multi-provider setup planned |
| R11 | Team Attrition | Low | Medium | 🟢 | Documentation practices in place |
| R12 | Scalability Bottleneck | Low | High | 🟡 | Load testing planned |
| R13 | Regulatory Changes | Very Low | High | 🟢 | Quarterly legal review |

---

*Document Version: 1.0 | Last Updated: September 2026*
