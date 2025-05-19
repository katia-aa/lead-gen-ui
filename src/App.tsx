import { LeadGenerator } from "./components/LeadGenerator";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Generator</h1>
        </div>
      </header>
      <main>
        <LeadGenerator />
      </main>
    </div>
  );
}

export default App;
