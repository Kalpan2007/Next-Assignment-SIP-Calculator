'use client';


// What it does: This component's only job is to draw the graph.

// How it works: It is a "presentational" component. It receives the investmentGrowth data array (calculated by our backend) 
// as a property. It does no calculations. It simply passes this data to the AreaChart component from the Recharts library. 
// Recharts handles all the complex work of rendering the visual graph.


import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  date: string;
  value: number; // Market Value
  invested: number; // Total Invested
}

// Helper to format large numbers for the Y-axis (e.g., 250000 -> 2.5L)
const formatToLakhs = (value: number) => {
    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
}

export const InvestmentChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatToLakhs} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number, name: string) => [
            `₹${Math.round(value).toLocaleString('en-IN')}`,
            name === 'value' ? 'Market Value' : 'Total Invested'
          ]}
        />
        <Legend wrapperStyle={{ bottom: -5 }} />
        
        {/* 'Total Invested' is shown as a clean, dashed line */}
        <Line 
          type="monotone" 
          dataKey="invested" 
          stroke="#5E5E5E" // light-text color
          strokeWidth={2} 
          dot={false} 
          name="Total Invested" 
          strokeDasharray="5 5"
        />

        {/* 'Market Value' is shown as a filled area chart */}
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#FF7A00" // brand-orange
          fill="#FF7A00" 
          fillOpacity={0.2} 
          strokeWidth={2} 
          name="Market Value" 
        />
        
      </AreaChart>
    </ResponsiveContainer>
  );
};
