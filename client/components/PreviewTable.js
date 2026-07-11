export default function PreviewTable({ headers, rows, darkMode }) {
  return (
    <div className={`border border-solid ${darkMode ? "border-white" : "border-gray-300"} bg-transparent rounded-lg overflow-hidden my-4`}>
      <div className={`px-4 py-2 border-b border-solid ${darkMode ? "border-white bg-zinc-700 text-white" : "border-gray-300 bg-gray-100 text-black"} font-bold text-center font-sans`}>
        PREVIEW DATA (Total: {rows.length} rows)
      </div>
      <div className="overflow-auto max-h-96">
        <table className="min-w-full text-sm text-center border-collapse font-mono">
          <thead className={`sticky top-0 border-b border-solid ${darkMode ? "border-white bg-zinc-700 text-white" : "border-gray-300 bg-gray-100 text-black"}`}>
            <tr>
              {headers.map((h) => (
                <th key={h} className={`px-4 py-2 border-r border-solid ${darkMode ? "border-white" : "border-gray-300"} font-extrabold uppercase tracking-wider`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-b border-solid ${darkMode ? "border-white bg-zinc-800 text-white" : "border-gray-200 bg-white text-black"}`}>
                {headers.map((h) => (
                  <td key={h} className={`px-4 py-2 border-r-solid border-r ${darkMode ? "border-white" : "border-gray-200"} whitespace-nowrap font-semibold`}>
                    {row[h] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
