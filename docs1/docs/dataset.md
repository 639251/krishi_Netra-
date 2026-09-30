# 📦 Dataset Description

> **Data Schema, Formats, Preprocessing, and Feature Engineering**

---

## 1. Dataset Overview

The system uses **5 primary datasets** that are combined to create the training and inference feature matrix:

```
┌─────────────────────────────────────────────────────────────┐
│                    DATASET ECOSYSTEM                         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ IMD Block   │  │ SRTM DEM    │  │ LULC Maps           │ │
│  │ Forecasts   │  │ (Elevation) │  │ (Land Use/Cover)    │ │
│  │ [Dynamic]   │  │ [Static]    │  │ [Semi-Static]       │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │               │                    │             │
│  ┌──────┴──────┐  ┌─────┴──────┐                          │
│  │ AWS Station │  │ Soil Maps  │                           │
│  │ Readings    │  │ (Soil Type)│                           │
│  │ [Dynamic]   │  │ [Static]   │                           │
│  └─────────────┘  └────────────┘                           │
│                                                             │
│  Combined into:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       UNIFIED FEATURE MATRIX                        │   │
│  │       ~15M rows × 35 features (5yr training data)   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Dataset 1: IMD Block-Level Forecasts

### 2.1 Description
Daily weather forecasts issued by IMD at the Block level, covering temperature, rainfall, humidity, wind, and cloud cover.

### 2.2 Schema

| Field | Type | Unit | Range | Description |
|-------|------|------|-------|-------------|
| `block_id` | string | — | — | Unique block identifier (e.g., "MH_PUNE_MULSHI") |
| `forecast_date` | date | — | — | Date the forecast is for |
| `issue_datetime` | datetime | IST | — | When the forecast was issued |
| `lead_days` | int | days | 1-5 | How many days ahead |
| `temp_max` | float | °C | -5 to 52 | Maximum temperature |
| `temp_min` | float | °C | -15 to 38 | Minimum temperature |
| `rainfall` | float | mm | 0 to 300 | Total rainfall in 24 hours |
| `relative_humidity` | float | % | 10 to 100 | Average relative humidity |
| `wind_speed` | float | km/h | 0 to 120 | Average wind speed |
| `wind_direction` | float | degrees | 0 to 360 | Dominant wind direction |
| `cloud_cover` | int | oktas | 0 to 8 | Sky cloud coverage |
| `weather_code` | int | — | 1-9 | IMD weather type code |

### 2.3 File Format
- **Primary**: GRIB2 (Binary Gridded data from GFS/WRF models)
- **Alternative**: NetCDF4 (for archived data)
- **Parsed to**: Pandas DataFrame / Xarray Dataset

### 2.4 Volume
- ~6,500 blocks × 5 lead days × 365 days/year = **~11.9M records/year**
- Historical: 5 years = **~59.5M records** (training)
- File size: ~50 MB per forecast cycle (2x daily)

### 2.5 Sample Data

```csv
block_id,forecast_date,issue_datetime,lead_days,temp_max,temp_min,rainfall,humidity,wind_speed,wind_direction,cloud_cover
MH_PUNE_MULSHI,2026-09-26,2026-09-25T06:00:00+05:30,1,32.0,24.5,15.0,78.0,12.0,270,6
MH_PUNE_MULSHI,2026-09-27,2026-09-25T06:00:00+05:30,2,30.5,23.8,22.0,82.0,15.0,260,7
MH_PUNE_MULSHI,2026-09-28,2026-09-25T06:00:00+05:30,3,29.0,23.0,8.0,75.0,10.0,280,4
```

---

## 3. Dataset 2: SRTM Digital Elevation Model (DEM)

### 3.1 Description
NASA Shuttle Radar Topography Mission provides near-global elevation data at 30m resolution.

### 3.2 Schema

| Field | Type | Unit | Range | Description |
|-------|------|------|-------|-------------|
| `latitude` | float | degrees | 8.0 to 37.0 (India) | WGS84 latitude |
| `longitude` | float | degrees | 68.0 to 97.5 (India) | WGS84 longitude |
| `elevation` | int16 | meters | -50 to 8,848 | Height above sea level |

### 3.3 Derived Features (Per Panchayat)

| Feature | Computation | Purpose |
|---------|-------------|---------|
| `elevation_mean` | Mean of all DEM pixels within Panchayat boundary | Average height |
| `elevation_std` | Std dev of elevation pixels | Terrain roughness |
| `elevation_min` | Minimum elevation | Valley depth |
| `elevation_max` | Maximum elevation | Peak height |
| `elevation_range` | Max - Min | Total relief |
| `elevation_anomaly` | Panchayat mean - Block mean | Relative height |
| `slope_mean` | Mean of slope grid (computed from DEM) | Average steepness |
| `slope_max` | Max slope | Steepest terrain |
| `aspect_dominant` | Mode of aspect grid | Dominant facing direction |
| `aspect_sin` | sin(dominant aspect) | Circular encoding (N-S component) |
| `aspect_cos` | cos(dominant aspect) | Circular encoding (E-W component) |
| `ruggedness_index` | Terrain Ruggedness Index (TRI) | Surface roughness |

### 3.4 File Format
- **Source**: GeoTIFF (one tile per 1° × 1° area)
- **Resolution**: 1 arc-second (~30m)
- **CRS**: EPSG:4326 (WGS84)
- **Total size for India**: ~100 GB (raw tiles)
- **Processed Panchayat features**: ~500 MB (CSV/Parquet)

### 3.5 Preprocessing Steps

```python
# DEM Preprocessing Pipeline
def process_dem_for_panchayat(dem_tiles, panchayat_boundary):
    """
    Steps:
    1. Mosaic relevant DEM tiles
    2. Clip to Panchayat boundary polygon
    3. Compute zonal statistics (mean, std, min, max)
    4. Compute slope and aspect grids
    5. Compute zonal statistics of slope/aspect
    6. Compute terrain ruggedness index
    7. Cache results (static — compute once)
    """
    # Step 1: Mosaic
    mosaic = merge_tiles(dem_tiles, panchayat_boundary.bounds)

    # Step 2: Clip
    clipped = clip_raster(mosaic, panchayat_boundary)

    # Step 3: Elevation stats
    elev_stats = zonal_stats(clipped, stats=['mean', 'std', 'min', 'max'])

    # Step 4: Slope and Aspect
    slope = compute_slope(clipped)       # degrees
    aspect = compute_aspect(clipped)     # degrees (0=N, 90=E, 180=S, 270=W)

    # Step 5: Slope/Aspect stats
    slope_stats = zonal_stats(slope, stats=['mean', 'max'])
    aspect_mode = circular_mode(aspect)

    # Step 6: TRI
    tri = compute_tri(clipped)

    return PanchayatElevationFeatures(
        elevation_mean=elev_stats['mean'],
        elevation_std=elev_stats['std'],
        slope_mean=slope_stats['mean'],
        aspect_dominant=aspect_mode,
        ruggedness_index=np.mean(tri)
    )
