# SPF Checker SPA

A simple Single Page Application (SPA) to check SPF (Sender Policy Framework) records for any domain using **React** (frontend) and **Express** (backend).

The app allows you to enter a domain, fetch its DNS TXT records, and display SPF entries (`v=spf1 ...`). It also highlights `include:` and `redirect=` mechanisms, which can be expanded to see their respective SPF records.  

---

## Running the Application Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/spf-checker.git
cd spf-checker
```
### 2. Setup Backend
```bash
cd server
npm install
```
### 3. Start the backend server:
```bash
npm run dev
```
### 4. Setup Frontend
```bash
cd ../client
npm install
```

### 5. Start the frontend server:
```bash
npm run dev
```
The frontend runs at: http://localhost:5173 (default Vite port).

### Note: This will also install react-loader-spinner used for the loading indicator.

## Open the app in your browser and enter a domain to check its SPF record.