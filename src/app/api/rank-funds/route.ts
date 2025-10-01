import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
// (You'll need all the date-fns imports from other files)

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    try {
        // 1. Get all funds
        const allFundsResponse = await axios.get('https://api.mfapi.in/mf');
        const allFunds = allFundsResponse.data;

        // WARNING: This is VERY slow. We only process the first 50 for this example.
        const fundsToProcess = allFunds.slice(0, 50);

        const results = [];

        for (const fund of fundsToProcess) {
            try {
                // 2. For each fund, get its returns
                const returnRes = await fetch(`http://localhost:3000/api/scheme/${fund.schemeCode}/returns?from=${from}&to=${to}`);
                const returnData = await returnRes.json();
                if (returnData.simpleReturn) {
                    results.push({
                        schemeName: fund.schemeName,
                        schemeCode: fund.schemeCode,
                        return: returnData.simpleReturn,
                    });
                }
            } catch (e) {
                // Ignore funds that fail
            }
        }

        // 3. Sort by return and send back the top 10
        const sortedResults = results.sort((a, b) => b.return - a.return);
        return NextResponse.json(sortedResults.slice(0, 10));

    } catch (error) {
        return NextResponse.json({ message: 'Failed to rank funds' }, { status: 500 });
    }
}