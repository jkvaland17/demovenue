"use client";
import {
  CallCreateAdhiyaachan,
  CallGetAdhiyaachanDataById,
  CallUpdateNewAdhiyaachan,
} from "@/_ServerActions";
import PostData from "@/components/Adhiyaachan/PostData";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import {
  AdhiyaanchanFormValues,
  ExistingFile,
} from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import AgeRelaxationData from "@/components/Adhiyaachan/AgeRelaxationData";

const postDetails = [
  { category: "General", key: "general" },
  { category: "OBC", key: "obc" },
  { category: "SC", key: "sc" },
  { category: "ST", key: "st" },
  { category: "EWS", key: "ews" },
];

const AdhiyaanchanSubmission = () => {
  const router = useRouter();
  const formMethods = useForm<AdhiyaanchanFormValues>();
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = formMethods;
  const [upload, setUpload] = useState<(File | ExistingFile)[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;

  const handleChangeST = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setUpload((prevFiles) => [...prevFiles, ...newFiles]);
    setValue("file", [...upload, ...newFiles]);
  };

  const onSubmit = (data: AdhiyaanchanFormValues) => {
    submitAdhiyaachan(data);
  };

  const submitAdhiyaachan = async (dto: AdhiyaanchanFormValues) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("title", dto?.title || "");
    formData.append("referenceNumber", dto?.referenceNumber || "");
    formData.append("dateOfReceived", dto?.dateOfReceived || "");
    formData.append("description", dto?.description || "");
    formData.append("type", dto?.type || "");
    formData.append("payScale", dto?.payScale || "");
    formData.append(
      "appointingAuthorityName",
      dto?.appointingAuthorityName || "",
    );
    formData.append("serviceCategory", dto?.serviceCategory || "");
    formData.append("onlyInterview", String(dto?.onlyInterview || false));
    formData.append("onlyWrittenExam", String(dto?.onlyWrittenExam || false));
    formData.append(
      "writtenExamAndInterview",
      String(dto?.writtenExamAndInterview || false),
    );
    formData.append("pst", String(dto?.pst || false));
    formData.append("typingTest", String(dto?.typingTest || false));
    formData.append("pensionable", String(dto?.pensionable || false));
    formData.append("probationPeriod", dto?.probationPeriod || "");
    if (dto?.postData && dto?.postData?.length > 0) {
      formData.append("postData", JSON.stringify(dto?.postData));
    }
    if (upload?.length > 0) {
      upload.forEach((item: any) => {
        formData.append("attachment", item);
      });
    }
    try {
      const { data, error } = (await CallCreateAdhiyaachan(formData)) as any;
      if (data) {
        toast.success(data?.message);
        reset();
        router.push(`/admin/adhiyaachan-advertisement/adhiyaachan-table`);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const AdhiyaachanGetById = async (id: any) => {
    setLoader(true);
    try {
      const { data, error } = (await CallGetAdhiyaachanDataById(id)) as any;
      if (data?.data) {
        setValue("title", data?.data?.title || "");
        setValue("referenceNumber", data?.data?.referenceNumber || "");
        setValue(
          "dateOfReceived",
          data?.data?.dateOfReceived?.split("T")[0] || "",
        );
        setValue("description", data?.data?.description || "");
        setValue("type", data?.data?.type || "");
        setValue("payScale", data?.data?.payScale || "");
        setValue(
          "appointingAuthorityName",
          data?.data?.appointingAuthorityName || "",
        );
        setValue("serviceCategory", data?.data?.serviceCategory || "");
        setValue("onlyInterview", data?.data?.onlyInterview || false);
        setValue("onlyWrittenExam", data?.data?.onlyWrittenExam || false);
        setValue(
          "writtenExamAndInterview",
          data?.data?.writtenExamAndInterview || false,
        );
        setValue("pst", data?.data?.pst || false);
        setValue("typingTest", data?.data?.typingTest || false);
        setValue("pensionable", data?.data?.pensionable || false);
        setValue("probationPeriod", data?.data?.probationPeriod || "");
        if (data?.data?.postData && data?.data?.postData?.length > 0) {
          const transformedPostData = data.data.postData.map((post: any) => {
            if (post.sports && Array.isArray(post.sports)) {
              const newSports = post.sports.map((sport: any) => ({
                ...sport,
                sportIds:
                  typeof sport.sportIds === "object" && sport.sportIds?._id
                    ? sport.sportIds._id
                    : sport.sportIds,
                subsport:
                  typeof sport.subsport === "object" && sport.subsport?._id
                    ? sport.subsport._id
                    : sport.subsport,
                position:
                  typeof sport.position === "object" && sport.position?._id
                    ? sport.position._id
                    : sport.position,
              }));
              return { ...post, sports: newSports };
            }
            return post;
          });
          setValue("postData", transformedPostData);
        }
        if (data?.data?.attachments && data?.data?.attachments?.length > 0) {
          const files = data?.data?.attachments.map((attachment: any) => ({
            name: attachment.fileName,
            url: attachment.file,
          }));
          setUpload(files);
          setValue("file", files);
        }
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const onSubmitUpdate = (data: AdhiyaanchanFormValues) => {
    AdhiyaachanUpdate(data);
  };

  const AdhiyaachanUpdate = async (dto: AdhiyaanchanFormValues) => {
    setLoader(true);
    const formData = new FormData();
    if (id) {
      formData.append("id", id);
    }
    formData.append("title", dto?.title || "");
    formData.append("referenceNumber", dto?.referenceNumber || "");
    formData.append("dateOfReceived", dto?.dateOfReceived || "");
    formData.append("description", dto?.description || "");
    formData.append("type", dto?.type || "");
    formData.append("payScale", dto?.payScale || "");
    formData.append(
      "appointingAuthorityName",
      dto?.appointingAuthorityName || "",
    );
    formData.append("serviceCategory", dto?.serviceCategory || "");
    formData.append("onlyInterview", String(dto?.onlyInterview || false));
    formData.append("onlyWrittenExam", String(dto?.onlyWrittenExam || false));
    formData.append(
      "writtenExamAndInterview",
      String(dto?.writtenExamAndInterview || false),
    );
    formData.append("pst", String(dto?.pst || false));
    formData.append("typingTest", String(dto?.typingTest || false));
    formData.append("pensionable", String(dto?.pensionable || false));
    formData.append("probationPeriod", dto?.probationPeriod || "");
    if (dto?.postData && dto?.postData?.length > 0) {
      const transformedPostData = dto.postData.map((post: any) => {
        if (post.sports && Array.isArray(post.sports)) {
          const newSports = post.sports.map((sport: any) => ({
            ...sport,
            sportIds:
              typeof sport.sportIds === "object" && sport.sportIds?._id
                ? sport.sportIds._id
                : sport.sportIds,
            subsport:
              typeof sport.subsport === "object" && sport.subsport?._id
                ? sport.subsport._id
                : sport.subsport,
            position:
              typeof sport.position === "object" && sport.position?._id
                ? sport.position._id
                : sport.position,
          }));
          return { ...post, sports: newSports };
        }
        return post;
      });
      formData.append("postData", JSON.stringify(transformedPostData));
    }
    if (upload?.length > 0) {
      upload.forEach((item: any) => {
        if (item instanceof File) {
          formData.append("attachment", item);
        } else if (typeof item === "object" && item !== null && "url" in item) {
          console.log("Skipping existing file:", item.url);
        }
      });
    }

    try {
      const { data, error } = (await CallUpdateNewAdhiyaachan(formData)) as any;
      if (data) {
        toast.success(data?.message);
        reset();
        router.push(`/admin/adhiyaachan-advertisement/adhiyaachan-table`);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    AdhiyaachanGetById(id);
  }, [id]);

  const test = watch();
  console.log(test);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="mb-5 text-2xl font-semibold">
          {id ? "Update Adhiyaachan" : "Adhiyaachan Submission"}
        </h1>
        <Button
          radius="full"
          className="mb-4 font-medium"
          onPress={() => {
            router.back();
          }}
          startContent={
            <span className="material-symbols-rounded">arrow_back</span>
          }
        >
          Go Back
        </Button>
      </div>
      <FlatCard>
        <form
          className="flex flex-col gap-6 p-3 mob:p-0"
          onSubmit={handleSubmit(id ? onSubmitUpdate : onSubmit)}
        >
          <div className="flex gap-4">
            <Controller
              name="title"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Enter Title",
                },
              }}
              render={({
                fieldState: { invalid, error },
                field: { onChange, value },
              }) => (
                <Input
                  type="text"
                  label="Title. शीर्षक"
                  labelPlacement="outside"
                  placeholder="Enter title"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name="referenceNumber"
              control={control}
              rules={{
                required: "Reference Number is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Input
                  type="text"
                  label="Reference number. संदर्भ संख्या"
                  labelPlacement="outside"
                  placeholder="Enter reference number"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name="dateOfReceived"
              control={control}
              rules={{
                required: "Received date is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Input
                  type="date"
                  label="Date of received. प्राप्त होने की तिथि"
                  labelPlacement="outside"
                  placeholder="Enter date"
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </div>

          <div className="flex gap-4">
            <Controller
              name="type"
              control={control}
              render={({
                fieldState: { invalid, error },
                field: { onChange, value },
              }) => (
                <Input
                  type="text"
                  label="Type of Recruitment. भर्ती का प्रकार"
                  labelPlacement="outside"
                  placeholder="Enter type of recruitment"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name="appointingAuthorityName"
              control={control}
              rules={{
                required: "Appointing Authority Name is required",
              }}
              render={({
                field: { onChange, value },
                fieldState: { error, invalid },
              }) => (
                <Input
                  type="text"
                  label="Appointing Authority Name. नियुक्ति प्राधिकरण का नाम"
                  labelPlacement="outside"
                  placeholder="Enter appointing authority name"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </div>

          <div className="flex gap-4">
            <Controller
              name="serviceCategory"
              control={control}
              render={({
                fieldState: { invalid, error },
                field: { onChange, value },
              }) => (
                <Input
                  type="text"
                  label="Service Category. सेवा श्रेणी"
                  labelPlacement="outside"
                  placeholder="Enter service category"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              name="probationPeriod"
              control={control}
              render={({
                fieldState: { invalid, error },
                field: { onChange, value },
              }) => (
                <Input
                  type="text"
                  label="Probation Period. परीक्षण अवधि"
                  labelPlacement="outside"
                  placeholder="Enter probation period"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                  value={value}
                  onValueChange={onChange}
                  isInvalid={invalid}
                  errorMessage={error?.message}
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

          <PostData formMethods={formMethods} />
          <div>
            <CustomMultipleUpload
              {...register("file")}
              title="Attachments. अनुलग्नक"
              preview={upload}
              setPreview={setUpload}
              handleChange={handleChangeST}
              setValue={setValue}
              accept=".pdf"
              name="Attachments"
              placeholder="Upload PDF"
            />
          </div>

          <Button
            variant="solid"
            color="primary"
            type="submit"
            isLoading={loader}
          >
            {id ? "Update" : "Submit"}
          </Button>
        </form>
      </FlatCard>
    </div>
  );
};

export default AdhiyaanchanSubmission;
