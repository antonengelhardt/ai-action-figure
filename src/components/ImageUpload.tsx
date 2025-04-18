'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
}

export default function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragEntering, setIsDragEntering] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      // Create a local object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Convert file to base64 for API
      const base64 = await convertToBase64(file);
      onImageUploaded(base64);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 10485760, // 10MB
    multiple: false,
    onDragEnter: () => setIsDragEntering(true),
    onDragLeave: () => setIsDragEntering(false),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed transition-all duration-500 ease-out ${
          isDragActive
            ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20 scale-105 shadow-lg'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:shadow-md transform ${isDragEntering ? 'scale-105' : ''} flex flex-col items-center justify-center space-y-2`}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative w-full aspect-square max-w-xs mx-auto transition-transform duration-300 ease-in-out animate-fade-in">
            <Image
              src={previewUrl}
              alt="Uploaded image"
              fill
              className="object-contain rounded-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
              <p className="text-white font-medium animate-pulse">Click to change image</p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group transition-transform duration-300 hover:scale-110">
              <svg
                className="h-8 w-8 text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transform group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {isDragActive ? (
                  <span className="animate-pulse">Drop your image here</span>
                ) : (
                  'Upload a full body photo'
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">PNG, JPG, GIF up to 10MB</p>
            </div>
          </>
        )}

        {isUploading && (
          <div className="mt-2 animate-fade-in">
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
