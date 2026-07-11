"use client";

import { useState } from "react";
import Papa from "papaparse";
import FileUpload from "@/components/FileUpload";
import PreviewTable from "@/components/PreviewTable";
import ResultTable from "@/components/ResultTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [step, setStep] = useState("upload"); // upload -> preview -> loading -> result
  const [csvData, setCsvData] = useState(null); // { headers, rows, fileName }
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFile(file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setCsvData({
          fileName: file.name,
          headers: res.meta.fields || [],
          rows: res.data,
        });
        setStep("preview");
      },
    });
  }

  async function handleConfirm() {
    setStep("loading");
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/csv/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers: csvData.headers,
          rows: csvData.rows,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) throw new Error(data.message || "Import failed");

      setResult(data);
      setStep("result");
    } catch (err) {
      setError(err.message);
      setStep("preview");
    }
  }

  function reset() {
    setStep("upload");
    setCsvData(null);
    setResult(null);
    setError("");
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">CRM CSV Importer</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Upload any lead CSV, AI will map it to the CRM format.
      </p>

      {step === "upload" && <FileUpload onFileSelected={handleFile} />}

      {step === "preview" && csvData && (
        <div className="space-y-4">
          <PreviewTable headers={csvData.headers} rows={csvData.rows} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-between">
            <button onClick={reset} className="text-sm text-gray-500 hover:underline">
              Start over
            </button>
            <button
              onClick={handleConfirm}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Confirm & Import
            </button>
          </div>
        </div>
      )}

      {step === "loading" && (
        <div className="text-center py-16 text-gray-500">Processing with AI...</div>
      )}

      {step === "result" && result && (
        <div className="space-y-4">
          <ResultTable result={result} />
          <button onClick={reset} className="text-sm text-gray-500 hover:underline">
            Import another file
          </button>
        </div>
      )}
    </main>
  );
}
