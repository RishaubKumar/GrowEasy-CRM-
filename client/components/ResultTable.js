const COLUMNS = [
  "name",
  "email",
  "mobile_without_country_code",
  "company",
  "city",
  "crm_status",
  "data_source",
];

export default function ResultTable({ result }) {
  return (
    <div>
      <div className="flex gap-4 mb-4 text-sm font-mono font-bold">
        <div className="bg-green-300 border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          SUCCESSFULLY IMPORTED: <span className="font-extrabold underline">{result.totalImported}</span>
        </div>
        <div className="bg-red-300 border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          SKIPPED/FAILED: <span className="font-extrabold underline">{result.totalSkipped}</span>
        </div>
      </div>

      <div className="border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-auto max-h-96">
          <table className="min-w-full text-sm text-center border-collapse font-mono">
            <thead className="bg-green-600 text-white sticky top-0 border-b-4 border-black">
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c} className="px-4 py-2 border-r-2 border-black font-extrabold uppercase">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.records.map((r, i) => (
                <tr key={i} className="bg-white hover:bg-cyan-100 border-b-2 border-black">
                  {COLUMNS.map((c) => (
                    <td key={c} className="px-4 py-2 border-r-2 border-black whitespace-nowrap font-semibold">
                      {r[c] || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {result.skipped.length > 0 && (
        <details className="mt-4 bg-yellow-100 border-2 border-black p-3 text-sm font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <summary className="cursor-pointer font-bold text-red-700">
            [CLICK HERE TO VIEW SKIPPED ROWS] ({result.skipped.length})
          </summary>
          <ul className="mt-2 list-decimal list-inside space-y-1 text-black font-semibold">
            {result.skipped.map((s, i) => (
              <li key={i} className="border-b border-dashed border-gray-400 pb-1">
                <span className="text-red-600 font-bold">Reason:</span> {s.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
