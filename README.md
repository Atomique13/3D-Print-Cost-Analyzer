# 3D Print Cost Analyzer

> Calculate 3D print costs and profits with real measurements – no guesswork!

A sleek, local web app for 3D printing enthusiasts and businesses. Built with vanilla HTML, CSS, and JavaScript – runs entirely in your browser, no installation or server needed.

## Features

- **Live Spreadsheet Interface**: Inline editing with instant calculations
- **Real-Time Updates**: Costs update as you type
- **Romanian Currency**: Prices in 🦁 (with lion emoji flair)
- **Local Storage**: Your data persists between sessions
- **JSON Export/Import**: Backup and share your pricing data
- **Mobile-Friendly**: Responsive design for phone and PC
- **Privacy-First**: All data stays on your device

### Per-Job Calculations
- Time parsing and conversion
- Filament length (PLA density: 2.98 g/m)
- Material and electricity costs
- Profit estimation with smart formula

## Quick Start

### Local (No Installation)
1. Download or clone the repo
2. Open `index.html` in your browser
3. Set printer power and electricity price
4. Add jobs and fill in details
5. View calculated costs and profits

### Docker
1. Pull the image: `docker pull ghcr.io/atomique13/3d-print-cost-analyzer:latest`
2. Run: `docker run -p 8080:80 ghcr.io/atomique13/3d-print-cost-analyzer:latest`
3. Open http://localhost:8080 in your browser

### Docker Compose
1. Run: `docker-compose up`
2. Open http://localhost:8080 in your browser

**Data Persistence**: Data is stored in `data.json` on your host machine. Mount this file to share data across multiple devices or container restarts.

## Usage Guide

### Global Settings
- **Printer Power (W)**: Your 3D printer's wattage
- **Electricity Price**: Cost per kWh in your area

### Job Inputs
- **Name**: Job identifier
- **Material**: Filament type (PLA for length calc)
- **Price/kg**: Filament cost
- **Weight (g)**: Actual printed weight
- **Print Time**: Hours:Minutes (e.g., 2:30)

### Actions
- Add Row: New job entry
- Duplicate: Copy a row
- Delete: Remove row (with confirmation)
- Clear: Reset row inputs
- Export JSON: Download data
- Import JSON: Load saved data

## Formulas

All calculations use Excel-compatible ROUNDUP/CEILING:

- **Time Minutes** = `hours * 60 + minutes`
- **Time Hours** = `time_minutes / 60`
- **Filament Length (PLA)** = `ROUNDUP(weight_g / 2.98, 1)` meters
- **Material Price** = `ROUNDUP((price_kg / 1000) * weight_g, 1)` 🦁
- **Electricity Cost** = `ROUNDUP((power_w / 1000) * time_hours * price_kwh, 1)` 🦁
- **Total Cost** = `ROUNDUP(material_price + electricity_cost, 1)` 🦁
- **Selling Price** = `CEILING((total_cost * 3 / 5), 1) * 5` 🦁

## Tech Stack

- **Frontend**: HTML5, CSS3, ES6 JavaScript
- **Storage**: Browser localStorage
- **Styling**: Dark theme with responsive design
- **No Dependencies**: Pure vanilla code

## Compatibility

- **Browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, tablet, mobile
- **OS**: Windows, macOS, Linux, Android, iOS

## Contributing

Found a bug or have a feature idea? Open an issue or submit a PR!

## License

MIT License – free to use and modify.

---

Built for the 3D printing community with a lot of assistance from 🤖 GitHub Copilot.