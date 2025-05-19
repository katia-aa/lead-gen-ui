import Papa from "papaparse";
import type { TableData } from "./types";

export function parseMarkdownTable(markdown: string): TableData {
  // Find the table part in the markdown
  const tableStart = markdown.indexOf("|");
  if (tableStart === -1) return { headers: [], rows: [] };
  const table = markdown.slice(tableStart).trim();
  const lines = table
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // If all data is on one line, split by '|'
  if (lines.length <= 3) {
    const cells = table
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);
    const headerCount =
      cells.indexOf("---") !== -1
        ? cells.indexOf("---")
        : Math.floor(cells.length / 2);
    const headers = cells.slice(0, headerCount);
    const dataCells = cells.slice(headerCount * 2); // skip headers and separator
    const rowCount = Math.floor(dataCells.length / headers.length);
    const rows: string[][] = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push(dataCells.slice(i * headers.length, (i + 1) * headers.length));
    }
    return { headers, rows };
  }

  // Multi-line table parsing
  const headers = lines[0]
    .split("|")
    .filter(Boolean)
    .map((h) => h.trim());
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const values = lines[i]
      .split("|")
      .filter(Boolean)
      .map((v) => v.trim());
    if (values.length === headers.length) {
      rows.push(values);
    }
  }
  return { headers, rows };
}

export function downloadCSV(data: Record<string, string>[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
