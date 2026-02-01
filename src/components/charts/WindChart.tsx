'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { weatherData } from './mockData';

interface WindChartProps {
    data?: any[];
}

export default function WindChart({ data }: WindChartProps) {
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
                    domain={[0, 'auto']}
                    ticks={[0, 5, 10, 15, 20, 25]}
                    label={{ value: 'Windspeed (Km/h)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#616161' }, offset: 10 }}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                    type="monotone"
                    dataKey="wind"
                    stroke="#8BADA9"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#8BADA9' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
