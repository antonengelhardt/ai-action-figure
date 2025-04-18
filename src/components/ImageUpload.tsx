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
    multiple: false
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed ${
          isDragActive
            ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        } rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col items-center justify-center space-y-2`}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative w-full aspect-square max-w-xs mx-auto">
            <Image
              src={previewUrl}
              alt="Uploaded image"
              fill
              className="object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-white font-medium">Click to change image</p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {isDragActive ? 'Drop your image here' : 'Upload a full body photo'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </>
        )}

        {isUploading && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Processing...</p>
          </div>
        )}
      </div>
    </div>
  );
}
