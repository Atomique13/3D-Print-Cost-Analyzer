# 🦁 3D Print Cost Analyzer

> Calculate 3D print costs and profits with real measurements – no guesswork!

A sleek, local web app for 3D printing enthusiasts and businesses. Built with vanilla HTML, CSS, and JavaScript – runs entirely in your browser, no installation or server needed.

![Demo](https://via.placeholder.com/800x400/1e1e1e/ffffff?text=3D+Print+Cost+Analyzer+Demo) *(Placeholder – add a screenshot if desired)*

## ✨ Features

- **📊 Live Spreadsheet Interface**: Inline editing with instant calculations
- **⚡ Real-Time Updates**: Costs update as you type
- **🦁 Romanian Currency**: Prices in 🦁 (with lion emoji flair)
- **💾 Local Storage**: Your data persists between sessions
- **📤📥 JSON Export/Import**: Backup and share your pricing data
- **📱 Mobile-Friendly**: Responsive design for phone and PC
- **🔒 Privacy-First**: All data stays on your device

### Per-Job Calculations
- **Time Parsing**: Converts H:MM to minutes/hours
- **Filament Length**: PLA density calculation (2.98 g/m)
- **Material & Electricity Costs**: Precise pricing
- **Profit Estimation**: Smart selling price formula

## 🚀 Quick Start

1. **Download**: Clone or download the repo
2. **Open**: Double-click `index.html` in your browser
3. **Configure**: Set printer power and electricity price
4. **Add Jobs**: Click ➕ Add Row and fill in details
5. **Profit!**: View calculated costs and selling prices

No setup required – works offline!

## 📋 Usage Guide

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
- **➕ Add Row**: New job entry
- **🔄 Duplicate**: Copy a row
- **🗑️ Delete**: Remove row (with confirmation)
- **🧹 Clear**: Reset row inputs
- **📤 Export JSON**: Download data
- **📥 Import JSON**: Load saved data

## 🧮 Formulas

All calculations use Excel-compatible ROUNDUP/CEILING:

- **Time Minutes** = `hours * 60 + minutes`
- **Time Hours** = `time_minutes / 60`
- **Filament Length (PLA)** = `ROUNDUP(weight_g / 2.98, 1)` meters
- **Material Price** = `ROUNDUP((price_kg / 1000) * weight_g, 1)` 🦁
- **Electricity Cost** = `ROUNDUP((power_w / 1000) * time_hours * price_kwh, 1)` 🦁
- **Total Cost** = `ROUNDUP(material_price + electricity_cost, 1)` 🦁
- **Selling Price** = `CEILING((total_cost * 3 / 5), 1) * 5` 🦁

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, ES6 JavaScript
- **Storage**: Browser localStorage
- **Styling**: Dark theme with responsive design
- **No Dependencies**: Pure vanilla code

## 📱 Compatibility

- **Browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, tablet, mobile
- **OS**: Windows, macOS, Linux, Android, iOS

## 🤝 Contributing

Found a bug or have a feature idea? Open an issue or submit a PR!

## 📄 License

MIT License – free to use and modify.

---

**Built with ❤️ for the 3D printing community**