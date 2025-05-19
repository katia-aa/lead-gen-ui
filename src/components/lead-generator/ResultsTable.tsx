import { downloadCSV, parseMarkdownTable } from "./utils";

interface ResultsTableProps {
  markdownResult: string;
  formData: {
    niche: string;
    location: string;
  };
}

export const ResultsTable = ({
  markdownResult,
  formData,
}: ResultsTableProps) => {
  const handleDownloadCSV = () => {
    if (!markdownResult) return;

    // Find the table part in the markdown
    const tableStart = markdownResult.indexOf("|");
    if (tableStart === -1) return;

    // Get only the table part
    const table = markdownResult.slice(tableStart).trim();
    const lines = table
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    // Get headers from the first line
    const headers = lines[0]
      .split("|")
      .filter(Boolean)
      .map((h) => h.trim());

    const data: Record<string, string>[] = [];

    // Start from line 2 (after headers and separator)
    for (let i = 2; i < lines.length; i++) {
      const values = lines[i]
        .split("|")
        .filter(Boolean)
        .map((v) => v.trim());
      if (values.length === headers.length) {
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    downloadCSV(data, `leads_${formData.niche}_${formData.location}.csv`);
  };

  const { headers, rows } = parseMarkdownTable(markdownResult);

  if (!headers.length || !rows.length) {
    return <div className="p-4 text-gray-500">No data to display.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-sm text-gray-900">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleDownloadCSV}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Download CSV
      </button>
    </div>
  );
};
