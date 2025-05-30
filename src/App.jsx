import React, { useState } from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export default function App() {
  const [sharedLinks, setSharedLinks] = useState("");
  const [csvOutput, setCsvOutput] = useState(null);

  const generateDirectLink = (link) => {
    if (link.includes("drive.google.com")) {
      const match = link.match(/\/d\/([^/]+)/);
      if (match) return `https://drive.usercontent.google.com/download?export=download&id=${match[1]}`;
      const altMatch = link.match(/id=([^&]+)/);
      if (altMatch) return `https://drive.usercontent.google.com/download?export=download&id=${altMatch[1]}`;
      return "Invalid Google Drive link";
    } else if (link.includes("1drv.ms")) {
      return "Please open the 1drv.ms link in a browser to get the full OneDrive link.";
    } else if (link.includes("onedrive.live.com")) {
      const match = link.match(/resid=([^&]+)/);
      if (match) return `https://onedrive.live.com/download?resid=${match[1]}`;
      return "Invalid OneDrive link";
    } else if (link.includes("sharepoint.com")) {
      const updatedLink = link.replace("/:u:/r/", "/:x:/r/");
      return updatedLink.includes("&download=1") ? updatedLink : `${updatedLink}&download=1`;
    }
    return "Unsupported or invalid link format.";
  };

  const handleGenerateCSV = () => {
    const linksArray = sharedLinks.split(/,\s*/).filter(Boolean);
    const csvData = linksArray.map(link => ({
      original: link,
      direct: generateDirectLink(link)
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "direct_links.csv");
    setCsvOutput(csv);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Direct Download Link Generator</h1>
      <div className="bg-white shadow-md rounded p-4 space-y-4">
        <textarea
          className="w-full border rounded p-2 h-32"
          placeholder="Paste a comma-separated list of links"
          value={sharedLinks}
          onChange={(e) => setSharedLinks(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleGenerateCSV}>
          Generate CSV
        </button>
        {csvOutput && (
          <p className="text-sm text-green-700">CSV file generated and downloaded!</p>
        )}
      </div>
    </div>
  );
}