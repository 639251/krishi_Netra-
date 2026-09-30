# 🌐 Data Sources

> **Complete Guide to All Data Sources, Access Methods, and Licensing**

---

## 1. Data Sources Summary

| # | Dataset | Source Organization | Access Method | Cost | Update Frequency |
|---|---------|-------------------|--------------|------|-----------------|
| 1 | Block-Level Weather Forecasts | IMD (India Meteorological Department) | API / FTP | Free (Gov) | 2x Daily |
| 2 | Digital Elevation Model (DEM) | NASA / USGS (SRTM) | HTTP Download | Free | One-time (Static) |
| 3 | Land Use / Land Cover (LULC) | ISRO NRSC / Bhuvan | Portal Download | Free (Gov) | Annual |
| 4 | Soil Maps | NBSS&LUP / SoilGrids | Portal / API | Free | One-time (Static) |
| 5 | AWS Weather Station Readings | IMD | API / FTP | Free (Gov MoU) | Hourly |
| 6 | Administrative Boundaries | Survey of India / Census | Portal Download | Free (Gov) | Decadal (Census) |
| 7 | Crop Calendar Data | ICAR / State Agri Depts | Manual Collection | Free | Seasonal |
| 8 | Satellite Weather (Supplementary) | ISRO MOSDAC / EUMETSAT | Portal / API | Free | Sub-daily |

---

## 2. Detailed Source Information

### 2.1 IMD Block-Level Weather Forecasts

| Property | Detail |
|----------|--------|
| **Organization** | India Meteorological Department (IMD), MoES |
| **Portal** | https://mausam.imd.gov.in |
| **API Endpoint** | https://api.imd.gov.in/v1/forecast/block (requires registration) |
| **Alternative Access** | FTP: `ftp://ftp.imd.gov.in/gfs/` (GRIB2 files) |
| **Data Format** | GRIB2, NetCDF4, JSON (API) |
| **Spatial Coverage** | All India (~6,500 blocks) |
| **Temporal Coverage** | 2015-present (historical); Real-time (current) |
| **Update Frequency** | 2x daily (06:00 IST, 12:00 IST) |
| **Forecast Range** | 1-5 days ahead |
| **Variables** | Temperature (Max/Min), Rainfall, Humidity, Wind Speed/Direction, Cloud Cover |
| **Resolution** | ~25 km (0.25° × 0.25° grid) |
| **Access Requirements** | MoU with IMD; Government project registration |
| **License** | Government of India Open Data License |
| **Contact** | Director General, IMD, Lodi Road, New Delhi |

**How to Access:**
```bash
# Option 1: IMD API (after registration)
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.imd.gov.in/v1/forecast/block?block_id=MH_PUNE_MULSHI&date=2026-09-26"

# Option 2: FTP for GRIB2 files
wget ftp://ftp.imd.gov.in/gfs/gfs_0p25_2026092506.grib2

# Option 3: Python
import xarray as xr
import cfgrib
ds = xr.open_dataset('gfs_0p25_2026092506.grib2', engine='cfgrib')
```

---

### 2.2 NASA SRTM Digital Elevation Model

| Property | Detail |
|----------|--------|
| **Organization** | NASA / USGS |
| **Portal** | https://earthexplorer.usgs.gov |
| **Direct Download** | https://dwtkns.com/srtm30m/ |
| **Alternative** | OpenTopography: https://opentopography.org |
| **Data Format** | GeoTIFF (HGT files) |
| **Resolution** | 1 arc-second (~30m) — SRTM GL1 |
| **Spatial Coverage** | 60°N to 56°S (covers all of India) |
| **Vertical Accuracy** | ±16m (absolute), ±6m (relative) |
| **CRS** | EPSG:4326 (WGS84, geographic) |
| **Tiles** | 1° × 1° tiles, named by SW corner (e.g., N18E073.hgt) |
| **Total Size (India)** | ~100 GB (all tiles covering 8°N-37°N, 68°E-97°E) |
| **Access Requirements** | Free; USGS EarthExplorer account |
| **License** | Public Domain |

**How to Access:**
```bash
# Download individual tile
wget https://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/N18E073.SRTMGL1.hgt.zip

# Bulk download for India (using script)
python scripts/download_srtm_india.py --output-dir data/dem/

# Python reading
import rasterio
with rasterio.open('N18E073.hgt') as src:
    elevation = src.read(1)  # 2D array of elevation values
    print(f"Shape: {elevation.shape}")  # (3601, 3601)
    print(f"Resolution: {src.res}")     # (0.000278, 0.000278) degrees
```

**India Tile Coverage:**
```
Tiles needed: ~870 tiles
Latitude range:  N08 to N36  (29 rows)
Longitude range: E068 to E097 (30 columns)
```

