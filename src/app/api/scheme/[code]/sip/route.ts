// File: src/app/api/scheme/[code]/sip/route.ts
// What it does: This is the most important calculation engine. It calculates the SIP returns for a specific fund based on real historical data.

// How it calculates:

// It receives the schemeCode, amount, from date, and to date from the frontend.

// It fetches the entire NAV history for that fund from the external API.

// It then loops month-by-month from the from date to the to date.

// In each month of the loop, it finds the correct historical NAV for that specific investment date.

// It calculates the number of units purchased (units = amount / NAV).

// It keeps a running total of totalUnits purchased and totalInvested.

// After the loop finishes, it takes the single most recent NAV from the history and calculates the final currentValue (currentValue = totalUnits * latestNAV).

// Finally, it calculates the percentages for absolute and annualized returns and sends the complete results object back to the frontend.















import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse, addMonths, startOfDay, format, isBefore } from 'date-fns';

// This command is crucial. It tells Next.js to NEVER cache this route.
export const dynamic = 'force-dynamic';

interface NavData {
  date: string;
  nav: string;
}

export async function POST(request: Request, context: any) {
  const code = context?.params?.code ?? null;
  const { amount, from, to } = await request.json();

  // --- BACKEND DEBUG LOG 1 ---
  // This will show in your TERMINAL when you click the button.
  console.log(`[API START] Received request for ${code}:`, { amount, from, to });

  if (!amount || !from || !to) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const navHistory: NavData[] = response.data.data;
    
    if (!navHistory || navHistory.length === 0) {
      return NextResponse.json({ message: 'NAV data not available.' }, { status: 404 });
    }
    
    // --- FINAL, CORRECTED CALCULATION LOGIC ---

    const processedNavs = navHistory
      .map(item => ({
        date: startOfDay(parse(item.date, 'dd-MM-yyyy', new Date())),
        nav: parseFloat(item.nav)
      }))
      .filter(item => !isNaN(item.nav) && item.nav > 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort ASC: oldest -> newest

    if (processedNavs.length === 0) {
        return NextResponse.json({ message: 'No valid NAV data found.' }, { status: 404 });
    }

    let totalUnits = 0;
    let totalInvested = 0;
    const investmentGrowth = [];
    
    const startDate = startOfDay(new Date(from));
    const endDate = startOfDay(new Date(to));
    let currentDate = startDate;

    while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
      const navEntry = processedNavs.slice().reverse().find(nav => nav.date <= currentDate);

      if (navEntry) {
        const unitsPurchased = amount / navEntry.nav;
        totalUnits += unitsPurchased;
        totalInvested += amount;
        
        investmentGrowth.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          invested: totalInvested,
          value: totalUnits * navEntry.nav,
        });
      }
      
      currentDate = addMonths(currentDate, 1);
    }
    
    if (totalInvested === 0) {
      return NextResponse.json({ message: 'No investments made in this period.' }, { status: 400 });
    }

    // THIS WAS THE BUG: We must use the latest NAV from the *entire dataset* for the final value.
    const latestNav = processedNavs[processedNavs.length - 1].nav;
    const currentValue = totalUnits * latestNav;
    
    const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
    
    // --- BACKEND DEBUG LOG 2 ---
    // This will show the final calculation results in your TERMINAL.
    console.log('[API END] Calculation result:', {
        totalInvested: totalInvested,
        currentValue: currentValue,
        totalUnits: totalUnits,
        latestNavUsed: latestNav,
        absoluteReturn: absoluteReturn
    });

    return NextResponse.json({
      totalInvested,
      currentValue,
      absoluteReturn,
      annualizedReturn: null, // Simplified for now to ensure core logic is correct
      investmentGrowth,
    });

  } catch (error) {
    console.error(`[API ERROR] SIP calculation failed for ${code}:`, error);
    return NextResponse.json({ message: 'An error occurred during calculation.' }, { status: 500 });
  }
}

