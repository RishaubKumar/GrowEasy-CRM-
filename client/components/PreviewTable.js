export default function PreviewTable({ headers, rows }) {
  return (
    <div className="border-4 border-black bg-white overflow-hidden my-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="px-4 py-2 border-b-4 border-black bg-yellow-300 font-bold text-black text-center font-mono">
        --- PREVIEW DATA (Total: {rows.length} rows) ---
      </div>
      <div className="overflow-auto max-h-96">
        <table className="min-w-full text-sm text-center border-collapse font-mono">
          <thead className="bg-blue-600 text-white sticky top-0 border-b-4 border-black">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-2 border-r-2 border-black font-extrabold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="bg-white hover:bg-yellow-100 border-b-2 border-black">
                {headers.map((h) => (
                  <td key={h} className="px-4 py-2 border-r-2 border-black whitespace-nowrap text-black font-semibold">
                    {row[h]}
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
