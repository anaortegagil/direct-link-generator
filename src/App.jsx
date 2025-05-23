import React, { useState } from "react";

export default function App() {
  const [sharedLink, setSharedLink] = useState("");
  const [directLink, setDirectLink] = useState("");

  const generateDirectLink = (link) => {
    if (link.includes("drive.google.com")) {
      const match = link.match(/\/d\/([^/]+)/);
      if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      const altMatch = link.match(/id=([^&]+)/);
      if (altMatch) return `https://drive.google.com/uc?export=download&id=${altMatch[1]}`;
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

  const handleGenerate = () => {
    const result = generateDirectLink(sharedLink.trim());
    setDirectLink(result);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Direct Download Link Generator</h1>
      <div className="bg-white shadow-md rounded p-4 space-y-4">
        <input
          className="w-full border rounded p-2"
          placeholder="Paste your shared Google Drive / OneDrive / SharePoint link"
          value={sharedLink}
          onChange={(e) => setSharedLink(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleGenerate}>
          Generate Direct Link
        </button>
        {directLink && (
          <div className="break-words p-2 bg-gray-100 rounded">
            <strong>Direct Link:</strong>
            <p className="text-blue-600 mt-1">{directLink}</p>
          </div>
        )}
      </div>
    </div>
  );
}