'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Target, Building, BarChart3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Import all the new calculator components
import SipCalculator from '@/components/calculators/SipCalculator';
import SwpCalculator from '@/components/calculators/SwpCalculator';
import StepUpSipCalculator from '@/components/calculators/StepUpSipCalculator';
import StepUpSwpCalculator from '@/components/calculators/StepUpSwpCalculator';
import RollingReturnsCalculator from '@/components/calculators/RollingReturnsCalculator';

// Define the type for the tabs
type CalculatorTab = 'sip' | 'swp' | 'step-up-sip' | 'step-up-swp' | 'rolling-returns';

export default function SchemeDetailPage() {
  const params = useParams();
  const code = params.code as string;

  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State to manage the active calculator tab
  const [activeTab, setActiveTab] = useState<CalculatorTab>('sip');

  useEffect(() => {
    if (!code) return;
    const fetchSchemeDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/scheme/${code}`);
        if (!res.ok) throw new Error('Scheme not found or failed to load.');
        const data = await res.json();
        setMeta(data.meta);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemeDetails();
  }, [code]);

  const getFundTypeColor = (category: string = '') => {
    if (category.toLowerCase().includes('equity')) return 'from-blue-500 to-blue-600';
    if (category.toLowerCase().includes('debt')) return 'from-green-500 to-green-600';
    if (category.toLowerCase().includes('hybrid')) return 'from-purple-500 to-purple-600';
    return 'from-gray-500 to-gray-600';
  };

  const renderActiveCalculator = () => {
    switch(activeTab) {
      case 'sip': return <SipCalculator code={code} />;
      case 'swp': return <SwpCalculator code={code} />;
      case 'step-up-sip': return <StepUpSipCalculator code={code} />;
      case 'step-up-swp': return <StepUpSwpCalculator code={code} />;
      case 'rolling-returns': return <RollingReturnsCalculator code={code} />;
      default: return <SipCalculator code={code} />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen text-center pt-32 space-y-4">
            <h2 className="text-2xl font-bold text-dark-text">Error</h2>
            <p className="text-light-text">{error}</p>
            <Link href="/funds" className="inline-flex items-center gap-2 bg-brand-orange text-white font-semibold py-2 px-4 rounded-lg">
                <ArrowLeft size={16} /> Go Back
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-28">
      <div className="max-w-7xl mx-auto px-4 space-y-8 pb-20">
        <div className="flex items-center gap-2 text-sm text-light-text">
          <Link href="/funds" className="hover:text-brand-orange">Funds</Link><span>/</span>
          <span className="text-dark-text font-medium">{meta?.scheme_name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-border-color overflow-hidden">
          <div className={`bg-gradient-to-br ${getFundTypeColor(meta?.scheme_category)} p-8 text-white relative`}>
             <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta?.scheme_name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2"><Building className="w-4 h-4" />{meta?.fund_house}</div>
                <div className="flex items-center gap-2"><Target className="w-4 h-4" />{meta?.scheme_category}</div>
                <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" />{meta?.scheme_type}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* --- Tab Navigation --- */}
        <div className="flex items-center justify-center flex-wrap bg-white rounded-full shadow-md p-1">
            <button onClick={() => setActiveTab('sip')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'sip' ? 'bg-brand-orange text-white' : 'text-light-text hover:bg-cream'}`}>SIP</button>
            <button onClick={() => setActiveTab('swp')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'swp' ? 'bg-brand-orange text-white' : 'text-light-text hover:bg-cream'}`}>SWP</button>
            <button onClick={() => setActiveTab('step-up-sip')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'step-up-sip' ? 'bg-brand-orange text-white' : 'text-light-text hover:bg-cream'}`}>Step-Up SIP</button>
            <button onClick={() => setActiveTab('step-up-swp')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'step-up-swp' ? 'bg-brand-orange text-white' : 'text-light-text hover:bg-cream'}`}>Step-Up SWP</button>
            <button onClick={() => setActiveTab('rolling-returns')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'rolling-returns' ? 'bg-brand-orange text-white' : 'text-light-text hover:bg-cream'}`}>Rolling Returns</button>
        </div>

        {/* Render the active calculator based on the selected tab */}
        <div>
            {renderActiveCalculator()}
        </div>
      </div>
    </div>
  );
}

