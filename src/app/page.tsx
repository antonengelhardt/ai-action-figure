"use client";

import { useState, useEffect } from "react";
import ActionFigureForm, {
  ActionFigureData,
} from "../components/ActionFigureForm";
import ResultsDisplay from "../components/ResultsDisplay";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [personDescription, setPersonDescription] = useState<string | null>(
    null
  );
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const generationSteps = [
    "Analyzing your photo...",
    "Identifying features...",
    "Creating action figure...",
    "Adding accessories...",
    "Designing packaging...",
  ];

  // Auto-advance the generation steps for a better UX
  useEffect(() => {
    if (!isGenerating) {
      setGenerationStep(0);
      setAnalysisComplete(false);
      return;
    }

    const interval = setInterval(() => {
      // If we have the person description and we're in step 0 or 1,
      // jump to step 2 as the analysis is complete
      if (personDescription && generationStep < 2) {
        setGenerationStep(2);
        setAnalysisComplete(true);
        return;
      }

      // Otherwise, advance normally if we don't have the description yet
      // or we're past the analysis steps
      if (!analysisComplete || generationStep >= 2) {
        setGenerationStep((prev) => {
          const nextStep = prev + 1;
          return nextStep < generationSteps.length ? nextStep : prev;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [
    isGenerating,
    generationSteps.length,
    personDescription,
    generationStep,
    analysisComplete,
  ]);

  const handleGenerate = async (data: ActionFigureData) => {
    setIsGenerating(true);
    setError(null);
    setGenerationStep(0);
    setPersonDescription(null);
    setAnalysisComplete(false);

    try {
      console.log("Sending request with data:", {
        ...data,
        gadgets: data.gadgets,
        imageUrl: data.imageUrl.substring(0, 50) + "...",
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Server responded with ${response.status}`
        );
      }

      // Save both the image URL and person description
      setGeneratedImageUrl(result.imageUrl);
      setPersonDescription(result.personDescription);

      // Mark analysis as complete once we have the description
      setAnalysisComplete(true);
    } catch (error: unknown) {
      console.error("Error generating image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedImageUrl(null);
    setPersonDescription(null);
    setError(null);
  };

  // Create loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-slate-900/90 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 backdrop-blur-md">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin"
              style={{
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                animationDuration: "1.5s",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                {Math.min(
                  100,
                  Math.round(
                    (generationStep / (generationSteps.length - 1)) * 100
                  )
                )}
                %
              </span>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
            Creating Your Action Figure
          </h3>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-6 text-lg">
            {generationSteps[generationStep]}
          </p>

          {personDescription && (
            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl text-sm animate-fadeIn">
              <p className="font-semibold mb-1 text-indigo-800 dark:text-indigo-300">
                AI&apos;s analysis of your photo:
              </p>
              <p className="italic text-slate-700 dark:text-slate-300">
                {personDescription}
              </p>
            </div>
          )}

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (generationStep / (generationSteps.length - 1)) * 100
                  )
                )}%`,
              }}
            ></div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            This process may take up to a minute. Please don&apos;t close this
            window.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 inline-block pb-2">
            Action Figure Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Create your own custom action figure by uploading a photo and
            customizing the details. Turn yourself into a collectible toy with
            AI!
          </p>
          <div className="inline-flex items-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl text-indigo-700 dark:text-indigo-300">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Our AI analyzes your photo to create a more personalized action figure!</span>
          </div>
        </header>

        <main>
          {error && (
            <section className="mb-8 p-5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl" aria-live="polite">
              <p className="font-medium flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Error: {error}</span>
              </p>
              <p className="text-sm mt-2 ml-7">
                Please try again or contact support if the issue persists.
              </p>
            </section>
          )}

          {generatedImageUrl ? (
            <section aria-labelledby="result-title">
              <ResultsDisplay
                imageUrl={generatedImageUrl}
                personDescription={personDescription}
                onReset={handleReset}
              />
            </section>
          ) : (
            <section aria-labelledby="form-title">
              <ActionFigureForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </section>
          )}
        </main>

        <footer className="mt-24 text-center text-slate-500 dark:text-slate-400 text-sm">
          <div className="mt-2 mb-8">
            <a
              href="https://buymeacoffee.com/antonengelhardt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2.5 px-5 rounded-lg transition-all transform hover:scale-105 shadow-md"
              aria-label="Support the developer by buying a coffee"
            >
              <img
                src="/buy-me-a-coffee.svg"
                alt="Buy Me a Coffee"
                className="w-6 h-6 mr-2"
                width={24}
                height={24}
              />
              Buy me a coffee
            </a>
            <p className="pt-8 text-sm">
              This project uses my personal OpenAI API key. The API key has a
              limit and when it&apos;s reached, the generation will fail.
              <br />
              Therefore, please consider supporting me, so i can increase the
              limit.
              <br />
              Alternatively, you can clone{" "}
              <a
                className="text-indigo-500 hover:text-indigo-600"
                href="https://github.com/antonengelhardt/ai-action-figure"
                target="_blank"
                rel="noopener noreferrer"
              >
                the project
              </a>{" "}
              and run it with your own OpenAI API key.
            </p>
          </div>
          <p className="mb-2">
            Powered by AI • Created with Next.js and OpenAI
          </p>
          <p>
            Images are generated using AI and belong to the user who created
            them.
          </p>
        </footer>
      </div>

      {isGenerating && <LoadingOverlay />}
    </div>
  );
}
