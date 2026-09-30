"""System constants and enumerations for KrishiNetra."""
from enum import Enum
from typing import Dict, Tuple

class WeatherParam(str, Enum):
    TEMP_MAX = "temperature_max"
    TEMP_MIN = "temperature_min"
    RAINFALL = "rainfall"
    HUMIDITY = "relative_humidity"
    WIND_SPEED = "wind_speed"
    WIND_DIRECTION = "wind_direction"
    SOLAR_RADIATION = "solar_radiation"
    SOIL_MOISTURE = "soil_moisture"

class Severity(str, Enum):
    GREEN = "green"          # Normal conditions
    YELLOW = "yellow"        # Watch: Moderate weather
    ORANGE = "orange"        # Warning: Severe weather
    RED = "red"              # Alert: Extreme weather

class LULCClass(str, Enum):
    CROPLAND = "cropland"
    FOREST_DENSE = "forest_dense"
    FOREST_OPEN = "forest_open"
    GRASSLAND = "grassland"
    BARREN = "barren"
    BUILT_UP = "built_up"
    WATER_BODY = "water_body"
    WETLAND = "wetland"
    PLANTATION = "plantation"

class SoilType(str, Enum):
    ALLUVIAL = "alluvial"
    BLACK_COTTON = "black_cotton"
    RED_LATERITE = "red_laterite"
    DESERT_SANDY = "desert_sandy"
    MOUNTAIN = "mountain"
    SALINE_ALKALINE = "saline_alkaline"

class CropStage(str, Enum):
    SOWING = "sowing"
    GERMINATION = "germination"
    VEGETATIVE = "vegetative"
    FLOWERING = "flowering"
    GRAIN_FILLING = "grain_filling"
    MATURITY = "maturity"
    HARVEST = "harvest"

class CropType(str, Enum):
    RICE = "rice"
    WHEAT = "wheat"
    COTTON = "cotton"
    SOYBEAN = "soybean"
    GRAPES = "grapes"
    SUGARCANE = "sugarcane"
    ONION = "onion"
    MUSTARD = "mustard"

class ActionType(str, Enum):
    IRRIGATION = "irrigation"
    SPRAYING = "spraying"
    HARVESTING = "harvesting"
    PROTECTION = "protection"
    FERTILIZATION = "fertilization"
    PEST_MANAGEMENT = "pest_management"

PHYSICAL_BOUNDS: Dict[str, Tuple[float, float]] = {
    "temp_max": (-10.0, 55.0),
    "temp_min": (-15.0, 40.0),
    "rainfall": (0.0, 500.0),
    "humidity": (0.0, 100.0),
    "wind_speed": (0.0, 200.0),
    "solar_radiation": (0.0, 1200.0),
    "soil_moisture": (0.0, 100.0),
}

STANDARD_LAPSE_RATE = -6.5  # °C per 1000m (Environmental Lapse Rate)
DEFAULT_CRS = "EPSG:4326"
DEFAULT_GRID_SIZE_KM = 1.0