---

### 2.3 ISRO LULC Maps (Land Use / Land Cover)

| Property | Detail |
|----------|--------|
| **Organization** | ISRO National Remote Sensing Centre (NRSC) |
| **Portal** | https://bhuvan.nrsc.gov.in |
| **Data Product** | LULC 50K (1:50,000 scale) |
| **Satellite Source** | Resourcesat-2 LISS-III (23.5m) / AWiFS (56m) |
| **Data Format** | GeoTIFF (classified raster), Shapefile (vector) |
| **Resolution** | 23.5m (LISS-III) or 56m (AWiFS) |
| **Classification** | Level-1: 9 classes; Level-2: 19 sub-classes |
| **Temporal Coverage** | 2005-06, 2011-12, 2015-16, 2021-22 (periodic updates) |
| **CRS** | EPSG:4326 |
| **Access Requirements** | Bhuvan account (free registration) |
| **License** | Government of India; Free for research/government use |
| **Alternative Source** | ESA WorldCover (10m, global, free): https://worldcover2021.esa.int |

**How to Access:**
```bash
# Option 1: Bhuvan Portal
# 1. Register at https://bhuvan.nrsc.gov.in
# 2. Navigate to: Data → Thematic Data → LULC
# 3. Select state/district → Download GeoTIFF

# Option 2: ESA WorldCover (Alternative)
wget https://worldcover2021.esa.int/download/v200/ESA_WorldCover_10m_2021_v200_N18E073_Map.tif

# Python reading
import rasterio
with rasterio.open('lulc_maharashtra_2021.tif') as src:
    lulc = src.read(1)
    # Values: 1=Cropland, 2=Forest, 3=Grassland, etc.
```

---

### 2.4 Soil Data

| Property | Detail |
|----------|--------|
| **Organization** | NBSS&LUP (National Bureau of Soil Survey & Land Use Planning) |
| **Portal** | https://www.nbsslup.in |
| **Alternative** | ISRIC SoilGrids (global): https://soilgrids.org |
| **Data Format** | Shapefile (vector polygons), GeoTIFF (raster) |
| **Resolution** | 1:250,000 scale (NBSS); 250m (SoilGrids) |
| **Variables** | Soil type, texture, depth, drainage, pH, organic carbon |
| **CRS** | EPSG:4326 |
| **Access Requirements** | Request from NBSS&LUP; SoilGrids is open access |
| **License** | Government use (NBSS); CC-BY 4.0 (SoilGrids) |

**How to Access:**
```bash
# Option 1: NBSS&LUP
# Contact: nbss@icar.gov.in
# Request soil map shapefiles for project area

# Option 2: ISRIC SoilGrids API (global, 250m)
curl "https://rest.isric.org/soilgrids/v2.0/properties/query?lon=73.85&lat=18.52&property=clay&depth=0-5cm"

# Option 3: SoilGrids WCS
import rasterio
url = "https://files.isric.org/soilgrids/latest/data/clay/clay_0-5cm_mean.vrt"
with rasterio.open(url) as src:
    window = src.window(73.0, 18.0, 74.0, 19.0)
    clay = src.read(1, window=window)
```

---

### 2.5 AWS (Automatic Weather Station) Readings

| Property | Detail |
|----------|--------|
| **Organization** | IMD |
| **Network** | ~7,000 AWS + 1,350 ARG (Automatic Rain Gauges) |
| **Portal** | https://city.imd.gov.in/citywx/awsdata.php |
| **Alternative** | IITM Pune Data Portal: https://www.tropmet.res.in |
| **Data Format** | CSV, JSON (API) |
| **Variables** | Temperature, Rainfall, Humidity, Wind, Pressure, Sunshine |
| **Temporal Resolution** | Hourly (AWS); Daily (manual observatories) |
| **Quality Control** | IMD QC flags (0=Good, 1=Suspect, 2=Missing) |
| **Access Requirements** | MoU with IMD for bulk historical data |
| **Historical Depth** | AWS: 2010-present; Manual stations: 1950-present |

**How to Access:**
```bash
# IMD API for real-time AWS data
curl "https://api.imd.gov.in/v1/aws/readings?station_id=42811&date=2026-09-25"

# Historical data: Request via MoU
# Contact: climatology@imd.gov.in

# Python
import pandas as pd
aws_data = pd.read_csv('aws_readings_maharashtra_2025.csv',
                       parse_dates=['datetime'])
```

---

### 2.6 Administrative Boundaries (Panchayat/Block/District)

| Property | Detail |
|----------|--------|
| **Organization** | Survey of India / Census of India |
| **Portal** | https://lgdirectory.gov.in (Local Government Directory) |
| **Alternative** | GADM: https://gadm.org ; Datameet: https://github.com/datameet |
| **Data Format** | Shapefile, GeoJSON |
| **Levels** | State → District → Sub-District → Block → Village/Panchayat |
| **CRS** | EPSG:4326 |
| **Access** | LGD portal (free); Census spatial data (request-based) |

