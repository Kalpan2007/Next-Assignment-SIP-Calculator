import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse, addMonths, startOfDay, format, isBefore } from 'date-fns';

// This command is crucial. It tells Next.js to NEVER cache this route.
export const dynamic = 'force-dynamic';

interface NavData {
  date: string;
  nav: string;
}

export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;
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

