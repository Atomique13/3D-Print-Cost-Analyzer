// Data structures
let globalSettings = {
    printerPower: 100, // default
    electricityPrice: 0.12, // default
    currencySymbol: '🦁'
};

let jobs = [];
let nextId = 1;

// Material density lookup (g/cm³) for 1.75mm filament
const MATERIAL_DENSITIES = {
    'pla': 1.24,
    'abs': 1.04,
    'petg': 1.27,
    'tpu': 1.21,
    'pa': 1.14,
    'asa': 1.07,
    'pc': 1.20
};

// Calculate linear density (g/m) from material density (g/cm³)
function getMaterialLinearDensity(materialName, customDensity = null) {
    if (customDensity) return customDensity;
    const filamentArea = Math.PI * Math.pow(1.75 / 2, 2) / 100; // cm²
    const materialDensity = MATERIAL_DENSITIES[materialName.toLowerCase()] || 1.24; // default PLA
    return roundup(materialDensity * filamentArea * 100, 2); // g/m
}

// Get material density in g/cm³
function getMaterialDensity(materialName) {
    return MATERIAL_DENSITIES[materialName.toLowerCase()] || 1.24; // default PLA
}

// Check if material is in preset list
function isMaterialPreset(materialName) {
    return materialName && MATERIAL_DENSITIES[materialName.toLowerCase()] !== undefined;
}

// Utility functions
function roundup(num, digits) {
    const factor = Math.pow(10, digits);
    return Math.ceil(num * factor) / factor;
}

function ceiling(num, sig) {
    return Math.ceil(num / sig) * sig;
}

function parseTime(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return { hours: 0, minutes: 0 };
    const h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    return { hours: h, minutes: m };
}

function validateTime(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return false;
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    return !isNaN(h) && !isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60;
}

function formatTime(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        let h = parseInt(parts[0]) || 0;
        let m = parseInt(parts[1]) || 0;
        // Limit minutes to 59
        if (m > 59) m = 59;
        return `${h}:${m.toString().padStart(2, '0')}`;
    }
    // If no colon, assume it's all hours
    const num = parseInt(timeStr) || 0;
    return `${num}:00`;
}

// Calculations
function calculateJob(job) {
    const timeParsed = parseTime(job.printTime);
    const timeMinutes = timeParsed.hours * 60 + timeParsed.minutes;
    const timeHours = timeMinutes / 60;

    let filamentLength = '';
    const linearDensity = getMaterialLinearDensity(job.material, job.customDensity);
    if (job.weightG > 0 && linearDensity > 0) {
        filamentLength = roundup(job.weightG / linearDensity, 1);
    }

    const materialPrice = roundup((job.priceKg / 1000) * job.weightG, 1);
    const electricityCost = roundup((globalSettings.printerPower / 1000) * timeHours * globalSettings.electricityPrice, 1);
    const totalCost = roundup(materialPrice + electricityCost, 1);
    const sellingPrice = ceiling((totalCost * 3 / 5), 1) * 5;

    return {
        timeMinutes,
        timeHours,
        filamentLength,
        materialPrice,
        electricityCost,
        totalCost,
        sellingPrice
    };
}

// Persistence
async function saveData() {
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ globalSettings, jobs, nextId })
        });
        if (!response.ok) throw new Error('Save failed');
    } catch (err) {
        console.error('Error saving data:', err);
        // Fallback to localStorage if API fails
        localStorage.setItem('3dPrintPricingData', JSON.stringify({ globalSettings, jobs, nextId }));
    }
}

