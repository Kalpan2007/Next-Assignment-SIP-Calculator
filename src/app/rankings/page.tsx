'use client';
import { useState } from 'react';
import { format, subYears } from 'date-fns';
import { Loader2, BarChart, Crown } from 'lucide-react';
import Link from 'next/link';

export default function RankingsPage() {
    const [from, setFrom] = useState(format(subYears(new Date(), 1), 'yyyy-MM-dd'));
    const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetchRankings = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults([]);
        try {
            const res = await fetch(`/api/rank-funds?from=${from}&to=${to}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setResults(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Fund Performance Rankings</h1>
                <p className="text-light-text mt-2">Discover the top-performing funds for any period.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <form onSubmit={handleFetchRankings} className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <label className="text-sm font-semibold">Start Date</label>
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-sm font-semibold">End Date</label>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="w-full p-2 border-2 rounded-lg mt-1" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full md:w-auto bg-brand-orange text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 mt-4 md:mt-0 self-end">
                        {loading ? <Loader2 className="animate-spin" /> : <BarChart size={18} />} Rank Funds
                    </button>
                </form>
                 <p className="text-xs text-light-text mt-2 text-center">Note: Ranking is based on a sample of 100 funds for performance reasons.</p>
            </div>

            {loading && <div className="text-center"><Loader2 className="w-12 h-12 animate-spin text-brand-orange" /></div>}
            {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
            
            {results.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Top 10 Performers</h2>
                    <div className="space-y-2">
                        {results.map((fund, index) => (
                            <Link href={`/scheme/${fund.schemeCode}`} key={fund.schemeCode}>
                                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-cream transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold text-lg ${index < 3 ? 'text-brand-orange' : 'text-light-text'}`}>{index + 1}</span>
                                        {index === 0 && <Crown className="text-yellow-500" />}
                                        <p className="font-semibold">{fund.schemeName}</p>
                                    </div>
                                    <p className={`font-bold text-lg ${fund.return > 0 ? 'text-green-600' : 'text-red-600'}`}>{fund.return.toFixed(2)}%</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

