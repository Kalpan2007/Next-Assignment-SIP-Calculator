# Mutual Fund Explorer with SIP Calculator

<p align="center">
  <img src="https://res.cloudinary.com/dxdrzit6x/image/upload/v1758798970/Home%20Page%20Of%20next%20assignment%20of%20sip.png" alt="Screenshot 1" width="30%"/> &nbsp;&nbsp;&nbsp;
  <img src="https://res.cloudinary.com/dxdrzit6x/image/upload/v1758798970/explore%20page%20of%20next%20assignment%20of%20sip.png" alt="Screenshot 2" width="30%"/> &nbsp;&nbsp;&nbsp;
  <img src="https://res.cloudinary.com/dxdrzit6x/image/upload/v1758798970/calculater%20of%20next%20assignment%20of%20sip.png" alt="Screenshot 3" width="30%"/>
</p>

---

## 🔗 Live Demo

👉 [View the App Here](https://sip-calc-next-assignment.vercel.app/)  

---



---

## 🚀 Objective

Build a **Next.js application** that:

- Wraps the [MFAPI.in](https://www.mfapi.in/) public APIs into custom backend endpoints.  
- Uses **Material UI (MUI)** components and **MUI Charts** for frontend pages.  
- Implements a **Systematic Investment Plan (SIP) calculator** with historical NAV data.  

---

## 📊 Data Source

All fund data is fetched from [MFAPI.in](https://www.mfapi.in/):

- **All schemes** → `https://api.mfapi.in/mf`  
- **Scheme NAV history** → `https://api.mfapi.in/mf/{SCHEME_CODE}`  

---

## 🔗 API Endpoints (Backend with Next.js)

### 1. List all schemes  
`GET /api/mf` → Fetches and caches all schemes.  

### 2. Scheme details  
`GET /api/scheme/:code` → Returns metadata + NAV history.  

### 3. Returns calculator  
`GET /api/scheme/:code/returns`  
- Query: `period=1m|3m|6m|1y` OR `from=YYYY-MM-DD&to=YYYY-MM-DD`.  
- Response: start/end dates, NAVs, simple % return, annualized return.  

### 4. SIP calculator  
`POST /api/scheme/:code/sip`  
```json
{
  "amount": 5000,
  "frequency": "monthly",
  "from": "2020-01-01",
  "to": "2023-12-31"
}

```
## 🎨 Frontend Pages (Next.js + MUI)

### 🔎 Fund Search / Listing (`/funds`)
- Browse funds grouped by house/category  
- Search filter  
- MUI Grid & Cards for layout  

### 📈 Scheme Detail (`/scheme/[code]`)
- Show metadata & NAV chart (last 1 year)  
- Returns table (1m, 3m, 6m, 1y)  

### 💰 SIP Calculator (inside scheme detail)
- Form inputs: amount, frequency, start & end dates  
- Results card: invested vs value, absolute & annualized returns  
- Growth chart of SIP over time  

---

## 🧮 SIP Calculation Rules

- **Each SIP date** → Buy units = amount ÷ NAV (nearest available)  
- **End date** → Total value = units × end NAV  
- **Returns**:  
  - Absolute = `(value – invested) / invested × 100`  
  - Annualized = `((value / invested)^(1/years)) – 1`  
- Handle edge cases: missing NAVs, invalid data, insufficient range  

---

## ⚙️ Tech Stack

- **Next.js** (API routes + pages)  
- **Material UI (MUI)** for responsive design  
- **MUI Charts / Recharts** for visualization  
- **In-memory caching** (12–24h TTL)  
- *(Optional)* Redis for advanced caching  

---

## 🌟 Bonus Ideas

- **Lumpsum calculator** (compare with SIP)  
- **SWP (Systematic Withdrawal Plan)** simulation  
- **Advanced charts** for deeper insights  
- **Fund comparison tools**  

---

## 🛠️ Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd mutual-fund-explorer

# Install dependencies
npm install

# Run the dev server
npm run dev

