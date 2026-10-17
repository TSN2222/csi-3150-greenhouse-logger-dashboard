(function () {
  'use strict';

  const STORAGE_KEY = 'greenhouse_sensor_records_v1';

  const entriesCount = document.getElementById('entries-count');
  const emptyState = document.getElementById('empty-state');
  const recordsList = document.getElementById('records-list');
  const errorBanner = document.getElementById('form-error-message');
  const rangeMessage = document.getElementById('form-range-message');
  const sensorForm = document.getElementById('sensor-form');
  const clearAllBtn = document.getElementById('clear-all-btn');

  const inputFirstName = document.getElementById('technician-first');
  const inputLastName = document.getElementById('technician-last');
  const inputBay = document.getElementById('bay-id');
  const inputPh = document.getElementById('ph-reading');
  const inputEc = document.getElementById('ec-reading');
  const inputTemperature = document.getElementById('temperature-reading');
  const inputHumidity = document.getElementById('humidity-reading');
  const inputs = sensorForm.querySelectorAll('input');

  const optimalRanges = {
    phReading: { min: 5.5, max: 6.5, label: 'pH' },
    ecReading: { min: 1.0, max: 2.0, label: 'EC (mS/cm)' },
    temperatureReading: { min: 64.4, max: 71.6, label: 'Air temperature (F)' },
    humidityReading: { min: 50, max: 70, label: 'Humidity (%)' },
  };

  let records = loadRecords();
  render();

  sensorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!updateValidation(true)) return;

    const formData = getFormData();
    formData.id = crypto.randomUUID();
    formData.timestamp = new Date().toLocaleTimeString();
    formData.status = evaluateStatus(formData);

    records.unshift(formData);
    saveRecords();
    render();
    sensorForm.reset();
    rangeMessage.textContent = '';
    inputs.forEach(function (input) {
      input.removeAttribute('aria-invalid');
      input.classList.remove('input-warning');
    });
    inputFirstName.focus();
  });

  sensorForm.addEventListener('input', function (event) {
    updateValidation(false, event.target);
  });

  clearAllBtn.addEventListener('click', function () {
    if (records.length === 0) return;

    if (confirm('Are you sure you want to delete all greenhouse entries?')) {
      records = [];
      hideError();
      saveRecords();
      render();
    }
  });

  recordsList.addEventListener('click', function (event) {
    const target = event.target.closest('.btn-delete');
    if (!target) return;

    const recordId = target.dataset.id;
    records = records.filter(function (record) {
      return record.id !== recordId;
    });

    hideError();
    saveRecords();
    render();
  });

  function loadRecords() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load greenhouse records', error);
      return [];
    }
  }

  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to write to your data store', error);
    }
  }

  function getFormData() {
    return {
      technicianFirst: inputFirstName.value.trim(),
      technicianLast: inputLastName.value.trim(),
      bayId: inputBay.value.trim(),
      phReading: inputPh.valueAsNumber,
      ecReading: inputEc.valueAsNumber,
      temperatureReading: inputTemperature.valueAsNumber,
      humidityReading: inputHumidity.valueAsNumber,
    };
  }

  function validateInput(data) {
    const errors = {};

    if (!data.technicianFirst.trim()) {
      errors.technicianFirst = 'First name is required.';
    }
    if (!data.technicianLast.trim()) {
      errors.technicianLast = 'Last name is required.';
    }
    if (!data.bayId.trim()) {
      errors.bayId = 'Greenhouse bay is required.';
    }
    if (
      !Number.isFinite(data.phReading) ||
      data.phReading < 0 ||
      data.phReading > 14
    ) {
      errors.phReading = 'pH must be a number between 0 and 14.';
    }
    if (!Number.isFinite(data.ecReading) || data.ecReading < 0) {
      errors.ecReading =
        'Electrical conductivity must be a number greater than or equal to 0 mS/cm.';
    }
    if (
      !Number.isFinite(data.temperatureReading) ||
      data.temperatureReading < 0
    ) {
      errors.temperatureReading =
        'Air temperature must be a number greater than or equal to 0 degrees Fahrenheit.';
    }
    if (
      !Number.isInteger(data.humidityReading) ||
      data.humidityReading < 0 ||
      data.humidityReading > 100
    ) {
      errors.humidityReading =
        'Relative humidity must be a whole number between 0 and 100%.';
    }

    return errors;
  }

  function updateValidation(showAll, changedInput) {
    const data = getFormData();
    const errors = validateInput(data);
    const messages = [];
    const warnings = [];

    inputs.forEach(function (input) {
      const range = optimalRanges[input.name];
      if (!errors[input.name] && input.validity.stepMismatch) {
        errors[input.name] =
          `${range.label} must use increments of ${input.step}.`;
      }

      const showError =
        showAll ||
        input === changedInput ||
        input.value !== '' ||
        input.getAttribute('aria-invalid') === 'true';
      const message = showError ? errors[input.name] : '';
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (message) messages.push(message);

      const outsideOptimal =
        range &&
        !errors[input.name] &&
        (data[input.name] < range.min || data[input.name] > range.max);
      input.classList.toggle('input-warning', Boolean(outsideOptimal));
      if (outsideOptimal) {
        warnings.push(
          `${range.label}: optimal range is ${range.min} to ${range.max}.`
        );
      }
    });

    displayError(messages.join(' '));
    rangeMessage.textContent = warnings.join(' ');
    return Object.keys(errors).length === 0;
  }

  function evaluateStatus(data) {
    if (
      (data.phReading < 5.0 || data.phReading > 7.5) &&
      (data.temperatureReading < 55 || data.temperatureReading > 95) &&
      (data.ecReading < 0.2 || data.ecReading > 4.5) &&
      (data.humidityReading < 30 || data.humidityReading > 90)
    ) {
      return { level: 'critical', label: 'Critical Hazard' };
    }

    if (
      data.phReading >= 5.5 &&
      data.phReading <= 6.5 &&
      data.temperatureReading >= 64.4 &&
      data.temperatureReading <= 71.6 &&
      data.ecReading >= 1.0 &&
      data.ecReading <= 2.0 &&
      data.humidityReading >= 50 &&
      data.humidityReading <= 70
    ) {
      return { level: 'optimal', label: 'Optimal' };
    }

    return { level: 'warning', label: 'Warning' };
  }

  function render() {
    entriesCount.textContent = records.length;

    if (records.length === 0) {
      emptyState.hidden = false;
      recordsList.innerHTML = '';
      return;
    }

    emptyState.hidden = true;

    const fragment = document.createDocumentFragment();

    records.forEach((rec) => {
      const li = document.createElement('li');

      li.innerHTML = `
        <div class="record-info">
          <h3 class="record-bay">${escapeHtml(rec.bayId)}</h3>
          <p>${escapeHtml(rec.technicianFirst)} ${escapeHtml(rec.technicianLast)}</p>
          <p class="record-timestamp">Logged at ${escapeHtml(rec.timestamp)}</p>
          <span class="status-badge ${rec.status.level}">${rec.status.label}</span>
        </div>
        <div class="sensor-stats">
          <div class="stat-item"><span>pH</span>${rec.phReading.toFixed(1)}</div>
          <div class="stat-item"><span>EC</span>${rec.ecReading.toFixed(1)} mS/cm</div>
          <div class="stat-item"><span>Air temperature</span>${rec.temperatureReading.toFixed(1)} &deg;F</div>
          <div class="stat-item"><span>Humidity</span>${rec.humidityReading}%</div>
        </div>
        <button type="button" class="btn btn-delete" data-id="${escapeHtml(rec.id)}">Delete Entry</button>
      `;

      fragment.appendChild(li);
    });

    recordsList.innerHTML = '';
    recordsList.appendChild(fragment);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function displayError(message) {
    errorBanner.textContent = message;
    errorBanner.hidden = false;
  }

  function hideError() {
    errorBanner.textContent = '';
    errorBanner.hidden = true;
  }
})();
