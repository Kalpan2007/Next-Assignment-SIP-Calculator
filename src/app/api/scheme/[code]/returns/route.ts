import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
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

interface ResponseData {
  schemeCode?: string;
  period?: string | null;
  startDate?: string;
  endDate?: string;
  startNav?: number;
  endNav?: number;
  returnPercentage?: number;
  days?: number;
  message?: string;
  error?: string;
}

export async function GET(request: NextRequest, context: any) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period');
  const code = context?.params?.code ?? searchParams.get('code') ?? '';

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
    else if (period === '3y') startDate = subYears(endDate, 3);
    else if (period === '5y') startDate = subYears(endDate, 5);
    else {
      return NextResponse.json({ message: 'Invalid period. Use 1m, 3m, 6m, 1y, 3y, or 5y.' }, { status: 400 });
    }

    const startNavData = findNavForDate(startDate, sortedNavs);
    if (!startNavData) {
      return NextResponse.json({ message: 'Could not find NAV data for the specified period.' }, { status: 404 });
    }

    const returnPercentage = ((latestNavData.nav - startNavData.nav) / startNavData.nav) * 100;
    const days = differenceInDays(endDate, startNavData.dateObj);

    return NextResponse.json({
      schemeCode: code,
      period,
      startDate: format(startNavData.dateObj, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      startNav: startNavData.nav,
      endNav: latestNavData.nav,
      returnPercentage: parseFloat(returnPercentage.toFixed(2)),
      days
    });

  } catch (error) {
    console.error('Error fetching NAV data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        message: 'Failed to fetch NAV data', 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}