import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parse, addMonths, isBefore, isEqual, format, differenceInYears } from 'date-fns';

const findNavForDate = (targetDate: Date, sortedNavs: { dateObj: Date; nav: number }[]): number | null => {
    const navPoint = sortedNavs.find(nav => isBefore(nav.dateObj, targetDate) || isEqual(nav.dateObj, targetDate));
    return navPoint ? navPoint.nav : null;
};

export async function POST(request: NextRequest, context: { params: { code: string } }) {
  const { code } = context.params;
  const { initialInvestment, initialWithdrawal, annualIncreasePercent, from, to } = await request.json();

  if (!initialInvestment || !initialWithdrawal || annualIncreasePercent === undefined || !from || !to) {
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

    if (isBefore(sortedNavs[0].dateObj, startDate)) {
        return NextResponse.json({ message: `Data out of bounds. Last available data is ${format(sortedNavs[0].dateObj, 'dd MMM, yyyy')}.` }, { status: 400 });
    }

    const initialNav = findNavForDate(startDate, sortedNavs);
    if (!initialNav) {
      return NextResponse.json({ message: 'NAV not available for initial investment date.' }, { status: 400 });
    }

    let totalUnits = initialInvestment / initialNav;
    let totalWithdrawn = 0;
    let currentDate = addMonths(startDate, 1);

    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
      const yearsElapsed = differenceInYears(currentDate, startDate);
      const currentWithdrawalAmount = initialWithdrawal * Math.pow(1 + annualIncreasePercent / 100, yearsElapsed);

      const nav = findNavForDate(currentDate, sortedNavs);
      if (nav && nav > 0) {
        const unitsToSell = currentWithdrawalAmount / nav;
        if (totalUnits < unitsToSell) {
          totalWithdrawn += totalUnits * nav;
          totalUnits = 0;
          break;
        }
        totalUnits -= unitsToSell;
        totalWithdrawn += currentWithdrawalAmount;
      }
      currentDate = addMonths(currentDate, 1);
    }

    const latestNav = sortedNavs[0].nav;
    const finalValue = totalUnits * latestNav;

    return NextResponse.json({ initialInvestment, totalWithdrawn, finalValue, isPortfolioActive: totalUnits > 0 });

  } catch (error) {
    console.error(`Step-Up SWP calculation failed for ${code}`, error);
    return NextResponse.json({ message: 'Error calculating Step-Up SWP' }, { status: 500 });
  }
}