**How to Access:**
```bash
# Option 1: LGD API
curl "https://lgdirectory.gov.in/api/v1/panchayats?state=27&district=521"

# Option 2: Datameet Community (Open Source)
git clone https://github.com/datameet/maps.git
# Contains: India district, sub-district, village boundaries

# Option 3: GADM (Global Administrative Areas)
wget https://geodata.ucdavis.edu/gadm/gadm4.1/shp/gadm41_IND_shp.zip
```

---

### 2.7 Crop Calendar Data

| Property | Detail |
|----------|--------|
| **Organization** | ICAR / State Agricultural Universities |
| **Portal** | https://farmer.gov.in |
| **Alternative** | Crop Calendar by FAO: https://cropcalendar.apps.fao.org |
| **Data Format** | CSV, Excel, PDF (manual digitization needed) |
| **Coverage** | Major crops × Agro-climatic zones × Seasons |
| **Variables** | Crop, Region, Sowing window, Flowering, Harvest, Critical stages |

---

### 2.8 Satellite Weather Data (Supplementary)

| Property | Detail |
|----------|--------|
| **Organization** | ISRO MOSDAC / NOAA / EUMETSAT |
| **Portal** | https://mosdac.gov.in |
| **Satellites** | INSAT-3D/3DR, GPM, MODIS, Sentinel-3 |
| **Variables** | Cloud Top Temperature, Outgoing Longwave Radiation, SST, NDVI |
| **Resolution** | 4-8 km (INSAT); 10 km (GPM rain); 250m-1km (MODIS) |
| **Access** | Free (MOSDAC registration) |

---

## 3. Data Access Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACQUISITION PIPELINE                 │
│                                                             │
│  ONE-TIME SETUP (Static Data):                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  NASA SRTM ──download──▶ DEM tiles ──process──▶ DB    │ │
│  │  ISRO LULC ──download──▶ LULC maps ──process──▶ DB    │ │
│  │  NBSS Soil ──request───▶ Soil maps ──process──▶ DB    │ │
│  │  Census    ──download──▶ Boundaries ──import──▶ DB     │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  RECURRING (Dynamic Data):                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  IMD API ──2x/day──▶ Block Forecasts ──ingest──▶ DB   │ │
│  │  IMD AWS ──hourly───▶ Station Readings ──QC────▶ DB   │ │
│  │  MOSDAC  ──6-hourly─▶ Satellite Data ──process─▶ DB   │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ANNUAL UPDATES:                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  ISRO LULC ──annual──▶ Updated LULC ──reprocess──▶ DB │ │
│  │  ICAR     ──seasonal─▶ Crop Calendar ──update───▶ DB  │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Licensing Summary

| Dataset | License | Commercial Use | Attribution Required |
|---------|---------|---------------|---------------------|
| IMD Forecasts | Govt. of India Open Data | Yes (with MoU) | Yes |
| NASA SRTM | Public Domain | Yes | Not required |
| ISRO LULC | Govt. of India | Govt/Research only | Yes |
| ESA WorldCover | CC-BY 4.0 | Yes | Yes |
| NBSS Soil | Govt. of India | Govt/Research only | Yes |
| SoilGrids | CC-BY 4.0 | Yes | Yes |
| IMD AWS | Govt. of India | With MoU | Yes |
| GADM Boundaries | Free for academic | No commercial | Yes |
| Census Boundaries | Govt. of India | Public use | Yes |

---

## 5. Data Storage Requirements

| Dataset | Raw Size | Processed Size | Storage Location |
|---------|---------|----------------|-----------------|
| DEM (SRTM, all India) | ~100 GB | ~500 MB (Panchayat features) | S3 (raw) + PostgreSQL (features) |
| LULC (India) | ~20 GB | ~300 MB (Panchayat features) | S3 (raw) + PostgreSQL (features) |
| Soil Maps | ~5 GB | ~100 MB (features) | S3 (raw) + PostgreSQL (features) |
| Block Forecasts (5 yr) | ~18 GB | ~5 GB (Parquet) | S3 + PostgreSQL |
| AWS Readings (5 yr) | ~8 GB | ~3.5 GB (Parquet) | S3 + PostgreSQL |
| Admin Boundaries | ~2 GB | ~500 MB (simplified) | PostgreSQL (PostGIS) |
| Satellite Data | ~50 GB | ~10 GB (features) | S3 |
| **Total** | **~203 GB** | **~20 GB** | — |

---

*Document Version: 1.0 | Last Updated: September 2026*
