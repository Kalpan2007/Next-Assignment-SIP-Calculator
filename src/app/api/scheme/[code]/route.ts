import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define types for the expected API response for better type safety
interface NavPoint {
  date: string;
  nav: string;
}

interface SchemeDetails {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: NavPoint[];
  status: string;
}

export async function GET(
  request: NextRequest, // This was the main fix: using NextRequest instead of Request
  { params }: { params: { code: string } }
) {
  const { code } = params;
  if (!code) {
    return NextResponse.json({ message: 'Scheme code is required' }, { status: 400 });
  }

  try {
    const response = await axios.get<SchemeDetails>(`https://api.mfapi.in/mf/${code}`);
    const { meta, data } = response.data;

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No data found for this scheme' }, { status: 404 });
    }

    return NextResponse.json({ meta, data });
  } catch (error) {
    console.error(`Failed to fetch scheme ${code}`, error);
    return NextResponse.json({ message: 'Error fetching scheme data' }, { status: 500 });
  }
}
