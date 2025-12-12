"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Tooltip,
  useDisclosure,
  Input,
  Card,
  CardHeader,
  Avatar,
  Chip,
  CardBody,
  Accordion,
  AccordionItem,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import FlatCard from "@/components/FlatCard";
// import DVAccordianItem from "@/assets/data/DVPSTVerificationFields.json";
import DVAccordianItem from "@/assets/data/NewDVPSTVerificationFields.json";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import {
  CallFetchDVPSTScreeningDetails,
  CallGetAllCandidateDetails,
  CallGetAllMasterData,
  CallGetAllSpecialtiesId,
  CallUpdateDVPSTApplicationStatus,
  CallUpdateDVPSTScreening,
  CallUpdateDVPSTScreeningDetailsStatus,
  CallUpdateDVPSTScreeningDocumentStatus,
  CallUpdateDVPSTstep,
  CallUpdateDVPSTuploadUnmatchedDocuments,
} from "@/_ServerActions";
import { useParams, useRouter } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";
import toast from "react-hot-toast";
import moment from "moment";
import CameraModal from "@/components/CameraModal";
import Link from "next/link";
import Stepper from "@/components/Stepper";
import SportsDetailsTable from "@/components/SportsDetailsTable";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
import Image from "next/image";
import { set, useForm } from "react-hook-form";
import CustomMultipleUpload from "@/components/CustomMultipleUpload";

