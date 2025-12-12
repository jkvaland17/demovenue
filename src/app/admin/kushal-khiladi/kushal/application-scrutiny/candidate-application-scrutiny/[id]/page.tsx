"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
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
  useDisclosure,
  Tooltip,
  Image,
} from "@nextui-org/react";
import scrutinyAccordianItem from "@/assets/data/scrutinyFields.json";
import { useParams, useRouter } from "next/navigation";
import {
  CallGetApplicationScrutinyDetails,
  CallUpdateApplicationScrutinyStatus,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import toast from "react-hot-toast";
import { handleCommonErrors } from "@/Utils/HandleError";
import moment from "moment";
import BackButton from "@/components/BackButton";
import UserSportsDetailsTable from "@/components/kushal-components/application-scrutiny/UserSportsDetailsTable";

const KushalKhiladiApplicationScrutiny: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>();
  const [loader, setLoader] = useState<string>("");
  const [modalType, setModalType] = useState("view");
  const [document, setDocument] = useState<any>("");
  const [finalVerification, setFinalVerification] = useState<any>({
    status: "",
    remark: "",
  });
  const [candidateData, setCandidateData] = useState<{
    accordianItem: {
      title: string;
      data: any[];
    }[];
  }>({
    accordianItem: scrutinyAccordianItem?.scrutinyAccordianItem,
  });

  const {
    isOpen: isRemarkModal,
    onOpen: onRemarkModal,
    onOpenChange: onOpenRemarkModal,
  } = useDisclosure();
  const {
    isOpen: isConsentModal,
    onOpen: onConsentModal,
    onOpenChange: onOpenConsentModal,
  } = useDisclosure();
  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onOpenChange: onOpenChangePreview,
  } = useDisclosure();

  useEffect(() => {
    getKushalApplications();
  }, [id]);

  const columns = [
    { name: "Field Name", uid: "title" },
    { name: "Registration Value", uid: "value" },
  ];
  const sportsColumns = [
    { name: "Sport", uid: "sport" },
    { name: "Sub sport", uid: "subSport" },
    { name: "Sport certificate", uid: "value" },
  ];

  const getKushalApplications = async () => {
    setLoader("userData");
    try {
      const { data, error } = (await CallGetApplicationScrutinyDetails(
        `applicationId=${id}`,
      )) as any;
      if (data) {
        setCurrentUser(data.application[0]);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const updateStatus = (
    sectionIndex: number,
    itemId: number,
    newStatus: string,
  ) => {
    setCandidateData((prevData) => {
      const updatedData = { ...prevData };
      const section = updatedData.accordianItem[sectionIndex];
      if (section?.data) {
        section.data = section.data.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item,
        );
      }
      return updatedData;
    });
  };

  const renderTable = (
    columns: { name: string; uid: string }[],
    data: any,
    sectionIndex: number,
  ) => (
    <Table
      removeWrapper
      aria-label="Kushal Khiladi Scrunity application"
      className="mb-6"
    >
      <TableHeader columns={columns}>
        {(column) => (
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
              <TableCell>{renderCell(sectionIndex, item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderCell = (sectionIndex: number, item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "value":
        return item?.dataType === "document" ? (
          cellValue === "NA" ? (
            "NA"
          ) : (
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
                alt="pdfIcon"
                className="h-full w-full object-contain"
              />
            </Button>
          )
        ) : item?.dataType === "date" && cellValue !== "NA" ? (
          moment(cellValue).format("ll")
        ) : item?.dataType === "image" ? ( // Fixed condition to check for "image"
          <div className="mb-5 h-[100px] w-[100px] rounded-lg">
            <Image
              src={item?.value}
              className="h-full w-full object-contain !opacity-100"
              alt="image"
            />
          </div>
        ) : Array.isArray(cellValue) ? (
          cellValue.join(", ")
        ) : (
          cellValue
        );
      case "status":
        return (
          <div className="flex gap-2">
            <Button
              variant={cellValue === "Valid" ? "solid" : "ghost"}
              color={cellValue === "Valid" ? "success" : "default"}
              radius="full"
              className={`text-white ${cellValue === "Valid" ? "" : "border border-slate-400 text-black"}`}
              onPress={() => updateStatus(sectionIndex, item.id, "Valid")}
            >
              Valid
            </Button>
            <Button
              variant={cellValue === "Invalid" ? "solid" : "ghost"}
              color={cellValue === "Invalid" ? "danger" : "default"}
              radius="full"
              className={`${cellValue === "Invalid" ? "" : "border border-slate-400"}`}
              onPress={() => updateStatus(sectionIndex, item.id, "Invalid")}
            >
              Invalid
            </Button>
          </div>
        );
      case "remark":
        return (
          <div className="flex justify-center gap-4">
            <Tooltip content="View Remark">
              <Button
                onPress={() => {
                  setModalType("view");
                  onRemarkModal();
                }}
                color="primary"
                variant="flat"
                radius="full"
                className="h-[40px] w-[40px] min-w-fit p-0"
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "rgb(29 78 216)" }}
                >
                  visibility
                </span>
              </Button>
            </Tooltip>
            <Tooltip content="Add/Edit Remark">
              <Button
                onPress={() => {
                  setModalType("edit");
                  onRemarkModal();
                }}
                color="secondary"
                variant="flat"
                radius="full"
                className="h-[40px] w-[40px] min-w-fit p-0"
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "rgb(109 40 217)" }}
                >
                  edit
                </span>
              </Button>
            </Tooltip>
          </div>
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

    return jsonUI.map((section) => {
      if (section.title) {
        const updatedData = section?.data?.map((detail) => {
          const value = getNestedValue(detail.key, currentItem);
          return { ...detail, value: value || "NA" };
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

  const handleSubmit = async (item: any, finalData: any) => {
    try {
      setLoader("status");
      const formData = {
        applicationScrutinyId: item?._id,
        applicationStatus: finalData?.status,
        remark: finalData?.remark,
      };
      const { data, error } = (await CallUpdateApplicationScrutinyStatus(
        formData,
      )) as any;
      if (error) {
        handleCommonErrors(error);
        setLoader("");
      } else if (data?.message === "Application Status update successfully!") {
        toast.success(data?.message);
        router.back();
      }
    } catch (error: any) {
      console.log(error);
      setLoader("");
    }
  };

  return (
    <>
      {loader === "userData" ? (
        <CardSkeleton cardsCount={3} columns={1} />
      ) : (
        <FlatCard>
          <div className="flex items-center justify-between mob:items-start">
            <h1 className="mb-6 text-2xl font-semibold">
              Candidate Application Scrutiny
            </h1>
            <BackButton />
          </div>

          <Accordion className="rounded-lg p-0" defaultExpandedKeys="all">
            {candidateData.accordianItem?.map((item, index) => (
              <AccordionItem
                key={index}
                title={<h5 className="text-xl font-semibold">{item?.title}</h5>}
              >
                {renderTable(
                  item?.title === "Sports Details" ? sportsColumns : columns,
                  item?.data,
                  index,
                )}
              </AccordionItem>
            ))}
          </Accordion>
          <UserSportsDetailsTable
            data={currentUser?.applicationDetails?.sportsCertificate}
          />

          <div className="mt-10 flex justify-end gap-5">
            <Button
              color="danger"
              onPress={() => {
                setFinalVerification({
                  ...finalVerification,
                  status: "Rejected",
                });
                onOpenRemarkModal();
              }}
            >
              Rejected
            </Button>
            <Button
              color="success"
              className="text-white"
              onPress={() => {
                setFinalVerification({
                  ...finalVerification,
                  status: "Accepted",
                });
                onOpenRemarkModal();
              }}
            >
              Accepted
            </Button>
          </div>

          <Modal
            isOpen={isRemarkModal}
            onOpenChange={onOpenRemarkModal}
            size="xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 pb-1">
                    {finalVerification?.status}
                  </ModalHeader>
                  <ModalBody>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onClose();
                        onConsentModal();
                      }}
                    >
                      <Textarea
                        value={finalVerification?.remark}
                        onChange={(e) =>
                          setFinalVerification({
                            ...finalVerification,
                            remark: e.target.value,
                          })
                        }
                        placeholder="Enter Remarks"
                        required={finalVerification.status === "Rejected"}
                        isRequired={finalVerification.status === "Rejected"}
                        minRows={5}
                      />
                      <div className="my-3 grid grid-cols-2 gap-3">
                        {" "}
                        <Button type="submit" color="primary">
                          Submit
                        </Button>
                        <Button
                          onPress={() => {
                            onClose();
                            setFinalVerification({
                              status: "",
                              remark: "",
                            });
                          }}
                          color="danger"
                        >
                          close
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
                      <iframe
                        src={document}
                        width="100%"
                        height="450px"
                      ></iframe>
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
                    Before submitting the application, please review the
                    following details carefully:
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
                        <span className="font-semibold">Final Review:</span>{" "}
                        Valid that all corrections and updates, if any, have
                        been incorporated.
                      </li>
                      <li>
                        <span className="font-semibold">Acknowledgment:</span>{" "}
                        By proceeding, you acknowledge that the scrutiny process
                        has been completed to the best of your ability.
                      </li>
                    </ol>

                    <div className="my-4 text-center">
                      <h2 className="text-lg font-semibold">
                        Are you sure you want to submit this application for
                        final approval?
                      </h2>
                      <p className="text-sm text-gray-600">
                        Once submitted, no further changes can be made.
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter className="grid grid-cols-2">
                    <Button
                      onPress={() => {
                        handleSubmit(currentUser, finalVerification);
                      }}
                      isLoading={loader === "status"}
                      color="primary"
                    >
                      Submit
                    </Button>
                    <Button
                      onPress={() => {
                        onClose();
                        setFinalVerification({
                          status: "",
                          remark: "",
                        });
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
        </FlatCard>
      )}
    </>
  );
};

export default KushalKhiladiApplicationScrutiny;
