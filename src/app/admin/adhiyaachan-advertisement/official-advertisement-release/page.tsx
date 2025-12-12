"use client";
import {
  CallGetAllAdhiyaachanList,
  CallGetAllNewAdhiyaachanList,
  CallSubmitAdvertisementRelease,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import FormSkeleton from "@/components/kushal-components/loader/FormSkeleton";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const OfficialAdvertisementRelease = () => {
  const route = useRouter();
  const { control, handleSubmit, setValue, register, reset, watch } = useForm();
  const [loader, setLoader] = useState<any>({
    button: false,
    list: false,
  });

  const [adhiyaachanList, setAdhiyaachanList] = useState<any>([]);
  const [uploadHindi, setUploadHindi] = useState<any>([]);
  const [uploadEnglish, setUploadEnglish] = useState<any>([]);

  const handleChangeHindi = (e: any) => {
    const newFiles = Array.from(e.target.files);
    const uniqueFiles = newFiles.filter(
      (file: any) =>
        !uploadHindi.some((item: any) => item?.name === file?.name),
    );
    if (uniqueFiles?.length <= 1) {
      const updatedFiles = [...uniqueFiles];
      setUploadHindi(updatedFiles);
      setValue("pdfFileInHindi", updatedFiles);
    } else {
      toast.error("You can only upload one file at a time.");
    }
  };

  const handleChangeEnglish = (e: any) => {
    const newFiles = Array.from(e.target.files);
    const uniqueFiles = newFiles.filter(
      (file: any) =>
        !uploadEnglish.some((item: any) => item?.name === file?.name),
    );
    if (uniqueFiles.length <= 1) {
      const updatedFiles = [...uniqueFiles];
      setUploadEnglish(updatedFiles);
      setValue("pdfFileInEnglish", updatedFiles);
    } else {
      toast.error("You can only upload one file at a time.");
    }
  };

  const getAdhiyaachanList = async () => {
    setLoader((prev: any) => ({
      ...prev,
      list: true,
    }));
    const query = `page=&limit=&title=`;
    try {
      const { data, error } = (await CallGetAllNewAdhiyaachanList(query)) as any;
      if (data?.data) {
        setAdhiyaachanList(data?.data?.adhiyaachanData);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        list: false,
      }));
    } catch (error) {
      console.log(error);
      setLoader((prev: any) => ({
        ...prev,
        list: false,
      }));
    }
  };

  const submitAdvertisementRelease = async (dto: any) => {
    setLoader((prev: any) => ({
      ...prev,
      button: true,
    }));
    const formData = new FormData();
    if (uploadHindi?.length > 0) {
      uploadHindi?.forEach((item: any) => {
        formData.append("pdfFileInHindi", item);
      });
    }
    if (uploadEnglish?.length > 0) {
      uploadEnglish?.forEach((item: any) => {
        formData.append("pdfFileInEnglish", item);
      });
    }
    if (dto?.adhiyaachan && Array.isArray(dto?.adhiyaachan)) {
      dto?.adhiyaachan.forEach((item: any) => {
        formData.append("adhiyaachan[]", item);
      });
    }
    formData.append(
      "advertisementReferenceNumber",
      dto?.advertisementReferenceNumber,
    );
    formData.append("releaseDate", dto?.releaseDate);
    formData.append("titleInEnglish", dto?.titleInEnglish);
    formData.append("titleInHindi", dto?.titleInHindi);

    try {
      const { data, error } = (await CallSubmitAdvertisementRelease(
        formData,
      )) as any;

      if (data?.status === "Success") {
        toast.success(data?.message);
        reset({
          titleInHindi: "",
          titleInEnglish: "",
          releaseDate: "",
          advertisementReferenceNumber: "",
          adhiyaachan: "",
        });
        route.push(
          `/admin/adhiyaachan-advertisement/adhiyaachan/advertisement-table`,
        );
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        button: false,
      }));
    } catch (error) {
      console.log(error);
      setLoader((prev: any) => ({
        ...prev,
        button: false,
      }));
    }
  };

  // console.log(watch());

  useEffect(() => {
    getAdhiyaachanList();
  }, []);
  return (
    <div>
      <>
        <h1 className="mb-5 text-xl font-semibold md:text-2xl">
          Advertisement Release
        </h1>

        <FlatCard>
          {loader?.list ? (
            <FormSkeleton inputCount={7} />
          ) : (
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(submitAdvertisementRelease)}
            >
              <div className="flex gap-6">
                <Controller
                  name="adhiyaachanIds"
                  control={control}
                  rules={{ required: "Select Adhiyaachan" }}
                  render={({
                    fieldState: { invalid, error },
                    field: { onChange, value },
                  }) => (
                    <Select
                      selectionMode="multiple"
                      placeholder="Select Adhiyaachan"
                      label="Select Adhiyaachan"
                      labelPlacement="outside"
                      isInvalid={invalid}
                      selectedKeys={value ? [...value] : []}
                      errorMessage={error?.message}
                      onSelectionChange={(e: any) => {
                        onChange([...e]);
                      }}
                      items={adhiyaachanList?.filter(
                        (item: any) => item.status === "Completed",
                      )}
                      radius="sm"
                    >
                      {(option: any) => (
                        <SelectItem key={option?._id}>
                          {option?.title}
                        </SelectItem>
                      )}
                    </Select>
                  )}
                />

                <Controller
                  name="advertisementNumberInEnglish"
                  control={control}
                  rules={{
                    required: "Enter Advertisement reference numbers",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Advertisement reference number English"
                      labelPlacement="outside"
                      placeholder="Enter Advertisement reference number"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />

                <Controller
                  name="advertisementNumberInHindi"
                  control={control}
                  rules={{
                    required: "Enter Advertisement reference numbers Hindi",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Advertisement reference number Hindi"
                      labelPlacement="outside"
                      placeholder="Enter Advertisement reference number"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />
              </div>

              <div className="flex gap-6">
                <Controller
                  name="titleInHindi"
                  control={control}
                  rules={{
                    required: "Enter Title in Hindi",
                    validate: (value) =>
                      /^[\u0900-\u097F\s]+$/.test(value) ||
                      "Please enter text in Hindi only",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Title in Hindi"
                      labelPlacement="outside"
                      placeholder="Enter Title in Hindi"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />

                <Controller
                  name="titleInEnglish"
                  control={control}
                  rules={{
                    required: "Enter Title in English",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Title in English"
                      labelPlacement="outside"
                      placeholder="Enter Title in English"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />
              </div>

              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    value={value}
                    onValueChange={onChange}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    endContent={
                      <span className="material-symbols-rounded">edit</span>
                    }
                  />
                )}
              />

              <CustomMultipleUpload
                {...register("pdfFileInHindi")}
                title="PDF File (Hindi)"
                preview={uploadHindi}
                setPreview={setUploadHindi}
                handleChange={handleChangeHindi}
                setValue={setValue}
                accept={".pdf"}
                name="pdfFileInHindi"
                placeholder="Upload PDF"
                type="single"
              />

              <CustomMultipleUpload
                {...register("pdfFileInEnglish")}
                title="PDF File (English)"
                preview={uploadEnglish}
                setPreview={setUploadEnglish}
                handleChange={handleChangeEnglish}
                setValue={setValue}
                accept={".pdf"}
                name="pdfFileInEnglish"
                placeholder="Upload PDF"
                type="single"
              />

              <div className="flex gap-6">
                <Controller
                  name="age.minDate"
                  control={control}
                  rules={{
                    required: "Enter Helpline Number",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="date"
                      label="Min Age criteria"
                      labelPlacement="outside"
                      placeholder="Enter HelpLine Number"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />
                <Controller
                  name="age.maxDate"
                  control={control}
                  rules={{
                    required: "Enter Helpline Number",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="date"
                      label="Max Age criteria"
                      labelPlacement="outside"
                      placeholder="Enter helpEmail"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />
              </div>

              <div className="flex gap-6">
                <Controller
                  name="helpNumber"
                  control={control}
                  rules={{
                    required: "Enter Helpline Number",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="number"
                      label="Help Line Number"
                      labelPlacement="outside"
                      placeholder="Enter HelpLine Number"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />
                <Controller
                  name="helpNumber"
                  control={control}
                  rules={{
                    required: "Enter Helpline Number",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="email"
                      label="Help Line Email"
                      labelPlacement="outside"
                      placeholder="Enter helpEmail"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />
                <Controller
                  name="contactHours"
                  control={control}
                  rules={{
                    required: "Enter Helpline Number",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      {...field}
                      type="email"
                      label="Contact Hours"
                      labelPlacement="outside"
                      placeholder="Enter contactHours"
                      endContent={
                        <span className="material-symbols-rounded">edit</span>
                      }
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      classNames={{
                        label: "font-medium",
                        inputWrapper: "rounded-small",
                      }}
                    />
                  )}
                />
              </div>

              <Controller
                name="releaseDate"
                control={control}
                rules={{
                  required: "Release Date Required",
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    type="date"
                    label="Release Date"
                    labelPlacement="outside"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    classNames={{
                      label: "font-medium",
                      inputWrapper: "rounded-small",
                    }}
                  />
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  isLoading={loader?.button}
                >
                  Advertisement Release
                </Button>
              </div>
            </form>
          )}
        </FlatCard>
      </>
    </div>
  );
};

export default OfficialAdvertisementRelease;
