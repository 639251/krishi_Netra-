from setuptools import setup, find_packages

setup(
    name="krishinetra-backend",
    version="2.3.1",
    description="Agro-Meteorological High-Resolution Downscaling System API Backend",
    author="Kosmonyx - SIH 2026",
    packages=find_packages(),
    python_requires=">=3.10",
    install_requires=[
        "fastapi>=0.104.0",
        "uvicorn>=0.24.0",
        "pydantic>=2.5.0",
        "sqlalchemy>=2.0.0",
        "scikit-learn>=1.3.0",
        "scipy>=1.11.0",
        "numpy>=1.25.0",
        "pandas>=2.1.0",
        "PyYAML>=6.0",
        "httpx>=0.25.0",
    ],
)
