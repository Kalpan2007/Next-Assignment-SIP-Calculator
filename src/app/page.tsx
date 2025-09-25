// src/app/page.tsx
import Link from 'next/link';
import { 
  MoveRight, 
  Database, 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  Star,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden pt-24 md:pt-28">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto  ">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left space-y-8">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  Now with real-time data
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Take Control of Your{' '}
                  <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    Mutual Fund
                  </span>{' '}
                  Investments
                </h1>
                
                <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Stop guessing, start analyzing. Use our advanced tools to explore thousands of funds and simulate your investment growth with real historical data.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    href="/funds" 
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Explore Funds Now
                    <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/calculator" 
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-4 px-8 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                  >
                    Try Calculator
                    <Calculator className="w-5 h-5" />
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900">10,000+</div>
                    <div className="text-sm text-gray-600">Mutual Funds</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900">5M+</div>
                    <div className="text-sm text-gray-600">Data Points</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900">99.9%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Dashboard Mockup */}
              <div className="relative">
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">Portfolio Dashboard</div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="h-40 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mb-6 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-500 to-transparent opacity-80"></div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160">
                      <path 
                        d="M0,140 Q75,120 150,100 T300,60" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Fund Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">HDFC Top 100</div>
                          <div className="text-xs text-gray-500">Large Cap</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">+12.5%</div>
                        <div className="text-xs text-gray-500">₹45,230</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">SBI Small Cap</div>
                          <div className="text-xs text-gray-500">Small Cap</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">+18.2%</div>
                        <div className="text-xs text-gray-500">₹28,650</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-semibold">+24.3%</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg p-4 text-white">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-semibold">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Get Started
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful tools and comprehensive data to make informed investment decisions
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive Fund Database</h3>
                <p className="text-gray-600 mb-6">Access detailed information on thousands of mutual funds from all major fund houses in India with real-time updates.</p>
                <Link href="/funds" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Explore Database <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Feature 2 */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced SIP Calculator</h3>
                <p className="text-gray-600 mb-6">Simulate your investments with our powerful calculator using real historical NAV data and advanced analytics.</p>
                <Link href="/calculator" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                  Try Calculator <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Feature 3 */}
              <div className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Visualizations</h3>
                <p className="text-gray-600 mb-6">Understand fund performance at a glance with beautiful, interactive charts and comprehensive analytics.</p>
                <Link href="/analytics" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  View Analytics <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
            </div>
          </div>
        </section>

        {/* --- Social Proof Section --- */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Thousands of Investors
              </h2>
              <p className="text-xl text-gray-600">
                Join the community of smart investors making data-driven decisions
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "FundExplorer helped me make informed decisions about my investments. The SIP calculator is incredibly accurate!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Priya Sharma</div>
                    <div className="text-sm text-gray-500">Investment Analyst</div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "The comprehensive database and real-time data have transformed how I research mutual funds. Highly recommended!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Raj Patel</div>
                    <div className="text-sm text-gray-500">Portfolio Manager</div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Finally, a platform that makes mutual fund analysis simple and accessible. The visualizations are outstanding!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Anita Kumar</div>
                    <div className="text-sm text-gray-500">Financial Advisor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-20 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Investment Strategy?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are already making smarter decisions with FundExplorer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/funds" 
                className="group inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Exploring Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

      </div>
  );
}