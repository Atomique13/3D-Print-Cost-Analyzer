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
- **Material Dropdown Selector**: Quick-select from 7 preset materials or enter custom materials
- **Smart Material Detection**: Type a preset name in custom field to auto-switch to dropdown
- **Material Density Lookup**: Preset densities for common filaments (PLA, ABS, PETG, TPU, PA, ASA, PC)
- **Custom Density Override**: Adjust material density per job with visual indicators
- **Color-Coded Materials**: Green for preset materials, orange for custom materials
- **Customizable Currency**: Set your own currency symbol (defaults to 🦁)
- **Automatic Backups**: Server mode creates automatic backups every 6 hours (keeps last 5)
- **Import Protection**: Creates backup before importing JSON data (keeps last 10)
- **Smart Backup**: Skips backup if imported data is identical to existing data
- **Backup Status Display**: Shows time since last backup in the UI
- **JSON Export/Import**: Backup and share your pricing data
- **Mobile-Friendly**: Responsive design for phone and PC
- **Privacy-First**: Local mode keeps all data on your device; server mode uses secure session storage
- **Secure by Default**: Blocks default credentials in production, auto-generates session secrets

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

**For Production (Secure):**
1. Edit `docker-compose.yml` to set custom credentials:
   ```yaml
   AUTH_USERNAME: your_username
   AUTH_PASSWORD: your_secure_password
   ```
2. Run: `docker-compose up -d`
3. Open http://localhost:8080 in your browser
4. Login with your custom credentials
5. Data persists in `data/data.json` on your host machine

**For Local Testing:**
1. Run: `.\test-local.ps1` (Windows) or `docker-compose -f docker-compose.local.yml up`
2. Uses default admin/admin credentials (allowed via ALLOW_DEFAULT_CREDENTIALS flag)
3. Open http://localhost:8080 in your browser

**Security Features:**
- Auto-generates SESSION_SECRET if not provided
- Blocks default admin/admin credentials in production
- Rejects empty passwords
- Shows warning banners when using default credentials
- Session-based authentication protects all endpoints

### Docker Hub
1. Pull: `docker pull ghcr.io/atomique13/3d-print-cost-analyzer:latest`
2. Run: `docker run -p 8080:80 -v ./data:/app/data ghcr.io/atomique13/3d-print-cost-analyzer:latest`
3. Open http://localhost:8080 in your browser

**Data Persistence**: In server mode, data is stored in `data/data.json` on your host. Mount the data directory with `-v ./data:/app/data` to persist data across container restarts and share across devices.

**Automatic Backups**: Server mode includes two backup systems:
- **Auto Backups**: Created every 6 hours automatically (keeps last 5)
  - Format: `data.json.auto-backup-YYYY-MM-DDTHH-MM`
- **Import Backups**: Created before importing JSON data (keeps last 10)
  - Format: `data.json.import-backup-YYYY-MM-DDTHH-MM`
  - Skips backup if imported data is identical to existing data
- All backups are stored in the mounted `data/` folder
- Backup status shown in UI with time since last backup

## Usage Guide

### Global Settings
- **Printer Power (W)**: Your 3D printer's wattage
- **Electricity Price**: Cost per kWh in your area
- **Currency Symbol**: Customize your currency (max 10 characters, defaults to 🦁)

### Job Inputs
- **Name**: Job identifier
- **Material**: Select from dropdown (PLA, ABS, PETG, TPU, PA, ASA, PC) or choose "Custom..." to enter your own
- **Price/kg**: Filament cost
- **Weight (g)**: Actual printed weight
- **Print Time**: Hours:Minutes (e.g., 2:30)

### Material Selector
- **Dropdown**: Quick-select from 7 preset materials
- **Custom Entry**: Select "Custom..." to type any material name
- **Smart Detection**: Type "PLA" in custom field → auto-switches to dropdown
- **Color Coding**:
  - 🟢 Green: Preset material with known density
  - 🟠 Orange: Custom material using default or custom density

### Material Density (Filament Length)
- **Preset Densities**: Automatic calculation for 7 common materials
- **Custom Override**: Click ⚙️ gear button next to filament length to set custom density
- **Color Indicators**:
  - 🟢 Green: Using preset density from material library
  - 🟠 Orange: Custom density override applied
  - 🔵 Blue: Unknown material using PLA default (1.24 g/cm³)

### Actions
- Add Row: New job entry
- Duplicate: Copy a row
- Delete: Remove row (with confirmation)
- Clear: Reset row inputs (with confirmation)
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