// Data structures
let globalSettings = {
    printerPower: 100, // default
    electricityPrice: 0.12, // default
    currencySymbol: '🦁'
};

let jobs = [];
let nextId = 1;

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

// Calculations
function calculateJob(job) {
    const timeParsed = parseTime(job.printTime);
    const timeMinutes = timeParsed.hours * 60 + timeParsed.minutes;
    const timeHours = timeMinutes / 60;

    let filamentLength = '';
    if (job.material.toLowerCase() === 'pla') {
        // Assumption: PLA filament density is 2.98 g/m (common value for 1.75mm PLA)
        filamentLength = roundup(job.weightG / 2.98, 1);
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
function saveData() {
    localStorage.setItem('3dPrintPricingData', JSON.stringify({ globalSettings, jobs, nextId }));
}

function loadData() {
    const data = localStorage.getItem('3dPrintPricingData');
    if (data) {
        const parsed = JSON.parse(data);
        globalSettings = parsed.globalSettings || globalSettings;
        jobs = parsed.jobs || [];
        nextId = parsed.nextId || 1;
        // Update old currency symbol
        if (globalSettings.currencySymbol !== '🦁') {
            globalSettings.currencySymbol = '🦁';
        }
    }
}

// Render functions
function renderGlobalSettings() {
    document.getElementById('printer-power').value = globalSettings.printerPower;
    document.getElementById('electricity-price').value = globalSettings.electricityPrice;
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
            <td><input type="text" class="input-material" data-field="material" value="${job.material}"></td>
            <td><input type="number" class="input-price" data-field="priceKg" value="${job.priceKg}"></td>
            <td><input type="number" class="input-weight" data-field="weightG" value="${job.weightG}"></td>
            <td><input type="text" class="input-time" data-field="printTime" value="${job.printTime}" placeholder="H:MM"></td>
            <td>${calc.timeMinutes}</td>
            <td>${calc.timeHours.toFixed(1)}</td>
            <td>${calc.filamentLength}</td>
            <td>${calc.materialPrice} ${globalSettings.currencySymbol}</td>
            <td>${calc.electricityCost} ${globalSettings.currencySymbol}</td>
            <td>${calc.totalCost} ${globalSettings.currencySymbol}</td>
            <td>${calc.sellingPrice} ${globalSettings.currencySymbol}</td>
        `;

        tbody.appendChild(row);
    });
}

// Event handlers
function handleGlobalChange() {
    globalSettings.printerPower = parseFloat(document.getElementById('printer-power').value) || 0;
    globalSettings.electricityPrice = parseFloat(document.getElementById('electricity-price').value) || 0;
    saveData();
    renderTable();
}

function handleTableChange(event) {
    const target = event.target;
    if (target.tagName === 'INPUT' && target.hasAttribute('data-field')) {
        const row = target.closest('tr');
        const jobId = parseInt(row.getAttribute('data-job-id'));
        const field = target.getAttribute('data-field');
        const value = target.type === 'number' ? parseFloat(target.value) || 0 : target.value;

        const job = jobs.find(j => j.id === jobId);
        if (job) {
            job[field] = value;
            saveData();
            // Update calculated fields in the row
            const calc = calculateJob(job);
            const tds = row.querySelectorAll('td');
            tds[6].textContent = calc.timeMinutes;
            tds[7].textContent = calc.timeHours.toFixed(1);
            tds[8].textContent = calc.filamentLength;
            tds[9].textContent = `${calc.materialPrice} ${globalSettings.currencySymbol}`;
            tds[10].textContent = `${calc.electricityCost} ${globalSettings.currencySymbol}`;
            tds[11].textContent = `${calc.totalCost} ${globalSettings.currencySymbol}`;
            tds[12].textContent = `${calc.sellingPrice} ${globalSettings.currencySymbol}`;
        }
    }
}

function handleActions(event) {
    const target = event.target;
    if (target.classList.contains('duplicate-btn')) {
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

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderGlobalSettings();
    renderTable();

    // Event listeners
    document.getElementById('printer-power').addEventListener('input', handleGlobalChange);
    document.getElementById('electricity-price').addEventListener('input', handleGlobalChange);

    document.getElementById('table-body').addEventListener('input', handleTableChange);
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