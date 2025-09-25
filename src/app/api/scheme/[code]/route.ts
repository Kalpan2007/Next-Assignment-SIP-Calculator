import { NextRequest, NextResponse } from "next/server";

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

// Context type for dynamic route params
interface RouteContext {
  params: {
    code: string;
  };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { code } = context.params;

  if (!code) {
    return NextResponse.json(
      { message: "Scheme code is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://api.mfapi.in/mf/${code}`);
    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch scheme data" },
        { status: res.status }
      );
    }

    const response: SchemeDetails = await res.json();
    const { meta, data } = response;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "No data found for this scheme" },
        { status: 404 }
      );
    }

    return NextResponse.json({ meta, data });
  } catch (error) {
    console.error(`Failed to fetch scheme ${code}`, error);
    return NextResponse.json(
      { message: "Error fetching scheme data" },
      { status: 500 }
    );
  }
}
