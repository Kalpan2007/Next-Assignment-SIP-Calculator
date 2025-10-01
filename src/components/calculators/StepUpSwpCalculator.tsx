'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Calculator } from 'lucide-react';

export default function StepUpSwpCalculator({ code }: { code: string }) {
    const [initialInvestment, setInitialInvestment] = useState('2500000');
    const [initialWithdrawal, setInitialWithdrawal] = useState('15000');
    const [annualIncreasePercent, setAnnualIncreasePercent] = useState('5');
    const [from, setFrom] = useState('2015-01-01');
    const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await fetch(`/api/scheme/${code}/step-up-swp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    initialInvestment: parseInt(initialInvestment),
                    initialWithdrawal: parseInt(initialWithdrawal),
                    annualIncreasePercent: parseInt(annualIncreasePercent),
                    from,
                    to,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(value);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-2">
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-6">Step-Up SWP Calculator</h3>
                    <form onSubmit={handleCalculate} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-light-text">Initial Investment</label>
                            <input type="number" value={initialInvestment} onChange={e => setInitialInvestment(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-light-text">Initial Monthly Withdrawal</label>
                            <input type="number" value={initialWithdrawal} onChange={e => setInitialWithdrawal(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-light-text">Annual Increase (%)</label>
                            <input type="number" value={annualIncreasePercent} onChange={e => setAnnualIncreasePercent(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-light-text">Start Date</label>
                                <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-light-text">End Date</label>
                                <input type="date" value={to} onChange={e => setTo(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : <Calculator size={18} />} Calculate
                        </button>
                    </form>
                </div>
            </div>
             <div className="xl:col-span-3">
                {loading && <div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-brand-orange" /></div>}
                {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
                {result && (
                     <div className="bg-white p-8 rounded-xl shadow-lg grid grid-cols-2 gap-6 text-center">
                        <div><p className="text-sm text-light-text">Initial Investment</p><p className="text-2xl font-bold">{formatCurrency(result.initialInvestment)}</p></div>
                        <div><p className="text-sm text-light-text">Total Withdrawn</p><p className="text-2xl font-bold">{formatCurrency(result.totalWithdrawn)}</p></div>
                        <div><p className="text-sm text-light-text">Final Value</p><p className="text-2xl font-bold">{formatCurrency(result.finalValue)}</p></div>
                        <div><p className="text-sm text-light-text">Portfolio Status</p><p className={`text-2xl font-bold ${result.isPortfolioActive ? 'text-green-600' : 'text-red-600'}`}>{result.isPortfolioActive ? 'Active' : 'Exhausted'}</p></div>
                    </div>
                )}
            </div>
        </div>
    );
}

