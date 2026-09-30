"""Backend Entry Point."""
import uvicorn
import sys
import os

# Add root directory to sys.path so imports resolve smoothly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.src.api.main import app

def main():
    print("=" * 65)
    print("       KRISHINETRA AGRO-MET DOWNSCALING API SERVER (SIH 2026)")
    print("   AI-Powered Hyper-Local Weather Intelligence for Indian Agriculture")
    print("=" * 65)
    print("-> Swagger API Docs:  http://localhost:8000/docs")
    print("-> Redoc API Docs:    http://localhost:8000/redoc")
    print("-> Health Endpoint:   http://localhost:8000/health")
    print("=" * 65)
    uvicorn.run("backend.src.api.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()
