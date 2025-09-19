import React, { useState } from "react";

const App = () => {
  
  const [fileData, setFileData] = useState([]);
  const [fileName, setFileName] = useState("Choose File");
  const [results, setResults] = useState([]);
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const data = JSON.parse(text);
          setFileData(data);
          console.log("✅ Loaded file data:", data);
        } catch (error) {
          console.error("❌ Error parsing file:", error);
        }
      };
    }
  };

  return (
    <div className="min-h-[100vh] bg-gray-200 flex pt-10 justify-center">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="font-bold text-2xl">Secure Room Access</h1>
        <form className="flex items-center gap-6">
          <label
            htmlFor="empData"
            className="cursor-pointer bg-white px-4 py-3 rounded-md border-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 shadow-sm transition duration-200 flex justify-between items-center"
          >
            <span>📂 {fileName}</span>
          </label>
          <input
            type="file"
            id="empData"
            name="empData"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={checkAccess}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-200"
          >
            Simulate Access
          </button>
        </form>

        {/* Show results */}
        <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-md shadow">
          <h2 className="font-semibold text-lg mb-2">Results:</h2>
          {results.length === 0 ? (
            <p>No results yet</p>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {results.map((res, i) => (
                <li key={i}>
                  <strong>{res.Employee}</strong> - {res.Access} ({res.Reason})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
