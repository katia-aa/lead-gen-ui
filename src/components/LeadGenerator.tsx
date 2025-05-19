import { useState } from "react";
import type { FormData } from "./lead-generator/types";
import { LeadForm } from "./lead-generator/LeadForm";
import { ResultsTable } from "./lead-generator/ResultsTable";

export const LeadGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    niche: "",
    location: "",
    count: "10",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markdownResult, setMarkdownResult] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMarkdownResult(null);

    try {
      const response = await fetch(
        "https://lead-gen-service.onrender.com/api/generate-leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate leads");
      }

      const { data } = await response.json();
      setMarkdownResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="max-w-4xl w-full p-6">
        <LeadForm
          formData={formData}
          loading={loading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {markdownResult && (
          <ResultsTable markdownResult={markdownResult} formData={formData} />
        )}
      </div>
    </div>
  );
};
