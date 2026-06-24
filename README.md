# Simple Weather App

A clean, lightweight weather app that lets you look up current weather conditions and a multi-day forecast for any city in the world.

**Live Demo:** [https://programuesihkb.github.io/simple_weather_app/](https://programuesihkb.github.io/simple_weather_app/)

---

## Features

- Search weather by city name
- Displays current conditions: temperature, humidity, wind speed, precipitation, visibility, UV index, sunrise and sunset times
- Expandable multi-day forecast with daily summaries
- Dynamic weather icons that match current conditions
- Keyboard support — press **Enter** to search

## How It Works

1. The user types a city name into the search bar and clicks **Get Weather** (or presses Enter).
2. The app sends a request to the Visual Crossing Weather API using [Axios](https://axios-http.com/).
3. The API returns a JSON payload with current conditions and a 15-day forecast.
4. The app parses the response and renders the weather card. Clicking **View Forecast** expands the full forecast.
5. Weather icons are rendered using [Iconify](https://iconify.design/) and map to condition names returned by the API (e.g. `clear-day`, `rain`, `snow`).

## API

This project uses the **[Visual Crossing Weather API](https://www.visualcrossing.com/weather-api)**.

- **Endpoint:** `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{city}`
- **Parameters used:** `unitGroup=metric`, `include=days`
- Free tier available — no credit card required to get an API key.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML / CSS / JavaScript | Core structure, styling, and logic |
| [Axios](https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js) | HTTP requests to the weather API |
| [Iconify](https://iconify.design/) | Weather condition icons |
| [Visual Crossing API](https://www.visualcrossing.com/) | Weather data |
| GitHub Pages | Hosting |

## Project Structure

```
Weather_App/
├── index.html     # App layout and script imports
├── index.js       # All app logic (fetch, render, event listeners)
└── style.css      # Styling
```

## Running Locally

No build step required. Just open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

To use your own API key, replace the value of `API_KEY` on line 8 of `index.js` with a key from [visualcrossing.com](https://www.visualcrossing.com/weather-api).

---

Created by Elion Emini © 2026
