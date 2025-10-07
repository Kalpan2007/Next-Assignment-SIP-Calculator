# Mutual Fund Explorer with SIP Calculator

<p align="center">
  <img src="https://res.cloudinary.com/dxdrzit6x/image/upload/v1758798970/Home%20Page%20Of%20next%20assignment%20of%20sip.png" alt="Screenshot 1" width="30%"/> &nbsp;&nbsp;&nbsp;
  <img src="https://res.cloudinary.com/dxdrzit6x/image/upload/v1758798970/explore%20page%20of%20next%20assignment%20of%20sip.png" alt="Screenshot 2" width="30%"/> &nbsp;&nbsp;&nbsp;
  <img src="https://res.cloudinary.com/dxdrzit6x/image/upload/v1758798970/calculater%20of%20next%20assignment%20of%20sip.png" alt="Screenshot 3" width="30%"/>

Build a **Next.js application** that:
All fund data is fetched from [MFAPI.in](https://www.mfapi.in/):
### 1. List all schemes  


- Query: `period=1m|3m|6m|1y` OR `from=YYYY-MM-DD&to=YYYY-MM-DD`.  
```
- Search filter  
- Returns table (1m, 3m, 6m, 1y)  
- Results card: invested vs value, absolute & annualized returns  
- **Each SIP date** → Buy units = amount ÷ NAV (nearest available)  
- **Next.js** (API routes + pages)  
- **Lumpsum calculator** (compare with SIP)  
```bash
# Mutual Fund Explorer — Next.js SIP & Returns Tool

A full-stack Next.js project that wraps MFAPI.in to provide fund exploration, SIP calculator, SWP/step-up simulations and a powerful rolling-returns analysis. This README explains the features, internal logic, API endpoints, folder structure and developer workflow so anyone can understand and extend the project quickly.

---

## Quick highlights
- Fund search & listing (wrapped MFAPI data)
- Scheme detail page with NAV chart and returns
- SIP calculator (monthly SIP simulation) with growth chart
- SWP and step-up calculators
- Rolling returns analysis with flexible window & duration
- Lightweight server-side caching for performance

---

## How the project works (high-level)
- Backend: Next.js API routes under `src/app/api/*` that proxy MFAPI.in and apply calculation logic (caching + math).
- Frontend: Next.js app (app router) with components in `src/components` that call the backend endpoints.
- Data source: https://api.mfapi.in/mf and https://api.mfapi.in/mf/{SCHEME_CODE}

---

## Calculation details (concise)

SIP (Systematic Investment Plan)
- Inputs: monthly amount, from date, to date.
- For each SIP date: buy units = amount / NAV (nearest NAV at or before that date).
- Final value = total units * latest NAV.
- Absolute return = (value - invested) / invested × 100.
- Annualized return = (value / invested)^(1/years) - 1 (if duration >= 1 year).

SWP / Step-up variants
- SWP: monthly withdrawals -> units sold = withdrawal / NAV at withdrawal date.
- Step-up: contribution/withdrawal increases yearly at a given percentage.

Returns (period & custom)
- Endpoint supports `period` shorthand (1m, 3m, 6m, 1y) or `from`/`to` dates.

Rolling returns
- Inputs: `window` and `duration` accept `d|m|y` units (e.g., `7d`, `1m`, `1y`, `3y`, `5y`).
- Optional `start` (ISO date) — server clamps to available NAV range.
- Default stepping uses daily NAVs; CAGR uses fractional years for day/month windows.

---

## Server API Endpoints (examples)
All server routes are under `src/app/api`.

- `GET /api/mf`
  - Returns list of schemes (cached in-memory).

- `GET /api/scheme/:code`
  - Returns scheme metadata and NAV history.

- `GET /api/scheme/:code/returns?period=1m|3m|6m|1y` or `?from=YYYY-MM-DD&to=YYYY-MM-DD`
  - Returns start/end NAVs, percentage return, days, and simple annualized value when applicable.

- `POST /api/scheme/:code/sip`
  - Body: `{ amount, from, to }` — returns totalInvested, currentValue, absoluteReturn, annualizedReturn, investmentGrowth[]

- `POST /api/scheme/:code/swp` and step-up variants
  - Simulate withdrawals; returns final portfolio values and totals.

- `GET /api/scheme/:code/rolling-returns?window=1m&duration=1y[&start=YYYY-MM-DD]`
  - Returns: `{ count, averageReturn, maxReturn, minReturn, startDate, rollingSeries[] }`
  - `window` and `duration` accept `d|m|y` values (e.g., `1d`, `30d`, `1m`, `1y`).

---

## Frontend pages & main components

- `src/app/page.tsx` — Landing / home page
- `src/app/funds/page.tsx` — Fund listing and search
- `src/app/scheme/[code]/page.tsx` — Scheme detail + calculators tabbed UI
- `src/app/calculator/page.tsx` — Standalone SIP calculator page
- `src/components/` — Reusable UI components (FloatingNavbar, InvestmentChart, calculators/*)

---

## Folder structure (quick)

src                                    
├─ app                                 
│  ├─ api                              
│  │  ├─ mf                            
│  │  │  └─ route.ts                   
│  │  ├─ rank-funds                    
│  │  │  └─ route.ts                   
│  │  └─ scheme                        
│  │     └─ [code]                     
│  │        ├─ returns                 
│  │        │  └─ route.ts             
│  │        ├─ rolling-returns         
│  │        │  └─ route.ts             
│  │        ├─ sip                     
│  │        │  └─ route.ts             
│  │        ├─ step-up-sip             
│  │        │  └─ route.ts             
│  │        ├─ step-up-swp             
│  │        │  └─ route.ts             
│  │        ├─ swp                     
│  │        │  └─ route.ts             
│  │        └─ route.ts                
│  ├─ calculator                       
│  │  └─ page.tsx                      
│  ├─ funds                            
│  │  └─ page.tsx                      
│  ├─ rankings                         
│  │  └─ page.tsx                      
│  ├─ scheme                           
│  │  └─ [code]                        
│  │     └─ page.tsx                   
│  ├─ favicon.ico                      
│  ├─ globals.css                      
│  ├─ layout.tsx                       
│  └─ page.tsx                         
└─ components                          
   ├─ calculators                      
   │  ├─ RollingReturnsCalculator.tsx  
   │  ├─ SipCalculator.tsx             
   │  ├─ StepUpSipCalculator.tsx       
   │  ├─ StepUpSwpCalculator.tsx       
   │  └─ SwpCalculator.tsx             
   ├─ ClientNavbarWrapper.tsx          
   ├─ FloatingNavbar.tsx               
   └─ InvestmentChart.tsx              


---

## Run & develop locally

Requirements: Node 16+, npm

```bash
# clone
git clone <repo-url>
cd mutual-fund-explorer

# install
npm install

# dev
npm run dev

# production build
npm run build
npm start
```

Notes:
- API routes call `https://api.mfapi.in` directly; no API key required.
- In-memory caching is used for list endpoints; restart clears cache.

---

## Developer tips & common pitfalls

- Type errors in Next.js route handlers: the app router performs strict checks on exported route functions. If TypeScript complains about the second `context` parameter, either import the correct Next.js types or use a defensive `context: any` while prototyping.
- Always parse MFAPI dates with `parse(item.date, 'dd-MM-yyyy', new Date())` before using them.
- Use `findNavForDate(targetDate, sortedNavs)` helper to find the latest NAV on or before a date.
- Rolling returns with daily windows over long durations can be heavy; if you add long-duration endpoints consider server-side aggregation.

---


