"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  CallCategoryByCode,
  CallCreateCategoriesData,
  CallFindAllAdvertisement,
  CallUploadFile,
} from "@/_ServerActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";

type FormData = {
  parentMasterId: string;
  value: string;
  prospectusLink: string;
  masterCategoryId: any;
};

const AddNoticeResult: React.FC<any> = ({ slug }) => {
  const Auth: any = useSession();
  const route = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [pdfFile, setPdfFile] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const [advertisement, setAllAdvertisement] = useState<any>(null);
  const [loaderFile, setLoaderFile] = useState(false);

  const getAllAdvertisement = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data: Advertisement, error } = (await CallFindAllAdvertisement(
        Auth?.data?.user?.data?.cellId,
      )) as any;
      if (error) {
        handleCommonErrors(error);
      }
      const { data: CategoryId, error: errorCode } = (await CallCategoryByCode(
        slug[0],
      )) as any;
      if (Advertisement?.message) {
        setAllAdvertisement(Advertisement?.data);
        setValue("masterCategoryId", CategoryId?.data?._id);
      }
      if (errorCode) {
        handleCommonErrors(errorCode);
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAdvertisement();
  }, [Auth]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const { data: response, error } = (await CallCreateCategoriesData(
        data,
      )) as any;

      if (response?.data) {
        toast.success(response?.message);
        route.back();
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, name: any) => {
    try {
      setLoaderFile(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = (await CallUploadFile(formData)) as any;
      setValue(name, response.data?.data?.url as any);
      setLoaderFile(false);
      if (response?.error) {
        handleCommonErrors(response?.error);
      }
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setLoaderFile(false);
    }
  };

  const handleChange = (e: any) => {
    if (e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
      uploadFile(e.target.files[0], "prospectusLink");
    } else {
      setPdfFile(null);
    }
  };

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-3">
          <Select
            isRequired
            variant="bordered"
            label="Advertisement"
            placeholder="Select Data"
            labelPlacement="outside"
            {...register("parentMasterId", { required: true })}
            startContent={
              <div className="pr-2">
                <i className="fa-solid fa-database" />
              </div>
            }
          >
            {advertisement?.map((item: any) => (
              <SelectItem key={item?._id}>{item?.value}</SelectItem>
            ))}
          </Select>
          <Textarea
            isRequired
            {...register("value", { required: true })}
            label="Notice"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your notice"
            errorMessage={"Notice is required."}
            isInvalid={errors?.value ? true : false}
            startContent={
              <div className="pr-2">
                <i className="fa-regular fa-flag" />
              </div>
            }
          />
          <div>
            <label>Upload file</label>
            <div className="flex items-center justify-center w-full mt-3">
              <label
                htmlFor="dropzone-file-excel"
                className="flex flex-col items-center justify-center w-full min-h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
              >
                {loaderFile ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center pt-5 pb-3">
                      <svg
                        className="w-10 h-10 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Upload PDF File</span>
                      </p>
                    </div>
                    {pdfFile ? (
                      <div className="relative w-fit mb-3 border rounded-md">
                        <div className="px-5 py-3 bg-slate-200 rounded-md">
                          <i className="fa-solid fa-file-lines" />{" "}
                          {pdfFile?.name}
                        </div>
                        <div
                          onClick={() => {
                            setPdfFile(null);
                            setValue("prospectusLink", "");
                          }}
                          className="cursor-pointer w-fit absolute top-0 right-0"
                        >
                          <i className="fa-solid fa-circle-xmark text-gray-800" />
                        </div>
                      </div>
                    ) : (
                      <input
                        id="dropzone-file-excel"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleChange}
                      />
                    )}
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="my-3 w-full flex items-center justify-center">
          <Button
            isLoading={loading}
            type="submit"
            radius="sm"
            color="primary"
            className="w-48 mt-5"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddNoticeResult;
