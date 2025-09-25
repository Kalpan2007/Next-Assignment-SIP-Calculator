'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { InvestmentChart } from '@/components/InvestmentChart';
import { format } from 'date-fns';
import { 
  Loader2, 
  Target,
  Building,
  ArrowLeft,
  Calculator,
  BarChart3,
  Sparkles
} from 'lucide-react'; // <-- REMOVED unused icons
import Link from 'next/link';

// Interfaces remain the same
interface SchemeMeta {
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_name: string;
}

interface SipResult {
  totalInvested: number;
  currentValue: number;
  absoluteReturn: number;
  annualizedReturn: number | null;
  investmentGrowth: { date: string; value: number; invested: number }[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SchemeDetailPage() {
  const params = useParams();
  const code = params.code as string;

  const [meta, setMeta] = useState<SchemeMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [sipResult, setSipResult] = useState<SipResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  const [amount, setAmount] = useState('5000');
  const [from, setFrom] = useState('2021-01-01');
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (code) {
      const fetchSchemeDetails = async () => {
        try {
          const res = await fetch(`/api/scheme/${code}`);
          const data = await res.json();
          setMeta(data.meta);
        } catch { // <-- Simplified catch block
          setError('Failed to load scheme details.');
        } finally {
          setLoading(false);
        }
      };
      fetchSchemeDetails();
    }
  }, [code]);

  const handleCalculateSip = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setSipResult(null);
    setError('');

    try {
      const res = await fetch(`/api/scheme/${code}/sip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          from,
          to,
        }),
        cache: 'no-store',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Calculation failed.');
      }

      const result = await res.json();
      setSipResult(result);
    } catch (err) { // <-- FIXED: Changed from 'any' type
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setCalculating(false);
    }
  };

  const getFundTypeColor = (category: string) => {
    if (category?.toLowerCase().includes('equity')) return 'from-blue-500 to-blue-600';
    if (category?.toLowerCase().includes('debt')) return 'from-green-500 to-green-600';
    if (category?.toLowerCase().includes('hybrid')) return 'from-purple-500 to-purple-600';
    return 'from-gray-500 to-gray-600';
  };
  
  // The rest of your JSX remains unchanged as it was correct.
  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-28">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
          <p className="text-xl text-light-text">Loading scheme details...</p>
        </div>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-cream pt-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20 space-y-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Building className="w-12 h-12 text-light-text" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text">Scheme not found</h3>
            <p className="text-light-text">The requested mutual fund scheme could not be found.</p>
            <Link 
              href="/funds"
              className="inline-flex items-center gap-2 bg-brand-orange text-white font-semibold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Funds
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-28">
      <div className="max-w-7xl mx-auto px-4 space-y-8 pb-20">
        
        <div className="flex items-center gap-2 text-sm text-light-text">
          <Link href="/funds" className="hover:text-brand-orange transition-colors">Funds</Link>
          <span>/</span>
          <span className="text-dark-text font-medium">{meta.scheme_name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-border-color overflow-hidden">
          <div className={`bg-gradient-to-br ${getFundTypeColor(meta.scheme_category)} p-8 text-white relative`}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
            <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta.scheme_name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2"> <Building className="w-4 h-4" /> <span className="font-semibold">{meta.fund_house}</span> </div>
                <div className="flex items-center gap-2"> <Target className="w-4 h-4" /> <span className="font-semibold">{meta.scheme_category}</span> </div>
                <div className="flex items-center gap-2"> <BarChart3 className="w-4 h-4" /> <span className="font-semibold">{meta.scheme_type}</span> </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-border-color p-8 sticky top-28">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-orange-400 rounded-2xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-dark-text">SIP Calculator</h2>
                  <p className="text-light-text text-sm">Calculate your investment returns</p>
                </div>
              </div>

              <form onSubmit={handleCalculateSip} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-light-text mb-2">Monthly Investment Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text font-medium">₹</span>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-8 pr-4 py-3 bg-cream border-2 border-border-color rounded-xl text-lg font-semibold focus:border-brand-orange focus:bg-white focus:outline-none transition-all duration-200" required min="100" step="100" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-light-text mb-2">Start Date</label>
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full p-3 bg-cream border-2 border-border-color rounded-xl focus:border-brand-orange focus:bg-white focus:outline-none transition-all duration-200" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-light-text mb-2">End Date</label>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full p-3 bg-cream border-2 border-border-color rounded-xl focus:border-brand-orange focus:bg-white focus:outline-none transition-all duration-200" required />
                  </div>
                </div>
                <button type="submit" disabled={calculating} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-brand-orange to-orange-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                  {calculating ? ( <><Loader2 className="w-5 h-5 animate-spin" /> Calculating...</> ) : ( <><Calculator className="w-5 h-5" /> Calculate Returns</> )}
                </button>
              </form>
            </div>
          </div>

          <div className="xl:col-span-3 space-y-6">
            {calculating && (
              <div className="bg-white rounded-3xl shadow-lg border border-border-color p-12 text-center">
                <Loader2 className="w-12 h-12 text-brand-orange animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-text">Calculating Returns</h3>
                <p className="text-light-text">Analyzing historical data for your investment...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Calculation Error</h3>
                  <p className="text-red-700">{error}</p>
              </div>
            )}
            {sipResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl shadow-lg border border-border-color p-6 text-center"> <p className="text-sm font-medium text-light-text mb-2">Total Invested</p> <p className="text-3xl font-bold text-dark-text">{formatCurrency(sipResult.totalInvested)}</p> </div>
                  <div className="bg-white rounded-3xl shadow-lg border border-border-color p-6 text-center"> <p className="text-sm font-medium text-light-text mb-2">Current Value</p> <p className="text-3xl font-bold text-dark-text">{formatCurrency(sipResult.currentValue)}</p> </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl shadow-lg border border-border-color p-6 text-center"> <p className="text-sm font-medium text-light-text mb-2">Total Gain (₹)</p> <p className="text-3xl font-bold text-green-600">{formatCurrency(sipResult.currentValue - sipResult.totalInvested)}</p> </div>
                  <div className="bg-white rounded-3xl shadow-lg border border-border-color p-6 text-center"> <p className="text-sm font-medium text-light-text mb-2">Absolute Return</p> <p className="text-3xl font-bold text-brand-orange">{`${sipResult.absoluteReturn.toFixed(2)}%`}</p> </div>
                </div>
                <div className="bg-white rounded-3xl shadow-lg border border-border-color p-8">
                  <h3 className="text-2xl font-bold text-dark-text mb-2">Investment Growth Over Time</h3>
                  <p className="text-light-text">This chart illustrates the growth of your investment based on historical NAVs.</p>
                  <div className="h-96 mt-6"> <InvestmentChart data={sipResult.investmentGrowth} /> </div>
                </div>
              </div>
            )}
            {!sipResult && !calculating && !error && (
              <div className="bg-white rounded-3xl shadow-lg border-2 border-dashed border-border-color p-12">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-brand-orange-light/30 rounded-3xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-12 h-12 text-brand-orange" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-text">Ready to Calculate?</h3>
                  <p className="text-light-text max-w-md mx-auto"> Enter your investment details to discover how your money could have grown. </p>
                  <div className="inline-flex items-center gap-2 text-brand-orange font-semibold pt-2"> <ArrowLeft className="w-4 h-4" /> <span>Use the calculator on the left</span> </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}