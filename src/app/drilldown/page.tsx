'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import ChartCard from '@/components/ChartCard/ChartCard';
import DrilldownChart from '@/components/charts/DrilldownChart';
import MetricDropdown, { MetricType } from '@/components/MetricDropdown/MetricDropdown';
import LocationDropdown from '@/components/Filters/LocationDropdown';
import DateRangePicker from '@/components/Filters/DateRangePicker';
import { Thermometer, CloudRain, Wind, Droplets, Gauge, Eye } from 'lucide-react';
import { fetchHistoricalWeather, METRIC_TO_API_VAR } from '@/services/weatherApi';
import { format } from 'date-fns';
import { ChartSkeleton } from '@/components/Skeleton/Skeleton';

function DrilldownContent() {
    const searchParams = useSearchParams();
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('Temperature');

    // Lifted State
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
        start: new Date(2024, 0, 1),
        end: new Date(2024, 0, 10)
    });
    const [locations, setLocations] = useState<string[]>(['India']);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const metricParam = searchParams.get('metric');
        if (metricParam) {
            const validMetrics: MetricType[] = ['Temperature', 'Precipitation', 'Wind Speed', 'Relative Humidity', 'Apparent Temperature', 'Sea Level Pressure'];
            if (validMetrics.includes(metricParam as MetricType)) {
                setSelectedMetric(metricParam as MetricType);
            }
        }
    }, [searchParams]);

    // Data Fetching with Comparison Logic
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const apiKey = METRIC_TO_API_VAR[selectedMetric];

            // Fetch data for ALL selected locations in parallel
            const fetchPromises = locations.map(loc => fetchHistoricalWeather(loc, dateRange.start, dateRange.end));
            const results = await Promise.all(fetchPromises);

            // Merge results into a single array for Recharts
            // Assumes all APIs return aligned dates (which they should for same range)
            if (results.length === 0 || results[0].length === 0) {
                setData([]);
                setLoading(false);
                return;
            }

            const mergedData = results[0].map((point, index) => {
                const mergedPoint: any = {
                    date: format(new Date(point.date as string), 'MMM d')
                };

                // Add each location's data point
                locations.forEach((loc, locIndex) => {
                    const locData = results[locIndex][index];
                    // Use the location name as the key for the value
                    if (locData && locData[apiKey] !== undefined) {
                        mergedPoint[loc] = locData[apiKey];
                    }
                });

                return mergedPoint;
            });

            setData(mergedData);
            setLoading(false);
        }
        loadData();
    }, [dateRange, locations, selectedMetric]);

    // Helper to get parameters for the specific metric
    const getChartParams = (metric: MetricType) => {
        let color = '#000000';
        let unit = '';

        switch (metric) {
            case 'Temperature': color = '#EEC920'; unit = '°C'; break;
            case 'Precipitation': color = '#007C9E'; unit = 'mm'; break;
            case 'Wind Speed': color = '#8BADA9'; unit = 'km/h'; break;
            case 'Relative Humidity': color = '#00CED1'; unit = '%'; break;
            case 'Apparent Temperature': color = '#FF7F50'; unit = '°C'; break;
            case 'Sea Level Pressure': color = '#9370DB'; unit = 'hPa'; break;
        }

        return { color, unit };
    };

    const { color, unit } = getChartParams(selectedMetric);

    const getIcon = (metric: MetricType) => {
        switch (metric) {
            case 'Temperature': return <Thermometer size={20} color="#000000" />;
            case 'Relative Humidity': return <Droplets size={20} color="#000000" />;
            case 'Apparent Temperature': return <Eye size={20} color="#000000" />;
            case 'Precipitation': return <CloudRain size={20} color="#000000" />;
            case 'Sea Level Pressure': return <Gauge size={20} color="#000000" />;
            case 'Wind Speed': return <Wind size={20} color="#000000" />;
            default: return <Thermometer size={20} color="#000000" />;
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Drilldown</h1>

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

            <div className={styles.chartContainer}>
                <ChartCard
                    title={selectedMetric}
                    icon={getIcon(selectedMetric)}
                    action={
                        <MetricDropdown
                            selectedMetric={selectedMetric}
                            onChange={setSelectedMetric}
                        />
                    }
                    className={styles.fullHeightCard}
                >
                    {loading ? <ChartSkeleton /> : (
                        <DrilldownChart
                            data={data}
                            // Pass comparison keys (locations) if multiple, else standard
                            multiSeries={locations}
                            stroke={color}
                            unit={unit}
                        />
                    )}
                </ChartCard>
            </div>
        </div>
    );
}

export default function Drilldown() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DrilldownContent />
        </Suspense>
    );
}
