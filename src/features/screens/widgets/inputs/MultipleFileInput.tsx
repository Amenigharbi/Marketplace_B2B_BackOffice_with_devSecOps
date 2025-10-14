import React, { useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface MultipleFileInputProps {
  id: string;
  label: string;
  register?: ReturnType<UseFormRegister<any>>;
  error?: FieldError;
  accept?: string;
  onChange?: (files: FileList | null) => void;
  previewUrls?: string[];
}

const MultipleFileInput: React.FC<MultipleFileInputProps> = ({
  id,
  label,
  register,
  error,
  accept = "image/*",
  onChange,
  previewUrls = [],
}) => {
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const urls: string[] = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          urls.push(reader.result as string);
          if (urls.length === files.length) {
            setNewPreviewUrls(urls);
          }
        };
        reader.readAsDataURL(file);
      });

      if (onChange) {
        onChange(files);
      }
    } else {
      setNewPreviewUrls([]);
      if (onChange) {
        onChange(null);
      }
    }
  };

  return (
    <div className="w-full justify-start">
      {label && <label className="block font-medium md:text-lg">{label}</label>}

      <div className="flex w-full flex-col items-center justify-center">
        <label
          htmlFor={id}
          className={`h-50 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
            previewUrls.length > 0 || newPreviewUrls.length > 0 ? "p-0" : "p-5"
          }`}
        >
          {previewUrls.length > 0 || newPreviewUrls.length > 0 ? (
            <div className="grid h-full w-full grid-cols-3 gap-2 overflow-y-auto p-2">
              {previewUrls.length > 0 &&
                previewUrls.map((url, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img
                      src={`http://102.219.178.14:3000/api/ad${url}`}
                      alt={`Existing Preview ${index}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  </div>
                ))}

              {newPreviewUrls.length > 0 &&
                newPreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={url}
                      alt={`New Preview ${index}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {accept === "image/*"
                  ? "SVG, PNG, JPG, or GIF"
                  : "Any file type"}{" "}
                (MAX. 800x400px)
              </p>
            </div>
          )}
          <input
            id={id}
            type="file"
            {...register}
            accept={accept}
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
      </div>
    </div>
  );
};

export default MultipleFileInput;
