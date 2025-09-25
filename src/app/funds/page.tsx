// src/app/funds/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, TrendingUp, Building, Star, ArrowRight, Loader2 } from 'lucide-react';

interface Scheme {
  schemeCode: number;
  schemeName: string;
}

export default function FundsPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch('/api/mf');
        const data = await res.json();
        setSchemes(data);
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const filteredSchemes = useMemo(() => {
    if (!searchTerm) return schemes;
    return schemes.filter((scheme) =>
      scheme.schemeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, schemes]);

  const getFundTypeFromName = (name: string) => {
    if (name.toLowerCase().includes('equity')) return { type: 'Equity', color: 'from-blue-500 to-blue-600', icon: TrendingUp };
    if (name.toLowerCase().includes('debt')) return { type: 'Debt', color: 'from-green-500 to-green-600', icon: Building };
    if (name.toLowerCase().includes('hybrid')) return { type: 'Hybrid', color: 'from-purple-500 to-purple-600', icon: Star };
    return { type: 'Other', color: 'from-gray-500 to-gray-600', icon: Building };
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Building className="w-4 h-4" />
            {schemes.length.toLocaleString()} Funds Available
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Explore <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Mutual Funds</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and analyze thousands of mutual funds to find the perfect investment for your financial goals
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search funds by name, category, or fund house..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-lg focus:border-orange-500 focus:bg-white focus:outline-none transition-all duration-200 placeholder-gray-500"
              />
            </div>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-semibold transition-all duration-200">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
          
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredSchemes.length}</span> funds matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-xl text-gray-600">Loading funds...</p>
            <p className="text-sm text-gray-500">This might take a moment</p>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSchemes.slice(0, displayCount).map((scheme) => {
                const fundInfo = getFundTypeFromName(scheme.schemeName);
                const IconComponent = fundInfo.icon;
                
                return (
                  <Link href={`/scheme/${scheme.schemeCode}`} key={scheme.schemeCode}>
                    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full">
                      {/* Header with gradient background */}
                      <div className={`bg-gradient-to-br ${fundInfo.color} p-4 relative`}>
                        <div className="flex items-center justify-between text-white">
                          <IconComponent className="w-6 h-6" />
                          <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                            {fundInfo.type}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {scheme.schemeName}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Code: {scheme.schemeCode}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-orange-500" />
                        </div>
                        
                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">View Details</span>
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                              <ArrowRight className="w-4 h-4 text-orange-600 group-hover:text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load More Button */}
            {filteredSchemes.length > displayCount && (
              <div className="text-center pt-8">
                <button
                  onClick={loadMore}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Load More Funds
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* No Results */}
            {filteredSchemes.length === 0 && searchTerm && (
              <div className="text-center py-20 space-y-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No funds found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search terms or browse all available funds
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}

        {/* Quick Stats */}
        {!loading && (
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Investing?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join thousands of smart investors who use our platform to make informed decisions
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{schemes.length.toLocaleString()}+</div>
                <div className="text-white/80">Available Funds</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Real-time</div>
                <div className="text-white/80">Data Updates</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Free</div>
                <div className="text-white/80">Analysis Tools</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}