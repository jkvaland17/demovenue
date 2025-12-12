import { Button } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";

const CustomMultipleUpload: React.FC<any> = ({
  preview,
  setPreview,
  handleChange,
  setValue,
  name,
  placeholder,
  title,
  accept,
  type,
  sampleDownload = false,
  sampleExcelUrl = "",
  disabled = false
}) => {
  const { register, setValue: UpdateValue } = useForm();
  const removeFile = (e: any, index: number) => {
    e.stopPropagation();
    const updatedPreview = preview.filter((_: any, i: number) => i !== index);
    setValue(`${name}`, updatedPreview);
    UpdateValue(`${name}`, updatedPreview);
    setPreview(updatedPreview);
  };
  // const downloadExcel = (fileUrl: any = "") => {
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.setAttribute("download", fileUrl.split("/").pop());
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // };

  const downloadExcel = async (fileUrl: string = "") => {
  try {
    if (!fileUrl) return;
    const res = await fetch(fileUrl, { credentials: "same-origin" });
    if (!res.ok) throw new Error("Failed to download");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileUrl.split("/").pop() || "sample.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
  }
};

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between">
          <span>{title} Upload</span>
          {sampleDownload ? (
            <Button
              onPress={() => downloadExcel(sampleExcelUrl)}
              color="default"
              variant="flat"
              size="sm"
            >
              Download Sample Excel
            </Button>
          ) : (
            ""
          )}
        </div>
      )}
      <div className="mt-3 flex w-full items-center justify-center">
        <div className={`flex min-h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          onClick={() => document.getElementById(`${name}`)?.click()}
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
          {preview?.length > 0 &&
            preview.map((item: any, index: number) => (
              <div
                key={index}
                className="relative mb-3 w-fit rounded-md border"
              >
                <div className="rounded-md bg-slate-200 px-5 py-3">
                  <i className="fa-solid fa-file-lines" /> {item?.name}
                </div>
                <div
                  onClick={(e) => removeFile(e, index)}
                  className="absolute right-0 top-0 z-50 w-fit cursor-pointer"
                >
                  <i className="fa-solid fa-circle-xmark text-gray-800" />
                </div>
              </div>
            ))}
        </div>
        <input
          {...register(name)}
          id={`${name}`}
          type="file"
          className="hidden"
          multiple={type === "single" ? false : true}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      {preview?.length > 0 && type !== "single" && (
        <div className="text-center">
          <Button
            className="mt-4"
            color="success"
            variant="flat"
            onPress={() => document.getElementById(`${name}`)?.click()}
          >
            Upload More Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomMultipleUpload;
