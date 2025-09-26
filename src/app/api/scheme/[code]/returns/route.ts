// File: src/app/api/scheme/[code]/returns/route.ts
// What it does: This performs a much simpler point-to-point return calculation (e.g., "what was the return over the last 3 months?").

// How it works:

// It receives a schemeCode and a period (like 3m or 1y).

// It fetches the full NAV history.

// It finds the latest NAV (this is the End NAV).

// It calculates the start date by going back in time from the latest date (e.g., 3 months back).

// It finds the closest NAV to that historical start date (this is the Start NAV).

// It uses these two NAVs to calculate the percentage return and sends it back.



import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parse, subMonths, subYears, isBefore, isEqual, differenceInDays, format } from 'date-fns';

interface NavPoint {
  date: string;
  nav: string;
}

// Helper to find the closest NAV on or before a target date
const findNavForDate = (targetDate: Date, sortedNavs: { dateObj: Date; nav: number }[]): { dateObj: Date, nav: number } | null => {
  const navPoint = sortedNavs.find(nav => isBefore(nav.dateObj, targetDate) || isEqual(nav.dateObj, targetDate));
  return navPoint || null;
};

export async function GET(request: NextRequest, context: { params: { code: string } }) {
  const { code } = context.params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period');

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const navHistory: NavPoint[] = response.data.data;

    if (!navHistory || navHistory.length < 2) {
      return NextResponse.json({ message: 'Insufficient NAV data.' }, { status: 404 });
    }

    const sortedNavs = navHistory
      .map(item => ({
        dateObj: parse(item.date, 'dd-MM-yyyy', new Date()),
        nav: parseFloat(item.nav),
      }))
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    const latestNavData = sortedNavs[0];
    const endDate = latestNavData.dateObj;
    let startDate: Date;

    if (period === '1m') startDate = subMonths(endDate, 1);
    else if (period === '3m') startDate = subMonths(endDate, 3);
    else if (period === '6m') startDate = subMonths(endDate, 6);
    else if (period === '1y') startDate = subYears(endDate, 1);
    else return NextResponse.json({ message: 'Invalid period specified.' }, { status: 400 });

    const startNavData = findNavForDate(startDate, sortedNavs);
    
    // If we can't find a start NAV, we can't calculate
    if (!startNavData) {
      return NextResponse.json({
        period,
        simpleReturn: null,
      });
    }

    const simpleReturn = ((latestNavData.nav - startNavData.nav) / startNavData.nav) * 100;
    
    // THIS IS THE NEW PART: We now return all the data points
    return NextResponse.json({
      period,
      simpleReturn,
      startDate: format(startNavData.dateObj, 'dd MMM, yyyy'),
      startNAV: startNavData.nav,
      endDate: format(latestNavData.dateObj, 'dd MMM, yyyy'),
      endNAV: latestNavData.nav,
    });
  } catch (error) {
    console.error(`Returns calculation failed for ${code}`, error);
    return NextResponse.json({ message: 'Error calculating returns' }, { status: 500 });
  }
}

