import { NextRequest, NextResponse } from 'next/server';
import { add, isAfter, sub, isBefore, isEqual, parse, format } from 'date-fns';
import axios from 'axios';

const findNavForDate = (targetDate: Date, sortedNavs: { dateObj: Date; nav: number }[]) => {
  // find NAV on or before targetDate
  for (const nav of sortedNavs) {
    if (isBefore(nav.dateObj, targetDate) || isEqual(nav.dateObj, targetDate)) return nav;
  }
  return null;
};

export async function GET(request: NextRequest, context: any) {
  const code = context?.params?.code ?? null;
  const { searchParams } = new URL(request.url);
  const window = searchParams.get('window') || '1y';
  const duration = searchParams.get('duration') || '5y';
  const interval = searchParams.get('interval') || 'monthly'; // daily | monthly | yearly

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const navHistory = response.data.data;

    if (!navHistory || navHistory.length === 0)
      return NextResponse.json({ message: 'No NAV data found for this scheme.' }, { status: 404 });

    const sortedNavs = navHistory
      .map((item: any) => ({
        dateObj: parse(item.date, 'dd-MM-yyyy', new Date()),
        nav: parseFloat(item.nav)
      }))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()); // oldest → latest

    const durationYears = parseInt(duration.replace('y', ''));
    const windowYears = parseInt(window.replace('y', ''));
    const endDate = sortedNavs[sortedNavs.length - 1].dateObj;
    const startDate = sub(endDate, { years: durationYears });
    const relevantNavs = sortedNavs.filter(n => isAfter(n.dateObj, startDate));

    if (relevantNavs.length === 0)
      return NextResponse.json({ message: 'Not enough data for selected duration.' }, { status: 400 });

    const returns: number[] = [];
    const chartData: { date: string; value: number }[] = [];

    for (let i = 0; i < relevantNavs.length; i++) {
      const startNav = relevantNavs[i];
      const endPeriodDate = add(startNav.dateObj, { years: windowYears });
      if (isAfter(endPeriodDate, endDate)) break;

      const endNav = findNavForDate(endPeriodDate, sortedNavs);
      if (endNav) {
        const cagr = (Math.pow(endNav.nav / startNav.nav, 1 / windowYears) - 1) * 100;
        returns.push(cagr);
        chartData.push({ date: format(endPeriodDate, 'MMM yyyy'), value: parseFloat(cagr.toFixed(2)) });
      }
    }

    if (returns.length === 0)
      return NextResponse.json({ message: 'Insufficient data for this rolling window.' }, { status: 400 });

    const average = returns.reduce((a, b) => a + b, 0) / returns.length;

    return NextResponse.json({
      count: returns.length,
      averageReturn: average,
      maxReturn: Math.max(...returns),
      minReturn: Math.min(...returns),
      rollingSeries: chartData
    });
  } catch (error) {
    console.error('Rolling returns failed', error);
    return NextResponse.json({ message: 'Error calculating rolling returns' }, { status: 500 });
  }
}
