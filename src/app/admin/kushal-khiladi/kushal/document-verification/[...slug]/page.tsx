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
  Select,
  SelectItem,
  Card,
} from "@nextui-org/react";
import FlatCard from "@/components/FlatCard";
import DVAccordianItem from "@/assets/data/kushalDVFields.json";
import Image from "next/image";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import {
  CallFetchApplicationScreeningDetails,
  CallUpdateApplicationScreening,
  CallUpdateAppllicationScreeningDetailsStatus,
  CallUpdateAppllicationScreeningDocumentStatus,
  CallUpdateDVstep,
  CallUpdateScreeningApplicationStatus,
} from "@/_ServerActions";
import { useParams, useRouter } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";
import toast from "react-hot-toast";
import moment from "moment";
import CameraModal from "@/components/CameraModal";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
import SportsDetailsTable from "@/components/kushal-components/SportsDetailsTable";
import Stepper from "@/components/Stepper";
import { useSessionData } from "@/Utils/hook/useSessionData";

const CandidateDocumentVerification: React.FC = () => {
  const { advertisementId } = useSessionData();
  const slug = useParams() as any;

  const applicationId = slug?.slug[1];

  const router = useRouter();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
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
  const [sportsData, setSportsData] = useState<any[]>([]);
  const videoRef = useRef<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [candidateAdvertisementId, setCandidateAdvertisementId] =
    useState<string>("");

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

  const getKushalApplications = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallFetchApplicationScreeningDetails(
        `applicationId=${applicationId}`,
      )) as any;
      console.log("Application Data: ", data);
      
      if (data.message === "Application retrieved successfully!") {
        let documetData: any = {};
        if (data?.respose?.documetData?.length) {
          data?.respose?.documetData?.forEach((item: any) => {
            documetData[item.fieldName || "fieldName"] = item;
          });
          data.respose.documetData = documetData;
        }
        setCurrentUser(data.respose);
        setCandidateAdvertisementId(data?.respose?.advertisementId);
        setSportsData(data?.respose?.sportsCertificates);
        setCurrentStep(data?.respose?.currentStep);
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
  }, [applicationId]);

  const [candidateData, setCandidateData] = useState<any>({
    accordianItem: DVAccordianItem,
  });

  const stepsArray = [
    { title: "Identity Documents" },
    { title: "Personal Details" },
    { title: "Address Details" },
    { title: "High School/10th" },
    { title: "Intermediate/12th" },
    { title: "Sports Details" },
  ];

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
      section.data = section.data.map((item: any) => {
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

  const handleSubmit = async (applicationId: string, attendance: string) => {
    try {
      setLoading(attendance);
      const formData = {
        id: applicationId,
        candidateStatus: attendance,
      };
      const { data, error } = (await CallUpdateApplicationScreening(
        formData,
      )) as any;
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
      };
      const data = (await CallUpdateScreeningApplicationStatus(
        formData,
      )) as any;
      if (data?.data) {
        setFinalStatus("");
        setFinalRemark("");
        closeConsentModal();
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
    applicationId: string,
    fieldData: any,
  ) => {
    try {
      // setFinalStatusLoading(true);
      const result = extractRemainingPath(fieldData?.key, fieldData?.fieldName);
      const formData = {
        _id: applicationId,
        fieldType: result,
        fieldName: fieldData?.fieldName,
        status: fieldData?.status,
        remarks: finalRemark,
        correctValue: fieldCorrectValue,
      };
      const formDatafile = new FormData();
      formDatafile.append("appllicationScreeningId", applicationId);
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
      let response: any;

      if (
        fieldData?.dataType === "photograph" ||
        fieldData?.dataType === "signature"
      ) {
        response = (await CallUpdateAppllicationScreeningDocumentStatus(
          formDatafile,
        )) as any;
      } else {
        response = (await CallUpdateAppllicationScreeningDetailsStatus(
          formData,
        )) as any;
      }
      const { data, error } = response;
      if (data) {
        setFinalStatus("");
        setFinalRemark("");
        setFieldCorrectValue("");
        setUploadedImage(null);
        setFileName("");
        onCloseRemarkModal();
        onCloseFile();
        getKushalApplications("");
        toast.success(data);
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
      section.data = section.data.map((item: any) => {
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
      aria-label="Kushal Khiladi Scrunity application"
      className="mb-6"
      classNames={{ wrapper: "shadow-none p-0" }}
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
    switch (columnKey) {
      case "value":
        return item?.dataType === "photograph" ? (
          <div className="flex gap-6">
            {item?.document?.length
              ? item?.document?.map((doc: any, index: any) => (
                  <div key={index}>
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                      <img
                        src={doc?.url || ""}
                        alt="Photograph"
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
              <p className="mt-1 text-xs">Current Signature</p>
            </div>
          </div>
        ) : item?.dataType === "document" && cellValue !== "NA" ? (
          <Button
            size="md"
            variant="light"
            className="bg-transparent hover:!bg-transparent"
            onPress={() => {
              setDocument(item?.value);
              onOpenPreview();
            }}
            isIconOnly
          >
            <Image
              src={pdf.src}
              width={30}
              height={30}
              className="object-contain"
              alt="pdfIcon"
            />
          </Button>
        ) : item?.dataType === "date" && cellValue !== "NA" ? (
          moment(cellValue).format("ll")
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
                updateStatus(sectionIndex, item.id, "Matched", setDocumentData);
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
                updateStatus(
                  sectionIndex,
                  item.id,
                  "Unmatched",
                  setDocumentData,
                );
              }}
            >
              Unmatched
            </Button>
          </div>
        );
      case "correctValue":
        return (
          <Tooltip content={cellValue}>
            <p>{cellValue ? cellValue : "---"}</p>
          </Tooltip>
        );
      case "sportCertificate":
        return (
          <Button
            size="md"
            variant="light"
            className="bg-transparent hover:!bg-transparent"
            onPress={() => {
              setDocument(item?.value);
              onOpenPreview();
            }}
            isIconOnly
          >
            <Image
              src={pdf.src}
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

  const updateCurrentUserData = useCallback((currentItem: any) => {
    const jsonUI = candidateData.accordianItem;

    const getNestedValue = (path: string, obj: any) =>
      path
        ?.split(".")
        .reduce((acc: any, key: string) => (acc ? acc[key] : "NA"), obj);

    return jsonUI.map((section: any) => {
      if (section.title) {
        const updatedData = section?.data?.map((detail: any) => {
          const value = getNestedValue(detail.key, currentItem);
          if (
            detail.dataType === "photograph" ||
            detail.dataType === "signature"
          ) {
            return {
              ...detail,
              fieldName: value?.fieldName || "NA",
              status: value?.status || "NA",
              remark: value?.remarks || "",
              correctValue: value?.correctValue || "",
              document: value?.document || [],
              _id: value?._id || "",
            };
          }
          return {
            ...detail,
            value: value?.value || "NA",
            fieldName: value?.fieldName || "NA",
            status: value?.status || "NA",
            remark: value?.remarks || "",
            correctValue: value?.correctValue || "",
          };
        });
        return { ...section, data: updatedData };
      }
      return section;
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const updatedJson = updateCurrentUserData(currentUser);
      setCandidateData({ accordianItem: updatedJson });
    }
  }, [currentUser, updateCurrentUserData]);
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

  const handleNext = () => {
    if (currentStep < candidateData?.accordianItem.length) {
      setCurrentStep(currentStep + 1);
      updateDVsteps(currentStep + 1);
    } else {
      setFinalStatus("Eligible");
      setModalType("re_dv");
      onRemarkModal();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      updateDVsteps(currentStep - 1);
    }
  };

  const updateDVsteps = async (stepNo: number) => {
    try {
      const obj = {
        applicationId,
        currentStep: stepNo,
      };
      const { data, error } = (await CallUpdateDVstep(obj)) as any;

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

  return (
    <>
      <FlatCard>
        <h1 className="mb-6 text-2xl font-semibold">Document Verification</h1>

        {loader === "showSkeleton" ? (
          <CardSkeleton cardsCount={3} columns={1} />
        ) : (
          <>
            <div className="flex items-center">
              <h4 className="me-8 text-xl font-semibold">Attendance</h4>
              <div className="flex gap-3 overflow-x-auto">
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

            {/* {currentUser?.candidateStatus === "Present" && (
              <>
                <Accordion className="rounded-lg p-0" defaultExpandedKeys="all">
                  {candidateData?.accordianItem?.map(
                    (item: any, index: any) => (
                      <AccordionItem
                        key={index}
                        title={
                          <h5 className="text-xl font-semibold">
                            {item?.title}
                          </h5>
                        }
                      >
                        {renderTable(
                          item?.title === "Identity Documents पहचान दस्तावेज़"
                            ? identityColumns
                            : otherColumns,
                          item?.data,
                          index,
                          setDocData,
                        )}
                      </AccordionItem>
                    ),
                  )}
                  <AccordionItem
                    key="99"
                    aria-label="Accordion 3"
                    title={
                      <h5 className="text-xl font-semibold">Sports Details</h5>
                    }
                  >
                    <SportsDetailsTable
                      sportsData={sportsData}
                      getKushalApplications={getKushalApplications}
                      docPreviewModal={onOpenPreview}
                      setDocument={setDocument}
                      applicationId={applicationId}
                      advertisementId={advertisementId}
                    />
                  </AccordionItem>
                </Accordion>

                <div className="mt-10 grid grid-cols-2 gap-60">
                  <Button
                    className="bg-red-600 text-white"
                    onClick={() => {
                      setFinalStatus("Ineligible");
                      setModalType("re_dv");
                      onRemarkModal();
                    }}
                  >
                    Ineligible
                  </Button>
                  <Button
                    className="bg-green-600 text-white"
                    onClick={() => {
                      setFinalStatus("Eligible");
                      setModalType("re_dv");
                      onRemarkModal();
                    }}
                  >
                    Eligible
                  </Button>
                </div>
              </>
            )} */}
          </>
        )}
      </FlatCard>

      {currentUser?.candidateStatus === "Present" && (
        <FlatCard>
          <Stepper
            items={stepsArray}
            currentStep={currentStep}
            completedStep={currentStep - 1}
          />
          {candidateData?.accordianItem?.map((item: any, index: number) =>
            index === currentStep ? (
              <div key={index}>
                <h1 className="mb-4 text-2xl font-semibold mob:text-lg">
                  {item?.title}
                </h1>

                {renderTable(
                  item?.title === "Identity Documents पहचान दस्तावेज़"
                    ? identityColumns
                    : otherColumns,
                  item?.data,
                  index,
                  setDocData,
                )}
              </div>
            ) : null,
          )}

          {currentStep === candidateData?.accordianItem.length && (
            <SportsDetailsTable
              sportsData={sportsData}
              getKushalApplications={getKushalApplications}
              docPreviewModal={onOpenPreview}
              setDocument={setDocument}
              applicationId={applicationId}
              advertisementId={candidateAdvertisementId}
              currentUser={currentUser}
            />
          )}

          <div className="flex justify-end gap-3">
            <Button
              onPress={handlePrev}
              className={`${currentStep === 0 && "hidden"}`}
              startContent={
                <span className="material-symbols-rounded">arrow_back</span>
              }
            >
              Previous
            </Button>
            <Button
              color="primary"
              onPress={handleNext}
              endContent={
                currentStep !== candidateData?.accordianItem.length && (
                  <span className="material-symbols-rounded">
                    arrow_forward
                  </span>
                )
              }
            >
              {currentStep === candidateData?.accordianItem.length
                ? "Submit"
                : "Save & Next"}
            </Button>
          </div>
        </FlatCard>
      )}

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
                        <Input
                          type={docData?.dataType === "date" ? "date" : "text"}
                          value={fieldCorrectValue}
                          onChange={(e) => setFieldCorrectValue(e.target.value)}
                          placeholder="Enter correct value"
                        />
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
                  {modalType !== "view" && (
                    <div className="my-3">
                      <Button color="primary" className="w-full" type="submit">
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
                <Button variant="bordered" className="border" onPress={onClose}>
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
                            onPress={() => {
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
                              onPress={() => {
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
                      onPress={() => {
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
                  onPress={() => {
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

      <CameraModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        action={HandleCapturedImage}
        loader={cameraLoader}
        setLoader={setCameraLoader}
        title="Capture Image"
        newEnroll={false}
      />
    </>
  );
};

export default CandidateDocumentVerification;
