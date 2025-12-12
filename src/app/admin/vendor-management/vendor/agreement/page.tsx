"use client";
import {
  CallFindMasterByCode,
  CallGetAllMOU,
  CallGetVendorByIdHistory,
  CallGetVendorByWorkScope,
  CallGetWorkScopeByAdvId,
  CallUpdateVendorAgreement,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import moment, { duration } from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import pdf from "@/assets/img/icons/common/pdf-icon.png";

const VendorAgreement = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loader, setLoader] = useState<string>("");
  const [MOUList, setMOUList] = useState<any[]>([]);
  const [workScopeList, setWorkScopeList] = useState<any[]>([]);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    advertisementId: "",
    vendorId: "",
    workScopeId: "",
    mouId: "",
    dateOfMou: "",
    uploadSignMou: "",
    dateOfGovernmentApproval: "",
    durationOfAgreement: "",
  });
  const [historyData, setHistoryData] = useState<any>(null);
  const [courseId, setCourseId] = useState<string>("");
  const [courseList, setCourseList] = useState<any[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);

  useEffect(() => {
    getMOUListData("showSkeleton");
    // getWorkScopeListData("showSkeleton");
    getCourseListData("showSkeleton");
  }, []);

  const getMOUListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallGetAllMOU()) as any;
      console.log("CallGetAllMOU", data, error);

      if (data?.statusCode === 200) {
        setMOUList(data?.data?.records);
      }
      if (error) console.error(error);
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

  // mouFileName
  const EventRecruitmentName = eventList?.find(
    (ele: any) => ele?._id === formData?.advertisementId,
  );
  const vendorListName = vendorList?.find(
    (ele: any) => ele?._id === formData?.vendorId,
  )?.vendorName;

  const MOUListName = MOUList?.find(
    (ele: any) => ele?._id === formData?.mouId,
  )?.mouTitle;
  const mouFileName =
    EventRecruitmentName?.advertisementNumberInEnglish &&
    vendorListName &&
    MOUListName
      ? `${EventRecruitmentName?.advertisementNumberInEnglish ?? ""} (${EventRecruitmentName?.titleInEnglish ?? ""})_${vendorListName ? vendorListName : ""}_${MOUListName}`
      : "";

  function transformToFormData(originalData: any) {
    const formData = new FormData();

    formData.append("vendorId", originalData?.vendorId);
    formData.append("mouId", originalData?.mouId);
    formData.append("dateOfMou", originalData?.dateOfMou);
    formData.append("uploadSignMou", originalData?.uploadSignMou);
    formData.append("advertisementId", originalData?.advertisementId);
    formData.append("mouFileName", mouFileName);
    formData.append("durationOfAgreement", originalData?.durationOfAgreement);
    formData.append(
      "dateOfGovernmentApproval",
      originalData?.dateOfGovernmentApproval,
    );

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
      // console.log("vendorData::: ", vendorData);
      const formData = transformToFormData(vendorData);
      console.log("vendorData.........", formData);
      const { data, error } = (await CallUpdateVendorAgreement(
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
      dateOfMou: "",
      uploadSignMou: "",
    });
  };
  const handleDownload = () => {
    const DownloadURL = MOUList?.filter(
      (item) => item?._id === formData?.mouId,
    );
    if (DownloadURL?.length) {
      const link = document.createElement("a");
      link.href = DownloadURL[0]?.mouTemplateFile;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getHistory = async (id: string) => {
    try {
      const { data, error } = (await CallGetVendorByIdHistory(id)) as any;
      console.log("CallGetVendorByIdHistory", data);

      if (data?.statusCode === 200) {
        setHistoryData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleCreateEligibility:", error);
    }
  };

  useEffect(() => {
    if (formData?.vendorId) {
      getHistory(formData?.vendorId);
    }
  }, [formData?.vendorId]);

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
    <>
      <FlatCard heading="Vendor MOU">
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
                setHistoryData(null);
                setVendorList([]);
                setEventList([]);
                setWorkScopeList([]);
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
                setHistoryData(null);
                setVendorList([]);
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
                  getVendorByWorkScopeList("workScope", value);
                  setHistoryData(null);
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
              isLoading={loader === "workScope"}
              isDisabled={loader === "workScope"}
              isRequired
              items={vendorList}
              selectedKeys={[formData?.vendorId]}
              onSelectionChange={(e: any) => {
                const value = Array.from(e)[0] as string;
                setFormData({
                  ...formData,
                  vendorId: value,
                });
              }}
            >
              {(item) => (
                <SelectItem key={item?._id} className="capitalize">
                  {item?.vendorName}
                </SelectItem>
              )}
            </Select>
          </div>
          <div className="col-span-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">MOU Creation</h2>
            {historyData?.activeHistoryButton && (
              <Button
                color="primary"
                variant="shadow"
                type="button"
                className="px-12"
                onPress={onOpen}
              >
                Vendor History
              </Button>
            )}
          </div>
          <div className="col-span-2 flex items-end justify-between gap-3 mob:flex-col">
            <Select
              label="Select MOU template"
              labelPlacement="outside"
              placeholder="Select"
              items={MOUList}
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
                <SelectItem key={item?._id} className="capitalize">
                  {item?.mouTitle}
                </SelectItem>
              )}
            </Select>

            <Button
              color="default"
              onPress={handleDownload}
              variant="shadow"
              className="px-24 mob:px-2 w-full"
            >
              Download
            </Button>
          </div>
          <div className="col-span-2">
            <Textarea
              isReadOnly
              type="text"
              label="MOU Name"
              labelPlacement="outside"
              placeholder=""
              value={mouFileName}
            />
          </div>
          <div className="">
            <Input
              type="date"
              label="Date of Government Approval"
              labelPlacement="outside"
              placeholder=""
              // min={moment(formData?.dateOfMou).format("YYYY-MM-DD")}
              // max={moment().format("YYYY-MM-DD")}
              value={formData?.dateOfGovernmentApproval}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  dateOfGovernmentApproval: e.target.value,
                });
              }}
            />
          </div>
          <div className="">
            <Input
              type="date"
              label="Date of Signing MOU"
              labelPlacement="outside"
              placeholder=""
              // max={moment().format("YYYY-MM-DD")}
              value={formData?.dateOfMou}
              onChange={(e) => {
                setFormData({ ...formData, dateOfMou: e.target.value });
              }}
            />
          </div>

          <div className="">
            <Input
              // isReadOnly
              type="text"
              label="Duration of Agreement"
              labelPlacement="outside"
              placeholder="Enter Duration of Agreement"
              // value={
              //   formData?.dateOfMou && formData?.dateOfGovernmentApproval
              //     ? moment(formData?.dateOfMou)
              //         .diff(moment(formData?.dateOfGovernmentApproval), "days")
              //         .toString()
              //     : "0"
              // }
              value={formData?.durationOfAgreement}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  durationOfAgreement: e.target.value,
                });
              }}
            />
          </div>
          <div className="">
            <p className="text-sm">Upload Signed MOU (Both Parties)</p>
            {formData?.uploadSignMou ? (
              <Input
                value={formData?.uploadSignMou.name}
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
                    onPress ={() => {
                      setFormData({
                        ...formData,
                        uploadSignMou: "",
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
                value={formData?.uploadSignMou.name}
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    uploadSignMou: e.target.files[0],
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
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Vender History
              </ModalHeader>
              <ModalBody>
                <Table isCompact removeWrapper>
                  <TableHeader>
                    <TableColumn>MOU Title</TableColumn>
                    <TableColumn>Date of MOU</TableColumn>
                    <TableColumn>Signed MOU</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="No Vender History Found">
                    {historyData?.vendor?.vendorAgreements?.map(
                      (agreement: any) => (
                        <TableRow key={agreement?._id}>
                          <TableCell>
                            {agreement?.mouId?.mouTitle ?? "-"}
                          </TableCell>
                          <TableCell>
                            {moment(agreement?.dateOfMou).format(
                              "DD/MM/YYYY",
                            ) ?? "-"}
                          </TableCell>
                          <TableCell>
                            <a
                              href={agreement?.uploadSignMou}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <Image
                                src={pdf}
                                style={{
                                  height: "40px",
                                  width: "40px",
                                  objectFit: "contain",
                                }}
                                alt="pdf"
                              />
                            </a>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default VendorAgreement;
