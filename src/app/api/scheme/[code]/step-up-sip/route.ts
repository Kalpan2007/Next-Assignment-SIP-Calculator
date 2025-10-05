import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parse, addMonths, isBefore, isEqual, format, differenceInYears, differenceInDays } from 'date-fns';

// (findNavForDate helper function would be the same as in the SWP file)
const findNavForDate = (targetDate: Date, sortedNavs: { dateObj: Date; nav: number }[]): number | null => {
    const navPoint = sortedNavs.find(nav => isBefore(nav.dateObj, targetDate) || isEqual(nav.dateObj, targetDate));
    return navPoint ? navPoint.nav : null;
};

export async function POST(request: NextRequest, context: any) {
  const code = context?.params?.code ?? null;
  const { initialAmount, annualIncreasePercent, from, to } = await request.json();

  if (!initialAmount || annualIncreasePercent === undefined || !from || !to) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const navHistory = response.data.data;
    const sortedNavs = navHistory
      .map((item: any) => ({ dateObj: parse(item.date, 'dd-MM-yyyy', new Date()), nav: parseFloat(item.nav) }))
      .sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime());

    const startDate = new Date(from);
    const endDate = new Date(to);
    let currentDate = startDate;
    let currentSipAmount = initialAmount;
    let totalUnits = 0;
    let totalInvested = 0;
    
    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
      // Check if it's time to step up the SIP amount (at the start of a new year)
      const yearsElapsed = differenceInYears(currentDate, startDate);
      if (yearsElapsed > 0) {
        currentSipAmount = initialAmount * Math.pow(1 + annualIncreasePercent / 100, yearsElapsed);
      }
      
      const nav = findNavForDate(currentDate, sortedNavs);
      if (nav && nav > 0) {
        const unitsPurchased = currentSipAmount / nav;
        totalUnits += unitsPurchased;
        totalInvested += currentSipAmount;
      }
      currentDate = addMonths(currentDate, 1);
    }
    
    if (totalInvested === 0) {
        return NextResponse.json({ message: 'Could not process Step-Up SIP for the selected dates.' }, { status: 400 });
    }

    const latestNav = sortedNavs[0].nav;
    const currentValue = totalUnits * latestNav;
    const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
    const durationInYears = differenceInDays(endDate, startDate) / 365.25;
    const annualizedReturn = durationInYears >= 1 ? (Math.pow(currentValue / totalInvested, 1 / durationInYears) - 1) * 100 : null;

    return NextResponse.json({ totalInvested, currentValue, absoluteReturn, annualizedReturn });

  } catch (error) {
    console.error(`Step-Up SIP calculation failed for ${code}`, error);
    return NextResponse.json({ message: 'Error calculating Step-Up SIP' }, { status: 500 });
  }
}
