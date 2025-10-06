import { NextRequest, NextResponse } from 'next/server';
import { add, isAfter, sub, isBefore, isEqual, parse, format, parseISO } from 'date-fns';
import axios from 'axios';

const findNavForDate = (targetDate: Date, sortedNavs: { dateObj: Date; nav: number }[]) => {
    // find the latest NAV on or before targetDate
    for (let i = sortedNavs.length - 1; i >= 0; i--) {
        const nav = sortedNavs[i];
        if (isBefore(nav.dateObj, targetDate) || isEqual(nav.dateObj, targetDate)) return nav;
    }
    return null;
};

export async function GET(request: NextRequest, context: any) {
    const code = context?.params?.code ?? null;
    const { searchParams } = new URL(request.url);
    const window = searchParams.get('window') || '1y';
    const duration = searchParams.get('duration') || '5y';
    const startParam = searchParams.get('start'); // optional ISO start date (e.g. 2024-01-01)

    // helper to parse period strings like '1d','30d','1m','3m','1y','5y'
    const parsePeriod = (s: string) => {
        const match = /^([0-9]+)\s*(d|m|y)$/i.exec(s.trim());
        if (!match) return null;
        return { value: parseInt(match[1], 10), unit: match[2].toLowerCase() as 'd' | 'm' | 'y' };
    };

    const windowParsed = parsePeriod(window) ?? { value: 1, unit: 'y' as const };
    const durationParsed = parsePeriod(duration) ?? { value: 5, unit: 'y' as const };

    try {
        const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
        const navHistory = response.data.data;

        if (!navHistory || navHistory.length === 0)
            return NextResponse.json({ message: 'No NAV data found for this scheme.' }, { status: 404 });
        type NavPoint = { dateObj: Date; nav: number };
        const sortedNavs: NavPoint[] = navHistory
            .map((item: any) => ({
                dateObj: parse(item.date, 'dd-MM-yyyy', new Date()),
                nav: parseFloat(item.nav)
            }))
            .sort((a: NavPoint, b: NavPoint) => a.dateObj.getTime() - b.dateObj.getTime());

    const endDate = sortedNavs[sortedNavs.length - 1].dateObj;
    // build startDate based on durationParsed
    const dur = durationParsed;
    const startDate = dur.unit === 'd' ? sub(endDate, { days: dur.value }) : dur.unit === 'm' ? sub(endDate, { months: dur.value }) : sub(endDate, { years: dur.value });

    // choose stepping: daily NAVs by default (no user interval)
    const step = { days: 1 };

    // If user provided explicit start date, parse and use it (clamp to available data range)
    let startDateUsed = startDate; // default
    if (startParam) {
        try {
            const parsed = parseISO(startParam);
            if (isNaN(parsed.getTime())) {
                return NextResponse.json({ message: 'Invalid start date format. Use ISO date (YYYY-MM-DD).' }, { status: 400 });
            }
            // clamp to available NAV range
            const earliest = sortedNavs[0].dateObj;
            if (isBefore(parsed, earliest)) startDateUsed = earliest;
            else if (isAfter(parsed, endDate)) return NextResponse.json({ message: 'Start date is after latest available NAV.' }, { status: 400 });
            else startDateUsed = parsed;
        } catch (e) {
            return NextResponse.json({ message: 'Invalid start date.' }, { status: 400 });
        }
    }

    // filter navs within the duration window (based on startDateUsed)
    const relevantNavs = sortedNavs.filter((n: NavPoint) => !isBefore(n.dateObj, startDateUsed) && !isAfter(n.dateObj, endDate));

        if (relevantNavs.length === 0)
            return NextResponse.json({ message: 'Not enough data for selected duration.' }, { status: 400 });

        const returns: number[] = [];
        const chartData: { date: string; value: number }[] = [];

    // iterate from startDateUsed to endDate using the specified step (daily by default)
    let cursor = startDateUsed;
        const win = windowParsed;
        while (!isAfter(cursor, endDate)) {
            const startNav = findNavForDate(cursor, sortedNavs);
            // compute end period date by adding window
            const endPeriodDate = win.unit === 'd' ? add(cursor, { days: win.value }) : win.unit === 'm' ? add(cursor, { months: win.value }) : add(cursor, { years: win.value });

            if (isAfter(endPeriodDate, endDate)) break;

            const endNav = findNavForDate(endPeriodDate, sortedNavs);
            if (startNav && endNav && startNav.nav > 0) {
                // convert window to years for CAGR exponent
                let years = win.unit === 'd' ? win.value / 365.25 : win.unit === 'm' ? win.value / 12 : win.value;
                if (years <= 0) years = win.value / 365.25;
                const cagr = (Math.pow(endNav.nav / startNav.nav, 1 / years) - 1) * 100;
                returns.push(cagr);
                // choose label format based on window unit
                const label = win.unit === 'd' ? format(endPeriodDate, 'dd MMM yyyy') : win.unit === 'm' ? format(endPeriodDate, 'MMM yyyy') : format(endPeriodDate, 'yyyy');
                chartData.push({ date: label, value: parseFloat(cagr.toFixed(2)) });
            }

            // move cursor by step
            cursor = add(cursor, step as any);
        }

        if (returns.length === 0)
            return NextResponse.json({ message: 'Insufficient data for this rolling window.' }, { status: 400 });

        const average = returns.reduce((a, b) => a + b, 0) / returns.length;

        return NextResponse.json({
            count: returns.length,
            averageReturn: average,
            maxReturn: Math.max(...returns),
            minReturn: Math.min(...returns),
            startDate: format(startDateUsed, 'yyyy-MM-dd'),
            rollingSeries: chartData
        });
    } catch (error) {
        console.error('Rolling returns failed', error);
        return NextResponse.json({ message: 'Error calculating rolling returns' }, { status: 500 });
    }
}
