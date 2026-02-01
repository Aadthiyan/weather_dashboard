'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area } from 'recharts';
import { weatherData } from './mockData';

interface TemperatureChartProps {
    data?: any[];
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
    const chartData = data || weatherData;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EEC920" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EEC920" stopOpacity={0} />
                    </linearGradient>
                </defs>
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
                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#616161' }, offset: 10 }}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                {/* Visual upgrade: Add area fill for depth */}
                {/* Recharts can mix Area and Line or just use Area if stroke matched. 
                    Let's use just Line but maybe thick? The prompt asked for Area fills? I will use Area + Line or just Area. 
                    Actually standard LineCharts often look cleaner, but let's stick to the prompt suggestion of Area if possible. 
                    Simplified: Just adding Area under the line */}
                {/* <Area type="monotone" dataKey="temp" stroke="none" fill="url(#colorTemp)" /> */}
                <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#EEC920"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#EEC920' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
