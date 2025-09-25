// src/app/api/scheme/[code]/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;
  if (!code) {
    return NextResponse.json({ message: 'Scheme code is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    // The API returns an object with metadata and a 'data' array for NAVs
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