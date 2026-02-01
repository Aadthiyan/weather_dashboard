'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { weatherData } from './mockData';

interface PrecipitationChartProps {
    data?: any[];
}

export default function PrecipitationChart({ data }: PrecipitationChartProps) {
    const chartData = data || weatherData;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                    domain={[0, 'auto']}
                    ticks={[0, 5, 10, 15, 20, 25]}
                    label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#616161' }, offset: 10 }}
                />
                <Tooltip
                    cursor={{ fill: '#f5f5f5' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar
                    dataKey="precip"
                    fill="#007C9E"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
