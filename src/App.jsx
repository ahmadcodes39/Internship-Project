import React, { useState } from "react";

const App = () => {
  const [fileData, setFileData] = useState([]);
  const [fileName, setFileName] = useState("Choose File");
  const [results, setResults] = useState([]);

  const roomRules = [
    { room: "ServerRoom", minAccess: 2, open: "09:00", end: "11:00", coolDown: 15 },
    { room: "Vault", minAccess: 3, open: "09:00", end: "11:00", coolDown: 30 },
    { room: "R&D Lab", minAccess: 1, open: "08:00", end: "12:00", coolDown: 10 },
  ];

  const lastAccess = {};

  const checkAccess = () => {
    let newResults = [];

    fileData.forEach((emp) => {
      const rule = roomRules.find((r) => r.room === emp.room);

      if (!rule) {
        newResults.push({
          Employee: emp.id,
          Access: "Denied",
          Reason: "Invalid room",
        });
        return;
      }

      if (emp.access_level < rule.minAccess) {
        newResults.push({
          Employee: emp.id,
          Access: "Denied",
          Reason: "Below required access level",
        });
        return;
      }

      const requestTime = emp.time; 
      if (requestTime < rule.open || requestTime > rule.end) {
        newResults.push({
          Employee: emp.id,
          Access: "Denied",
          Reason: "Room closed",
        });
        return;
      }

      const key = `${emp.id}-${emp.room}`;
      if (lastAccess[key]) {
        const prevTime = lastAccess[key];
        const diff = timeDiffInMinutes(prevTime, requestTime);
        if (diff < rule.coolDown) {
          newResults.push({
            Employee: emp.id,
            Access: "Denied",
            Reason: "Cooldown active",
          });
          return;
        }
      }

      newResults.push({
        Employee: emp.id,
        Access: `Granted to ${emp.room}`,
        Reason: "All conditions satisfied",
      });

      lastAccess[key] = requestTime;
    });

    setResults(newResults);
  };

  const timeDiffInMinutes = (t1, t2) => {
    const [h1, m1] = t1.split(":").map(Number);
    const [h2, m2] = t2.split(":").map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const data = JSON.parse(text);
        setFileData(data);
        console.log("Loaded file data:", data);
      } catch (err) {
        console.error("Error parsing file:", err);
      }
    };
  };

  return (
    <div className="min-h-[100vh] bg-gray-200 flex pt-10 justify-center">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="font-bold text-2xl">Secure Room Access</h1>

        <form className="flex items-center gap-6">
          <label
            htmlFor="empData"
            className="cursor-pointer bg-white px-4 py-3 rounded-md border-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 shadow-sm transition duration-200"
          >
            <span>📂 {fileName}</span>
          </label>
          <input
            type="file"
            id="empData"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={checkAccess}
            className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-200"
          >
            Simulate Access
          </button>
        </form>

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
