"use client";

import { useState, KeyboardEvent } from "react";
import Image from "next/image";
import ImageUpload from "./ImageUpload";

interface ActionFigureFormProps {
  onGenerate: (data: ActionFigureData) => void;
  isGenerating: boolean;
}

export interface ActionFigureData {
  figureName: string;
  outfit: string;
  facialExpression: string;
  colorScheme: string;
  gadgets: string[];
  imageUrl: string;
}

export default function ActionFigureForm({
  onGenerate,
  isGenerating,
}: ActionFigureFormProps) {
  const [formData, setFormData] = useState<ActionFigureData>({
    figureName: "",
    outfit: "",
    facialExpression: "",
    colorScheme: "",
    gadgets: [],
    imageUrl: "",
  });
  const [gadgetInput, setGadgetInput] = useState("");

  const [currentStep, setCurrentStep] = useState<"upload" | "details">(
    "upload"
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
    setCurrentStep("details");
  };

  const handleAddGadget = () => {
    if (gadgetInput.trim() === "" || formData.gadgets.length >= 3) return;

    setFormData((prev) => ({
      ...prev,
      gadgets: [...prev.gadgets, gadgetInput.trim()],
    }));
    setGadgetInput("");
  };

  const handleGadgetKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGadget();
    }
  };

  const handleRemoveGadget = (gadget: string) => {
    setFormData((prev) => ({
      ...prev,
      gadgets: prev.gadgets.filter((g) => g !== gadget),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const isValid =
    formData.figureName &&
    formData.outfit &&
    formData.facialExpression &&
    formData.colorScheme &&
    formData.imageUrl;

  if (currentStep === "upload") {
    return (
      <div className="max-w-md mx-auto p-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
          Upload Your Photo
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Upload a full body photo of yourself to create your action figure
        </p>
        <ImageUpload onImageUploaded={handleImageUploaded} />
        <div className="mt-6 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <p className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
            Tips for best results:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-gray-600 dark:text-gray-300">
            <li>Use a well-lit photo</li>
            <li>Choose a full-body or clear upper body shot</li>
            <li>Simple backgrounds work best</li>
          </ul>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Our AI will analyze your photo to create a personalized action
            figure!
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700"
    >
      <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
        Customize Your Action Figure
      </h2>

      <div className="mb-8">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <Image
            src={formData.imageUrl}
            alt="Your uploaded photo"
            fill
            className="object-cover rounded-xl shadow-md border-2 border-white dark:border-slate-600"
          />
          <button
            type="button"
            onClick={() => setCurrentStep("upload")}
            className="absolute -bottom-3 -right-3 bg-white dark:bg-slate-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 border border-gray-100 dark:border-slate-600 text-blue-500 dark:text-blue-300"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="figureName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Figure Name
          </label>
          <input
            type="text"
            id="figureName"
            name="figureName"
            value={formData.figureName}
            onChange={handleInputChange}
            placeholder="e.g. The Code Master"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="outfit"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Outfit Description
          </label>
          <input
            type="text"
            id="outfit"
            name="outfit"
            value={formData.outfit}
            onChange={handleInputChange}
            placeholder="e.g. a sleek black suit with silver accents"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="facialExpression"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Facial Expression
          </label>
          <input
            type="text"
            id="facialExpression"
            name="facialExpression"
            value={formData.facialExpression}
            onChange={handleInputChange}
            placeholder="e.g. determined, smiling, serious"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="colorScheme"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Packaging Color Scheme
          </label>
          <input
            type="text"
            id="colorScheme"
            name="colorScheme"
            value={formData.colorScheme}
            onChange={handleInputChange}
            placeholder="e.g. blue and gold gradient"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="gadgets"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Action Figure Gadgets (up to 3)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="gadgets"
              value={gadgetInput}
              onChange={(e) => setGadgetInput(e.target.value)}
              onKeyDown={handleGadgetKeyDown}
              placeholder="e.g. laser watch"
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              disabled={formData.gadgets.length >= 3}
            />
            <button
              type="button"
              onClick={handleAddGadget}
              className={`px-4 py-3 rounded-lg shadow-sm ${
                gadgetInput.trim() === "" || formData.gadgets.length >= 3
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              }`}
              disabled={
                gadgetInput.trim() === "" || formData.gadgets.length >= 3
              }
            >
              Add
            </button>
          </div>

          {formData.gadgets.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.gadgets.map((gadget) => (
                <div
                  key={gadget}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm flex items-center border border-blue-100 dark:border-blue-800"
                >
                  {gadget}
                  <button
                    type="button"
                    onClick={() => handleRemoveGadget(gadget)}
                    className="ml-2 h-5 w-5 rounded-full bg-white dark:bg-slate-700 text-blue-500 dark:text-blue-300 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-slate-600 transition-all duration-200"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter or click Add after each gadget
            {formData.gadgets.length < 3 &&
              ` (${3 - formData.gadgets.length} remaining)`}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || isGenerating}
        className={`w-full mt-8 py-3 px-4 rounded-xl shadow-md ${
          isValid && !isGenerating
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-200"
            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        } font-medium text-lg`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Creating your action figure...</span>
          </div>
        ) : (
          "Generate Action Figure"
        )}
      </button>

      {isGenerating && (
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-4 text-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          AI is analyzing your photo and creating a custom action figure. This
          may take up to a minute.
        </p>
      )}
    </form>
  );
}
