import ExcelIcon from "@/assets/img/svg/Excel";
import React from "react";

const UploadFile: React.FC<any> = ({
  preview,
  setPreview,
  setData,
  handleLogoChange,
}) => {
  return (
    <>
      <div className="col-span-3">
        <label>Upload Excel file</label>
        {preview ? (
          <div className="flex items-center justify-center">
            <div className="relative w-fit">
              <div className="mt-4 flex flex-col items-center justify-center rounded-md bg-slate-100 p-3">
                <ExcelIcon />
                <p> {preview.name}</p>
              </div>
              <div
                onClick={() => {
                  setPreview(null);
                  setData([]);
                }}
                className="absolute right-0 top-1 w-fit cursor-pointer"
              >
                <i className="fa-solid fa-circle-xmark text-gray-800" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex w-full items-center justify-center">
            <label
              htmlFor="dropzone-file-excel"
              className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-blue-200/35"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500"
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop excel
                </p>
                <p className="text-xs text-gray-500">XLSX, XLS, CSV</p>
              </div>
              <input
                id="dropzone-file-excel"
                type="file"
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleLogoChange}
              />
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadFile;
