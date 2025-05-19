export interface FormData {
  niche: string;
  location: string;
  count: "10" | "30" | "50";
}

export interface TableData {
  headers: string[];
  rows: string[][];
}
