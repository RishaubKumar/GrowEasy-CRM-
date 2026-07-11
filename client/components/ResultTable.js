const COLUMNS = [
  "name",
  "email",
  "mobile_without_country_code",
  "company",
  "city",
  "crm_status",
  "data_source",
];

export default function ResultTable({ result, darkMode }) {
  return (
    <div>
      <div className="flex gap-4 mb-4 text-sm font-mono font-bold">
        <div className={`border ${darkMode ? "border-white bg-zinc-800 text-white" : "border-gray-300 bg-white text-black"} px-4 py-2 rounded-lg`}>
          SUCCESSFULLY IMPORTED: <span className="font-extrabold underline">{result.totalImported}</span>
        </div>
        <div className={`border ${darkMode ? "border-white bg-zinc-800 text-white" : "border-gray-300 bg-white text-black"} px-4 py-2 rounded-lg`}>
          SKIPPED/FAILED: <span className="font-extrabold underline">{result.totalSkipped}</span>
        </div>
      </div>

      <div className={`border ${darkMode ? "border-white" : "border-gray-300"} bg-transparent rounded-lg overflow-hidden`}>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full text-sm text-center border-collapse font-mono">
            <thead className={`sticky top-0 border-b ${darkMode ? "border-white bg-zinc-700 text-white" : "border-gray-300 bg-gray-100 text-black"}`}>
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c} className={`px-4 py-2 border-r ${darkMode ? "border-white" : "border-gray-300"} font-extrabold uppercase`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.records.map((r, i) => (
                <tr key={i} className={`border-b border-solid ${darkMode ? "border-white bg-zinc-800 text-white" : "border-gray-200 bg-white text-black"}`}>
                  {COLUMNS.map((c) => (
                    <td key={c} className={`px-4 py-2 border-r ${darkMode ? "border-white" : "border-gray-200"} whitespace-nowrap font-semibold`}>
                      {r[c] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {result.skipped.length > 0 && (
        <details className={`mt-4 border ${darkMode ? "border-white bg-zinc-800 text-white" : "border-gray-300 bg-white text-black"} p-3 text-sm font-mono rounded-lg`}>
          <summary className="cursor-pointer font-bold text-red-600">
            CLICK HERE TO VIEW SKIPPED ROWS ({result.skipped.length})
          </summary>
          <ul className="mt-2 list-decimal list-inside space-y-1 font-semibold">
            {result.skipped.map((s, i) => (
              <li key={i} className={`border-b border-solid ${darkMode ? "border-zinc-700" : "border-gray-200"} pb-1`}>
                <span className="text-red-500 font-bold">Reason:</span> {s.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
