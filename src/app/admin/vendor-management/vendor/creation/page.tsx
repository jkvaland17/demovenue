"use client";
import FlatCard from "@/components/FlatCard";
import {
  Accordion,
  AccordionItem,
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
  useDisclosure,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import VendorAccordianItem from "@/assets/data/vendorCreationData.json";
import React, { use, useEffect, useState } from "react";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import {
  CallFindMasterByCode,
  CallGetAllWorkScope,
  CallGetHistoryStatus,
  CallSaveVendorDetail,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import toast from "react-hot-toast";
import moment from "moment";
import { useRouter } from "next/navigation";

const VendorCreation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loader, setLoader] = useState<string>("");
  const [eventList, setEventList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [workScopeList, setWorkScopeList] = useState<any[]>([]);
  const [vendorAccordianItem, setVendorAccordianItem] = useState<any[]>([
    ...VendorAccordianItem,
  ]);
  const route = useRouter();
  const [isHistoryStatus, setIsHistoryStatus] = useState<any>({
    ishistory: false,
    id: "",
  });
  const [formData, setFormData] = useState<any>({
    advertisementId: "",
    workScopeId: "",
    vendorName: "",
    officialAddress: "",
    officialEmail: "",
    OfficialContactNumber: "",
    gstnNumber: "",
    gstCertificate: "",
    panNumber: "",
    panCard: "",
    hsnSacCode: "",
    msmeCertificate: "",
    businessRegistrationCertificate: "",
    chequeInFavour: "",
    bankName: "",
    bankAccountNo: "",
    ifscCode: "",
    branchName: "",
    itrAcknowledgementNo1: "",
    financialYear: "",
    dateOfFiling: "",
    vendorAuthorityFullName: "",
    authorityPersonID: "",
    authorityPersonIDNo: "",
    contactNumberOfAuthorityPersonName: "",
    emailAddressOfAuthorityPersonName: "",
    status: "",
    remark: "",
    vendorType: "",
  });

  useEffect(() => {
    if (!courseList?.length) {
      getCourseListData("showSkeleton");
    }
    getWorkScopeListData("workScope");
  }, []);

  function getFinancialYears(startYear: any, endYear: any) {
    if (
      !Number.isInteger(startYear) ||
      !Number.isInteger(endYear) ||
      startYear > endYear
    ) {
      throw new Error(
        "Invalid input: Ensure startYear and endYear are integers and startYear ≤ endYear.",
      );
    }

    return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const year1 = endYear - i;
      const year2 = year1 - 1;
      return { label: `${year2}-${year1}`, value: `${year2}-${year1}` };
    });
  }
  const handleSelectionOptions = (currentKey: any, selectionItems: any[]) => {
    const newVendorAccordianItem = vendorAccordianItem?.map((item: any) => {
      if (item.section) {
        const updatedData = item?.fields?.map((detail: any) => {
          if (detail.key === currentKey) {
            return { ...detail, options: selectionItems };
          }
          return detail;
        });
        return { ...item, fields: updatedData };
      }
      return item;
    });
    setVendorAccordianItem(newVendorAccordianItem);
  };

  function transformToFormData(originalData: any) {
    const formData = new FormData();

    formData.append("advertisementId", originalData?.advertisementId);
    formData.append("workScopeId", originalData.workScopeId);
    formData.append("vendorName", originalData.vendorName);
    formData.append("officialAddress", originalData.officialAddress);
    formData.append("officialEmail", originalData.officialEmail);
    formData.append("vendorType", originalData.vendorType);
    formData.append(
      "officialContactNumber",
      originalData.OfficialContactNumber,
    );
    formData.append("gstnNumber", originalData.gstnNumber);
    formData.append("gstCertificate", originalData.gstCertificate);
    formData.append("panNumber", originalData.panNumber);
    formData.append("panCard", originalData.panCard);
    formData.append("hsnhsnSacCode", originalData.hsnSacCode);
    formData.append("msmeCertificate", originalData.msmeCertificate);
    formData.append(
      "businessRegistrationCertificate",
      originalData.businessRegistrationCertificate,
    );

    formData.append("bankDetails[chequeInFavour]", originalData.chequeInFavour);
    formData.append("bankDetails[bankName]", originalData.bankName);
    formData.append("bankDetails[bankAccountNo]", originalData.bankAccountNo);
    formData.append("bankDetails[ifscCode]", originalData.ifscCode);
    formData.append("bankDetails[branchName]", originalData.branchName);
    formData.append("bankDetails[financialYear]", originalData.financialYear);
    formData.append("bankDetails[dateOfFiling]", originalData.dateOfFiling);
    formData.append(
      "bankDetails[itrAcknowledgementNo1]",
      originalData.itrAcknowledgementNo1,
    );

    formData.append(
      "authorityPerson[fullName]",
      originalData.vendorAuthorityFullName,
    );
    formData.append(
      "authorityPerson[idNumber]",
      originalData.authorityPersonIDNo,
    );
    formData.append(
      "authorityPerson[idDocument]",
      originalData.authorityPersonID,
    );
    formData.append(
      "authorityPerson[email]",
      originalData.emailAddressOfAuthorityPersonName,
    );
    formData.append(
      "authorityPerson[contactNumber]",
      originalData.contactNumberOfAuthorityPersonName,
    );

    return formData;
  }

  const handleCreateEligibility = async (
    event: any,
    loaderType: string,
    vendorData: any,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      const formData = transformToFormData(vendorData);
      console.log("vendorData.........", formData);

      const { data, error } = (await CallSaveVendorDetail(formData)) as any;
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
      advertisementId: "",
      workScopeId: "",
      vendorName: "",
      officialAddress: "",
      officialEmail: "",
      OfficialContactNumber: "",
      gstnNumber: "",
      gstCertificate: "",
      panNumber: "",
      panCard: "",
      hsnSacCode: "",
      msmeCertificate: "",
      businessRegistrationCertificate: "",
      chequeInFavour: "",
      bankName: "",
      bankAccountNo: "",
      ifscCode: "",
      branchName: "",
      itrAcknowledgementNo1: "dshfjglikj",
      financialYear: "",
      dateOfFiling: "",
      vendorAuthorityFullName: "",
      authorityPersonID: "",
      authorityPersonIDNo: "",
      contactNumberOfAuthorityPersonName: "",
      emailAddressOfAuthorityPersonName: "",
      status: "",
      remark: "",
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
        const financialYearlist = getFinancialYears(2000, 2025);
        handleSelectionOptions("financialYear", financialYearlist);
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
  const getWorkScopeListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallGetAllWorkScope("")) as any;
      console.log("CallGetAllWorkScope", data, error);

      if (data?.statusCode === 200) {
        setWorkScopeList(data?.data?.records);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const getPanNumber = async () => {
    const pancard = formData?.panNumber ?? "";
    if (pancard.length === 10) {
      try {
        const query = `panNumber=${pancard}`;
        const { data, error } = (await CallGetHistoryStatus(query)) as any;
        console.log("CallGetHistoryStatus", { data, error });
        if (data) {
          setIsHistoryStatus({
            ishistory: data?.isHistory,
            id: data?._id,
          });
        }
        if (error) {
          toast.error(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (pancard.length !== 10) {
      setIsHistoryStatus({
        ishistory: false,
        id: "",
      });
      return;
    }
  };

  useEffect(() => {
    getPanNumber();
  }, [formData?.panNumber]);

  return (
    <FlatCard heading="Vendor Creation">
      <form
        action=""
        onSubmit={(e) => {
          handleCreateEligibility(e, "submitForm", formData);
        }}
      >
        <div className="mb-4 grid grid-cols-2 gap-5 mob:grid-cols-1">
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
              label="Recruitment Drive"
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
                setFormData({
                  ...formData,
                  workScopeId: value,
                });
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
              label="Vendor Type"
              labelPlacement="outside"
              placeholder="Select"
              items={[
                { _id: "general", value: "General" },
                // { _id: "confidential", value: "Confidential" },
              ]}
              isRequired
              required
              selectedKeys={[formData?.vendorType]}
              onSelectionChange={(e) => {
                const value = Array.from(e)[0] as string;
                setFormData({
                  ...formData,
                  vendorType: value,
                  ...(value === "confidential" && {
                    panNumber: "",
                    panCard: "",
                  }),
                });
              }}
            >
              {(item) => (
                <SelectItem key={item?._id} className="capitalize">
                  {item?.value || item?._id}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>

        <Accordion defaultExpandedKeys="all">
          {vendorAccordianItem?.map((section) => (
            <AccordionItem
              key={section.section}
              title={<p className="font-semibold">{section.section}</p>}
            >
              <div className="mb-3 grid grid-cols-2 gap-5 mob:grid-cols-1">
                {section?.fields
                  ?.filter((field: any) => {
                    if (
                      formData.vendorType === "confidential" &&
                      (field.key === "panNumber" || field.key === "panCard")
                    ) {
                      return false;
                    }
                    return true;
                  })
                  ?.map((field: any) =>
                    field.type === "file" ? (
                      <div key={field.key}>
                        <p className="mb-1 text-sm">{field.label}</p>
                        {formData[field.key] ? (
                          <Input
                            key={field.key}
                            value={formData[field.key].name}
                            type="text"
                            readOnly
                            startContent={
                              <span className="material-symbols-rounded">
                                {field.icon}
                              </span>
                            }
                            endContent={
                              <Button
                                variant="flat"
                                size="sm"
                                color="danger"
                                onPress={() => {
                                  setFormData({
                                    ...formData,
                                    [field.key]: "",
                                  });
                                }}
                                className="text-danger"
                              >
                                <span className="material-symbols-rounded">
                                  close
                                </span>
                                Remove
                              </Button>
                            }
                          />
                        ) : (
                          <Input
                            key={field.key}
                            labelPlacement="outside"
                            value={formData[field.key].name}
                            onChange={(e: any) => {
                              setFormData({
                                ...formData,
                                [field.key]: e.target.files[0],
                              });
                            }}
                            accept=".pdf"
                            type={field.type}
                            startContent={
                              <span className="material-symbols-rounded">
                                {field.icon}
                              </span>
                            }
                          />
                        )}
                      </div>
                    ) : field.type === "select" ? (
                      <Select
                        key={field.key}
                        label={field.label}
                        labelPlacement="outside"
                        selectedKeys={[formData[field.key]]}
                        onSelectionChange={(e) => {
                          const value = Array.from(e)[0];
                          setFormData({ ...formData, [field.key]: value });
                        }}
                        placeholder="Select"
                        items={field?.options ?? []}
                      >
                        {(option: { value: string; label: string }) => (
                          <SelectItem key={option?.value}>
                            {option?.label}
                          </SelectItem>
                        )}
                      </Select>
                    ) : field.key === "panNumber" ? (
                      <div className="flex items-end gap-2">
                        <Input
                          className="flex-1"
                          required={field.isRequired}
                          isRequired={field.isRequired}
                          key={field.key}
                          label={
                            <div className="flex w-full items-center justify-between">
                              <span>{field.label}</span>
                            </div>
                          }
                          labelPlacement="outside"
                          value={formData[field.key]}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              panNumber: e.target.value,
                            });
                          }}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          type={field.type}
                          maxLength={10}
                          endContent={
                            <span className="material-symbols-rounded">
                              {field.icon}
                            </span>
                          }
                        />
                        {isHistoryStatus?.ishistory && (
                          <Button
                            size="md"
                            color="primary"
                            variant="flat"
                            className="shrink-0"
                            onPress={() => {
                              route.push(
                                `/admin/vendor-management/vendor/history/view/${isHistoryStatus?.id}`,
                              );
                            }}
                          >
                            View History
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Input
                        required={field.isRequired}
                        isRequired={field.isRequired}
                        key={field.key}
                        label={field.label}
                        labelPlacement="outside"
                        value={formData[field.key]}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            [field.key]: e.target.value,
                          });
                        }}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        type={field.type}
                        max={
                          field.type === "date"
                            ? moment().format("YYYY-MM-DD")
                            : ""
                        }
                        endContent={
                          <span className="material-symbols-rounded">
                            {field.icon}
                          </span>
                        }
                      />
                    ),
                  )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-3 flex justify-end">
          <Button
            color="primary"
            variant="shadow"
            type="submit"
            className="px-24 mob:w-full"
            isLoading={loader === "submitForm"}
          >
            Send for Approval
          </Button>
        </div>
      </form>
    </FlatCard>
  );
};

export default VendorCreation;
