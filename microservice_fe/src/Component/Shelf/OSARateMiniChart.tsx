import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { RealtimeShelfOsaRate } from "../../services/types" // Adjust the import path as necessary

interface MiniChartProps {
  data: RealtimeShelfOsaRate[];
  alertThreshold: number;
}

export const OSARateMiniChart: React.FC<MiniChartProps> = ({ data, alertThreshold }) => {
  return (
    <div className="h-28 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip />
          <ReferenceLine y={alertThreshold} stroke="red" strokeDasharray="3 3" />
          <Bar dataKey="osaRate" fill="#ccc" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