const CandidateDocumentVerification: React.FC = () => {
  const { id } = useParams() as any;
  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isCorrect,
    onOpen: onCorrect,
    onClose: onCloseCorrect,
    onOpenChange: onOpenCorrect,
  } = useDisclosure();

  const {
    isOpen: isRemarkModal,
    onOpen: onRemarkModal,
    onClose: onCloseRemarkModal,
    onOpenChange: onOpenRemarkModal,
  } = useDisclosure();
  const {
    isOpen: isConsentModal,
    onOpen: onConsentModal,
    onClose: closeConsentModal,
    onOpenChange: onOpenConsentModal,
  } = useDisclosure();
  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onOpenChange: onOpenChangePreview,
  } = useDisclosure();
  const {
    isOpen: isOpenFile,
    onOpen: onOpenFile,
    onClose: onCloseFile,
    onOpenChange: onOpenChangeFile,
  } = useDisclosure();
  const [modalType, setModalType] = useState("view");
  const [document, setDocument] = useState("");
  const [finalRemark, setFinalRemark] = useState("");
  const [fieldCorrectValue, setFieldCorrectValue] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [docData, setDocData] = useState<any>(null);
  const [finalStatus, setFinalStatus] = useState("");
  const [currentUser, setCurrentUser] = useState<any>();
  const [loader, setLoader] = useState<string>("showSkeleton");
  const [loading, setLoading] = useState<string>("");
  const [cameraLoader, setCameraLoader] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const videoRef = useRef<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState([]) as any;
  const [selectedStatus, setSelectedStatus] = useState("");
  const [categories, setCategories] = useState<any>([]);
  const [upload, setUpload] = useState<any>([]);
  const { setValue, register } = useForm();
  const [titleValue, setTitleValue] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("");
  const [stepsArray, setStepsArray] = useState<any>([]);
  const [isVerifyButton, setisVerifyButton] = useState<boolean>(false);

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };

  const identityColumns = [
    { name: "Field Name", uid: "title" },
    { name: "Registration Value", uid: "value" },
    { name: "Status", uid: "status" },
    { name: "Remarks for valid and invaild", uid: "remark" },
  ];
  const otherColumns = [
    { name: "Field Name", uid: "title" },
    { name: "Registration Value", uid: "value" },
    { name: "Status", uid: "status" },
    { name: "Correct value", uid: "correctValue" },
    { name: "Remarks for valid and invaild", uid: "remark" },
  ];
  const docColumns = [
    { name: "Verifiy Documents", uid: "isVerify" },
    { name: "Field Name", uid: "title" },
    { name: "Registration Value", uid: "value" },
    { name: "Status", uid: "status" },
    { name: "DV Document", uid: "correctValue" },
    { name: "Remarks for valid and invaild", uid: "remark" },
  ];
  const sportsColumns = [
    { name: "Sport", uid: "sport" },
    { name: "Sub sport", uid: "subSport" },
    { name: "Sport certificate", uid: "value" },
  ];

  const getKushalApplications = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallFetchDVPSTScreeningDetails(
        `applicationId=${id}`,
      )) as any;
      console.log("getKushalApplications", data);
      if (data.message === "Application retrieved successfully!") {
        let documetData: any = {};
        if (data?.response?.documetData?.length) {
          data?.response?.documetData?.forEach((item: any) => {
            documetData[item.fieldName || "fieldName"] = item;
          });
          data.response.documetData = documetData;
        }
        setCurrentUser(data?.response);
        setCurrentStep(data?.response?.currentStep);
        setStepsArray(data?.response?.stepsArray);
        setisVerifyButton(data?.response?.responseData?.isSubmit);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  useEffect(() => {
    getKushalApplications("showSkeleton");
    GetApplicationData();
  }, [id]);

  const [candidateData, setCandidateData] = useState<{
    accordianItem: {
      title: string;
      key: string;
      data: any[];
    }[];
  }>({
    accordianItem: [],
  });

  const updateStatus = (
    sectionIndex: number,
    itemId: number,
    newStatus: string,
    setDocumentData: any,
  ) => {
    let currentDocData: any;
    const updatedData = { ...candidateData };
    const section = updatedData.accordianItem[sectionIndex];
    if (section?.data) {
      section.data = section.data.map((item) => {
        if (item.id === itemId) {
          currentDocData = { ...item, status: newStatus };
        }
        return item;
      });
    }
    setDocumentData({ ...currentDocData, itemId, sectionIndex });
    if (newStatus === "Unmatched") {
      setModalType("edit");
      setFieldCorrectValue(currentDocData?.correctValue ?? "");
      setFinalRemark(currentDocData?.remark ?? "");
      onRemarkModal();
    } else if (newStatus === "Matched") {
      handleDocumentStatus(currentUser?._id, {
        ...currentDocData,
        itemId,
        sectionIndex,
      });
    }
    // return updatedData;
  };

  const handleSubmit = async (id: string, attendance: string) => {
    try {
      setLoading(attendance);
      const formData = {
        id: id,
        candidateStatus: attendance,
      };
      const { data, error } = (await CallUpdateDVPSTScreening(formData)) as any;
      if (data?.message === "Status update successfully.") {
        toast.success("Attendance update successfully");
        getKushalApplications("");
        setLoading("");
      } else if (error) {
        handleCommonErrors(error);
        setLoading("");
      }
    } catch (error: any) {
      console.log(error);
      setLoading("");
    }
  };

  const handleFinalStatus = async () => {
    try {
      // setFinalStatusLoading(true);
      const formData = {
        _id: currentUser?._id,
        applicationScreeningStatus: finalStatus,
        applicationScreeningRemarks: finalRemark,
        selectedStatus,
      };
      console.log("last submit", formData);
      const data = (await CallUpdateDVPSTApplicationStatus(formData)) as any;
      if (data?.data) {
        setFinalStatus("");
        setFinalRemark("");
        closeConsentModal();
        setSelectedStatus("");
        toast.success(data?.data?.message);
        router.back();
      }
      if (data?.error) {
        handleCommonErrors(data?.error);
      }

      // setFinalStatusLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      // setFinalStatusLoading(false);
    }
  };

  function extractRemainingPath(fullString: string, fieldName: string): string {
    if (!fullString || !fieldName) return fullString;

    const updatedString = fullString.replace(fieldName, "").replace(/\.$/, "");

    const parts = updatedString.split(".").filter(Boolean);

    return parts.length > 0 ? parts[parts.length - 1] : "";
  }
  const handleDocumentStatus = async (
    id: string,
    fieldData: any,
    isVerifyValue?: boolean,
  ) => {
    console.log("fieldData", fieldData);
    try {
      // setFinalStatusLoading(true);
      const result = extractRemainingPath(fieldData?.key, fieldData?.fieldName);
      let formData: any = {
        _id: id,
        fieldType: result,
        fieldName: fieldData?.fieldName,
        status: fieldData?.status,
        // remarks: finalRemark,
        // correctValue: fieldCorrectValue,
        selectedStatus: selectedStatus,
        isVerify: isVerifyValue,
      };
      if (fieldData?.status) {
        formData.remarks = finalRemark;
        formData.correctValue = fieldCorrectValue;
      }
      const formDatafile = new FormData();
      formDatafile.append("appllicationScreeningId", id);
      formDatafile.append("fieldName", fieldData?.dataType);
      if (fileName) {
        formDatafile.append("name", fileName);
      }
      if (fieldCorrectValue) {
        formDatafile.append("file", fieldCorrectValue);
        formDatafile.append("documentId", fieldData?._id);
      }
      if (finalRemark || fieldData?.status === "Matched") {
        formDatafile.append("remarks", finalRemark ?? "");
      }
      if (fieldData?.status) {
        formDatafile.append("status", fieldData?.status);
      }

      // document upload section start
      const documentfile = new FormData();
      documentfile.append("fieldName", fieldData?.fieldName);
      if (upload?.length > 0) {
        upload.forEach((item: any) => {
          documentfile.append("attachment", item);
        });
      }
      documentfile.append("appllicationScreeningId", id);
      documentfile.append("remarks", finalRemark ?? "");
      documentfile.append("dataType", fieldData?.dataType);
      documentfile.append("name", fileName);
      documentfile.append("status", statusValue);
      documentfile.append("title", titleValue);
      // document upload section end
      let response: any;

      if (
        fieldData?.dataType === "photograph" ||
        fieldData?.dataType === "signature" ||
        fieldData?.dataType === "thumbprint"
      ) {
        response = (await CallUpdateDVPSTScreeningDocumentStatus(
          formDatafile,
        )) as any;
      } else if (fieldData?.dataType === "document") {
        response = (await CallUpdateDVPSTuploadUnmatchedDocuments(
          documentfile,
        )) as any;
      } else {
        response = (await CallUpdateDVPSTScreeningDetailsStatus(
          formData,
        )) as any;
      }
      const { data, error } = response;
      console.log("handleDocumentStatus", { data, error });
      if (data) {
        setFinalStatus("");
        setFinalRemark("");
        setFieldCorrectValue("");
        setUploadedImage(null);
        setFileName("");
        onCloseRemarkModal();
        onCloseFile();
        getKushalApplications("");
        setValue("file", []);
        setUpload([]);
        toast.success(data || data?.message);
      }
      if (error) {
        handleCommonErrors(error);
      }

      // setFinalStatusLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      // setFinalStatusLoading(false);
    }
  };

  const getFieldData = (
    sectionIndex: number,
    itemId: number,
    setDocumentData: any,
  ) => {
    let currentDocData: any;
    const updatedData = { ...candidateData };
    const section = updatedData.accordianItem[sectionIndex];
    if (section?.data) {
      section.data = section.data.map((item) => {
        if (item.id === itemId) {
          currentDocData = item;
          return item;
        }
        return item;
      });
    }
    setDocumentData({ ...currentDocData, itemId, sectionIndex });
    // return updatedData;
  };

  const renderTable = (
    columns: { name: string; uid: string }[],
    data: any,
    sectionIndex: number,
    setDocumentData: any,
  ) => (
    <Table
      isStriped
      shadow="none"
      aria-label="Kushal Khiladi Scrunity application"
      className="mb-6"
      classNames={{
        wrapper: "p-0",
      }}
    >
      <TableHeader columns={columns}>
        {(column: { name: string; uid: string }) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "remark" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item: any) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(sectionIndex, item, columnKey, setDocumentData)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
  const convertBase64ToFile = (base64String: any, fileName: any) => {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: "image/png" });
  };
  const HandleCapturedImage = (file: string) => {
    const convertedFile = convertBase64ToFile(file, "image.png");
    setUploadedImage(file);
    setFieldCorrectValue(convertedFile);
    onClose();
    onOpenFile();
  };

  const renderCell = (
    sectionIndex: number,
    item: any,
    columnKey: any,
    setDocumentData: any,
  ) => {
    const cellValue = item[columnKey];
    function isValidUrl(str: string) {
      try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch (_) {
        return false;
      }
    }
    switch (columnKey) {
      case "isVerify":
        return (
          <Checkbox
            isSelected={item?.isVerify == "true" ? true : false}
            onChange={(e) => {
              const checkedValue = e.target.checked;
              const fieldData = {
                fieldName: item?.fieldName,
                _id: item?._id,
                key: item?.key,
                // sectionIndex: sectionIndex,
                isVerify: checkedValue,
              };
              handleDocumentStatus(currentUser?._id, fieldData, checkedValue);
            }}
          >
            Verify
          </Checkbox>
        );
      case "value":
        return item?.dataType === "photograph" ? (
          <div className="flex gap-6">
            {item?.document?.length
              ? item?.document?.map((doc: any, index: any) => (
                  <div key={index}>
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                      <Image
                        src={doc?.url || ""}
                        alt="Photograph"
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-1 text-xs">{doc?.name || ""}</p>
                  </div>
                ))
              : ""}

            <div>
              <Button
                className="h-28 w-28 rounded-full bg-gray-200"
                onClick={() => {
                  getFieldData(sectionIndex, item.id, setDocumentData);
                  onOpenFile();
                }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "black" }}
                >
                  add
                </span>
              </Button>
              <p className="mt-1 text-xs">Current Photograph</p>
            </div>
          </div>
        ) : item?.dataType === "signature" ? (
          <div className="mt-8 flex flex-wrap gap-6">
            {item?.document?.length
              ? item?.document?.map((doc: any, index: any) => (
                  <div key={index}>
                    <div className="flex h-28 w-32 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={doc?.url || ""}
                        alt="Signature"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-1 text-xs">{doc?.name || ""}</p>
                  </div>
                ))
              : ""}

            <div>
              <Button
                className="h-28 w-32 rounded-md bg-gray-200"
                onClick={() => {
                  getFieldData(sectionIndex, item.id, setDocumentData);
                  onOpenFile();
                }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "black" }}
                >
                  add
                </span>
              </Button>
              <p className="mt-1 text-xs">Current Signature</p>
            </div>
          </div>
        ) : item?.dataType === "document" && cellValue !== "NA" ? (
          <Button
            size="md"
            variant="light"
            className="bg-transparent hover:!bg-transparent"
            onPress={() => {
              // setDocument(item?.value);
              // onOpenPreview();
              window.open(item.value, "_blank");
            }}
            isIconOnly
          >
            <Image
              src={pdf}
              width={30}
              height={30}
              className="object-contain"
              alt="pdfIcon"
            />
          </Button>
        ) : item?.dataType === "thumbprint" ? (
          <div className="mt-8 flex flex-wrap gap-6">
            {item?.document?.length
              ? item?.document?.map((doc: any, index: any) => (
                  <div key={index}>
                    <div className="flex h-28 w-32 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={doc?.url || ""}
                        alt="thumbprint"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-1 text-xs">{doc?.name || ""}</p>
                  </div>
                ))
              : ""}

            <div>
              <Button
                className="h-28 w-32 rounded-md bg-gray-200"
                onPress={() => {
                  getFieldData(sectionIndex, item.id, setDocumentData);
                  onOpenFile();
                }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "black" }}
                >
                  add
                </span>
              </Button>
              {/* <p className="mt-1 text-xs">Current Signature</p> */}
            </div>
          </div>
        ) : item?.dataType === "date" && cellValue !== "NA" ? (
          moment(cellValue).format("ll")
        ) : item?.dataType === "array" && Array.isArray(cellValue) ? (
          cellValue.map((sub: any) => sub?.label || sub?.value || "").join(", ")
        ) : Array.isArray(cellValue) ? (
          cellValue.join(", ")
        ) : (
          cellValue
        );

      case "status":
        return (
          <div className="flex gap-2">
            <Button
              variant={cellValue === "Matched" ? "solid" : "ghost"}
              color={cellValue === "Matched" ? "success" : "default"}
              radius="full"
              className={`text-white ${cellValue === "Matched" ? "" : "border border-slate-400 text-black"}`}
              onPress={() => {
                if (item?.dataType === "document") {
                  getFieldData(sectionIndex, item?.id, setDocData);
                  setTitleValue(item?.title);
                  setStatusValue("Matched");
                  onOpenCorrect();
                  return;
                }
                updateStatus(
                  sectionIndex,
                  item?.id,
                  "Matched",
                  setDocumentData,
                );
              }}
            >
              Matched
            </Button>
            <Button
              variant={cellValue === "Unmatched" ? "solid" : "ghost"}
              color={cellValue === "Unmatched" ? "danger" : "default"}
              radius="full"
              className={`${cellValue === "Unmatched" ? "" : "border border-slate-400"}`}
              onPress={() => {
                if (item?.dataType === "document") {
                  getFieldData(sectionIndex, item?.id, setDocData);
                  setTitleValue(item?.title);
                  setStatusValue("Unmatched");
                  onOpenCorrect();
                  return;
                }
                updateStatus(
                  sectionIndex,
                  item?.id,
                  "Unmatched",
                  setDocumentData,
                );
              }}
            >
              {/* {item?.dataType === "document" ? "Re Upload" : "Unmatched"} */}
              Unmatched
            </Button>
          </div>
        );
      case "correctValue":
        return !item?.correctValue || cellValue === "NA" ? (
          <p>---</p>
        ) : isValidUrl(item?.correctValue) ? (
          <Button
            size="md"
            variant="light"
            className="bg-transparent hover:!bg-transparent"
            onPress={() => {
              window.open(item?.correctValue, "_blank");
            }}
            isIconOnly
          >
            <Image
              src={pdf}
              width={30}
              height={30}
              className="object-contain"
              alt="pdfIcon"
            />
          </Button>
        ) : (
          <Tooltip content={item?.correctValue}>
            <p>{item?.correctValue}</p>
          </Tooltip>
        );

      case "sportCertificate":
        return (
          <Button
            size="md"
            variant="light"
            className="bg-transparent hover:!bg-transparent"
            onClick={() => {
              // setDocument(item?.value);
              // onOpenPreview();
              window.open(item?.value, "_blank");
            }}
            isIconOnly
          >
            <Image
              src={pdf}
              width={30}
              height={30}
              className="object-contain"
              alt="pdfIcon"
            />
          </Button>
        );
      case "remark":
        return (
          <div className="flex justify-center gap-4">
            <Tooltip content={cellValue}>
              <p className="truncate">{cellValue ? cellValue : "---"}</p>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  // const updateCurrentUserData = useCallback((currentItem: any) => {
  //   const jsonUI = candidateData.accordianItem;
  //   const getNestedValue = (path: string, obj: any) =>
  //     path
  //       ?.split(".")
  //       .reduce((acc: any, key: string) => (acc ? acc[key] : "NA"), obj);

  //   return jsonUI.map((section) => {
  //     if (section.title) {
  //       const updatedData = section?.data?.map((detail) => {
  //         const value = getNestedValue(detail.key, currentItem);
  //         if (
  //           detail.dataType === "photograph" ||
  //           detail.dataType === "signature"
  //         ) {
  //           return {
  //             ...detail,
  //             fieldName: value?.fieldName || "NA",
  //             status: value?.status || "NA",
  //             remark: value?.remarks || "",
  //             correctValue: value?.correctValue || "",
  //             document: value?.document || [],
  //             _id: value?._id || "",
  //           };
  //         }
  //         return {
  //           ...detail,
  //           value: value?.value || "NA",
  //           fieldName: value?.fieldName || "NA",
  //           status: value?.status || "NA",
  //           remark: value?.remarks || "",
  //           correctValue: value?.correctValue || "",
  //         };
  //       });
  //       return { ...section, data: updatedData };
  //     }
  //     return section;
  //   });
  // }, []);

  const updateCurrentUserData = useCallback(
    (filteredFields: any, currentItem: any) => {
      const jsonUI = filteredFields;
      const getNestedValue = (path: string, obj: any) => {
        const target = path?.split(".").reduce((acc: any, key: string) => {
          return acc ? acc[key] : undefined;
        }, obj);

        if (!target) {
          return {
            value: "NA",
            fieldName: "NA",
            status: "NA",
            remark: "",
            correctValue: "",
            document: [],
            _id: "",
            isVerify: "false",
          };
        }

        let value;
        if (Array.isArray(target?.value)) {
          value =
            target?.value
              ?.map((item: any) => item?.label || item?.value || "")
              .join(", ") || "NA";
        } else if (
          typeof target?.value === "object" &&
          target?.value !== null
        ) {
          if (target?.fieldName === "freedomFighter") {
            value = target?.value.isFreedomFighter || "NA";
          } else if (target?.fieldName === "exServiceMan") {
            value = target?.value.isExServiceMan || "NA";
          } else if (target?.fieldName === "upEmployee") {
            value = target?.value.isUpEmployee || "NA";
          } else {
            value = JSON.stringify(target?.value);
          }
        } else {
          value = target?.value || "NA";
        }

        const document = target?.document || [];
        return {
          value,
          fieldName: target?.fieldName || "NA",
          status: target?.status || "NA",
          remark: target?.remarks || "",
          correctValue: target?.correctValue || "",
          document,
          _id: target?._id || "",
          isVerify: target?.isVerify || "false",
        };
      };

      return jsonUI?.map((section: any) => {
        if (section?.title) {
          const updatedData = section?.data?.map((detail: any) => {
            if (!detail.key) {
              return {
                ...detail,
                value: "NA",
                fieldName: "NA",
                status: detail?.status || "NA",
                remark: detail?.remark || "",
                correctValue: "",
                document: [],
                _id: "",
              };
            }

            const resolvedValue = getNestedValue(detail?.key, currentItem);

            if (
              detail.dataType === "photograph" ||
              detail.dataType === "signature" ||
              detail.dataType === "thumbprint"
            ) {
              return {
                ...detail,
                fieldName: resolvedValue?.fieldName || "NA",
                status: resolvedValue?.status || "NA",
                remark: resolvedValue?.remark || "",
                correctValue: resolvedValue?.correctValue || "",
                document: resolvedValue?.document || [],
                _id: resolvedValue?._id || "",
                isVerify: resolvedValue?.isVerify || "false",
              };
            }

            return {
              ...detail,
              value: resolvedValue?.value,
              fieldName: resolvedValue?.fieldName,
              status: resolvedValue?.status,
              remark: resolvedValue?.remark,
              correctValue: resolvedValue?.correctValue,
              _id: resolvedValue?._id,
              isVerify: resolvedValue?.isVerify || "false",
            };
          });
          return { ...section, data: updatedData };
        }
        return section;
      });
    },
    [],
  );

  useEffect(() => {
    if (!currentUser || stepsArray.length === 0) return;

    const filtered = DVAccordianItem.filter((field) =>
      stepsArray.some(
        (step: any) =>
          step?.title?.trim().toLowerCase() ===
          field?.key?.trim().toLowerCase(),
      ),
    );

    const updatedJson = updateCurrentUserData(filtered, currentUser);
    setCandidateData({ accordianItem: updatedJson });
  }, [stepsArray, currentUser]);

  function fileToUrl(file: any) {
    if (!file) return null;
    return URL.createObjectURL(file);
  }
  const handleFileUpload = (event: any) => {
    setFieldCorrectValue(event.target.files[0]);
    const file = event.target.files[0];
    const fileUrl = fileToUrl(file);
    setUploadedImage(fileUrl);
  };
  const candidateDetails = [
    {
      name: "Registration ID",
      value: userData[0]?.applicationDetails?.register || "-",
      type: "text",
    },
    {
      name: "Candidate's Name",
      value: userData[0]?.applicationDetails?.personalDetails?.fullName || "-",
      type: "text",
    },
    {
      name: "Roll No.",
      value: userData[0]?.admitCardDetails?.rollNo,
      type: "text",
    },
    {
      name: "Father's Name/Husband's Name",
      value:
        userData[0]?.applicationDetails?.personalDetails?.fatherName || "-",
      type: "text",
    },
    {
      name: "Gender",
      value: userData[0]?.applicationDetails?.personalDetails?.gender || "-",
      type: "text",
    },
    {
      name: "Venue of DV/PST",
      value: `${userData[0]?.center?.school_name} (${userData[0]?.center?.school_address})`,
      type: "text",
    },
    {
      name: "Date of DV/PST",
      value: moment(userData[0]?.admitCardDetails?.exam_date).format(
        "YYYY-MM-DD hh:mm:ss A",
      ),
      type: "text",
    },
    {
      name: "DOB",
      value: userData[0]?.applicationDetails?.personalDetails?.dateOfBirth
        ? new Date(
            userData[0].applicationDetails.personalDetails.dateOfBirth,
          ).toLocaleDateString("en-GB")
        : "-",
      type: "text",
    },
    {
      name: "District",
      value:
        userData[0]?.applicationDetails?.addressDetails?.presentAddress
          ?.state || "-",
      type: "text",
    },
    {
      name: "Category",
      value:
        userData[0]?.applicationDetails?.personalDetails?.reservationCategory ||
        "-",
      type: "text",
    },
    {
      name: "Post Apply",
      value: userData[0]?.advertisementDetails?.titleInEnglish || "-",
      type: "text",
    },
    // {
    //   name: "Doc Attached",
    //   value:
    //     userData[0]?.applicationDetails?.additionalDocuments?.map(
    //       (doc: any) => doc.fileUrl,
    //     ) || [],
    //   type: "doc",
    // },
  ];

  const GetApplicationData = async () => {
    try {
      const query = `applicationId=${id}`;
      const { data, error } = (await CallGetAllCandidateDetails(query)) as any;
      console.log("CallGetAllCandidateDetails", data, error);
      if (data) {
        setUserData(data?.applications);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      updateDVsteps(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < candidateData?.accordianItem.length - 1) {
      setCurrentStep(currentStep + 1);
      updateDVsteps(currentStep + 1);
    } else {
      setFinalStatus("Eligible");
      setModalType("re_dv");
      onRemarkModal();
    }
  };

  const updateDVsteps = async (stepNo: number) => {
    try {
      const obj = {
        applicationId: id,
        currentStep: stepNo,
      };
      const { data, error } = (await CallUpdateDVPSTstep(obj)) as any;
      if (data) {
        toast.success(data?.message);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllList = async (): Promise<void> => {
    try {
      const query = `code=category`;
      const { data, error } = (await CallGetAllMasterData(query)) as any;
      console.log("CallGetAllMasterData", { data, error });
      if (data) setCategories(data?.data);
    } catch (error) {
      console.error("Error fetching all list:", error);
    }
  };

  useEffect(() => {
    fetchAllList();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="mb-6 text-2xl font-semibold">Document Verification</h1>
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
      <>
        {loader === "showSkeleton" ? (
          <CardSkeleton cardsCount={3} columns={1} />
        ) : (
          <>
            <Card className="mb-5 overflow-hidden">
              <CardHeader className="bg-default-100 p-5">
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                  <Image
                    height={80}
                    width={80}
                    src={userData[0]?.applicationDetails?.photograph}
                    alt="userImage"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <div className="space-y-1">
                    <h3 className="mb-2 text-2xl font-semibold capitalize">
                      {candidateDetails[1].value}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Chip variant="flat" color="primary">
                        Registration No.: {candidateDetails[0].value}
                      </Chip>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="pt-6">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                  {candidateDetails.slice(1).map((item: any, index: any) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-0.5 text-gray-500">{item.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {item.name}
                        </p>
                        <div className="mt-1">
                          {item.type === "chip" ? (
                            <Chip
                              variant="solid"
                              className="text-white"
                              color="default"
                            >
                              {item.value}
                            </Chip>
                          ) : item.type === "doc" ? (
                            <div className="flex flex-row flex-wrap gap-3">
                              {item.value.length > 0 ? (
                                item.value.map((url: any, docIndex: any) => (
                                  <Link
                                    key={docIndex}
                                    href={url}
                                    target="_blank"
                                    className="flex items-center gap-2"
                                  >
                                    <Image
                                      src={pdf}
                                      className="h-[30px] w-[30px] object-contain"
                                      alt="pdf"
                                    />
                                  </Link>
                                ))
                              ) : (
                                <p className="font-medium">-</p>
                              )}
                            </div>
                          ) : (
                            <p className="font-medium capitalize">
                              {item.value || "-"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            <div className="flex items-center justify-end">
              <div className="flex gap-3">
                <Button
                  onPress={() => handleSubmit(currentUser?._id, "Present")}
                  radius="full"
                  color="success"
                  isLoading={loading === "Present"}
                  variant={
                    currentUser?.candidateStatus === "Present"
                      ? "solid"
                      : "bordered"
                  }
                  className={`px-8 font-medium ${currentUser?.candidateStatus === "Present" && "text-white"}`}
                >
                  Present
                </Button>
                <Button
                  onPress={() => handleSubmit(currentUser?._id, "Absent")}
                  isLoading={loading === "Absent"}
                  radius="full"
                  color="danger"
                  variant={
                    currentUser?.candidateStatus === "Absent"
                      ? "solid"
                      : "bordered"
                  }
                  className={`px-8 font-medium ${currentUser?.candidateStatus === "Absent" && "text-white"}`}
                >
                  Absent
                </Button>
              </div>
            </div>

            {/* step section */}
            {currentUser?.candidateStatus === "Present" && (
              <div className="mt-5">
                <FlatCard>
                  <Stepper
                    items={stepsArray}
                    currentStep={currentStep}
                    completedStep={currentStep - 1}
                  />
                  {candidateData?.accordianItem?.map(
                    (item: any, index: number) =>
                      index === currentStep ? (
                        <div key={index}>
                          <h1 className="mb-4 text-2xl font-semibold">
                            {item?.title}
                          </h1>
                          {/* Show note only for All Documents */}
                          {item?.title === "All Documents सभी दस्तावेज़" && (
                            <div className="mb-2 text-[12px] text-red-600 font-bold">
                              Note: सभी दस्तावेज़ों के लिए &quot;Verify&quot; विकल्प को चयनित करना अनिवार्य है। कृपया सुनिश्चित करें कि सभी दस्तावेज़ों को सत्यापित (Verified) किया गया है, तभी आप आगे बढ़ सकते हैं।
                            </div>
                          )}
                          {renderTable(
                            item?.title === "Identity Documents पहचान दस्तावेज़"
                              ? identityColumns
                              : item?.title === "All Documents सभी दस्तावेज़"
                                ? docColumns
                                : otherColumns,
                            item?.data,
                            index,
                            setDocData,
                          )}
                        </div>
                      ) : null,
                  )}

                  <div className="flex justify-end gap-3">
                    <Button
                      onPress={handlePrev}
                      className={`${currentStep === 0 && "hidden"}`}
                      startContent={
                        <span className="material-symbols-rounded">
                          arrow_back
                        </span>
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleNext}
                      isDisabled={
                        currentStep === candidateData?.accordianItem.length - 1
                          ? !isVerifyButton
                          : false
                      }
                      endContent={
                        currentStep !==
                          candidateData?.accordianItem.length - 1 && (
                          <span className="material-symbols-rounded">
                            arrow_forward
                          </span>
                        )
                      }
                    >
                      {currentStep === candidateData?.accordianItem.length - 1
                        ? "Submit"
                        : "Save & Next"}
                    </Button>
                  </div>
                </FlatCard>
              </div>
            )}
          </>
        )}

        <CameraModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          action={HandleCapturedImage}
          loader={cameraLoader}
          setLoader={setCameraLoader}
          title="Capture Image"
          newEnroll={false}
        />

        <Modal
          scrollBehavior="inside"
          isOpen={isRemarkModal}
          onOpenChange={onOpenRemarkModal}
          size="xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 pb-1">
                  {{
                    view: "View Remark",
                    edit: "Add/Edit Remark",
                    re_dv: "Remarks for Changes after Document Verification",
                  }[modalType] || ""}
                </ModalHeader>
                <ModalBody>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (modalType === "edit") {
                        handleDocumentStatus(currentUser?._id, docData);
                      } else {
                        onConsentModal();
                        onClose();
                      }
                    }}
                  >
                    {modalType === "edit" &&
                      docData?.dataType !== "signature" &&
                      docData?.dataType !== "photograph" && (
                        <div className="mb-3">
                          {docData?.dataType === "category" ? (
                            <Select
                              label="Select Category"
                              labelPlacement="outside"
                              placeholder="Select category"
                              selectedKeys={
                                fieldCorrectValue ? [fieldCorrectValue] : []
                              }
                              onChange={(e) =>
                                setFieldCorrectValue(e.target.value)
                              }
                              className="w-full"
                            >
                              {categories?.map((cat: any) => (
                                <SelectItem key={cat?.name} value={cat?.name}>
                                  {cat?.name}
                                </SelectItem>
                              ))}
                            </Select>
                          ) : docData?.dataType === "yesNo" ? (
                            <Select
                              label="Select Option"
                              labelPlacement="outside"
                              placeholder="Yes or No"
                              selectedKeys={
                                fieldCorrectValue ? [fieldCorrectValue] : []
                              }
                              onChange={(e) =>
                                setFieldCorrectValue(e.target.value)
                              }
                              className="w-full"
                            >
                              <SelectItem key="Yes" value="Yes">
                                Yes
                              </SelectItem>
                              <SelectItem key="No" value="No">
                                No
                              </SelectItem>
                            </Select>
                          ) : docData?.dataType === "malefemale" ? (
                            <Select
                              label="Select Gender"
                              labelPlacement="outside"
                              placeholder="Gender"
                              selectedKeys={
                                fieldCorrectValue ? [fieldCorrectValue] : []
                              }
                              onChange={(e) =>
                                setFieldCorrectValue(e.target.value)
                              }
                              className="w-full"
                            >
                              <SelectItem key="Male" value="Male">
                                Male
                              </SelectItem>
                              <SelectItem key="Female" value="Female">
                                Female
                              </SelectItem>
                            </Select>
                          ) : docData?.dataType === "meritalstatus" ? (
                            <Select
                              label="Merital Status"
                              labelPlacement="outside"
                              placeholder="Select Merital Status"
                              selectedKeys={
                                fieldCorrectValue ? [fieldCorrectValue] : []
                              }
                              onChange={(e) =>
                                setFieldCorrectValue(e.target.value)
                              }
                              className="w-full"
                            >
                              <SelectItem key="Married" value="Married">
                                Married
                              </SelectItem>
                              <SelectItem key="Unmarried" value="Unmarried">
                                Unmarried
                              </SelectItem>
                            </Select>
                          ) : (
                            <Input
                              type={
                                docData?.dataType === "date" ? "date" : "text"
                              }
                              maxLength={
                                docData?.dataType === "mobile" ? 10 : 50
                              }
                              value={fieldCorrectValue}
                              onChange={(e) =>
                                setFieldCorrectValue(e.target.value)
                              }
                              placeholder="Enter correct value"
                            />
                          )}
                        </div>
                      )}
                    <Textarea
                      variant="bordered"
                      label="Event remark"
                      value={finalRemark}
                      onChange={(e) => setFinalRemark(e.target.value)}
                      labelPlacement="outside"
                      placeholder=" "
                      required={
                        modalType === "re_dv" && finalStatus === "Ineligible"
                      }
                      isRequired={
                        modalType === "re_dv" && finalStatus === "Ineligible"
                      }
                    />
                    {modalType === "re_dv" && (
                      <div className="mb-4 mt-3 flex justify-between gap-2">
                        <Button
                          className="h-10 flex-1"
                          variant={
                            selectedStatus === "Fit" ? "solid" : "bordered"
                          }
                          color="success"
                          onPress={() => setSelectedStatus("Fit")}
                          radius="full"
                        >
                          Fit
                        </Button>
                        <Button
                          className="h-10 flex-1"
                          variant={
                            selectedStatus === "Unfit" ? "solid" : "bordered"
                          }
                          color="danger"
                          onPress={() => setSelectedStatus("Unfit")}
                          radius="full"
                        >
                          Unfit
                        </Button>
                        <Button
                          className="h-10 flex-1"
                          variant={
                            selectedStatus === "Provisionally Fit"
                              ? "solid"
                              : "bordered"
                          }
                          color="warning"
                          onPress={() => setSelectedStatus("Provisionally Fit")}
                          radius="full"
                        >
                          Provisionally Fit
                        </Button>
                      </div>
                    )}
                    {modalType !== "view" && (
                      <div className="my-3">
                        <Button
                          color="primary"
                          className="w-full"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    )}
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isConsentModal}
          placement="top-center"
          onOpenChange={onOpenConsentModal}
          size="3xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  Before submitting the application, please review the following
                  details carefully:
                </ModalHeader>
                <ModalBody id="consent-modal-body">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>
                      <span className="font-semibold">
                        Scrutiny Process Completion:
                      </span>{" "}
                      Ensure that all assigned sections have been thoroughly
                      reviewed and verified.
                    </li>
                    <li>
                      <span className="font-semibold">Final Review:</span> Valid
                      that all corrections and updates, if any, have been
                      incorporated.
                    </li>
                    <li>
                      <span className="font-semibold">Acknowledgment:</span> By
                      proceeding, you acknowledge that the scrutiny process has
                      been completed to the best of your ability.
                    </li>
                  </ol>

                  <div className="my-4 text-center">
                    <h2 className="text-lg font-semibold">
                      Are you sure you want to submit this application for final
                      approval?
                    </h2>
                    <p className="text-sm text-gray-600">
                      Once submitted, no further changes can be made.
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter className="grid grid-cols-2 gap-6">
                  <Button
                    variant="bordered"
                    className="border"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleFinalStatus}>
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          className="z-50"
          isOpen={isOpenFile}
          onOpenChange={onOpenChangeFile}
          size="md"
          placement="center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 pb-1">
                  Upload Image
                </ModalHeader>
                <ModalBody>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleDocumentStatus(currentUser?._id, docData);
                    }}
                  >
                    <div className="grid grid-cols-1">
                      <div className="mb-3">
                        {uploadedImage ? (
                          <div className="">
                            <label>Uploaded File</label>
                            <Image
                              src={uploadedImage}
                              alt="Uploaded Preview"
                              width={100}
                              height={100}
                              className="h-[200px] w-[200px] rounded-md border-2 border-blue-500 object-contain p-1 shadow-lg"
                            />
                            <Button
                              color="primary"
                              className="mt-3 w-full"
                              onClick={() => {
                                setFieldCorrectValue("");
                                setUploadedImage(null);
                              }}
                            >
                              Reupload
                            </Button>
                          </div>
                        ) : (
                          <Input
                            startContent={
                              <span
                                className="material-symbols-rounded"
                                style={{ color: "rgb(100 116 139)" }}
                              >
                                upload
                              </span>
                            }
                            endContent={
                              <Button
                                size="sm"
                                variant="flat"
                                color="success"
                                className="w-[150px] text-sm font-medium text-green-700"
                                onClick={() => {
                                  onCloseFile();
                                  onOpen();
                                }}
                              >
                                <span
                                  className="material-symbols-rounded"
                                  style={{ color: "rgb(100 116 139)" }}
                                >
                                  add_a_photo
                                </span>
                                Capture
                              </Button>
                            }
                            required
                            isRequired
                            onChange={handleFileUpload}
                            type="file"
                            label="Upload File"
                            labelPlacement="outside"
                          />
                        )}
                      </div>
                      <div className="mb-3">
                        <Input
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          type="text"
                          placeholder="Enter Name"
                          label="Name"
                          labelPlacement="outside"
                          required
                          isRequired
                        />
                      </div>
                    </div>

                    <div className="my-3 grid grid-cols-2 gap-3">
                      <Button
                        color="primary"
                        className="mb-3 w-full"
                        onClick={() => {
                          onClose();
                          setFieldCorrectValue("");
                          setFileName("");
                        }}
                      >
                        Close
                      </Button>
                      <Button color="primary" className="w-full" type="submit">
                        Submit
                      </Button>
                    </div>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          className="z-50"
          isOpen={isOpenPreview}
          onOpenChange={onOpenChangePreview}
          size="3xl"
          placement="top"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  View Document
                </ModalHeader>
                <ModalBody>
                  <div>
                    <iframe src={document} width="100%" height="450px"></iframe>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      onClose();
                    }}
                    color="danger"
                  >
                    close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isCorrect} onOpenChange={onOpenCorrect}>
          <ModalContent>
            {(onClose) => (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDocumentStatus(currentUser?._id, docData);
                    onCloseCorrect();
                  }}
                >
                  <ModalHeader className="flex flex-col gap-1">
                    Upload Document
                  </ModalHeader>
                  <ModalBody>
                    <CustomMultipleUpload
                      {...register("file")}
                      preview={upload}
                      setPreview={setUpload}
                      handleChange={handleChangeST}
                      setValue={setValue}
                      accept={".pdf"}
                      name="Attachments"
                      placeholder="Upload PDF"
                      type="single"
                    />
                    <Textarea
                      label="Remark"
                      value={finalRemark}
                      onChange={(e) => setFinalRemark(e.target.value)}
                      labelPlacement="outside"
                      placeholder="Enter your remark"
                      required
                      isRequired
                      errorMessage={"Remark is required"}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      className="w-full"
                      type="submit"
                      // onPress={onCloseCorrect}
                    >
                      Upload
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default CandidateDocumentVerification;
