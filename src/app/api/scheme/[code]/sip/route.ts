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

export async function POST(request: NextRequest, context: any) {
  const code = context?.params?.code ?? null;
  const body = await request.json();
  const { amount, from, to } = body;

  if (!amount || !from || !to || amount <= 0) {
    return NextResponse.json({ message: 'Valid amount, from, and to dates are required.' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const navHistory: NavPoint[] = response.data.data;

    if (!navHistory || navHistory.length === 0) {
      return NextResponse.json({ message: 'NAV data not available for this scheme.' }, { status: 404 });
    }

    const sortedNavs = navHistory
      .map(item => ({ dateObj: parse(item.date, 'dd-MM-yyyy', new Date()), nav: parseFloat(item.nav) }))
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    const startDate = new Date(from);
    const endDate = new Date(to);
    
    if (isBefore(sortedNavs[0].dateObj, startDate)) {
        return NextResponse.json({ message: `Data is out of bounds. The last available data for this fund is on ${format(sortedNavs[0].dateObj, 'dd MMM, yyyy')}.` }, { status: 400 });
    }

    let currentDate = startDate;
    let totalUnits = 0;
    let totalInvested = 0;
    const investmentGrowth = [];

    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
      const nav = findNavForDate(currentDate, sortedNavs);
      if (nav && nav > 0) {
        const unitsPurchased = amount / nav;
        totalUnits += unitsPurchased;
        totalInvested += amount;
        investmentGrowth.push({ date: format(currentDate, 'yyyy-MM-dd'), invested: totalInvested, value: totalUnits * nav });
      }
      currentDate = addMonths(currentDate, 1);
    }

    if (totalInvested === 0) {
      return NextResponse.json({ message: 'Could not process SIP. Check date range and NAV availability.' }, { status: 400 });
    }

    const latestNav = sortedNavs[0].nav;
    const currentValue = totalUnits * latestNav;
    const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
    const durationInYears = differenceInDays(endDate, startDate) / 365.25;
    const annualizedReturn = durationInYears >= 1 ? (Math.pow(currentValue / totalInvested, 1 / durationInYears) - 1) * 100 : null;

    return NextResponse.json({ totalInvested, currentValue, totalUnits, absoluteReturn, annualizedReturn, investmentGrowth });
  } catch (error) {
    console.error(`SIP calculation failed for ${code}`, error);
    return NextResponse.json({ message: 'Error calculating SIP' }, { status: 500 });
  }
}

