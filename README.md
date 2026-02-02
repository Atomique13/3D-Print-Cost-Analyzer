# 3D Print Cost Analyzer

A local web app for calculating 3D print pricing based on real measured values. Built with vanilla HTML, CSS, and JavaScript – no frameworks required.

## Features

- **Per-Job Inputs**: Name, Material, Price per kg, Real weight in grams, Print time (H:MM format)
- **Global Settings**: Printer power consumption (W), Electricity price per kWh
- **Live Calculations**:
  - Time parsing and conversion
  - Filament length (PLA only, 2.98 g/m density)
  - Material price, Electricity cost, Total base cost
  - Estimated selling price (CEILING formula)
- **Spreadsheet-like Interface**: Inline editable table with add, duplicate, delete, and clear rows
- **Persistence**: Saves data in localStorage
- **Import/Export**: JSON format for backup and sharing
- **Dark Theme**: Mobile-responsive design

## Usage

1. Open `index.html` in any modern web browser.
2. Set global settings (printer power and electricity price).
3. Add rows for each print job.
4. Fill in job details – calculations update live.
5. Use actions to manage rows.
6. Export data as JSON for backup.

## Formulas

- Time minutes = hours * 60 + minutes
- Time hours = time_minutes / 60
- Filament length (PLA) = ROUNDUP(weight_g / 2.98, 1) meters
- Material price = ROUNDUP((price_per_kg / 1000) * weight_g, 1)
- Electricity cost = ROUNDUP((power_W / 1000) * time_hours * price_per_kWh, 1)
- Total cost = material_price + electricity_cost
- Selling price = CEILING((total_cost * 3 / 5), 1) * 5

## Browser Compatibility

Works in any browser with JavaScript enabled. No server required – runs entirely locally.

## License

Feel free to use and modify as needed.