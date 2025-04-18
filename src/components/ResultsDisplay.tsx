"use client";

import { useState } from "react";

interface ResultsDisplayProps {
  imageUrl: string;
  personDescription: string | null;
  onReset: () => void;
}

export default function ResultsDisplay({
  imageUrl,
  personDescription,
  onReset,
}: ResultsDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Use our proxy API to download the image
      const downloadUrl = `/api/download?url=${encodeURIComponent(imageUrl)}`;

      // Create a link and trigger the download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "action-figure.png";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Action Figure",
          text: "Check out my custom action figure!",
          url: imageUrl,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard
        .writeText(imageUrl)
        .then(() => alert("Image URL copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-[0_10px_60px_-15px_rgba(0,0,0,0.2)] bg-gradient-to-br from-white to-blue-50">
      <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Your Action Figure
      </h2>

      <div className="relative aspect-square max-w-lg mx-auto mb-8 rounded-xl overflow-hidden shadow-lg">
        <img
          src={imageUrl}
          alt="Generated action figure"
          className="w-full h-full object-contain"
        />
      </div>

      {personDescription && (
        <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-sm shadow-inner">
          <p className="font-semibold mb-2 text-blue-800">AI&apos;s analysis of your photo:</p>
          <p className="italic text-gray-700">{personDescription}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-5 justify-center mb-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>

        <button
          onClick={handleShare}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Share
        </button>

        <button
          onClick={onReset}
          className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 border border-gray-200"
        >
          Create Another
        </button>
      </div>
    </div>
  );
}
