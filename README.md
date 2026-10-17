# Greenhouse Logger Dashboard

This project was created for **CSI-3150: Web and Mobile Systems** as part of Assignment 2B.

The application uses Vanilla JavaScript to record greenhouse sensor readings, classify them as Optimal, Warning, or Critical Hazard, save entries in browser storage, and delete entries without reloading the page. It provides input validation and growth-range feedback while typing.

## Reading Rules

Classification follows Assignment 2A, Section 3. Temperature is recorded in Fahrenheit.

- **Optimal:** all four readings are within their inclusive optimal ranges: pH 5.5–6.5, EC 1.0–2.0 mS/cm, temperature 64.4–71.6°F, and humidity 50–70%.
- **Critical Hazard:** pH is below 5.0 or above 7.5 **and** temperature is below 55°F or above 95°F **and** EC is below 0.2 or above 4.5 mS/cm **and** humidity is below 30% or above 90%.
- **Warning:** any valid reading set that is neither Optimal nor Critical Hazard.

Red input borders and the error banner indicate invalid values that cannot be submitted. Yellow input borders and range messages indicate valid measurements outside optimal growth ranges; these can still be logged. pH is limited to 0–14, EC to nonnegative numbers, and humidity to whole numbers from 0–100. The assignment's instruction to reject negative inputs is also applied to temperature with a minimum of 0°F; the PDFs do not specify a separate physical temperature limit.

Entries are stored under `greenhouse_sensor_records_v1` in `localStorage`. The IIFE keeps app variables and functions private, as required by Assignment 2B.

## Project Goals

This project focuses on practicing:

- JavaScript (ES6+)
- DOM manipulation
- Event handling
- HTML5 form validation
- Browser `localStorage`
- Dynamic content rendering
- Client-side state management
- Immediate user feedback
- Error prevention and input constraints

## Technical Requirements

The project is built using:

- HTML5
- CSS3
- JavaScript (ES6+)
- Browser `localStorage` API

## Project Structure

