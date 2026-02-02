# 3D Print Cost Analyzer

> Calculate 3D print costs and profits with real measurements – no guesswork!

A powerful web app for 3D printing enthusiasts and businesses. Built with vanilla HTML, CSS, and JavaScript – runs both locally in your browser and on a server for multi-device synchronization.

## Two Deployment Modes

### 1. Local Mode (Browser-Based)
- **No server required**: Open `index.html` directly in your browser
- **Browser Storage**: Data persists in browser localStorage
- **Single Device**: Perfect for quick calculations and testing
- **Instant**: Zero setup, immediate use

### 2. Server Mode (Docker/Express.js)
- **Multi-Device**: Access from any device on your network
- **Server Storage**: Data saved to `data/data.json` on the server
- **Authentication**: Simple login system to protect your pricing data
- **Docker Ready**: Pre-configured containerization for easy deployment

## Features

- **Live Spreadsheet Interface**: Inline editing with instant calculations
- **Real-Time Updates**: Costs update as you type
- **Material Density Lookup**: Preset densities for common filaments (PLA, ABS, PETG, TPU, PA, ASA, PC)
- **Custom Density Override**: Adjust material density per job with visual indicators
- **Romanian Currency**: Prices in 🦁 (with lion emoji flair)
- **JSON Export/Import**: Backup and share your pricing data
- **Mobile-Friendly**: Responsive design for phone and PC
- **Privacy-First**: Local mode keeps all data on your device; server mode uses secure session storage

### Per-Job Calculations
- Time parsing and conversion
- Filament length (using material-specific densities)
- Material and electricity costs
- Profit estimation with smart formula

## Quick Start

### Local (No Installation)
1. Download or clone the repo
2. Open `index.html` in your browser
3. Set printer power and electricity price
4. Add jobs and fill in details
5. View calculated costs and profits
6. Data is saved in your browser's localStorage

### Docker (Server Mode)
1. Build: `docker build -t 3d-print-cost-analyzer:local .`
2. Run: `docker-compose up` (or `.\test-local.ps1` on Windows)
3. Open http://localhost:8080 in your browser
4. Login with default credentials: `admin` / `admin`
5. Data persists in `data/data.json` on your host machine

### Docker Hub
1. Pull: `docker pull ghcr.io/atomique13/3d-print-cost-analyzer:latest`
2. Run: `docker run -p 8080:80 -v ./data:/app/data ghcr.io/atomique13/3d-print-cost-analyzer:latest`
3. Open http://localhost:8080 in your browser

**Data Persistence**: In server mode, data is stored in `data/data.json` on your host. Mount the data directory with `-v ./data:/app/data` to persist data across container restarts and share across devices.

## Usage Guide

### Global Settings
- **Printer Power (W)**: Your 3D printer's wattage
- **Electricity Price**: Cost per kWh in your area

### Job Inputs
- **Name**: Job identifier
- **Material**: Filament type (uses preset density if available)
- **Price/kg**: Filament cost
- **Weight (g)**: Actual printed weight
- **Print Time**: Hours:Minutes (e.g., 2:30)

### Material Density
- **Color Coding**: 
  - 🟢 Green: Preset material from library
  - 🟠 Orange: Custom density override
  - 🔵 Blue: Unknown material using PLA default
- Click ⚙️ to customize density for any job

### Actions
- Add Row: New job entry
- Duplicate: Copy a row
- Delete: Remove row (with confirmation)
- Clear: Reset row inputs
- Export JSON: Download data
- Import JSON: Load saved data

## Material Densities (g/cm³)
- **PLA**: 1.24
- **ABS**: 1.04
- **PETG**: 1.27
- **TPU**: 1.21
- **PA (Nylon)**: 1.14
- **ASA**: 1.07
- **PC**: 1.20
- **Unknown**: 1.24 (PLA default)