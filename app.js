(function () {
  'use strict';

  const STORAGE_KEY = 'greenhouse_sensor_records_v1';

  const entriesCount = document.getElementById('entries-count');
  const emptyState = document.getElementById('empty-state');
  const recordsList = document.getElementById('records-list');

  let records = loadRecords();
  render();

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

      li.className = 'sensor-record';
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
})();
