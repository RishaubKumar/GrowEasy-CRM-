# CRM CSV Importer

Assignment project - uploads a CSV of leads (any column format) and uses AI (Gemini) to map it into the CRM fields.

## Folder Structure

```
csv-importer/
|-- client/          Next.js frontend
│   -- app/          page.js, layout.js
│   -- components/   FileUpload.js, PreviewTable.js, ResultTable.js
|-- server/          Express backend
│   -- routes/
│   -- controllers/
│   -- services/     geminiService.js (AI prompt + call)
```

## How it works

1. Upload a CSV (drag and drop or file picker)
2. Preview the rows in a table (no AI used yet)
3. Click Confirm & Import - sends data to backend
4. Backend sends rows to Gemini in batches, gets back CRM fields
5. Result table shows imported + skipped records

## Run locally

**Backend**
```
cd server
cp .env   # add your Gemini API key
npm install
npm run dev
```

**Frontend**
```
cd client
cp .env
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

## Tech used

- Next.js (frontend)
- Node.js + Express (backend)
- Gemini API (AI field mapping)
- PapaParse (CSV parsing)
