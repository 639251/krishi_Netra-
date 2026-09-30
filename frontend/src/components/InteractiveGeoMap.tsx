import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  Activity, 
  Mountain, 
  TreePine, 
  Compass, 
  SplitSquareVertical, 
  CloudRain, 
  Thermometer, 
  ShieldCheck
} from 'lucide-react';
import type { PanchayatLocation } from '../types';
import { PANCHAYAT_LOCATIONS, UI_TRANSLATIONS } from '../data/mockData';

// Fix Leaflet Default Icon issue in React Vite
const customPanchayatIcon = new L.DivIcon({
  className: 'custom-panchayat-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 32px; height: 32px; background: #0C4A34; border: 2.5px solid #FFFFFF; border-radius: 50%; box-shadow: 0 4px 14px rgba(12,74,52,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
        🌱
      </div>
      <div style="position: absolute; width: 44px; height: 44px; border: 2px solid rgba(12,74,52,0.35); border-radius: 50%; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const customAwsIcon = new L.DivIcon({
  className: 'custom-aws-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 28px; height: 28px; background: #131E18; border: 2px solid #FFFFFF; border-radius: 10px; box-shadow: 0 4px 12px rgba(19,30,24,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
        📡
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

// Component to dynamically recenter map on location change
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

interface InteractiveGeoMapProps {
  selectedLocation: PanchayatLocation;
  onSelectLocation: (loc: PanchayatLocation) => void;
  currentLang: 'en' | 'hi' | 'mr' | 'ta';
}

export const InteractiveGeoMap: React.FC<InteractiveGeoMapProps> = ({
  selectedLocation,
  onSelectLocation,
  currentLang
}) => {
  const t = UI_TRANSLATIONS[currentLang];
  const [viewMode, setViewMode] = useState<'downscaled' | 'traditional'>('downscaled');
  const [activeLayer, setActiveLayer] = useState<'rain' | 'elevation' | 'temp' | 'ndvi'>('rain');

  // Generate a seamless 3x3 contiguous micro-grid (9 contiguous 1 km² cells)
  const centerLat = selectedLocation.lat;
  const centerLng = selectedLocation.lng;
  const cellStep = 0.009; // ~1 km precision

  const gridRows = [-1, 0, 1];
  const gridCols = [-1, 0, 1];

  const microGridCells = gridRows.flatMap((rowIdx) =>
    gridCols.map((colIdx) => {
      const latMin = centerLat + (rowIdx - 0.5) * cellStep;
      const latMax = centerLat + (rowIdx + 0.5) * cellStep;
      const lngMin = centerLng + (colIdx - 0.5) * cellStep;
      const lngMax = centerLng + (colIdx + 0.5) * cellStep;

      // Realistic topography variances based on cell position
      const elevOffset = (rowIdx * 35) - (colIdx * 20);
      const rainOffset = (rowIdx * 4.2) + (colIdx * -3.1);
      const tempOffset = -(elevOffset / 100) * 0.65;
      const ndviOffset = (rowIdx * 0.04) + (colIdx * 0.02);

      const cellElevation = Math.max(10, selectedLocation.elevation + elevOffset);
      const cellRain = Math.max(2, parseFloat((38.5 + rainOffset).toFixed(1)));
      const cellTemp = parseFloat((27.3 + tempOffset).toFixed(1));
      const cellNdvi = parseFloat(Math.min(0.95, Math.max(0.3, selectedLocation.ndvi + ndviOffset)).toFixed(2));

      const isCenter = rowIdx === 0 && colIdx === 0;
      const positionLabel = isCenter 
        ? `${selectedLocation.name} (Panchayat Core)` 
        : `1km Micro-Cell [${rowIdx > 0 ? 'N' : rowIdx < 0 ? 'S' : ''}${colIdx > 0 ? 'E' : colIdx < 0 ? 'W' : ''}]`;

      return {
        bounds: [
          [latMin, lngMin],
          [latMax, lngMax]
        ] as L.LatLngBoundsExpression,
        rain: cellRain,
        temp: cellTemp,
        elevation: cellElevation,
        ndvi: cellNdvi,
        label: positionLabel,
        isCenter
      };
    })
  );

  // 25 km IMD Block Coarse Bounding Box
  const blockBounds: L.LatLngBoundsExpression = [
    [centerLat - 0.12, centerLng - 0.12],
    [centerLat + 0.12, centerLng + 0.12]
  ];

  // Minimal 2-Color cohesive aesthetic for map cells
  const getCellColor = (cell: typeof microGridCells[0]) => {
    if (viewMode === 'traditional') {
      return '#0C4A34';
    }
    if (activeLayer === 'rain') {
      return cell.rain > 40 ? '#0C4A34' : cell.rain > 32 ? '#1B6A4E' : cell.rain > 24 ? '#3D8C6D' : '#6FAFA0';
    }
    if (activeLayer === 'elevation') {
      return cell.elevation > 150 ? '#0C4A34' : cell.elevation > 80 ? '#267356' : '#579C81';
    }
    if (activeLayer === 'temp') {
      return cell.temp > 28 ? '#0C4A34' : cell.temp > 26 ? '#2A7A5D' : '#64A990';
    }
    // NDVI
    return cell.ndvi > 0.8 ? '#0C4A34' : cell.ndvi > 0.65 ? '#277559' : '#5DA58B';
  };

  return (
    <div className="space-y-4">
      {/* Map Control Toolbar */}
      <div className="glass-card p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: View Mode Toggle (AI Downscaled vs Traditional IMD 25km) */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#55635B] dark:text-[#8FA89B] uppercase tracking-wider flex items-center">
            <SplitSquareVertical className="w-4 h-4 mr-1.5 text-[#0C4A34] dark:text-[#34D399]" />
            Grid Mode:
          </span>
          <div className="flex items-center p-1 rounded-full bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E]">
            <button
              onClick={() => setViewMode('downscaled')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'downscaled'
                  ? 'bg-[#0C4A34] text-white shadow-sm'
                  : 'text-[#55635B] dark:text-[#8FA89B] hover:text-[#131E18] dark:hover:text-white'
              }`}
            >
              Gram Panchayat Grid (1 km)
            </button>
            <button
              onClick={() => setViewMode('traditional')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'traditional'
                  ? 'bg-[#0C4A34] text-white shadow-sm'
                  : 'text-[#55635B] dark:text-[#8FA89B] hover:text-[#131E18] dark:hover:text-white'
              }`}
            >
              Taluka Block Average (25 km)
            </button>
          </div>
        </div>

        {/* Right: Layer Selector - Minimal 2-color styling */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#55635B] dark:text-[#8FA89B] uppercase tracking-wider flex items-center">
            <Layers className="w-4 h-4 mr-1.5 text-[#0C4A34] dark:text-[#34D399]" />
            Geo Layer:
          </span>
          <div className="flex items-center flex-wrap gap-1.5">
            <button
              onClick={() => setActiveLayer('rain')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeLayer === 'rain'
                  ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                  : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rainfall (mm)</span>
            </button>
            <button
              onClick={() => setActiveLayer('elevation')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeLayer === 'elevation'
                  ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                  : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>SRTM Elevation (m)</span>
            </button>
            <button
              onClick={() => setActiveLayer('temp')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeLayer === 'temp'
                  ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                  : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Thermal Lapse</span>
            </button>
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeLayer === 'ndvi'
                  ? 'bg-[#0C4A34] text-white font-bold shadow-sm'
                  : 'bg-white/80 dark:bg-[#142F24] text-[#131E18] dark:text-neutral-300 hover:bg-[#FAF9EE] border border-[#E6E9DC] dark:border-[#1B3B2E]'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>ISRO NDVI</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Map & Micro-Climate Inspection Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 h-[520px] rounded-3xl overflow-hidden shadow-md border border-[#E6E9DC] dark:border-[#1B3B2E] relative">
          
          <MapContainer
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapUpdater center={[selectedLocation.lat, selectedLocation.lng]} zoom={13} />

            {/* Base OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Traditional 25 km IMD Coarse Block Box */}
            {viewMode === 'traditional' ? (
              <Rectangle
                bounds={blockBounds}
                pathOptions={{
                  color: '#0C4A34',
                  fillColor: '#0C4A34',
                  fillOpacity: 0.2,
                  weight: 2,
                  dashArray: '6, 6'
                }}
              >
                <Popup>
                  <div className="p-2 font-sans">
                    <span className="text-[10px] font-bold text-[#0C4A34] uppercase">IMD GRIB2 Block Model</span>
                    <h4 className="font-bold text-sm mt-0.5 text-[#131E18]">{selectedLocation.block} Block (25 km Grid)</h4>
                    <p className="text-xs text-[#55635B] mt-1">
                      Uniform Taluka average estimate (15.0 mm Rain). Lacks 1 km micro-topography precision.
                    </p>
                  </div>
                </Popup>
              </Rectangle>
            ) : (
              /* KrishiNetra Seamless 3x3 Micro-Grid Cells */
              <>
                {microGridCells.map((cell, idx) => (
                  <Rectangle
                    key={idx}
                    bounds={cell.bounds}
                    pathOptions={{
                      color: '#0C4A34',
                      fillColor: getCellColor(cell),
                      fillOpacity: cell.isCenter ? 0.45 : 0.3,
                      weight: cell.isCenter ? 2 : 1
                    }}
                  >
                    <Popup>
                      <div className="p-2.5 font-sans">
                        <span className="text-[10px] font-bold text-[#0C4A34] uppercase">1 km² Micro-Grid Cell</span>
                        <h4 className="font-bold text-sm text-[#131E18]">{cell.label}</h4>
                        <div className="mt-2 text-xs space-y-1 text-[#3E4D45]">
                          <div><strong>Predicted Rain:</strong> {cell.rain} mm</div>
                          <div><strong>Predicted Temp:</strong> {cell.temp}°C</div>
                          <div><strong>SRTM Elevation:</strong> {cell.elevation} m</div>
                          <div><strong>NDVI Canopy:</strong> {cell.ndvi}</div>
                        </div>
                      </div>
                    </Popup>
                  </Rectangle>
                ))}
              </>
            )}

            {/* Panchayat Location Pins */}
            {PANCHAYAT_LOCATIONS.map(loc => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={customPanchayatIcon}
                eventHandlers={{
                  click: () => {
                    onSelectLocation(loc);
                  }
                }}
              >
                <Popup>
                  <div className="p-2 text-[#131E18] font-sans">
                    <span className="text-[10px] font-bold text-[#0C4A34] uppercase">Panchayat Micro-Grid</span>
                    <h4 className="font-bold text-sm">{loc.name}</h4>
                    <p className="text-xs text-[#55635B] mt-0.5">{loc.block} Block, {loc.district}</p>
                    <div className="mt-2 text-xs space-y-0.5 font-mono text-[#3E4D45]">
                      <div>Elev: {loc.elevation}m | Slope: {loc.slope}°</div>
                      <div>Soil: {loc.soilType}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* AWS (Automatic Weather Station) Pin */}
            <Marker
              position={[selectedLocation.lat + 0.012, selectedLocation.lng - 0.010]}
              icon={customAwsIcon}
            >
              <Popup>
                <div className="p-2 text-[#131E18] font-sans">
                  <span className="text-[10px] font-bold text-[#0C4A34] uppercase">Ground-Truth Station</span>
                  <h4 className="font-bold text-sm">{selectedLocation.awsStationName}</h4>
                  <p className="text-xs text-[#55635B]">IMD AWS Sensor Ground Network</p>
                  <div className="mt-2 text-xs text-[#0C4A34] font-semibold font-mono">
                    Live Telemetry: Active (Deviation: -0.8 mm)
                  </div>
                </div>
              </Popup>
            </Marker>

          </MapContainer>

          {/* Floating Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 dark:bg-[#0F241C]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-[#E6E9DC] dark:border-[#1B3B2E] text-xs">
            <span className="font-bold text-[#131E18] dark:text-white block mb-1.5">
              {viewMode === 'traditional' ? 'IMD 25km Block Outline' : `${activeLayer.toUpperCase()} 1km Gradient`}
            </span>
            {viewMode === 'traditional' ? (
              <div className="flex items-center space-x-2 text-[11px] text-[#55635B] dark:text-[#8FA89B]">
                <span className="w-3.5 h-3.5 bg-[#0C4A34]/30 rounded border border-[#0C4A34]"></span>
                <span>Uniform Block Value (25km)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#55635B] dark:text-[#8FA89B]">
                <span className="px-2 py-0.5 bg-[#6FAFA0] text-[#131E18] rounded-full font-bold">Low</span>
                <span>→</span>
                <span className="px-2 py-0.5 bg-[#1B6A4E] text-white rounded-full font-bold">Mid</span>
                <span>→</span>
                <span className="px-2 py-0.5 bg-[#0C4A34] text-white rounded-full font-bold">Peak</span>
              </div>
            )}
            <div className="mt-2 pt-2 border-t border-[#E6E9DC] dark:border-[#1B3B2E] flex items-center space-x-3 text-[11px] text-[#131E18] dark:text-white">
              <span className="flex items-center"><span className="mr-1">🌱</span> Panchayat Pin</span>
              <span className="flex items-center"><span className="mr-1">📡</span> IMD AWS</span>
            </div>
          </div>

        </div>

        {/* Micro-Climate Deep Inspection Panel - Minimal 2-Color Design */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-6 rounded-3xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E9DC] dark:border-[#1B3B2E]">
              <div>
                <span className="text-[11px] font-bold text-[#0C4A34] dark:text-[#34D399] uppercase tracking-wider">
                  Micro-Climate Inspection
                </span>
                <h3 className="text-lg font-bold text-[#131E18] dark:text-white">
                  {selectedLocation.name}
                </h3>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#EDF5EE] dark:bg-[#142F24] text-[#0C4A34] dark:text-[#6EE7B7]">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* 35 Geo-Covariates Feature Matrix - 2-Color Minimalist */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#55635B] dark:text-[#8FA89B] uppercase">
                Geo-Covariates (NASA / ISRO / NBSS)
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E]">
                  <div className="flex items-center space-x-1.5 text-xs text-[#55635B] dark:text-[#8FA89B]">
                    <Mountain className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />
                    <span>{t.elevation}</span>
                  </div>
                  <div className="text-base font-bold text-[#131E18] dark:text-white mt-1">
                    {selectedLocation.elevation} m
                  </div>
                  <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-mono">
                    NASA SRTM 30m DEM
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E]">
                  <div className="flex items-center space-x-1.5 text-xs text-[#55635B] dark:text-[#8FA89B]">
                    <Activity className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />
                    <span>{t.slope}</span>
                  </div>
                  <div className="text-base font-bold text-[#131E18] dark:text-white mt-1">
                    {selectedLocation.slope}° Angle
                  </div>
                  <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-mono">
                    Run-off Index: High
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E]">
                  <div className="flex items-center space-x-1.5 text-xs text-[#55635B] dark:text-[#8FA89B]">
                    <TreePine className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />
                    <span>Vegetation NDVI</span>
                  </div>
                  <div className="text-base font-bold text-[#131E18] dark:text-white mt-1">
                    {selectedLocation.ndvi}
                  </div>
                  <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-mono">
                    ISRO Bhuvan High-Res
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E]">
                  <div className="flex items-center space-x-1.5 text-xs text-[#55635B] dark:text-[#8FA89B]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0C4A34] dark:text-[#34D399]" />
                    <span>AWS Distance</span>
                  </div>
                  <div className="text-base font-bold text-[#131E18] dark:text-white mt-1">
                    {selectedLocation.nearestAwsDistanceKm} km
                  </div>
                  <span className="text-[10px] text-[#0C4A34] dark:text-[#6EE7B7] font-mono">
                    {selectedLocation.awsStationName}
                  </span>
                </div>
              </div>

              {/* Soil & Land Use */}
              <div className="p-3.5 rounded-2xl bg-[#FAF9EE] dark:bg-[#142F24] border border-[#E6E9DC] dark:border-[#1B3B2E] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#55635B] dark:text-[#8FA89B]">{t.soilType}:</span>
                  <span className="font-bold text-[#131E18] dark:text-white">{selectedLocation.soilType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#55635B] dark:text-[#8FA89B]">{t.landUse}:</span>
                  <span className="font-bold text-[#131E18] dark:text-white">{selectedLocation.landUse}</span>
                </div>
              </div>

            </div>

            {/* Scientific Rationale Banner */}
            <div className="p-4 rounded-2xl bg-[#EDF5EE] dark:bg-[#142F24] border border-[#CCE4D3] dark:border-[#1F4D3A] text-xs text-[#3E4D45] dark:text-[#D1E5D8] leading-relaxed">
              <span className="font-bold text-[#0C4A34] dark:text-[#34D399] block mb-1">
                💡 Scientific Insight: Why Block Forecasts Fail
              </span>
              Within a single 25 km block (~500 km²), orographic lifting and terrain slope create rainfall disparities of up to 77 mm. KrishiNetra utilizes a hybrid ensemble (RF + XGBoost + CNN U-Net) to rectify this bias at 1 km precision.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
