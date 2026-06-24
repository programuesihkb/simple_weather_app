/**
 * @jest-environment jsdom
 */

const API_KEY = '7GHHXN3SRSTFLXYDH4FNC2GCP';

const mockWeatherData = {
    resolvedAddress: 'New York, NY, USA',
    days: [
        {
            datetime: '2024-06-01',
            temp: 25,
            conditions: 'Partly Cloudy',
            description: 'Becoming partly cloudy in the afternoon.',
            humidity: 60,
            windspeed: 15,
            precip: 0,
            visibility: 10,
            uvindex: 5,
            sunrise: '05:28:12',
            sunset: '20:25:36',
            icon: 'partly-cloudy-day',
        },
    ],
};

// index.js captures DOM nodes at module load time, so the DOM must exist
// before the module is imported. We reset + re-import in each beforeEach.
let getWeather, handleWeatherData, formatForecastDate, forecastIcon;

beforeEach(async () => {
    document.body.innerHTML = `
        <input id="city-input" type="text" />
        <div id="weather-container"></div>
        <p id="error-message"></p>
        <button id="weather-btn">Get Weather</button>
    `;
    global.axios = { get: jest.fn() };
    jest.resetModules();
    const mod = await import('./index.js');
    getWeather = mod.getWeather;
    handleWeatherData = mod.handleWeatherData;
    formatForecastDate = mod.formatForecastDate;
    forecastIcon = mod.forecastIcon;
});

afterEach(() => {
    jest.clearAllMocks();
});

// ─── forecastIcon ────────────────────────────────────────────────────────────~

describe('forecastIcon', () => {
    test.each([
        ['clear-day',               'lucide:sun'],
        ['clear-night',             'lucide:moon'],
        ['cloudy',                  'lucide:cloud'],
        ['cloudy-day',              'lucide:cloud'],
        ['cloudy-night',            'lucide:cloud'],
        ['partly-cloudy-day',       'lucide:cloud-sun'],
        ['partly-cloudy-night',     'lucide:cloud-moon'],
        ['fog',                     'lucide:cloud-fog'],
        ['wind',                    'lucide:wind'],
        ['rain',                    'lucide:cloud-rain'],
        ['showers-day',             'lucide:cloud-drizzle'],
        ['showers-night',           'lucide:cloud-drizzle'],
        ['snow',                    'lucide:snowflake'],
        ['snow-showers-day',        'lucide:cloud-snow'],
        ['snow-showers-night',      'lucide:cloud-snow'],
        ['sleet',                   'lucide:cloud-hail'],
        ['hail',                    'lucide:cloud-hail'],
        ['thunder',                 'lucide:cloud-lightning'],
        ['thunder-rain',            'lucide:cloud-lightning'],
        ['thunder-showers-day',     'lucide:cloud-lightning'],
        ['thunder-showers-night',   'lucide:cloud-lightning'],
        ['rain-snow',               'lucide:cloud-rain-wind'],
        ['rain-snow-showers-day',   'lucide:cloud-rain-wind'],
        ['rain-snow-showers-night', 'lucide:cloud-rain-wind'],
    ])('maps "%s" → "%s"', (condition, expected) => {
        expect(forecastIcon(condition)).toBe(expected);
    });

    test('returns fallback icon for an unknown condition', () => {
        expect(forecastIcon('unknown')).toBe('lucide:question-mark');
    });

    test('returns fallback icon for an empty string', () => {
        expect(forecastIcon('')).toBe('lucide:question-mark');
    });

    test('returns fallback icon for undefined', () => {
        expect(forecastIcon(undefined)).toBe('lucide:question-mark');
    });
});

// ─── formatForecastDate ──────────────────────────────────────────────────────

