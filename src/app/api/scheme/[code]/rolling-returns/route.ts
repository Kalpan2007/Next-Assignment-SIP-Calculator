import { NextRequest, NextResponse } from 'next/server';
import { add, isAfter } from 'date-fns';
import axios from 'axios';
import { parse, sub, isBefore, isEqual, format } from 'date-fns';

const findNavForDate = (targetDate: Date, sortedNavs: { dateObj: Date; nav: number }[]): { dateObj: Date, nav: number } | null => {
    const navPoint = sortedNavs.find(nav => isBefore(nav.dateObj, targetDate) || isEqual(nav.dateObj, targetDate));
    return navPoint || null;
};

export async function GET(request: NextRequest, context: any) {
    const code = context?.params?.code ?? null;
    const { searchParams } = new URL(request.url);
    const window = searchParams.get('window') || '1y'; // e.g., 1y, 3y
    const duration = searchParams.get('duration') || '5y'; // e.g., 3y, 5y, 10y

    try {
        const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
        const navHistory = response.data.data;
        const sortedNavs = navHistory
            .map((item: any) => ({ dateObj: parse(item.date, 'dd-MM-yyyy', new Date()), nav: parseFloat(item.nav) }))
            .sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime());
        
        const durationYears = parseInt(duration.replace('y', ''));
        const windowYears = parseInt(window.replace('y', ''));
        
        const endDate = sortedNavs[0].dateObj;
        const startDate = sub(endDate, { years: durationYears });
        
        const relevantNavs = sortedNavs.filter((nav: any) => isAfter(nav.dateObj, startDate));
        
        const returns: number[] = [];
        // We iterate backwards (from oldest to newest) to calculate forward-looking returns
        for (let i = relevantNavs.length - 1; i >= 0; i--) {
            const startNavData = relevantNavs[i];
            const endPeriodDate = add(startNavData.dateObj, { years: windowYears });
            
            if (isAfter(endPeriodDate, endDate)) break; // Stop if the window goes beyond our latest data

            const endNavData = findNavForDate(endPeriodDate, sortedNavs);
            
            if (endNavData) {
                const cagr = (Math.pow(endNavData.nav / startNavData.nav, 1 / windowYears) - 1) * 100;
                returns.push(cagr);
            }
        }
        
        if (returns.length === 0) {
            return NextResponse.json({ message: 'Not enough data to calculate rolling returns for this period.' }, { status: 400 });
        }

        const average = returns.reduce((a, b) => a + b, 0) / returns.length;
        const max = Math.max(...returns);
        const min = Math.min(...returns);

        return NextResponse.json({
            count: returns.length,
            averageReturn: average,
            maxReturn: max,
            minReturn: min,
        });

    } catch (error) {
        console.error(`Rolling returns failed for ${code}`, error);
        return NextResponse.json({ message: 'Error calculating rolling returns' }, { status: 500 });
    }
}
// Need to add these imports at the top

