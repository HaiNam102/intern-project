import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Shelf, RealtimeShelfOsaRate } from '../../services/types';

interface Props {
    shelf: Shelf;
    data: RealtimeShelfOsaRate[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data: RealtimeShelfOsaRate = payload[0].payload;
        return (
            <div className="bg-white p-4 border border-gray-200 shadow-xl rounded-lg">
                <p className="font-bold text-gray-800 mb-2">{`Time: ${new Date(data.ts).toLocaleTimeString()}`}</p>
                <p className="text-blue-500 font-semibold">{`OSA Rate: ${data.osaRatePct.toFixed(2)}%`}</p>
                <p className="text-gray-600 mt-1">{`Duration Above Threshold: ${data.durationAboveThresholdMinutes} min`}</p>
                <p className="text-gray-600">{`Duration Empty (100%): ${data.durationEmptyRatio100Minutes} min`}</p>
            </div>
        );
    }
    return null;
};

export const ShelfOsaChart: React.FC<Props> = React.memo(({ shelf, data }) => {
    const formatXAxis = (tickItem: number) => {
        return new Date(tickItem).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{shelf.name}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ts" tickFormatter={formatXAxis} />
                    <YAxis domain={[0, 100]} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine
                        y={shelf.emptyRatioThreshold}
                        stroke="red"
                        strokeDasharray="3 3"
                    />
                    <Bar dataKey="osaRatePct" name="OSA Rate" fill="#3b82f6" />
                    <text
                        x="98%"             
                        y={300 - (shelf.emptyRatioThreshold * 300 / 100) - 40}            
                        textAnchor="end"
                        fill="red"
                        fontWeight="bold"
                    >
                        {`Alert (${shelf.emptyRatioThreshold}%)`}
                    </text>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
});
