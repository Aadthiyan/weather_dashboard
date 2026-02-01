import { format } from 'date-fns';

export interface WeatherDataPoint {
    date: string;
    [key: string]: string | number;
}

const COORDINATES: Record<string, { lat: number; lon: number }> = {
    'Australia': { lat: -25.27, lon: 133.77 },
    'Belgium': { lat: 50.85, lon: 4.35 },
    'Brazil': { lat: -14.23, lon: -51.92 },
    'China': { lat: 35.86, lon: 104.19 },
    'Denmark': { lat: 56.26, lon: 9.50 },
    'India': { lat: 20.59, lon: 78.96 },
    'Sri Lanka': { lat: 7.87, lon: 80.77 },
    'Thailand': { lat: 15.87, lon: 100.99 }
};

export const METRIC_TO_API_VAR: Record<string, string> = {
    'Temperature': 'temperature_2m_mean',
    'Precipitation': 'precipitation_sum',
    'Wind Speed': 'wind_speed_10m_max',
    'Relative Humidity': 'relative_humidity_2m_mean',
    'Apparent Temperature': 'apparent_temperature_mean',
    'Sea Level Pressure': 'pressure_msl_mean'
};

const ALL_DAILY_VARS = [
    'temperature_2m_mean',
    'precipitation_sum',
    'wind_speed_10m_max',
    'relative_humidity_2m_mean',
    'apparent_temperature_mean',
    'pressure_msl_mean'
];

// Cache to prevent redundant fetches
const CACHE: Record<string, WeatherDataPoint[]> = {};

export async function fetchHistoricalWeather(
    location: string,
    startDate: Date,
    endDate: Date
): Promise<WeatherDataPoint[]> {
    const coords = COORDINATES[location] || COORDINATES['India'];
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');
    const cacheKey = `${location}-${startStr}-${endStr}`;

    if (CACHE[cacheKey]) return CACHE[cacheKey];

    const params = new URLSearchParams({
        latitude: coords.lat.toString(),
        longitude: coords.lon.toString(),
        start_date: startStr,
        end_date: endStr,
        daily: ALL_DAILY_VARS.join(',')
    });

    const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.daily) return [];

        const { time } = data.daily;
        const result = time.map((t: string, index: number) => {
            const point: WeatherDataPoint = { date: t };
            ALL_DAILY_VARS.forEach(variable => {
                if (data.daily[variable]) {
                    point[variable] = data.daily[variable][index];
                }
            });
            return point;
        });

        CACHE[cacheKey] = result; // Simple in-memory cache
        return result;

    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return [];
    }
}
