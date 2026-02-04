'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { weatherData } from './mockData';

interface DrilldownChartProps {
    data?: any[];
    dataKey?: string;
    stroke?: string;
    unit?: string;
    multiSeries?: string[]; // Array of keys for multiple lines (e.g. ['India', 'China'])
    chartType?: 'line' | 'bar'; // Specify chart type
}

const COLORS = ['#EEC920', '#007C9E', '#FF7F50', '#9370DB', '#8BADA9', '#FF69B4', '#CD5C5C', '#4B0082'];

export default function DrilldownChart({
    data,
    dataKey = "temp",
    stroke = "#EEC920",
    unit = "°C",
    multiSeries,
    chartType = 'line'
}: DrilldownChartProps) {
    const chartData = data || weatherData;

    const chartProps = {
        data: chartData,
        margin: { top: 10, right: 10, left: -20, bottom: 0 }
    };

    const axisProps = (
        <>
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
        </>
    );

    if (chartType === 'bar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart {...chartProps}>
                    {axisProps}
                    {multiSeries ? (
                        multiSeries.map((seriesKey, index) => (
                            <Bar
                                key={seriesKey}
                                dataKey={seriesKey}
                                fill={COLORS[index % COLORS.length]}
                                radius={[4, 4, 0, 0]}
                                barSize={12}
                                name={seriesKey}
                            />
                        ))
                    ) : (
                        <Bar
                            dataKey={dataKey}
                            fill={stroke}
                            radius={[4, 4, 0, 0]}
                            barSize={12}
                        />
                    )}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
                {axisProps}
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
