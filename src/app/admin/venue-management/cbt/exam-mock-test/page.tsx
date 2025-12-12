"use client";
import {
  CallGetAllDistricts,
  CallGetCenterMockStats,
  CallGetCenters,
  CallGetFormByTemplateId,
  CallGetPhaseData,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FieldDisplay from "@/components/FieldDisplay";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import { title } from "process";
import React, { useEffect, useState } from "react";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;
type Props = {};

const ExamMockTest = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [currentCenter, setCurrentCenter] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
  const [dynamicModal, setDynamicModal] = useState<any[]>([]);
  const [stats, setStats] = useState<any>();
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const [loadingPhaseKey, setLoadingPhaseKey] = useState<string | null>(null);
  const [filterData, setFitlerData] = useState<any>({
    status: "",
    district: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isCenter,
    onOpen: onCenter,
    onOpenChange: onOpenCenter,
  } = useDisclosure();
  const {
    isOpen: isPhase,
    onOpen: onPhase,
    onOpenChange: onOpenPhase,
  } = useDisclosure();

  const ObserverFeedbackData = [
    {
      icon: "schedule",
      title: "Mock Start Time",
      value:
        currentCenter?.centerObserverData?.examMockConduction?.mockStartTime.toUpperCase(),
    },
    {
      icon: "schedule",
      title: "Mock End Time",
      value:
        currentCenter?.centerObserverData?.examMockConduction?.mockEndTime.toUpperCase(),
    },
    {
      icon: "tag",
      title: "Mock Count",
      value: currentCenter?.centerObserverData?.examMockConduction?.mockCount,
    },
    {
      icon: "tag",
      title: "Registration Mock Count",
      value:
        currentCenter?.centerObserverData?.examMockConduction
          ?.registerMockCount,
    },
    {
      icon: "assignment",
      title: "Observation",
      value: currentCenter?.centerObserverData?.examMockConduction?.observation,
    },
  ];
  const columns = [
    { title: "District", key: "district" },
    { title: "Center Head", key: "centerHead" },
    { title: "Center Name", key: "centerName" },
    { title: "Phase 1 Status", key: "phase1" },
    { title: "Phase 2 Status", key: "phase2" },
    { title: "Phase 3 Status", key: "phase3" },
    { title: "Actions", key: "actions" },
  ];
  const cardData = [
    {
      title: "Total Pending",
      value: stats?.totalPending ?? 0,
    },
    {
      title: "Total Phase 1 Completed",
      value: stats?.phase1Complete ?? 0,
    },
    {
      title: "Total Phase 2 Completed",
      value: stats?.phase2Complete ?? 0,
    },
    {
      title: "Total Phase 3 Completed",
      value: stats?.phase3Complete ?? 0,
    },
  ];
  const phaseData = [
    {
      key: "phase1",
      title: "Phase 1 - Activity",
      status:
        currentCenter?.examMockConductionPhasesStatus?.find(
          (p: any) => p.phaseKey === "phase1",
        )?.status === "Completed"
          ? "Completed"
          : "Not Started",
      date: moment(
        currentCenter?.examMockConductionPhasesStatus?.find(
          (p: any) => p.phaseKey === "phase1",
        )?.submittedDate,
      ).format("DD-MM-YYYY"),
    },
    {
      key: "phase2",
      title: "Phase 2 - Activity",
      status:
        currentCenter?.examMockConductionPhasesStatus?.find(
          (p: any) => p.phaseKey === "phase2",
        )?.status === "Completed"
          ? "Completed"
          : "Not Started",
      date: moment(
        currentCenter?.examMockConductionPhasesStatus?.find(
          (p: any) => p.phaseKey === "phase2",
        )?.submittedDate,
      ).format("DD-MM-YYYY"),
    },
    {
      key: "phase3",
      title: "Phase 3 - Final Preparation Day",
      status:
        currentCenter?.examMockConductionPhasesStatus?.find(
          (p: any) => p.phaseKey === "phase3",
        )?.status === "Completed"
          ? "Completed"
          : "Not Started",
      date: moment(
        currentCenter?.examMockConductionPhasesStatus?.find(
          (p: any) => p.phaseKey === "phase3",
        )?.submittedDate,
      ).format("DD-MM-YYYY"),
    },
  ];
  const statusColorMap: { [key: string]: ChipColor } = {
    "Not Started": "warning",
    Completed: "success",
    undefined: "default",
  };

  const updateCurrentUserData = (currentItem: any, phaseKey: string) => {
    const jsonUI = dynamicModal?.find(
      (item: any) => item?.key === phaseKey,
    )?.sections;

    console.log("jsonUI", jsonUI);

    const getNestedValue = (path: any, obj: any) =>
      path
        ?.split(".")
        .reduce((acc: any, key: any) => (acc ? acc[key] : "NA"), obj);

    return (
      jsonUI?.map((section: any) => {
        const updatedFields = section?.fields?.map((detail: any) => {
          return {
            ...detail,
            value: getNestedValue(detail.key, currentItem) || "NA",
          };
        });

        return {
          ...section,
          fields: updatedFields,
        };
      }) ?? []
    );
  };

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "centerName":
        return <p>{item?.school_name}</p>;
      case "district":
        return <p>{item?.district?.name}</p>;
      case "phase1": {
        const phaseStatus =
          item?.examMockConductionPhasesStatus?.find(
            (p: any) => p.phaseKey === "phase1",
          )?.status === "Completed"
            ? "Completed"
            : "Not Started";

        if (phaseStatus) {
          return (
            <Chip
              color={statusColorMap[phaseStatus]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {phaseStatus}
            </Chip>
          );
        } else {
          return <p>-</p>;
        }
      }
      case "phase2": {
        const phaseStatus =
          item?.examMockConductionPhasesStatus?.find(
            (p: any) => p.phaseKey === "phase2",
          )?.status === "Completed"
            ? "Completed"
            : "Not Started";

        if (phaseStatus) {
          return (
            <Chip
              color={statusColorMap[phaseStatus]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {phaseStatus}
            </Chip>
          );
        } else {
          return <p>-</p>;
        }
      }
      case "phase3": {
        const phaseStatus =
          item?.examMockConductionPhasesStatus?.find(
            (p: any) => p.phaseKey === "phase3",
          )?.status === "Completed"
            ? "Completed"
            : "Not Started";

        if (phaseStatus) {
          return (
            <Chip
              color={statusColorMap[phaseStatus]}
              variant="flat"
              radius="full"
              className="capitalize"
            >
              {phaseStatus}
            </Chip>
          );
        } else {
          return <p>-</p>;
        }
      }
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="view"
                onPress={() => {
                  setCurrentCenter(item);
                  onCenter();
                }}
              >
                View Center Head Supervisor Data
              </DropdownItem>
              <DropdownItem
                key="observer"
                onPress={() => {
                  setCurrentCenter(item);
                  onOpen();
                }}
              >
                View Observer Feedback
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const getCenters = async () => {
    setIsLoading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetCenters(query)) as any;
      console.log("getCenters", { data, error });

      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getCenters();
    }
  }, [page]);
  useEffect(() => {
    if (currentAdvertisementID) {
      getCenters();
      getDynamicAccordian();
    }
  }, [currentAdvertisementID]);

  const getAllDistricts = async () => {
    try {
      // const query = `stateId=${filterData?.stateId}&zoneId=${filterData?.zoneId}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllDistricts()) as any;
      // console.log("getAllDistricts", { data, error });

      if (data) {
        setAllDistricts(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDynamicAccordian = async () => {
    try {
      const query = `key=exam_mock_conduction_form_mobile&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetFormByTemplateId(query)) as any;
      console.log("getDynamicAccordian", { data, error });

      if (data) {
        setDynamicModal(data?.data?.formData);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDistricts();
  }, []);

  const clearFilter = () => {
    setFitlerData({
      status: "",
      district: "",
    });
    getCenters();
  };

  const getPhaseData = async (phaseKey: string) => {
    setLoadingPhaseKey(phaseKey);
    try {
      const query = `advertisementId=${currentAdvertisementID}&centerId=${currentCenter?._id}&phasekey=${phaseKey}`;
      const { data, error } = (await CallGetPhaseData(query)) as any;
      console.log("getPhaseData", { data, error });

      if (data) {
        const updatedJson = updateCurrentUserData(data?.data, phaseKey);
        setCurrentPhase(updatedJson);
        onPhase();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingPhaseKey(null);
  };

  // console.log("currentPhase", currentPhase);
  const getStats = async () => {
    try {
      const query = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetCenterMockStats(query)) as any;
      console.log("getStats", { data, error });

      if (data) {
        setStats(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      getStats();
    }
  }, [currentAdvertisementID]);

  return (
    <>
      <FlatCard heading="Exam Mock Test Overview">
        <CardGrid columns={4} data={cardData} />
      </FlatCard>

      <Table
        isStriped
        color="default"
        className="mb-6"
        topContent={
          <>
            <h2 className="text-xl font-semibold">Exam Mock Test Data</h2>
            <div className="grid grid-cols-4 flex-wrap items-end gap-4 mob:flex mob:flex-col mob:items-stretch tab:grid-cols-2">
              <Autocomplete
                defaultItems={allDistricts}
                selectedKey={filterData?.district}
                label="District"
                labelPlacement="outside"
                placeholder="Select"
                onSelectionChange={(e) => {
                  setFitlerData((prev: any) => ({
                    ...prev,
                    district: e,
                  }));
                }}
              >
                {(item: any) => (
                  <AutocompleteItem key={item?._id}>
                    {item?.district}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(`v1/admin/center/downloadCenterByDistrictExcel?advertisementId=${currentAdvertisementID}&district=${filterData?.district}`, "Exam mock test", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(`v1/admin/center/downloadCenterByDistrictPDF?advertisementId=${currentAdvertisementID}&district=${filterData?.district}`, "Exam mock test", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
              <FilterSearchBtn
                searchFunc={getCenters}
                clearFunc={clearFilter}
              />
            </div>
          </>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination
              showControls
              total={totalPage}
              page={page}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              className="text-wrap mob:text-nowrap tab:text-nowrap"
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={allData}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No data"
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isCenter} onOpenChange={onOpenCenter} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Center Head Supervisor Data
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 gap-3">
                  {phaseData.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-300 p-3"
                    >
                      <div className="flex justify-between gap-6">
                        <p className="text-lg font-medium">{item?.title}</p>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            item?.status === "Completed"
                              ? "success"
                              : item?.status === "Not Started"
                                ? "warning"
                                : "default"
                          }
                        >
                          {item?.status}
                        </Chip>
                      </div>
                      {item?.date && item?.status === "Completed" && (
                        <p className="text-sm text-slate-500">{item?.date}</p>
                      )}
                      <Button
                        color="primary"
                        radius="sm"
                        size="sm"
                        className="mt-2"
                        isLoading={loadingPhaseKey === item?.key}
                        onPress={() => {
                          getPhaseData(item?.key);
                        }}
                        isDisabled={item?.status !== "Completed"}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isPhase}
        onOpenChange={onOpenPhase}
        size="5xl"
        placement="top"
        className="max-w-[100rem]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                City Exam Center
              </ModalHeader>
              <ModalBody>
                <>
                  <Accordion defaultExpandedKeys="all">
                    {currentPhase
                      ?.filter((section: any) => section?.titleEnglish)
                      .map((section: any, index: number) => (
                        <AccordionItem
                          key={index}
                          aria-label={`Accordion ${index}`}
                          title={
                            <p className="text-xl font-semibold">
                              {section?.titleEnglish}
                            </p>
                          }
                        >
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {section?.fields?.map(
                              (field: any, fieldIndex: number) => (
                                <FieldDisplay key={fieldIndex} field={field} />
                              ),
                            )}
                          </div>
                        </AccordionItem>
                      ))}
                  </Accordion>

                  {/* Sections with no title */}
                  {currentPhase
                    ?.filter((section: any) => !section?.titleEnglish)
                    .map((section: any, index: number) => (
                      <div
                        key={index}
                        className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4"
                      >
                        {section?.fields?.map(
                          (field: any, fieldIndex: number) => (
                            <FieldDisplay key={fieldIndex} field={field} />
                          ),
                        )}
                      </div>
                    ))}
                </>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Observer Feedback
              </ModalHeader>
              <ModalBody>
                {ObserverFeedbackData.map(({ icon, title, value }, index) => (
                  <div key={index} className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="material-symbols-rounded align-bottom">
                        {icon}
                      </span>{" "}
                      {title}
                    </div>
                    <div className="flex gap-2">
                      <span>:</span>
                      <div>{value}</div>
                    </div>
                  </div>
                ))}
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
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

export default ExamMockTest;
