'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// Removed PiggyBank and TrendingUp as they are not used on this page
import { Calculator as CalculatorIcon, RefreshCw, Plus, Minus } from 'lucide-react';

// --- Reusable component for number inputs with buttons ---
interface NumberInputProps {
  label: string;
  value: number;
  onValueChange: (newValue: number) => void;
  step: number;
  min?: number;
  unit?: string;
}

function NumberInputWithButtons({ label, value, onValueChange, step, min = 0, unit }: NumberInputProps) {
  const handleDecrement = () => {
    onValueChange(Math.max(min, value - step));
  };

  const handleIncrement = () => {
    onValueChange(value + step);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-light-text mb-2">{label}</label>
      <div className="flex items-center">
        <button type="button" onClick={handleDecrement} className="p-3 bg-cream border border-border-color rounded-l-md hover:bg-border-color transition-colors">
          <Minus className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={`${unit ? unit + ' ' : ''}${value.toLocaleString('en-IN')}`}
          readOnly
          className="w-full p-3 text-center bg-white border-y border-border-color text-lg font-semibold focus:outline-none"
        />
        <button type="button" onClick={handleIncrement} className="p-3 bg-cream border border-border-color rounded-r-md hover:bg-border-color transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
// --- End of reusable component ---


// Define the structure for calculation results
interface SipResult {
  futureValue: number;
  totalInvested: number;
  wealthGained: number;
}

// Define the structure for chart data
interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#FF7A00', '#2D2D2D']; // Orange for wealth gained, Dark Text for invested

export default function SipCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(15);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  const [result, setResult] = useState<SipResult | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    const P = monthlyInvestment;
    const n = investmentPeriod * 12; // total number of months
    const annualRate = expectedReturn / 100;
    const i = annualRate / 12; // monthly rate of interest

    // Future value of an annuity due (SIP formula)
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    
    const totalInvested = P * n;
    const wealthGained = M - totalInvested;
    
    setTimeout(() => {
      setResult({
        futureValue: M,
        totalInvested: totalInvested,
        wealthGained: wealthGained,
      });
      setChartData([
        { name: 'Wealth Gained', value: wealthGained },
        { name: 'Total Invested', value: totalInvested },
      ]);
      setIsCalculating(false);
    }, 500);
  };

  const handleReset = () => {
    setMonthlyInvestment(10000);
    setInvestmentPeriod(15);
    setExpectedReturn(12);
    setResult(null);
    setChartData([]);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-dark-text">SIP Calculator</h1>
        <p className="text-lg text-light-text mt-2">Plan your future investments and visualize your wealth growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* --- Input Form Section --- */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-border-color">
          <h2 className="text-2xl font-semibold text-dark-text mb-6">Enter Your Investment Details</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            
            <NumberInputWithButtons
              label="Monthly Investment"
              unit="₹"
              value={monthlyInvestment}
              onValueChange={setMonthlyInvestment}
              step={500}
              min={500}
            />
            <NumberInputWithButtons
              label="Investment Period (Years)"
              value={investmentPeriod}
              onValueChange={setInvestmentPeriod}
              step={1}
              min={1}
            />
            <NumberInputWithButtons
              label="Expected Annual Return (%)"
              unit="%"
              value={expectedReturn}
              onValueChange={setExpectedReturn}
              step={0.5}
              min={0}
            />

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={isCalculating}
                // FIXED: Changed text-brown to text-white
                className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold py-3 rounded-md hover:bg-opacity-90 transition-all disabled:bg-brand-orange-light"
              >
                {isCalculating ? 'Calculating...' : 'Calculate'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-auto p-3 text-light-text hover:text-dark-text hover:bg-black/5 rounded-md transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* --- Results Section --- */}
        <div className="bg-dark-text text-cream p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center">
          {result ? (
            <div className="w-full text-center">
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center bg-cream/10 p-3 rounded-md">
                    <p className="text-cream/80">Total Invested:</p>
                    <p className="font-bold text-lg">{formatCurrency(result.totalInvested)}</p>
                </div>
                <div className="flex justify-between items-center bg-cream/10 p-3 rounded-md">
                    <p className="text-cream/80">Wealth Gained:</p>
                    <p className="font-bold text-lg text-brand-orange-light">{formatCurrency(result.wealthGained)}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-cream/20 flex justify-between items-center">
                    <p className="text-lg">Future Value:</p>
                    <p className="font-bold text-2xl">{formatCurrency(result.futureValue)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-cream/60">
              <CalculatorIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Your results will appear here</h3>
              <p>Fill in the details to see your potential returns.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
