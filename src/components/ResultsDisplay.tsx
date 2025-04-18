"use client";

import { useState, useEffect } from "react";

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
  const [isSharing, setIsSharing] = useState(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000); // Keep the downloading state a bit longer for visual feedback
    }
  };

  const handleShare = () => {
    setIsSharing(true);

    if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.share) {
      navigator
        .share({
          title: "My Action Figure",
          text: "Check out my custom action figure!",
          url: imageUrl,
        })
        .catch((error) => console.log("Error sharing", error))
        .finally(() => setIsSharing(false));
    } else if (typeof navigator !== 'undefined' && 'clipboard' in navigator && navigator.clipboard) {
      navigator.clipboard
        .writeText(imageUrl)
        .then(() => {
          setShowCopiedAlert(true);
          setTimeout(() => setShowCopiedAlert(false), 2000);
        })
        .catch((err: Error) => console.error("Could not copy text: ", err))
        .finally(() => setIsSharing(false));
    } else {
      setIsSharing(false);
      alert("Sharing is not supported in this browser");
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-8 rounded-2xl shadow-[0_10px_60px_-15px_rgba(0,0,0,0.2)] bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/30 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-text-shimmer">
        Your Action Figure
      </h2>

      <div className="relative aspect-square max-w-lg mx-auto mb-8 rounded-xl overflow-hidden shadow-lg group">
        <img
          src={imageUrl}
          alt="Generated action figure"
          className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          style={{
            animation: "floating 6s ease-in-out infinite"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {personDescription && (
        <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-sm shadow-inner animate-fade-in" style={{ animationDelay: "300ms" }}>
          <p className="font-semibold mb-2 text-blue-800 dark:text-blue-300">AI&apos;s analysis of your photo:</p>
          <p className="italic text-gray-700 dark:text-gray-300">{personDescription}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-5 justify-center mb-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 ${isDownloading ? 'animate-pulse' : ''} animate-fade-in`}
          style={{ animationDelay: "500ms" }}
        >
          {isDownloading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </span>
          )}
        </button>

        <button
          onClick={handleShare}
          disabled={isSharing}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 relative animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          {isSharing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sharing...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </span>
          )}

          {showCopiedAlert && (
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded animate-fade-in">
              URL copied!
            </span>
          )}
        </button>

        <button
          onClick={onReset}
          className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 border border-gray-200 dark:border-gray-600 animate-fade-in"
          style={{ animationDelay: "700ms" }}
        >
          <span className="flex items-center">
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Create Another
          </span>
        </button>
      </div>
    </div>
  );
}
