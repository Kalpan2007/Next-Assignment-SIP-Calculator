'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Calculator } from 'lucide-react';
import { InvestmentChart } from '@/components/InvestmentChart';

export default function SipCalculator({ code }: { code: string }) {
    const [amount, setAmount] = useState('20000');
    const [from, setFrom] = useState('2021-01-01');
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
            const res = await fetch(`/api/scheme/${code}/sip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseInt(amount), from, to }),
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
                    <h3 className="text-2xl font-bold mb-6">SIP Calculator</h3>
                    <form onSubmit={handleCalculate} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-light-text">Monthly Amount</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" min="1" max="100000000" />
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
                        <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-orange-hover active:bg-brand-orange-active disabled:bg-brand-orange-disabled transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange">
                            {loading ? <Loader2 className="animate-spin" /> : <Calculator size={18} />} Calculate
                        </button>
                    </form>
                </div>
            </div>
            <div className="xl:col-span-3">
                {loading && <div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-brand-orange" /></div>}
                {error && <div className="text-error bg-red-100 p-4 rounded-lg">{error}</div>}
                {result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-cream p-6 rounded-xl shadow-lg text-center"><p className="text-sm text-light-text">Total Invested</p><p className="text-2xl font-bold text-dark-text">{formatCurrency(result.totalInvested)}</p></div>
                            <div className="bg-cream p-6 rounded-xl shadow-lg text-center"><p className="text-sm text-light-text">Current Value</p><p className="text-2xl font-bold text-brand-orange">{formatCurrency(result.currentValue)}</p></div>
                        </div>
                        <div className="bg-gray-100 p-8 rounded-xl shadow-lg">
                            <h4 className="font-bold text-lg mb-4 text-dark-text">Investment Growth</h4>
                            <div className="h-80"><InvestmentChart data={result.investmentGrowth} /></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

