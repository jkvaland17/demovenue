"use client";
import {
  CallDownloadDataByBoardPhysicalTest,
  CallDownloadDataByBoardTypingTest,
  CallDownloadTemplate,
  CallDownloadTemplatephysicalEfficiency,
  CallFileCheck,
  CallGetAdvByCourse,
  CallGetAllCourses,
  CallGetPhysicalByAdvertisement,
  CallGetPhysicalByAdvertisementUpload,
  CallPhysicalUploadCandidateExam,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Input } from "@nextui-org/input";
import { Button, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

const UploadCandidateExamData = (props: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { isSubmitting },
  } = useForm();
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allAdvertisements, setAllAdvertisements] = useState<any[]>([]);
  const [allVendors, setAllVendors] = useState<any[]>([]);
  const [advertisementId, setAdvertisementId] = useState<string>("");
  const [vendorId, setVendorId] = useState<string>("");
  const [securityCode, setSecurityCode] = useState<string>("");
  const [upload, setUpload] = useState<any>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAdvLoading, setIsAdvLoading] = useState<boolean>(false);
  const [isVendorLoading, setIsVendorLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<any>({
    courseId: false,
    advertisementId: false,
    workScopeId: false,
    vendorId: false,
  });
  const [loader, setLoader] = useState<boolean>(false);
  const [borderLoader, setBorderLoader] = useState<boolean>(false);
  const [validateUploadFile, setValidateUploadFile] = useState<boolean>(false);

  // const handleChangeST = (e: any) => {
  //   const newFiles = Array.from(e.target.files);
  //   setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
  //   setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  // };

  const getAllCourse = async () => {
    try {
      const { data, error } = (await CallGetAllCourses()) as any;
      console.log("getAllCourse", { data, error });

      if (data) {
        setAllCourses(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCourse();
  }, []);

  const getAllAdvertisements = async (courseId: string) => {
    setIsAdvLoading(true);
    try {
      const query = `parentMasterId=${courseId}`;
      const { data, error } = (await CallGetAdvByCourse(query)) as any;
      console.log("getAllAdvertisements", { data, error });

      if (data) {
        setAllAdvertisements(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsAdvLoading(false);
  };
  const getVendorByAdvId = async (advertisementId: string) => {
    setIsVendorLoading(true);
    try {
      // const query = `advertisementId=${advertisementId}&page=1&limit=10`;
      const query = `advertisementId=${advertisementId}&workScopeId=&search=&status=&page=1&limit=10`;
      // const { data, error } = (await CallGetPhysicalByAdvertisement(query)) as any;
      const { data, error } = (await CallGetPhysicalByAdvertisementUpload(
        query,
      )) as any;
      console.log("getVendorById", data, error);

      if (data) {
        setAllVendors(data?.data);
        // Automatically set the first vendor as default
        if (data?.data && data?.data.length > 0) {
          setVendorId(data?.data[0]?.vendorId?._id || "");
        }
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsVendorLoading(false);
  };

  const uploadCandidateExam = async () => {
    setValidateUploadFile(true);

    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("file", item);
      });
    }
    formData.append("advertisementId", advertisementId);
    formData.append("vendorId", vendorId);
    formData.append("securityCode", securityCode);
    console.log("formData", formData);
    try {
      const { data, error } = (await CallPhysicalUploadCandidateExam(
        formData,
      )) as any;
      console.log("uploadCandidateExam", { data, error });
      if (data?.message) {
        toast?.success(data?.message);
        setSecurityCode("");
        setUpload([]);
        setAllCourses([]);
        setAllAdvertisements([]);
        setAllVendors([]);
        setValidateUploadFile(false);
      }
      if (error) {
        handleCommonErrors(error);
        setValidateUploadFile(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fileCheck = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const formData = new FormData();
    fileArray.forEach((file: File) => {
      formData.append("file", file);
    });
    try {
      const { data, error } = (await CallFileCheck(formData)) as any;
      console.log("fileCheck", { data, error });
      if (data?.analysis?.status === "OCR-based") {
        toast.success(data?.analysis?.status || "File validation successful");
        setUpload(fileArray);
        setValue("file", fileArray);
      } else {
        toast.error(data?.analysis?.status || "File validation failed");
        setUpload([]);
        setValue("file", []);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during file check.");
    }
  };

  const handleChangeST = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    const pdfFiles: File[] = [];
    const excelFiles: File[] = [];
    Array.from(selectedFiles).forEach((file) => {
      if (file.type === "application/pdf") {
        pdfFiles.push(file);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx")
      ) {
        excelFiles.push(file);
      }
    });
    if (pdfFiles.length > 0) {
      fileCheck(pdfFiles);
    }
    if (excelFiles.length > 0) {
      const newUpload = [...upload, ...excelFiles];
      setUpload(newUpload);
      setValue("file", newUpload);
    }
    e.target.value = "";
  };

  const downloadTemplate = async () => {
    try {
      setLoader(true);
      const { data, error } =
        (await CallDownloadTemplatephysicalEfficiency()) as any;
      console.log("CallDownloadTemplatephysicalEfficiency", data, error);
      if (data?.fileUrl) {
        toast.success(data?.message);
        setLoader(false);
        window.open(data?.fileUrl, "_blank");
      } else {
        console.error("Invalid response or missing download URL");
        setLoader(false);
      }
    } catch (err) {
      console.error("Error downloading application:", err);
    }
  };

  const downloadDataByBoard = async () => {
    try {
      setBorderLoader(true);
      // const query = `vendorId=${vendorId}`;
      const payload = {
        vendorId,
        securityCode,
      };
      const { data, error } = (await CallDownloadDataByBoardPhysicalTest(
        payload,
      )) as any;
      console.log("CallDownloadDataByBoardPhysicalTest", data, error);
      if (data?.fileUrl) {
        toast.success(data?.message);
        setBorderLoader(false);
        window.open(data?.fileUrl, "_blank");
      } else {
        toast.error(error);
        console.error("Invalid response or missing download URL");
        setBorderLoader(false);
      }
    } catch (err) {
      console.error("Error downloading application:", err);
    }
  };

  return (
    <FlatCard heading="Upload Candidate Exam Data">
      <div className="mb-4 flex justify-end gap-4">
        <Button
          color="primary"
          variant="flat"
          onPress={downloadTemplate}
          isLoading={loader}
        >
          Download Template
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Select
          items={allCourses ?? []}
          label="Course"
          labelPlacement="outside"
          placeholder="Select"
          isRequired
          isInvalid={showError?.courseId ? true : false}
          errorMessage={"You must select a course."}
          onChange={(e) => {
            getAllAdvertisements(e.target.value);
          }}
        >
          {(item) => <SelectItem key={item?._id}>{item?.name}</SelectItem>}
        </Select>
        <Select
          items={allAdvertisements ?? []}
          label="Select Event/Recruitment"
          labelPlacement="outside"
          placeholder="Select"
          isRequired
          isInvalid={showError?.advertisementId ? true : false}
          errorMessage={"You must select a Event/Recruitment."}
          isLoading={isAdvLoading}
          onChange={(e) => {
            getVendorByAdvId(e.target.value);
            setAdvertisementId(e.target.value);
          }}
        >
          {(item) => (
            <SelectItem key={item?._id}>{item?.titleInEnglish}</SelectItem>
          )}
        </Select>
        <Select
          items={allVendors ?? []}
          label="Vendor"
          labelPlacement="outside"
          placeholder="Select"
          isDisabled={true}
          selectedKeys={vendorId ? [vendorId] : []}
          isLoading={isVendorLoading}
          onChange={(e) => {
            setVendorId(e.target.value);
          }}
        >
          {(item: any) => (
            <SelectItem key={item?.vendorId?._id || "-"}>
              {item?.vendorId?.vendorName || "-"}
            </SelectItem>
          )}
        </Select>
        <Input
          label="Security Code"
          autoComplete="new-password"
          value={securityCode}
          labelPlacement="outside"
          placeholder="Enter security code"
          onChange={(e) => {
            setSecurityCode(e.target.value);
          }}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={() => {
                setIsVisible(!isVisible);
              }}
            >
              {isVisible ? (
                <span className="material-symbols-rounded align-middle">
                  visibility_off
                </span>
              ) : (
                <span className="material-symbols-rounded align-middle">
                  visibility
                </span>
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          isRequired
        />
        <Button
          color="primary"
          variant="flat"
          onPress={downloadDataByBoard}
          isDisabled={!vendorId || !securityCode}
          isLoading={borderLoader}
        >
          Download Provided Data By Board
        </Button>
        <div className="col-span-2">
          <CustomMultipleUpload
            {...register("file")}
            title="Data file"
            preview={upload}
            setPreview={setUpload}
            handleChange={handleChangeST}
            setValue={setValue}
            accept={".pdf,.xlsx"}
            name="Attachments"
            placeholder="Upload PDF / Excel"
            type="multiple"
            disabled={!advertisementId || !vendorId || !securityCode}
          />
        </div>

        <div className="col-span-2">
          <Button
            onPress={uploadCandidateExam}
            isLoading={validateUploadFile}
            color="primary"
            variant="shadow"
            className="w-fit px-8"
          >
            Validate and Upload File
          </Button>
        </div>
      </div>
    </FlatCard>
  );
};

export default UploadCandidateExamData;
