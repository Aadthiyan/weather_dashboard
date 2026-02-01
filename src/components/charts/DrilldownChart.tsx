'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { weatherData } from './mockData';

interface DrilldownChartProps {
    data?: any[];
    dataKey?: string;
    stroke?: string;
    unit?: string;
    multiSeries?: string[]; // Array of keys for multiple lines (e.g. ['India', 'China'])
}

const COLORS = ['#EEC920', '#007C9E', '#FF7F50', '#9370DB', '#8BADA9', '#FF69B4', '#CD5C5C', '#4B0082'];

export default function DrilldownChart({
    data,
    dataKey = "temp",
    stroke = "#EEC920",
    unit = "°C",
    multiSeries
}: DrilldownChartProps) {
    const chartData = data || weatherData;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#616161' }}
                    interval={1}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#616161' }}
                    domain={['auto', 'auto']}
                    label={{ value: unit, angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#616161' }, offset: 10 }}
                />
                <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                {multiSeries && multiSeries.length > 0 && <Legend />}

                {multiSeries ? (
                    multiSeries.map((seriesKey, index) => (
                        <Line
                            key={seriesKey}
                            type="monotone"
                            dataKey={seriesKey}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                            name={seriesKey}
                        />
                    ))
                ) : (
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={stroke}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: stroke }}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
}
