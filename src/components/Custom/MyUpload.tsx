import React from "react";
import { useForm } from "react-hook-form";

const MyUpload: React.FC<any> = ({
  preview,
  setPreview,
  handleChange,
  setValue,
  name,
  placeholder,
  title,
}) => {
  const { register } = useForm();
  return (
    <div className="mt-3">
      <label>{title} Upload</label>
      <div className="mt-3 flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-file-excel"
          className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pb-3 pt-5">
            <svg
              className="mb-4 h-10 w-10 text-gray-500"
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
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">{placeholder}</span>
            </p>
          </div>
          {preview ? (
            <div className="relative mb-3 w-fit rounded-md border">
              <div className="rounded-md bg-slate-200 px-5 py-3">
                <i className="fa-solid fa-file-lines" /> {preview?.name}
              </div>
              <div
                onClick={() => {
                  setValue(name, null);
                  setPreview(null);
                }}
                className="absolute right-0 top-0 z-50 w-fit cursor-pointer"
              >
                <i className="fa-solid fa-circle-xmark text-gray-800" />
              </div>
            </div>
          ) : (
            <input
              {...register(name)}
              id="dropzone-file-excel"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleChange}
            />
          )}
        </label>
      </div>
    </div>
  );
};

export default MyUpload;