describe('formatForecastDate', () => {
    test('formats a Saturday in June correctly', () => {
        expect(formatForecastDate('2024-06-01')).toBe('Sat, June 1');
    });

    test('formats a Monday in January correctly', () => {
        expect(formatForecastDate('2024-01-15')).toBe('Mon, January 15');
    });

    test('formats a single-digit day without a leading zero', () => {
        expect(formatForecastDate('2024-03-05')).toBe('Tue, March 5');
    });

    test('formats the last day of a year correctly', () => {
        expect(formatForecastDate('2024-12-31')).toBe('Tue, December 31');
    });
});

// ─── handleWeatherData ───────────────────────────────────────────────────────

describe('handleWeatherData', () => {
    test('renders the resolved address', () => {
        handleWeatherData(mockWeatherData);
        expect(document.getElementById('weather-container').innerHTML).toContain('New York, NY, USA');
    });

    test('renders temperature, condition, and description', () => {
        handleWeatherData(mockWeatherData);
        const html = document.getElementById('weather-container').innerHTML;
        expect(html).toContain('25°C');
        expect(html).toContain('Partly Cloudy');
        expect(html).toContain('Becoming partly cloudy in the afternoon.');
    });

    test('renders humidity, wind speed, precipitation, visibility, and UV index', () => {
        handleWeatherData(mockWeatherData);
        const html = document.getElementById('weather-container').innerHTML;
        expect(html).toContain('60%');
        expect(html).toContain('15 km/h');
        expect(html).toContain('0 mm');
        expect(html).toContain('10 km');
        expect(html).toContain('5');
    });

    test('renders sunrise and sunset times', () => {
        handleWeatherData(mockWeatherData);
        const html = document.getElementById('weather-container').innerHTML;
        expect(html).toContain('05:28:12');
        expect(html).toContain('20:25:36');
    });

    test('renders the View Forecast button', () => {
        handleWeatherData(mockWeatherData);
        const btn = document.getElementById('weather-forecast-btn');
        expect(btn).not.toBeNull();
        expect(btn.textContent).toBe('View Forecast');
    });

    test('replaces previous weather card when called a second time', () => {
        handleWeatherData(mockWeatherData);
        const updatedData = { ...mockWeatherData, resolvedAddress: 'London, UK' };
        handleWeatherData(updatedData);
        const html = document.getElementById('weather-container').innerHTML;
        expect(html).toContain('London, UK');
        expect(html).not.toContain('New York, NY, USA');
    });
});

// ─── getWeather ──────────────────────────────────────────────────────────────

describe('getWeather', () => {
    test('calls axios.get with the correct URL', async () => {
        global.axios.get.mockResolvedValue({ data: mockWeatherData });
        await getWeather('New York', API_KEY);
        expect(global.axios.get).toHaveBeenCalledWith(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/New York?key=${API_KEY}&unitGroup=metric&include=days`
        );
    });

    test('renders the weather card on a successful fetch', async () => {
        global.axios.get.mockResolvedValue({ data: mockWeatherData });
        await getWeather('New York', API_KEY);
        expect(document.getElementById('weather-container').innerHTML).toContain('New York, NY, USA');
    });

    test('clears any previous error message on a successful fetch', async () => {
        document.getElementById('error-message').textContent = 'Previous error';
        global.axios.get.mockResolvedValue({ data: mockWeatherData });
        await getWeather('New York', API_KEY);
        expect(document.getElementById('error-message').textContent).toBe('');
    });

    test('shows a user-friendly message and clears the container on an API error', async () => {
        global.axios.get.mockRejectedValue({ response: { data: 'Bad Request' } });
        await getWeather('InvalidCityXYZ', API_KEY);
        expect(document.getElementById('error-message').textContent).toBe(
            'Could not fetch weather data. Please check the city name and try again.'
        );
        expect(document.getElementById('weather-container').innerHTML).toBe('');
    });

    test('shows a network error message and clears the container on a network failure', async () => {
        global.axios.get.mockRejectedValue(new Error('Network Error'));
        await getWeather('New York', API_KEY);
        expect(document.getElementById('error-message').textContent).toBe('Network error: Network Error');
        expect(document.getElementById('weather-container').innerHTML).toBe('');
    });
});
