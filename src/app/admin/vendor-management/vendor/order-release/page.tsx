"use client";
import {
  CallFindMasterByCode,
  CallGetAllWorkScope,
  CallGetVendorByWorkScope,
  CallGetWorkScopeByAdvId,
  CallUserFindAllAdvertisement,
  CallVendorWorkOrderReleased,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Button, Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const OrderRelease = (props: Props) => {
  const [loader, setLoader] = useState<string>("");
  const [MOUList, setMOUList] = useState<any[]>([]);
  console.log("MOUList::: ", MOUList);
  const [workScopeList, setWorkScopeList] = useState<any[]>([]);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    advertisementId: "",
    vendorId: "",
    workScopeId: "",
    mouId: "",
    dateOfWorkReleased: "",
    uploadWorkOrder: "",
  });
  const [courseId, setCourseId] = useState<string>("");
  const [courseList, setCourseList] = useState<any[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);

  useEffect(() => {
    getCourseListData("showSkeleton");
  }, []);

  const getMOUListData = async (loaderType: string, vendorId: string) => {
    try {
      setLoader(loaderType);
      const vendorData = [...vendorList];
      const mouList = vendorData?.filter((item: any) => item?._id === vendorId);
      if (mouList?.length && mouList[0]?.vendorAgreements?.length) {
        setMOUList(mouList[0]?.vendorAgreements);
      } else {
        setMOUList([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };
  const getWorkScopeListData = async (loaderType: string, id: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallGetWorkScopeByAdvId(
        `advertisementId=${id}`,
      )) as any;
      if (data.statusCode === 200) {
        setWorkScopeList(data?.data);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };
  const getVendorByWorkScopeList = async (
    loaderType: string,
    workScopeId: string,
  ) => {
    setLoader(loaderType);
    try {
      let params = `workScopeId=${workScopeId}`;
      const { data, error } = (await CallGetVendorByWorkScope(params)) as any;
      console.log("CallGetVendorByWorkScope", data, error);

      if (data.statusCode === 200) {
        setVendorList(data?.data?.records);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  function transformToFormData(originalData: any) {
    const formData = new FormData();

    formData.append("vendorId", originalData?.vendorId);
    formData.append("mouId", originalData.mouId);
    formData.append("dateOfWorkReleased", originalData.dateOfWorkReleased);
    formData.append("uploadWorkOrder", originalData.uploadWorkOrder);
    formData.append("advertisementId", originalData.advertisementId);
    return formData;
  }
  const handleSubmitAgreement = async (
    event: any,
    loaderType: string,
    vendorData: any,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      const formData = transformToFormData(vendorData);
      const { data, error } = (await CallVendorWorkOrderReleased(
        formData,
      )) as any;
      console.log("CallSaveVendorDetail", data, error);

      if (data?.statusCode === 200) {
        toast.success(data.message);
        resetFormFields();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleCreateEligibility:", error);
    } finally {
      setLoader("");
    }
  };
  const resetFormFields = () => {
    setFormData({
      workScopeId: "",
      vendorId: "",
      mouId: "",
      dateOfWorkReleased: "",
      uploadWorkOrder: "",
    });
  };

  const getCourseListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallFindMasterByCode()) as any;
      console.log("CallFindMasterByCode", data, error);

      if (data.message === "Success") {
        setCourseList(data?.data);
        if (data?.data?.length) {
          getEventListData("showSkeleton", data?.data[0]?._id);
          setCourseId(data?.data[0]?._id);
        }
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const getEventListData = async (loaderType: string, courseId: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallUserFindAllAdvertisement(
        `parentMasterId=${courseId}`,
      )) as any;
      console.log("CallUserFindAllAdvertisement", data, error);

      if (data?.message === "Success") {
        setEventList(data?.data);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };
  return (
    <FlatCard heading="Work Order Release">
      <form
        onSubmit={(event) => {
          handleSubmitAgreement(event, "submitForm", formData);
        }}
        className="mb-5 grid grid-cols-2 gap-4 mob:flex flex-col"
      >
        <div className="">
          <Select
            label="Select Course"
            labelPlacement="outside"
            placeholder="Select"
            items={courseList}
            selectedKeys={[courseId]}
            isRequired
            required
            onSelectionChange={(e: any) => {
              const value = Array.from(e)[0] as string;
              setCourseId(value);
              getEventListData("workScope", value);
              setWorkScopeList([]);
              setVendorList([]);
            }}
          >
            {(item) => (
              <SelectItem key={item?._id} className="capitalize">
                {item?.name}
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="">
          <Select
            label="Select Event/Recruitment"
            labelPlacement="outside"
            placeholder="Select"
            isLoading={loader === "workScope"}
            isDisabled={loader === "workScope"}
            items={eventList}
            isRequired
            required
            selectedKeys={[formData?.advertisementId]}
            onSelectionChange={(e: any) => {
              const value = Array.from(e)[0] as string;
              setFormData({
                ...formData,
                advertisementId: value,
              });

              getWorkScopeListData("showSkeleton", value);
            }}
          >
            {(item) => (
              <SelectItem key={item?._id} className="capitalize">
                {`${item?.advertisementNumberInEnglish} (${item?.titleInEnglish})`}
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="">
          <Select
            label="Work Scope"
            labelPlacement="outside"
            placeholder="Select"
            items={workScopeList}
            isRequired
            required
            selectedKeys={[formData?.workScopeId]}
            onSelectionChange={(e: any) => {
              const value = Array.from(e)[0] as string;
              if (value) {
                setFormData({
                  ...formData,
                  workScopeId: value,
                });
                getVendorByWorkScopeList("WorkScope", value);
              } else {
                setVendorList([]);
              }
            }}
          >
            {(item) => (
              <SelectItem key={item?._id} className="capitalize">
                {item?.workScopeTitle}
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="">
          <Select
            label="Select Vendor"
            labelPlacement="outside"
            placeholder="Select"
            isLoading={loader === "WorkScope"}
            isDisabled={loader === "WorkScope"}
            isRequired
            items={vendorList}
            selectedKeys={[formData?.vendorId]}
            onSelectionChange={(e: any) => {
              const value = Array.from(e)[0] as string;
              setFormData({
                ...formData,
                vendorId: value,
              });
              if (value) {
                getMOUListData("MOUList", value);
              } else {
                setMOUList([]);
              }
            }}
          >
            {(item) => (
              <SelectItem key={item?._id} className="capitalize">
                {item?.vendorName}
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="col-span-2">
          <Select
            label="Select MOU"
            labelPlacement="outside"
            placeholder="Select"
            items={MOUList}
            isLoading={loader === "MOUList"}
            isDisabled={loader === "MOUList"}
            isRequired
            required
            selectedKeys={[formData?.mouId]}
            onSelectionChange={(e: any) => {
              const value = Array.from(e)[0] as string;
              setFormData({
                ...formData,
                mouId: value,
              });
            }}
          >
            {(item) => (
              <SelectItem key={item?.mouId?._id ?? ""} className="capitalize">
                {item?.mouFileName ?? item?.mouId?.mouTitle}
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="">
          <Input
            type="date"
            label="Date of Work Order Release"
            labelPlacement="outside"
            max={moment().format("YYYY-MM-DD")}
            placeholder=""
            value={formData?.dateOfWorkReleased}
            onChange={(e) => {
              console.log(e.target.value);

              setFormData({ ...formData, dateOfWorkReleased: e.target.value });
            }}
          />
        </div>
        <div className="">
          <p className="text-sm">Upload work order with stamp</p>
          {formData?.uploadWorkOrder ? (
            <Input
              value={formData?.uploadWorkOrder.name}
              type="text"
              readOnly
              startContent={
                <span className="material-symbols-rounded">upload_file</span>
              }
              endContent={
                <Button
                  variant="flat"
                  size="sm"
                  color="danger"
                  onPress={() => {
                    setFormData({
                      ...formData,
                      uploadWorkOrder: "",
                    });
                  }}
                  className="text-danger"
                >
                  <span className="material-symbols-rounded">close</span>
                  Remove
                </Button>
              }
            />
          ) : (
            <Input
              value={formData?.uploadWorkOrder.name}
              onChange={(e: any) => {
                setFormData({
                  ...formData,
                  uploadWorkOrder: e.target.files[0],
                });
              }}
              type="file"
              startContent={
                <span className="material-symbols-rounded">upload_file</span>
              }
            />
          )}
        </div>
        <div className="col-span-2 mt-4 flex justify-end">
          <Button
            color="primary"
            variant="shadow"
            type="submit"
            className="px-24 mob:w-full"
            isLoading={loader === "submitForm"}
          >
            Submit
          </Button>
        </div>
      </form>
    </FlatCard>
  );
};

export default OrderRelease;