```

---

## 4. Dataset 3: Land Use / Land Cover (LULC)

### 4.1 Description
Classification of the Earth's surface into land use categories from satellite imagery, provided by ISRO's National Remote Sensing Centre.

### 4.2 Classification Schema

| Class Code | Category | Sub-categories |
|-----------|----------|----------------|
| 1 | **Cropland** | Kharif, Rabi, Double Crop, Plantation |
| 2 | **Forest (Dense)** | Evergreen, Deciduous, Mixed (canopy > 40%) |
| 3 | **Forest (Open)** | Scrub, Degraded, Canopy 10-40% |
| 4 | **Grassland** | Pasture, Grazing land |
| 5 | **Barren/Wasteland** | Rocky, Sandy, Salt flats |
| 6 | **Built-up** | Urban, Rural settlements, Roads |
| 7 | **Water Body** | Rivers, Lakes, Reservoirs, Ponds |
| 8 | **Wetland** | Mangroves, Marshes, Swamps |
| 9 | **Plantation** | Tea, Coffee, Rubber, Coconut |
| 10 | **Snow/Ice** | Glaciers, Permanent snow |

### 4.3 Derived Features (Per Panchayat)

| Feature | Computation | Purpose |
|---------|-------------|---------|
| `lulc_dominant` | Mode of LULC pixels | Primary land type |
| `lulc_cropland_pct` | % pixels = Cropland | Agricultural extent |
| `lulc_forest_pct` | % pixels = Forest (Dense + Open) | Forest cover |
| `lulc_urban_pct` | % pixels = Built-up | Urbanization level |
| `lulc_water_pct` | % pixels = Water Body | Water presence |
| `lulc_barren_pct` | % pixels = Barren | Barren land extent |
| `lulc_diversity` | Shannon entropy of class distribution | Land use heterogeneity |
| `ndvi_mean` | Mean NDVI from satellite | Vegetation greenness |

### 4.4 File Format
- **Source**: GeoTIFF (classified raster, ISRO/NRSC)
- **Resolution**: 56m (AWiFS) or 23.5m (LISS-III)
- **CRS**: EPSG:4326
- **Update Frequency**: Annual (LULC changes slowly)
- **Total size**: ~20 GB for India

---

## 5. Dataset 4: Soil Data

### 5.1 Description
Soil classification and properties from the National Bureau of Soil Survey and Land Use Planning (NBSS&LUP).

### 5.2 Schema

| Field | Type | Description |
|-------|------|-------------|
| `soil_type` | categorical | Major soil group (Alluvial, Black, Red, etc.) |
| `soil_texture` | categorical | Sandy, Loamy, Clayey, Silty |
| `soil_depth` | categorical | Shallow (<25cm), Medium (25-50cm), Deep (>50cm) |
| `drainage` | categorical | Well-drained, Moderately, Poorly drained |
| `water_holding_capacity` | float (mm/m) | Available water capacity |
| `organic_carbon` | float (%) | Organic matter content |
| `ph` | float | Soil acidity/alkalinity |

### 5.3 Why Soil Data Matters for Weather Downscaling

| Soil Property | Effect on Local Weather |
|---------------|------------------------|
| **Clay soils** | Retain moisture → higher local humidity after rain |
| **Sandy soils** | Drain quickly → lower humidity, faster drying |
| **Dark soils** | Absorb more heat → higher local temperatures |
| **Waterlogged soils** | Increase evaporation → localized cloud formation |

---

## 6. Dataset 5: Automatic Weather Station (AWS) Readings

### 6.1 Description
Ground truth weather observations from IMD's network of ~7,000 Automatic Weather Stations across India.

### 6.2 Schema

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `station_id` | string | — | Unique station identifier |
| `station_name` | string | — | Station location name |
| `latitude` | float | degrees | Station latitude |
| `longitude` | float | degrees | Station longitude |
| `elevation` | float | meters | Station altitude |
| `datetime` | datetime | IST | Observation timestamp |
| `temp_max` | float | °C | Observed maximum temperature |
| `temp_min` | float | °C | Observed minimum temperature |
| `rainfall` | float | mm | Observed rainfall (24-hr cumulative) |
| `humidity_0830` | float | % | RH at 0830 IST |
| `humidity_1730` | float | % | RH at 1730 IST |
| `wind_speed` | float | km/h | Average wind speed |
| `wind_direction` | float | degrees | Dominant wind direction |
| `pressure` | float | hPa | Station-level pressure |
| `sunshine_hours` | float | hours | Duration of sunshine |
| `quality_flag` | int | — | 0=Good, 1=Suspect, 2=Missing |

### 6.3 Usage
- **Training**: AWS readings serve as **ground truth (y)**. The model learns: "When the block forecast says X, and the location has these geographic features, the actual weather at this station was Y."
- **Validation**: Hold-out stations used to evaluate model accuracy.
- **Volume**: ~7,000 stations × 365 days × 5 years = **~12.8M records**

---

## 7. Unified Feature Matrix

### 7.1 Training Data Assembly

The training dataset is assembled by joining all 5 data sources:

```
For each (AWS_station, date) pair:
  1. Find the Block that contains this station
  2. Get the Block Forecast for that date
  3. Get the static features (elevation, LULC, soil) for the station location
  4. The AWS reading is the target variable (y)

