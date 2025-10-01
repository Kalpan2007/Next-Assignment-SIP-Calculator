import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parse, addMonths, isBefore, isEqual, format, differenceInDays } from 'date-fns';

interface NavPoint {
  date: string;
  nav: string;
}

const findNavForDate = (targetDate: Date, sortedNavs: { dateObj: Date; nav: number }[]): number | null => {
  const navPoint = sortedNavs.find(nav => isBefore(nav.dateObj, targetDate) || isEqual(nav.dateObj, targetDate));
  return navPoint ? navPoint.nav : null;
};

export async function POST(request: NextRequest, context: { params: { code: string } }) {
  const { code } = context.params;
  const { initialInvestment, withdrawalAmount, from, to } = await request.json();

  if (!initialInvestment || !withdrawalAmount || !from || !to) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const navHistory: NavPoint[] = response.data.data;

    if (!navHistory || navHistory.length === 0) {
      return NextResponse.json({ message: 'NAV data not available.' }, { status: 404 });
    }

    const sortedNavs = navHistory
      .map(item => ({ dateObj: parse(item.date, 'dd-MM-yyyy', new Date()), nav: parseFloat(item.nav) }))
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    const startDate = new Date(from);
    const endDate = new Date(to);

    // Initial Investment
    const initialNav = findNavForDate(startDate, sortedNavs);
    if (!initialNav) {
      return NextResponse.json({ message: 'NAV not available for the initial investment date.' }, { status: 400 });
    }
    let totalUnits = initialInvestment / initialNav;
    let totalWithdrawn = 0;

    let currentDate = addMonths(startDate, 1); // First withdrawal is one month after investment

    // Simulate monthly withdrawals
    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
      const navForWithdrawal = findNavForDate(currentDate, sortedNavs);
      if (navForWithdrawal && navForWithdrawal > 0) {
        const unitsToSell = withdrawalAmount / navForWithdrawal;
        if (totalUnits < unitsToSell) {
          // Portfolio exhausted
          totalWithdrawn += totalUnits * navForWithdrawal;
          totalUnits = 0;
          break; 
        }
        totalUnits -= unitsToSell;
        totalWithdrawn += withdrawalAmount;
      }
      currentDate = addMonths(currentDate, 1);
    }

    const latestNav = sortedNavs[0].nav;
    const finalValue = totalUnits * latestNav;

    return NextResponse.json({
      initialInvestment,
      totalWithdrawn,
      finalValue,
      isPortfolioActive: totalUnits > 0,
    });
  } catch (error) {
    console.error(`SWP calculation failed for ${code}`, error);
    return NextResponse.json({ message: 'Error calculating SWP' }, { status: 500 });
  }
}
