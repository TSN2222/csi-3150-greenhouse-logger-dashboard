(function () {
  'use strict';

  const STORAGE_KEY = 'greenhouse_sensor_records_v1';

  let records = loadRecords();

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
});