async function loadData() {
    try {
        const response = await fetch('/api/data');
        if (response.ok) {
            const parsed = await response.json();
            globalSettings = parsed.globalSettings || globalSettings;
            jobs = parsed.jobs || [];
            nextId = parsed.nextId || 1;
            document.getElementById('error-message').style.display = 'none';
        } else {
            throw new Error('Load failed');
        }
    } catch (err) {
        console.error('Error loading data:', err);
        // Fallback to localStorage
        const data = localStorage.getItem('3dPrintPricingData');
        if (data) {
            const parsed = JSON.parse(data);
            globalSettings = parsed.globalSettings || globalSettings;
            jobs = parsed.jobs || [];
            nextId = parsed.nextId || 1;
        }
        document.getElementById('error-message').textContent = 'Database not accessible. Data will not persist.';
        document.getElementById('error-message').style.display = 'block';
    }
}

// Render functions
function renderGlobalSettings() {
    document.getElementById('printer-power').value = globalSettings.printerPower;
    document.getElementById('electricity-price').value = globalSettings.electricityPrice;
    document.getElementById('currency-symbol').value = globalSettings.currencySymbol;
}

function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    jobs.forEach(job => {
        const calc = calculateJob(job);
        const row = document.createElement('tr');
        row.setAttribute('data-job-id', job.id);

        row.innerHTML = `
            <td>
                <button class="action-btn duplicate-btn" title="Duplicate">🔄</button>
                <button class="action-btn delete-btn" title="Delete">🗑️</button>
                <button class="action-btn clear-btn" title="Clear">🧹</button>
            </td>
            <td><input type="text" class="input-name" data-field="name" value="${job.name}"></td>
            <td class="material-cell">
                <select class="input-material ${isMaterialPreset(job.material) ? 'material-preset' : ''}" data-field="material" value="${job.material}" style="${isMaterialPreset(job.material) || !job.material ? 'display: inline-block;' : 'display: none;'}">
                    <option value="">Custom...</option>
                    <option value="pla" ${job.material === 'pla' ? 'selected' : ''}>PLA</option>
                    <option value="abs" ${job.material === 'abs' ? 'selected' : ''}>ABS</option>
                    <option value="petg" ${job.material === 'petg' ? 'selected' : ''}>PETG</option>
                    <option value="tpu" ${job.material === 'tpu' ? 'selected' : ''}>TPU</option>
                    <option value="pa" ${job.material === 'pa' ? 'selected' : ''}>PA</option>
                    <option value="asa" ${job.material === 'asa' ? 'selected' : ''}>ASA</option>
                    <option value="pc" ${job.material === 'pc' ? 'selected' : ''}>PC</option>
                </select>
                <input type="text" class="input-material-custom material-custom" data-field="material" value="${job.material}" placeholder="Custom material" style="${!isMaterialPreset(job.material) && job.material ? 'display: inline-block;' : 'display: none;'}">
            </td>
            <td><input type="number" class="input-price" data-field="priceKg" value="${job.priceKg}"></td>
            <td><input type="number" class="input-weight" data-field="weightG" value="${job.weightG}"></td>
            <td><input type="text" class="input-time" data-field="printTime" value="${job.printTime}" placeholder="H:MM" maxlength="10"></td>
            <td class="filament-cell">
                <span class="filament-length ${job.customDensity ? 'custom-density' : (isMaterialPreset(job.material) ? 'preset-density' : 'default-density')}">${calc.filamentLength || ''}</span>
                <button class="density-edit-btn" title="Material density: ${getMaterialLinearDensity(job.material, job.customDensity).toFixed(2)} g/m">⚙️</button>
                <input type="number" class="input-density" data-field="customDensity" value="${job.customDensity || ''}" placeholder="${getMaterialDensity(job.material).toFixed(2)}" step="0.01" min="0" style="display: none;">
            </td>
            <td>${calc.materialPrice ? `${calc.materialPrice} ${globalSettings.currencySymbol}` : ''}</td>
            <td>${calc.electricityCost ? `${calc.electricityCost} ${globalSettings.currencySymbol}` : ''}</td>
            <td>${calc.totalCost ? `${calc.totalCost} ${globalSettings.currencySymbol}` : ''}</td>
            <td>${calc.sellingPrice ? `${calc.sellingPrice} ${globalSettings.currencySymbol}` : ''}</td>
        `;

        tbody.appendChild(row);
    });
}

