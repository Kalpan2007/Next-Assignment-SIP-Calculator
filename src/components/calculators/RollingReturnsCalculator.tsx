'use client';
import { useState } from 'react';
import { Loader2, Calculator } from 'lucide-react';

// Define a specific type for our result object for better type safety
interface RollingResult {
    count: number;
    averageReturn: number;
    maxReturn: number;
    minReturn: number;
}

export default function RollingReturnsCalculator({ code }: { code: string }) {
    const [window, setWindow] = useState('1');
    const [duration, setDuration] = useState('5');
    const [result, setResult] = useState<RollingResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await fetch(`/api/scheme/${code}/rolling-returns?window=${window}y&duration=${duration}y`);
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
            <div className="xl:col-span-2">
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-6">Rolling Returns Analysis</h3>
                    <form onSubmit={handleCalculate} className="space-y-4">
                         <div>
                            <label className="text-sm font-semibold text-light-text">Return Window (Years)</label>
                            <select value={window} onChange={e => setWindow(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1 bg-cream border-border-color focus:border-brand-orange">
                                <option value="1">1 Year</option>
                                <option value="3">3 Years</option>
                                <option value="5">5 Years</option>
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-light-text">Analysis Duration (Years)</label>
                             <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1 bg-cream border-border-color focus:border-brand-orange">
                                <option value="3">Last 3 Years</option>
                                <option value="5">Last 5 Years</option>
                                <option value="10">Last 10 Years</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-opacity-90">
                            {loading ? <Loader2 className="animate-spin" /> : <Calculator size={18} />} Analyze
                        </button>
                    </form>
                </div>
            </div>
            <div className="xl:col-span-3">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center min-h-[200px] flex items-center justify-center">
                    {loading && <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />}
                    {error && <div className="text-red-600">{error}</div>}
                    
                    {/* --- THE FIX --- */}
                    {/* Check for 'result.averageReturn' which matches the API response */}
                    {result && result.averageReturn !== undefined && (
                         <div>
                            <h4 className="font-bold text-lg text-dark-text mb-2">Rolling Returns Summary</h4>
                            <p className="text-sm text-light-text">{`Based on ${result.count} rolling ${window}-year periods over the last ${duration} years.`}</p>
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div><p className="font-bold text-2xl text-green-600">{result.maxReturn.toFixed(2)}%</p><p className="text-sm text-light-text">Max Return</p></div>
                                <div><p className="font-bold text-2xl text-brand-orange">{result.averageReturn.toFixed(2)}%</p><p className="text-sm text-light-text">Average Return</p></div>
                                <div><p className="font-bold text-2xl text-red-600">{result.minReturn.toFixed(2)}%</p><p className="text-sm text-light-text">Min Return</p></div>
                            </div>
                        </div>
                    )}
                    {!loading && !error && !result && (
                        <p className="text-light-text">Select your analysis options and click "Analyze" to see the results.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

