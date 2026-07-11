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
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

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
    setProgress(0);
    try {
      const allRecords = [];
      const allSkipped = [];
      const totalBatches = Math.ceil(csvData.rows.length / 20);

      for (let i = 0; i < totalBatches; i++) {
        const start = i * 20;
        const end = Math.min(start + 20, csvData.rows.length);
        const batch = csvData.rows.slice(start, end);

        const startPercent = Math.round((i / totalBatches) * 100);
        const endPercent = Math.round(((i + 1) / totalBatches) * 100);
        const range = endPercent - startPercent;

        let currentPercent = startPercent;
        const intervalId = setInterval(() => {
          const maxSimulated = startPercent + Math.round(range * 0.9);
          if (currentPercent < maxSimulated) {
            currentPercent += Math.max(1, Math.round(range * 0.05));
            if (currentPercent > maxSimulated) currentPercent = maxSimulated;
            setProgress(currentPercent);
          }
        }, 300);

        try {
          const res = await fetch(`${API_URL}/api/csv/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              headers: csvData.headers,
              rows: batch,
            }),
          });

          let data = {};
          try {
            data = await res.json();
          } catch {
            data = {};
          }

          if (!res.ok) {
            const errMsg = data.message || "Import failed";
            batch.forEach((row) => {
              allSkipped.push({ originalRow: row, reason: errMsg });
            });
          } else {
            if (data.records) {
              data.records.forEach((rec) => allRecords.push(rec));
            }
            if (data.skipped) {
              data.skipped.forEach((skp) => allSkipped.push(skp));
            }
          }
        } finally {
          clearInterval(intervalId);
        }

        setProgress(endPercent);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      setResult({
        records: allRecords,
        skipped: allSkipped,
        totalImported: allRecords.length,
        totalSkipped: allSkipped.length,
      });
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
    setProgress(0);
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-zinc-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* Top Header & Toggle */}
        <div className="flex justify-between items-center mb-10 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold font-sans">CRM CSV Importer</h1>
            <p className="opacity-70 text-xs font-sans mt-1">
              Upload lead CSV, mapped by AI to CRM format.
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`border px-3 py-1.5 font-mono font-bold text-xs rounded-lg ${
              darkMode ? "border-white bg-white text-black hover:bg-gray-250" : "border-black bg-black text-white hover:bg-gray-800"
            }`}
          >
            {darkMode ? " LIGHT MODE " : " DARK MODE "}
          </button>
        </div>

        {/* Upload Step */}
        {step === "upload" && <FileUpload onFileSelected={handleFile} darkMode={darkMode} />}

        {/* Modal for Preview */}
        {step === "preview" && csvData && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className={`border p-6 max-w-4xl w-full relative rounded-lg ${darkMode ? "border-white bg-zinc-800 text-white" : "border-gray-300 bg-white text-black"}`}>
              <button
                onClick={reset}
                className={`absolute top-2 right-2 text-sm font-bold font-mono border px-2 py-0.5 rounded-lg ${
                  darkMode ? "border-white hover:bg-zinc-700 text-white" : "border-gray-300 hover:bg-gray-100 text-black"
                }`}
              >
                X
              </button>
              <h2 className="text-lg font-bold font-mono mb-2 text-center">
                 PREVIEW MODAL ({csvData.fileName}) 
              </h2>
              
              <PreviewTable headers={csvData.headers} rows={csvData.rows} darkMode={darkMode} />
              
              {error && <p className="text-red-500 font-mono text-xs mt-2">Error: {error}</p>}
              
              <div className="flex justify-between mt-6 font-mono font-bold">
                <button
                  onClick={reset}
                  className={`border px-3 py-1 text-sm rounded-lg ${
                    darkMode ? "border-white hover:bg-zinc-700 text-white" : "border-gray-300 hover:bg-gray-100 text-black"
                  }`}
                >
                   Start Over 
                </button>
                <button
                  onClick={handleConfirm}
                  className={`border px-4 py-2 text-sm rounded-lg ${
                    darkMode ? "border-white bg-white text-black hover:bg-gray-250" : "border-black bg-black text-white hover:bg-gray-800"
                  }`}
                >
                   Confirm & Import Data 
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Step */}
        {step === "loading" && (
          <div className="text-center py-20 font-mono font-bold">
            <div className="mb-4">
              IMPORTING LEADS: {progress}% COMPLETED
            </div>
            <div className={`w-full ${darkMode ? "bg-zinc-800 border-white" : "bg-gray-200 border-gray-300"} border border-solid rounded-lg overflow-hidden h-6 mt-4`}>
              <div
                className={`${darkMode ? "bg-white text-black" : "bg-black text-white"} h-full text-xs flex items-center justify-center font-sans font-bold transition-all duration-300`}
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        )}

        {/* Result Step (Regular View on main page canvas, NOT Modal) */}
        {step === "result" && result && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-mono pb-2">
               AI IMPORT RESULTS 
            </h2>
            <ResultTable result={result} darkMode={darkMode} />
            <button
              onClick={reset}
              className={`border px-4 py-2 font-mono font-bold text-sm rounded-lg ${
                darkMode ? "border-white hover:bg-zinc-800 text-white" : "border-gray-300 hover:bg-gray-100 text-black"
              }`}
            >
               Import Another File 
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