// Event handlers
function handleGlobalChange() {
    globalSettings.printerPower = parseFloat(document.getElementById('printer-power').value) || 0;
    globalSettings.electricityPrice = parseFloat(document.getElementById('electricity-price').value) || 0;
    const currencyInput = document.getElementById('currency-symbol').value.trim();
    globalSettings.currencySymbol = currencyInput || '🦁';
    saveData();
    renderTable();
}

function handleTableChange(event) {
    const target = event.target;
    if ((target.tagName === 'INPUT' || target.tagName === 'SELECT') && target.hasAttribute('data-field')) {
        const row = target.closest('tr');
        const jobId = parseInt(row.getAttribute('data-job-id'));
        const field = target.getAttribute('data-field');
        let value = target.type === 'number' ? parseFloat(target.value) || 0 : target.value;
        
        // Handle material dropdown: show custom input when Custom is selected
        if (field === 'material' && target.tagName === 'SELECT') {
            const cell = target.closest('td');
            const materialSelect = cell.querySelector('.input-material');
            const customInput = cell.querySelector('.input-material-custom');
            if (value === '') {
                materialSelect.style.display = 'none';
                customInput.style.display = 'inline-block';
                customInput.focus();
                return; // Don't update job yet, wait for custom input
            }
        }

        if (field === 'priceKg' || field === 'weightG') {
            value = roundup(value, 1);
            target.value = value;
        } else if (field === 'customDensity') {
            value = parseFloat(value) || null;
            if (value) target.value = value;
        } else if (field === 'printTime') {
            // Format on blur only to avoid interfering with typing
            if (event.type === 'blur' || event.type === 'change') {
                value = formatTime(value);
                target.value = value;
            }
        }

        const job = jobs.find(j => j.id === jobId);
        if (job) {
            job[field] = value;
            
            // If material field changed and it's now a preset, switch back to dropdown
            if (field === 'material') {
                const cell = target.closest('td');
                const materialSelect = cell.querySelector('.input-material');
                const customInput = cell.querySelector('.input-material-custom');
                if (isMaterialPreset(value)) {
                    materialSelect.value = value.toLowerCase();
                    materialSelect.style.display = 'inline-block';
                    materialSelect.classList.add('material-preset');
                    customInput.style.display = 'none';
                } else {
                    materialSelect.classList.remove('material-preset');
                }
            }
            
            saveData();
            // Update calculated fields in the row
            const calc = calculateJob(job);
            const tds = row.querySelectorAll('td');
            // Update filament length span inside the cell
            const filamentSpan = tds[6].querySelector('.filament-length');
            if (filamentSpan) {
                filamentSpan.textContent = calc.filamentLength || '';
                let className = 'filament-length';
                if (job.customDensity) {
                    className += ' custom-density';
                } else if (isMaterialPreset(job.material)) {
                    className += ' preset-density';
                } else {
                    className += ' default-density';
                }
                filamentSpan.className = className;
            }
            // Update density button tooltip and input placeholder
            const densityBtn = tds[6].querySelector('.density-edit-btn');
            const densityInput = tds[6].querySelector('.input-density');
            if (densityBtn) {
                densityBtn.title = `Material density: ${getMaterialLinearDensity(job.material, job.customDensity).toFixed(2)} g/m`;
            }
            if (densityInput && field === 'material') {
                // Update placeholder when material changes
                densityInput.placeholder = getMaterialDensity(job.material).toFixed(2);
            }
            tds[7].textContent = calc.materialPrice ? `${calc.materialPrice} ${globalSettings.currencySymbol}` : '';
            tds[8].textContent = calc.electricityCost ? `${calc.electricityCost} ${globalSettings.currencySymbol}` : '';
            tds[9].textContent = calc.totalCost ? `${calc.totalCost} ${globalSettings.currencySymbol}` : '';
            tds[10].textContent = calc.sellingPrice ? `${calc.sellingPrice} ${globalSettings.currencySymbol}` : '';
        }
    }
}