```text
greenhouse-logger-dashboard/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Assignment 2A

### User Journey Funnel -

- **Starting State:** Application loads and displays the dashboard. It will be empty for first-time users, but returning users may see previously saved log history restored from `localStorage`

- **Step 1:** User inputs data into the form. While filling out the form, dynamic warnings appear if any values are outside acceptable ranges, even before submission.

- **Step 2:** User submits validated data, and the application evaluates the sensor readings to determine the environmental status.

- **Step 3:** Application displays the submitted data in a card on the dashboard with a status of `Optimal`, `Warning`, or `Critical Hazard` based on its calculations.

- **Step 4:** User can interact with the application to clear individual cards or purge the entire log.

- **Terminal State:** Application remains in the user's final state, with any remaining records preserved across browser sessions.

---

### Don Norman Usability & Constraint Audit -

| **Norman Principle / Concept** | **System Context** | **Questions to Answer Using Concrete Implementation Mechanism (DOM / HTML / JS)** |
| --- | --- | --- |
| Gulf of Execution | Typing numeric sensor metrics (pH, ElectricalConductivity[EC], Temp, Humidity) | Clear field labels, units of measurement, and placeholder text help users understand what type of value is expected in each input field and reduce any confusion during data entry. |
| Gulf of Evaluation | Ingesting sensor values after clicking "Record Reading" | After submission, JavaScript evaluates the entered values using the provided classification logic and immediately updates the interface with a visible status of `Optimal`, `Warning`, or `Critical Hazard`. |
| System Constraint | E.g. Water pH Boundaries (0.0 <= pH <= 14.0) | Native HTML attributes such as `min`, `max`, and `step` restrict numeric inputs to valid ranges. For example, `step="0.1"` can limit an input to one-decimal increments, while JavaScript can perform an additional validation check before the value is added to application state. |
| Visual Feedback State | Real-Time Input Error / Out-of-Bounds | JavaScript can listen for input events on each field and check the entered value against the acceptable range. If the value is out of bounds, the application can edit the DOM, and add an `error class` to the input and display a warning message or other visual indicator before the user submits the form. |
| Error Recovery | Accidental or test data submissions | Each logged record can have a delete or resolve button that removes that individual record. The interface can also include a "Purge All" button to clear the entire log history. JavaScript click event listeners would update the application state, `localStorage`, and the displayed records. |

---

### Semantic Component & Layout Tree -

- `<body>` [STATIC] (CSS: `display: flex`)
  - `<header id="dashboard-header">` [STATIC] (CSS: `display: flex`)
    - `<a href="#dashboard-header" class="dashboard-logo">` [STATIC] (CSS: `display: flex`)
      - `<span class="logo-icon" aria-hidden="true">` [STATIC]
      - `<h1>` [STATIC]
    - `<div id="dashboard-status">` [STATIC]
      - `<p>` [STATIC]
        - `<span id="entries-count">` [STATIC]
  - `<main>` [STATIC] (CSS: `display: grid`)
    - `<section id="form-container" class="section-container">` [STATIC]
      - `<h2 id="form-title" class="section-title">` [STATIC]
      - `<div id="form-error-message" aria-live="polite">` [STATIC]
      - `<form action="#" id="sensor-form" novalidate>` [STATIC] (CSS: `display: grid`)
        - `<div class="form-group">` [STATIC] (CSS: `display: flex`)
          - `<label for="technician-first" class="form-label">` [STATIC]
            - `<span class="required-mark" aria-hidden="true">` [STATIC]
          - `<input type="text" name="technicianFirst" id="technician-first" class="form-input" placeholder="John" required>` [STATIC]
        - `<div class="form-group">` [STATIC] (CSS: `display: flex`)
          - `<label for="technician-last" class="form-label">` [STATIC]
            - `<span class="required-mark" aria-hidden="true">` [STATIC]
          - `<input type="text" name="technicianLast" id="technician-last" class="form-input" placeholder="Smith" required>` [STATIC]
        - `<div class="form-group">` [STATIC] (CSS: `display: flex`)
          - `<label for="bay-id" class="form-label">` [STATIC]
            - `<span class="required-mark" aria-hidden="true">` [STATIC]
          - `<input type="text" name="bayId" id="bay-id" class="form-input" placeholder="Bay A" required>` [STATIC]
        - `<div class="form-group">` [STATIC] (CSS: `display: flex`)
          - `<label for="ph-reading" class="form-label">` [STATIC]
            - `<span class="required-mark" aria-hidden="true">` [STATIC]
          - `<input type="number" name="phReading" id="ph-reading" class="form-input sensor-input" min="0" max="14" step="0.1" placeholder="6.0" required>` [STATIC]
        - `<div class="form-group">` [STATIC] (CSS: `display: flex`)
          - `<label for="ec-reading" class="form-label">` [STATIC]
            - `<span class="required-mark" aria-hidden="true">` [STATIC]
          - `<input type="number" name="ecReading" id="ec-reading" class="form-input sensor-input" min="0" step="0.1" placeholder="1.5" required>` [STATIC]
        - `<div class="form-group">` [STATIC] (CSS: `display: flex`)
          - `<label for="temperature-reading" class="form-label">` [STATIC]
            - `<span class="required-mark" aria-hidden="true">` [STATIC]
          - `<input type="number" name="temperatureReading" id="temperature-reading" class="form-input sensor-input" step="0.1" placeholder="68.0" required>` [STATIC]
        - `<div class="form-group">` [STATIC] (CSS: `display: flex`)
          - `<label for="humidity-reading" class="form-label">` [STATIC]
            - `<span class="required-mark" aria-hidden="true">` [STATIC]
          - `<input type="number" name="humidityReading" id="humidity-reading" class="form-input sensor-input" min="0" max="100" step="1" placeholder="60" required>` [STATIC]
        - `<button type="submit" id="record-reading-btn" class="btn">` [STATIC]
    - `<section id="records-container" class="section-container">` [STATIC]
      - `<header id="records-header">` [STATIC] (CSS: `display: flex`)
        - `<h2 id="records-title" class="section-title">` [STATIC]
        - `<button id="clear-all-btn" class="btn" type="button">` [STATIC]
      - `<div id="empty-state">` [STATIC] (CSS: `display: flex`)
        - `<span class="empty-icon" aria-hidden="true">` [STATIC]
        - `<p>` [STATIC]
      - `<ul id="records-list" aria-live="polite">` [STATIC] (CSS: `display: grid`)
        - Dynamically populated by JavaScript
        - `<li class="record-card">` [DYNAMIC]
          - Record technician name [DYNAMIC]
          - Greenhouse bay [DYNAMIC]
          - pH reading [DYNAMIC]
          - Electrical conductivity reading [DYNAMIC]
          - Temperature reading [DYNAMIC]
          - Relative humidity reading [DYNAMIC]
          - Environmental status: `Optimal`, `Warning`, or `Critical Hazard` [DYNAMIC]
          - `<button class="delete-record-btn" type="button">` [DYNAMIC]
  - `<footer id="dashboard-footer">` [STATIC] (CSS: `display: flex`)
    - `<p id="footer-copy">` [STATIC]

---

### Data Schema -

```javascript
const greenhouseSensorLogSchema = {
  id: 'Number', // unique numeric identifier
  firstName: 'String', // technician's first name
  lastName: 'String', // technician's last name
  bayId: 'String', // greenhouse bay identifier
  ph: 'Number', // pH reading
  ec: 'Number', // electrical conductivity reading in mS/cm
  temperature: 'Number', // air temperature reading in degrees Fahrenheit
  humidity: 'Number', // relative humidity reading as a percentage
  status: 'String', // calculated environmental status
};
```
