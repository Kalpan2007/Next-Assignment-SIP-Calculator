'use client';
import { useState } from 'react';
import { Loader2, Calculator } from 'lucide-react';
import { InvestmentChart } from '@/components/InvestmentChart'; // adjust path

interface RollingResult {
  count: number;
  averageReturn: number;
  maxReturn: number;
  minReturn: number;
  startDate?: string;
  rollingSeries?: { date: string; value: number }[];
}

export default function RollingReturnsCalculator({ code }: { code: string }) {
  // window and duration are full period strings like '1d','7d','1m','3m','1y','3y','5y'
  const [window, setWindow] = useState('1y');
  const [duration, setDuration] = useState('5y');
  const [start, setStart] = useState(''); // optional ISO date YYYY-MM-DD
  const [result, setResult] = useState<RollingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const params = new URLSearchParams();
      params.set('window', window);
      params.set('duration', duration);
      if (start) params.set('start', start);
      const res = await fetch(`/api/scheme/${code}/rolling-returns?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Calculation failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
      {/* LEFT: Controls */}
      <div className="xl:col-span-2">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Rolling Returns Analysis</h3>
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-light-text">Return Window</label>
              <select
                value={window}
                onChange={e => setWindow(e.target.value)}
                className="w-full p-2 border-2 rounded-lg mt-1 bg-cream border-border-color focus:border-brand-orange"
              >
                <option value="1d">1 Day</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="1m">1 Month</option>
                <option value="3m">3 Months</option>
                <option value="1y">1 Year</option>
                <option value="3y">3 Years</option>
                <option value="5y">5 Years</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-light-text">Analysis Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full p-2 border-2 rounded-lg mt-1 bg-cream border-border-color focus:border-brand-orange"
              >
                <option value="1d">Last day</option>
                <option value="1m">Last month</option>
                <option value="1y">Last year</option>
                <option value="3y">Last 3 years</option>
                <option value="5y">Last 5 years</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-light-text">Start Date (optional)</label>
              <input
                type="date"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="w-full p-2 border-2 rounded-lg mt-1 bg-white border-border-color focus:border-brand-orange"
              />
              <p className="text-xs text-light-text mt-1">If set, analysis will start from this date (clamped to available NAV range).</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-opacity-90"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Calculator size={18} />} Analyze
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Output + Graph */}
      <div className="xl:col-span-3">
        <div className="bg-white p-8 rounded-xl shadow-lg min-h-[300px] flex flex-col items-center justify-center">
          {loading && <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />}
          {error && <div className="text-red-600">{error}</div>}

          {result && result.averageReturn !== undefined && (
            <div className="w-full">
              <h4 className="font-bold text-lg text-dark-text mb-2 text-center">Rolling Returns Summary</h4>
              <p className="text-sm text-light-text text-center">
                Based on {result.count} rolling periods using a <strong>{window}</strong> window over the last <strong>{duration}</strong>.
              </p>
              {result.startDate && (
                <p className="text-xs text-light-text text-center mt-2">Start date used: <strong>{result.startDate}</strong></p>
              )}

              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <p className="font-bold text-2xl text-green-600">{result.maxReturn.toFixed(2)}%</p>
                  <p className="text-sm text-light-text">Max Return</p>
                </div>
                <div>
                  <p className="font-bold text-2xl text-brand-orange">{result.averageReturn.toFixed(2)}%</p>
                  <p className="text-sm text-light-text">Average Return</p>
                </div>
                <div>
                  <p className="font-bold text-2xl text-red-600">{result.minReturn.toFixed(2)}%</p>
                  <p className="text-sm text-light-text">Min Return</p>
                </div>
              </div>

              {result.rollingSeries && (
                <div className="mt-8 h-64">
                  <InvestmentChart
                    data={result.rollingSeries.map(d => ({
                      date: d.date,
                      value: d.value,
                      invested: 0
                    }))}
                  />
                </div>
              )}
            </div>
          )}

          {!loading && !error && !result && (
            <p className="text-light-text text-center">
              Select your analysis options and click "Analyze" to see the results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