function handleActions(event) {
    const target = event.target;
    if (target.classList.contains('density-edit-btn')) {
        const cell = target.closest('td');
        const densityInput = cell.querySelector('.input-density');
        const isVisible = densityInput.style.display !== 'none';
        densityInput.style.display = isVisible ? 'none' : 'inline-block';
        if (!isVisible) {
            densityInput.focus();
        }
    } else if (target.classList.contains('duplicate-btn')) {
        const row = target.closest('tr');
        const jobId = parseInt(row.getAttribute('data-job-id'));
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            const newJob = { ...job, id: nextId++ };
            jobs.push(newJob);
            saveData();
            renderTable();
        }
    } else if (target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this row?')) {
            const row = target.closest('tr');
            const jobId = parseInt(row.getAttribute('data-job-id'));
            jobs = jobs.filter(j => j.id !== jobId);
            saveData();
            renderTable();
        }
    } else if (target.classList.contains('clear-btn')) {
        if (confirm('Are you sure you want to clear this row?')) {
            const row = target.closest('tr');
            const jobId = parseInt(row.getAttribute('data-job-id'));
            const job = jobs.find(j => j.id === jobId);
            if (job) {
                job.name = '';
                job.material = '';
                job.priceKg = 0;
                job.weightG = 0;
                job.printTime = '0:00';
                saveData();
                renderTable();
            }
        }
    }
}

function handleAddRow() {
    const newJob = {
        id: nextId++,
        name: '',
        material: '',
        priceKg: 0,
        weightG: 0,
        printTime: '0:00'
    };
    jobs.push(newJob);
    saveData();
    renderTable();
}

function handleExport() {
    const data = { globalSettings, jobs };
    const json = JSON.stringify(data, null, 2);
    const textarea = document.getElementById('import-textarea');
    textarea.value = json;
    textarea.style.display = 'block';
    alert('JSON exported to textarea below import button.');
}

function handleImport() {
    const textarea = document.getElementById('import-textarea');
    try {
        const data = JSON.parse(textarea.value);
        globalSettings = data.globalSettings || globalSettings;
        jobs = data.jobs || [];
        nextId = Math.max(...jobs.map(j => j.id), 0) + 1;
        saveData();
        renderGlobalSettings();
        renderTable();
        textarea.style.display = 'none';
        alert('Data imported successfully.');
    } catch (e) {
        alert('Invalid JSON.');
    }
}

// Init
let importMode = false;

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderGlobalSettings();
    renderTable();

    // Show warning if using default credentials
    if (sessionStorage.getItem('usingDefaultCredentials') === 'true') {
        document.getElementById('warning-message').style.display = 'block';
    }

    // Event listeners
    document.getElementById('printer-power').addEventListener('input', handleGlobalChange);
    document.getElementById('electricity-price').addEventListener('input', handleGlobalChange);
    document.getElementById('currency-symbol').addEventListener('input', handleGlobalChange);

    document.getElementById('table-body').addEventListener('input', handleTableChange);
    document.getElementById('table-body').addEventListener('blur', handleTableChange, true);
    document.getElementById('table-body').addEventListener('click', handleActions);

    document.getElementById('add-row').addEventListener('click', handleAddRow);
    document.getElementById('export-data').addEventListener('click', handleExport);
    document.getElementById('import-data').addEventListener('click', () => {
        const textarea = document.getElementById('import-textarea');
        if (!importMode) {
            textarea.style.display = 'block';
            textarea.value = '';
            importMode = true;
        } else {
            handleImport();
            textarea.style.display = 'none';
            importMode = false;
        }
    });
});