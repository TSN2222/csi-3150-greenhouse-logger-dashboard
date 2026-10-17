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
