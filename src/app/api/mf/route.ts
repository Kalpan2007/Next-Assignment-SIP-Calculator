// src/app/api/mf/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// Simple in-memory cache
let cachedData: any = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export async function GET() {
  const now = Date.now();

  if (cachedData && now - lastFetchTime < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  try {
    const response = await axios.get('https://api.mfapi.in/mf');
    cachedData = response.data;
    lastFetchTime = now;
    return NextResponse.json(cachedData);
  } catch (error) {
    console.error("Failed to fetch from MFAPI", error);
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}   