Result:
┌──────────────────────────────────────────────────────────────────┐
│ TRAINING FEATURE MATRIX                                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  X (Features) — 35 columns:                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Block Forecast (7)  │ Elevation (6) │ LULC (7) │ Soil (4) │ │
│  │ • temp_max           │ • elev_mean   │ • crop%  │ • type    │ │
│  │ • temp_min           │ • elev_std    │ • forest%│ • texture │ │
│  │ • rainfall           │ • elev_anom   │ • urban% │ • depth   │ │
│  │ • humidity           │ • slope_mean  │ • water% │ • whc     │ │
│  │ • wind_speed         │ • aspect_sin  │ • barren%│           │ │
│  │ • wind_dir           │ • aspect_cos  │ • divers │           │ │
│  │ • cloud_cover        │               │ • ndvi   │           │ │
│  ├──────────────────────┼───────────────┴──────────┴───────────┤ │
│  │ Derived (7)          │ Spatial (4)                           │ │
│  │ • temp_lapse_est     │ • latitude                            │ │
│  │ • rain_orog_factor   │ • longitude                           │ │
│  │ • season             │ • dist_to_water                       │ │
│  │ • day_of_year        │ • dist_to_coast                       │ │
│  │ • lead_days          │                                       │ │
│  │ • block_elev_mean    │                                       │ │
│  │ • elev_diff_block    │                                       │ │
│  └──────────────────────┴───────────────────────────────────────┘ │
│                                                                  │
│  y (Targets) — 5 columns:                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ actual_temp_max │ actual_temp_min │ actual_rainfall │ ... │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Total rows: ~12.8M (5 years × 7,000 stations × 365 days)      │
│  Total size: ~3.5 GB (Parquet format, compressed)                │
└──────────────────────────────────────────────────────────────────┘
```

### 7.2 Data Split Strategy

| Split | Proportion | Method | Purpose |
|-------|-----------|--------|---------|
| **Training** | 70% | Years 1-3.5 (temporal) | Model training |
| **Validation** | 15% | Years 3.5-4.25 (temporal) | Hyperparameter tuning |
| **Test** | 15% | Years 4.25-5 (temporal) | Final evaluation |
| **Spatial CV** | 5-fold | Leave-One-Region-Out | Evaluate spatial generalization |

> **Important**: We use **temporal splits** (not random) to prevent data leakage from future dates. We also use **spatial cross-validation** to ensure the model generalizes to unseen locations.

---

## 8. Data Quality & Preprocessing

### 8.1 Quality Control Checks

| Check | Rule | Action |
|-------|------|--------|
| **Range Check** | temp_max ∈ [-10, 55] | Flag as suspect; impute if isolated |
| **Consistency** | temp_max > temp_min | Swap if reversed |
| **Rainfall** | rainfall ≥ 0 | Set negative values to 0 |
| **Humidity** | humidity ∈ [0, 100] | Clip to bounds |
| **Missing Data** | >20% missing in a station-month | Exclude that station-month |
| **Duplicates** | Same station + same datetime | Keep first occurrence |
| **Spatial Outlier** | Value > 3σ from neighboring stations | Flag and verify |
| **Temporal Jump** | |Δtemp| > 15°C in 24 hours | Flag as suspect |

### 8.2 Missing Data Imputation

| Method | When Used | Algorithm |
|--------|-----------|-----------|
| **Temporal Forward Fill** | Single day gaps | Fill from previous day |
| **Spatial IDW** | Station outage (< 7 days) | Inverse Distance Weighted from 5 nearest stations |
| **Climatological Mean** | Extended outage (> 7 days) | 30-year monthly mean for that station |
| **Model-Based** | Systematic gaps | Random Forest imputation using available features |

### 8.3 Feature Scaling

| Feature Type | Scaler | Range |
|-------------|--------|-------|
| Temperature | StandardScaler | z-score (mean=0, std=1) |
| Rainfall | Log1p + StandardScaler | log(1+x) then z-score |
| Elevation | RobustScaler | Median-centered, IQR-scaled |
| Percentage | None (already 0-100) | Divide by 100 |
| Circular (Aspect) | Sin/Cos encoding | [-1, 1] |
| Categorical (Soil) | OneHotEncoder | Binary columns |
| Day of Year | Sin/Cos encoding | [-1, 1] (captures seasonality) |

---

*Document Version: 1.0 | Last Updated: September 2026*
