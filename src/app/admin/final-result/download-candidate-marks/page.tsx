"use client";
import {
  CallFinalResultDownloadCandidateMarks,
  CallGetAdvByCourse,
  CallGetAllCourses,
  CallGetFinalByAdvertisement,
  CallGetFinalResultWorkScopeByVendorId,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Button, Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const DownloadCandidateMarks = (props: Props) => {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allAdvertisements, setAllAdvertisements] = useState<any[]>([]);
  const [allVendors, setAllVendors] = useState<any[]>([]);
  const [vendorId, setVendorId] = useState<string>("");
  const [workScopeId, setWorkScopeId] = useState<string>("");
  const [securityCode, setSecurityCode] = useState<string>("");
  const [isAdvLoading, setIsAdvLoading] = useState<boolean>(false);
  const [isVendorLoading, setIsVendorLoading] = useState<boolean>(false);
  const [isWorkScopeLoading, setIsWorkScopeLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [allWorkScope, setAllWorkScope] = useState<any[]>([]);
  const [showError, setShowError] = useState<any>({
    courseId: false,
    advertisementId: false,
    workScopeId: false,
    vendorId: false,
  });

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
      const { data, error } = (await CallGetFinalByAdvertisement(query)) as any;
      console.log("getVendorById", data, error);

      if (data) {
        setAllVendors(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsVendorLoading(false);
  };

  const getAllWorkScope = async (verdorId: string) => {
    setIsWorkScopeLoading(true);
    try {
      const query = `vendorId=${verdorId}`;
      const { data, error } = (await CallGetFinalResultWorkScopeByVendorId(
        query,
      )) as any;
      console.log("getAllWorkScope", { data, error });

      if (data) {
        setAllWorkScope(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsWorkScopeLoading(false);
  };

  const downloadExcel = (fileUrl: string, fileName: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName || "downloaded_file.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMultipleExcel = (files: { file: string; _id: string }[]) => {
    files.forEach((fileObj, index) => {
      const fileName =
        fileObj.file.split("/").pop() || `file_${fileObj._id}.xlsx`;
      setTimeout(() => {
        downloadExcel(fileObj.file, fileName);
      }, index * 1000);
    });
  };

  const downloadExamMarks = async () => {
    try {
      const submitData = {
        vendorId,
        workScopeId,
        securityCode,
      };
      console.log("submitData", submitData);
      const { data, error } = (await CallFinalResultDownloadCandidateMarks(
        submitData,
      )) as any;
      console.log("data", data);

      if (data?.data?.length > 0) {
        downloadMultipleExcel(data.data);
      } else {
        console.log("No files available for download");
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FlatCard heading="Download Candidate Marks">
      <div className="grid grid-cols-2 flex-col gap-5 mob:flex">
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
          isLoading={isVendorLoading}
          onChange={(e) => {
            getAllWorkScope(e.target.value);
            setVendorId(e.target.value);
          }}
        >
          {(item: any) => (
            <SelectItem key={item?.vendorId?._id || "-"}>
              {item?.vendorId?.vendorName || "-"}
            </SelectItem>
          )}
        </Select>
        <Select
          items={allWorkScope ?? []}
          label="Work Scope"
          labelPlacement="outside"
          placeholder="Select"
          isRequired
          errorMessage={"You must select a work scope."}
          isLoading={isWorkScopeLoading}
          onChange={(e) => {
            setWorkScopeId(e.target.value);
          }}
        >
          {(item) => (
            <SelectItem key={item?._id}>{item?.workScopeTitle}</SelectItem>
          )}
        </Select>
        <Input
          label="Security Code"
          autoComplete="new-password"
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
        <div className="col-span-2 flex justify-end">
          <Button
            onPress={downloadExamMarks}
            color="primary"
            variant="shadow"
            className="w-fit px-8 mob:w-full"
            startContent={
              <span className="material-symbols-rounded">download</span>
            }
          >
            Download
          </Button>
        </div>
      </div>
    </FlatCard>
  );
};

export default DownloadCandidateMarks;
