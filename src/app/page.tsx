'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import ChartCard from '@/components/ChartCard/ChartCard';
import TemperatureChart from '@/components/charts/TemperatureChart';
import PrecipitationChart from '@/components/charts/PrecipitationChart';
import WindChart from '@/components/charts/WindChart';
import DateRangePicker from '@/components/Filters/DateRangePicker';
import LocationDropdown from '@/components/Filters/LocationDropdown';
import { Thermometer, CloudRain, Wind } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchHistoricalWeather, WeatherDataPoint } from '@/services/weatherApi';
import { format } from 'date-fns';

export default function Overview() {
  const router = useRouter();


  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(2024, 0, 1), // Jan 1 2024 (Archive API works best with past data)
    end: new Date(2024, 0, 10)
  });
  const [locations, setLocations] = useState<string[]>(['India']); // Default
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      // Use first selected location or default
      const location = locations.length > 0 ? locations[0] : 'India';

      const apiData = await fetchHistoricalWeather(location, dateRange.start, dateRange.end);

      // Transform for charts
      const chartData = apiData.map(d => ({
        date: format(new Date(d.date), 'MMM d'), // '2025-01-01' -> 'Jan 1'
        temp: d.temperature_2m_mean,
        precip: d.precipitation_sum,
        wind: d.wind_speed_10m_max
      }));

      setData(chartData);
      setLoading(false);
    }

    loadData();
  }, [dateRange, locations]);

  const handleNavigate = (metric: string) => {
    router.push(`/drilldown?metric=${encodeURIComponent(metric)}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Overview</h1>

      <div className={styles.filterRow}>
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={(start, end) => setDateRange({ start, end })}
        />
        <LocationDropdown
          onChange={(locs) => setLocations(locs)}
        />
      </div>

      <div className={styles.chartsGrid}>
        <ChartCard
          title="Temperature"
          icon={<Thermometer size={20} color="#000000" />}
          onClick={() => handleNavigate('Temperature')}
        >
          {loading ? <p>Loading...</p> : <TemperatureChart data={data} />}
        </ChartCard>

        <ChartCard
          title="Precipitation"
          icon={<CloudRain size={20} color="#000000" />}
          onClick={() => handleNavigate('Precipitation')}
        >
          {loading ? <p>Loading...</p> : <PrecipitationChart data={data} />}
        </ChartCard>

        <ChartCard
          title="Wind Speed"
          icon={<Wind size={20} color="#000000" />}
          onClick={() => handleNavigate('Wind Speed')}
        >
          {loading ? <p>Loading...</p> : <WindChart data={data} />}
        </ChartCard>
      </div>
    </div>
  );
}
