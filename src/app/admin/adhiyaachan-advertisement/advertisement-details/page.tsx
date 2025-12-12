"use client";
import {
  CallCreateAdvertisementRelease,
  CallGetAdvertisementById,
  CallGetAllAdvertisement,
  CallGetAllNewAdhiyaachanList,
  CallUpdateNewAdvertisement,
} from "@/_ServerActions";
import UseMasterByCodeSelect from "@/components/Adhiyaachan/UseMasterByCodeSelect";
import AgeRelaxationData from "@/components/Advertisement/AgeRelaxationData";
import ImportantDates from "@/components/Advertisement/ImportantDates";
import CustomMultipleUpload from "@/components/CustomMultipleUpload";
import FormSkeleton from "@/components/kushal-components/loader/FormSkeleton";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GeneralInfo from "@/components/Advertisement/GeneralInfo";
import { useRouter, useSearchParams } from "next/navigation";
import ApplicationFees from "@/components/Advertisement/ApplicationFees";
import moment from "moment";
import { AdvertisementFormData } from "@/Utils/Advertisement/types";

const AdvertisementDetails = () => {
  const formMethods = useForm<AdvertisementFormData>();
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = formMethods;

  const [uploadHindi, setUploadHindi] = useState<any>([]);
  const [uploadEnglish, setUploadEnglish] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    update: false,
    form: false,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;

  const onSubmit = (data: AdvertisementFormData) => {
    if (id) {
      AdvertisementUpdate(data);
    } else {
      sendAdvertisementDetails(data);
    }
  };

  const sendAdvertisementDetails = async (dto: AdvertisementFormData) => {
    setLoader((prev: any) => ({
      ...prev,
      update: true,
    }));

    try {
      const formData = new FormData();
      formData.append("course", dto?.course || "");
      formData.append("startDate", dto?.startDate || "");
      formData.append("endDate", dto?.endDate || "");
      formData.append("helpNumber", dto?.helpNumber || "");
      formData.append(
        "advertisementNumberInEnglish",
        dto?.advertisementNumberInEnglish || "",
      );
      formData.append(
        "advertisementNumberInHindi",
        dto?.advertisementNumberInHindi || "",
      );
      formData.append("titleInEnglish", dto?.titleInEnglish || "");
      formData.append("titleInHindi", dto?.titleInHindi || "");
      formData.append("description", dto?.description || "");
      formData.append("helpEmail", dto?.helpEmail || "");
      formData.append("contactHours", dto?.contactHours || "");
      formData.append("releaseDate", dto?.releaseDate || "");
      formData.append(
        "documentVerificationStartDate",
        dto?.documentVerificationStartDate || "",
      );
      formData.append(
        "documentVerificationEndDate",
        dto?.documentVerificationEndDate || "",
      );
      if (dto?.newAdhiyaachanIds && dto?.newAdhiyaachanIds.length > 0) {
        formData.append(
          "newAdhiyaachanIds",
          JSON.stringify(dto?.newAdhiyaachanIds),
        );
      }
      if (dto?.mainInformation) {
        formData.append(
          "mainInformation",
          JSON.stringify(dto?.mainInformation),
        );
      }
      if (dto?.importantDates) {
        formData.append("importantDates", JSON.stringify(dto?.importantDates));
      }
      if (dto?.applicationFees) {
        formData.append(
          "applicationFees",
          JSON.stringify(dto?.applicationFees),
        );
      }
      if (dto?.ageRelaxation && dto?.ageRelaxation.length > 0) {
        formData.append("ageRelaxation", JSON.stringify(dto?.ageRelaxation));
      }
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
      const { data, error } = (await CallCreateAdvertisementRelease(
        formData,
      )) as any;
      if (data) {
        toast.success(data?.message);
        reset();
        router.push(`/admin/adhiyaachan-advertisement/advertisement-table`);
        setUploadHindi([]);
        setUploadEnglish([]);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error submitting advertisement details:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setLoader((prev: any) => ({
        ...prev,
        update: false,
      }));
    }
  };

  const validateHindi = (value: string | undefined) => {
    if (!value) return true;
    const hindiRegex = /^[\u0900-\u097F\s]+$/;
    return hindiRegex.test(value) || "Please Enter Hindi Text Only";
  };

  const handleChangeHindi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const uniqueFiles = newFiles.filter(
      (file) => !uploadHindi.some((item: File) => item?.name === file?.name),
    ) as File[];
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
      setValue("pdfFileInEnglish", updatedFiles as File[]);
    } else {
      toast.error("You can only upload one file at a time.");
    }
  };

  const AdvertisementGetById = async (id: any) => {
    setLoader(true);
    try {
      const { data, error } = (await CallGetAdvertisementById(id)) as any;
      console.log("AdvertisementGetById data", data);
      if (data?.data) {
        setValue("course", data?.data?.course || "");
        setValue("newAdhiyaachanIds", data?.data?.newAdhiyaachanIds || []);
        setValue(
          "advertisementNumberInEnglish",
          data?.data?.advertisementNumberInEnglish || "",
        );
        setValue(
          "advertisementNumberInHindi",
          data?.data?.advertisementNumberInHindi || "",
        );
        setValue(
          "documentVerificationStartDate",
          moment(data?.data?.documentVerificationStartDate).format(
            "YYYY-MM-DD",
          ) || "",
        );
        setValue(
          "documentVerificationEndDate",
          moment(data?.data?.documentVerificationEndDate).format(
            "YYYY-MM-DD",
          ) || "",
        );
        setValue("titleInHindi", data?.data?.titleInHindi || "");
        setValue("titleInEnglish", data?.data?.titleInEnglish || "");
        setValue(
          "startDate",
          moment(data?.data?.startDate).format("YYYY-MM-DD") || "",
        );
        setValue(
          "endDate",
          moment(data?.data?.endDate).format("YYYY-MM-DD") || "",
        );
        setValue("description", data?.data?.description || "");
        setValue("helpNumber", data?.data?.helpNumber || "");
        setValue("helpEmail", data?.data?.helpEmail || "");
        setValue("contactHours", data?.data?.contactHours || "");
        setValue(
          "releaseDate",
          moment(data?.data?.releaseDate).format("YYYY-MM-DD") || "",
        );
        if (data?.data?.mainInformation) {
          setValue(
            "mainInformation.shortSummary",
            data?.data?.mainInformation?.shortSummary || "",
          );
          setValue(
            "mainInformation.shortSummaryInHindi",
            data?.data?.mainInformation?.shortSummaryInHindi || "",
          );
          setValue(
            "mainInformation.extraNotes",
            data?.data?.mainInformation?.extraNotes || "",
          );
          setValue(
            "mainInformation.extraNotesInHindi",
            data?.data?.mainInformation?.extraNotesInHindi || "",
          );
        }
        if (data?.data?.importantDates) {
          setValue(
            "importantDates.examDate",
            data?.data?.importantDates?.examDate || "",
          );
          setValue(
            "importantDates.registrationStartDate",
            data?.data?.importantDates?.registrationStartDate || "",
          );
          setValue(
            "importantDates.registrationEndDate",
            data?.data?.importantDates?.registrationEndDate || "",
          );
          setValue(
            "importantDates.lastDateForSubmissionOfApplicationFee",
            data?.data?.importantDates?.lastDateForSubmissionOfApplicationFee ||
              "",
          );
          setValue(
            "importantDates.lastDateForSubmissionOfApplicationForm",
            data?.data?.importantDates
              ?.lastDateForSubmissionOfApplicationForm || "",
          );
          setValue(
            "importantDates.extraNotes",
            data?.data?.importantDates?.extraNotes || "",
          );
          setValue(
            "importantDates.extraNotesInHindi",
            data?.data?.importantDates?.extraNotesInHindi || "",
          );
          setValue(
            "importantDates.writtenExamImportantDates",
            data?.data?.importantDates?.writtenExamImportantDates || "",
          );
          setValue(
            "importantDates.documentVerificationImportantDates",
            data?.data?.importantDates?.documentVerificationImportantDates || "",
          );
          setValue(
            "importantDates.physicalEfficiencyTestImportantDates",
            data?.data?.importantDates?.physicalEfficiencyTestImportantDates || "",
          );
          setValue(
            "importantDates.typingTestImportantDates",
            data?.data?.importantDates?.typingTestImportantDates || "",
          );
          setValue(
            "importantDates.admitCardReleaseDate",
            data?.data?.importantDates?.admitCardReleaseDate || "",
          );
        }
        setValue("applicationFees", data?.data?.applicationFees || []);
        setValue("ageRelaxation", data?.data?.ageRelaxation || []);
        const hindiFiles = buildFileArray(data.data.pdfFileInHindi) as any;
        const englishFiles = buildFileArray(data.data.pdfFileInEnglish) as any;
        if (hindiFiles || englishFiles) {
          const hindifiles = hindiFiles.map((attachment: any) => ({
            name: attachment.fileName,
            url: attachment.file,
          }));
          const englishfiles = englishFiles.map((attachment: any) => ({
            name: attachment.fileName,
            url: attachment.file,
          }));
          setUploadHindi(hindifiles);
          setValue("pdfFileInHindi", hindifiles);
          setUploadEnglish(englishfiles);
          setValue("pdfFileInEnglish", englishfiles);
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

  const AdvertisementUpdate = async (dto: AdvertisementFormData) => {
    setLoader((prev: any) => ({
      ...prev,
      update: true,
    }));
    const formData = new FormData();
    if (id) {
      formData.append("id", id);
    }
    formData.append("course", dto?.course || "");
    formData.append("startDate", dto?.startDate || "");
    formData.append("endDate", dto?.endDate || "");
    formData.append("helpNumber", dto?.helpNumber || "");
    formData.append(
      "advertisementNumberInEnglish",
      dto?.advertisementNumberInEnglish || "",
    );
    formData.append(
      "advertisementNumberInHindi",
      dto?.advertisementNumberInHindi || "",
    );
    formData.append("titleInEnglish", dto?.titleInEnglish || "");
    formData.append("titleInHindi", dto?.titleInHindi || "");
    formData.append("description", dto?.description || "");
    formData.append("helpEmail", dto?.helpEmail || "");
    formData.append("contactHours", dto?.contactHours || "");
    formData.append("releaseDate", dto?.releaseDate || "");
    formData.append(
      "documentVerificationStartDate",
      dto?.documentVerificationStartDate || "",
    );
    formData.append(
      "documentVerificationEndDate",
      dto?.documentVerificationEndDate || "",
    );
    if (dto?.newAdhiyaachanIds && dto?.newAdhiyaachanIds.length > 0) {
      formData.append(
        "newAdhiyaachanIds",
        JSON.stringify(dto?.newAdhiyaachanIds),
      );
    }
    if (dto?.mainInformation) {
      formData.append("mainInformation", JSON.stringify(dto?.mainInformation));
    }
    if (dto?.importantDates) {
      formData.append("importantDates", JSON.stringify(dto?.importantDates));
    }
    if (dto?.applicationFees) {
      formData.append("applicationFees", JSON.stringify(dto?.applicationFees));
    }
    if (dto?.ageRelaxation && dto?.ageRelaxation.length > 0) {
      formData.append("ageRelaxation", JSON.stringify(dto?.ageRelaxation));
    }
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
    try {
      const { data, error } = (await CallUpdateNewAdvertisement(
        formData,
      )) as any;
      if (data) {
        toast.success(data?.message);
        reset();
        router.push(`/admin/adhiyaachan-advertisement/advertisement-table`);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader((prev: any) => ({
        ...prev,
        update: false,
      }));
    }
  };

  const buildFileArray = (url?: string | string[] | null) => {
    if (!url) return [];
    const toObj = (u: string) => {
      const raw = u?.split("/").pop()!;
      const fileName = raw?.includes("_") ? raw?.split("_").slice(-1)[0] : raw;
      return { fileName, file: u };
    };
    return Array.isArray(url) ? url.map(toObj) : [toObj(url)];
  };

  useEffect(() => {
    AdvertisementGetById(id);
  }, [id]);
  // console.log("formData", watch());

  return (
    <>
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white px-4 py-6 md:px-8 md:py-10">
        <div className="flex justify-between">
          <h1 className="mb-5 text-2xl font-semibold">
            {id ? "Update Advertisement" : "Advertisement Submission"}
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
        {/* <h1 className="text-xl font-semibold md:text-3xl">
          Content/Details of Advertisement
        </h1>
        <p className="md:text-md my-3 text-sm text-slate-500 md:my-5">
          Clearly fill the form below. Fields marked with * are mandatory to
          fill:
        </p>
        <p className="md:text-md text-sm text-slate-500">
          नीचे दिए गए फॉर्म को स्पष्ट रूप से भरें, * से चिह्नित फ़ील्ड भरना
          अनिवार्य है:
        </p> */}

        {loader.form ? (
          <FormSkeleton inputCount={10} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
              <Accordion
                selectionMode="multiple"
                defaultExpandedKeys={["1", "2", "3", "4", "5"]}
                className="col-span-3 px-0"
              >
                <AccordionItem
                  key="1"
                  aria-label="General Information"
                  title={
                    <p className="font-semibold md:text-xl">
                      General Information
                    </p>
                  }
                >
                  <GeneralInfo
                    formMethods={formMethods}
                    uploadHindi={uploadHindi}
                    setUploadHindi={setUploadHindi}
                    setUploadEnglish={setUploadEnglish}
                    uploadEnglish={uploadEnglish}
                    handleChangeEnglish={handleChangeEnglish}
                    handleChangeHindi={handleChangeHindi}
                  />
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="Main Information प्रमुख जानकारी"
                  title={
                    <p className="font-semibold md:text-xl">
                      Main Information प्रमुख जानकारी
                    </p>
                  }
                >
                  <div className="grid w-full grid-cols-2 gap-6 py-8">
                    <Controller
                      name="mainInformation.shortSummary"
                      control={control}
                      rules={{
                        required: "Enter a short summary",
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="Short summary"
                          labelPlacement="outside"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.shortSummaryInHindi"
                      control={control}
                      rules={{
                        required: "संक्षिप्त सारांश दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="संक्षिप्त सारांश"
                          labelPlacement="outside"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.extraNotes"
                      control={control}
                      rules={{
                        required: "Enter extra notes",
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="Extra notes"
                          labelPlacement="outside"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />

                    <Controller
                      name="mainInformation.extraNotesInHindi"
                      control={control}
                      rules={{
                        required: "अतिरिक्त टिप्पणियाँ दर्ज करें",
                        validate: validateHindi,
                      }}
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Textarea
                          {...field}
                          label="अतिरिक्त टिप्पणियाँ"
                          labelPlacement="outside"
                          placeholder=" "
                          endContent={
                            <span className="material-symbols-rounded text-slate-400">
                              edit
                            </span>
                          }
                          classNames={{
                            label: "font-medium",
                            inputWrapper: "rounded-small",
                          }}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                  </div>
                </AccordionItem>
                <AccordionItem
                  key="3"
                  aria-label="Important Dates"
                  title={
                    <p className="font-semibold md:text-xl">Important Dates</p>
                  }
                >
                  <ImportantDates
                    formMethods={formMethods}
                    validateHindi={validateHindi}
                  />
                </AccordionItem>
                <AccordionItem
                  key="4"
                  aria-label="Exam Fees Category-wise"
                  title={
                    <p className="font-semibold md:text-xl">
                      Exam Fees Category-wise
                    </p>
                  }
                >
                  <ApplicationFees formMethods={formMethods} />
                </AccordionItem>
                {/* <AccordionItem
                  key="5"
                  aria-label="Age Relaxation Category-wise"
                  title={
                    <p className="font-semibold md:text-xl">
                      Age Relaxation Category-wise
                    </p>
                  }
                >
                  <AgeRelaxationData formMethods={formMethods} />
                </AccordionItem> */}
              </Accordion>
            </div>
            <div className="full-width">
              <Button
                type="submit"
                className="mt-8 w-full bg-blue-500 text-white"
                isLoading={loader?.update}
              >
                {id ? "Update" : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default AdvertisementDetails;
