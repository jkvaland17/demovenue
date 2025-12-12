"use client";
import {
  CallGetAllDistricts,
  CallGetCBTCenterVerificationData,
  CallGetCenterAuditStats,
  CallGetCenters,
  CallGetVenueDynamicAccordians,
} from "@/_ServerActions";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import FieldDisplay from "@/components/FieldDisplay";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import { set } from "react-hook-form";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type Props = {};

const CenterAuditData = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [stats, setStats] = useState<any>();
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentCenterData, setCurrentCenterData] = useState<any>();
  const [currentCenter, setCurrentCenter] = useState<any>();
  const [dynamicModal, setDynamicModal] = useState<any[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
    const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const [filterData, setFitlerData] = useState<any>({
    status: "",
    district: "",
  });

  const cardData = [
    {
      title: "Total Centers",
      value: stats?.totalCenter ?? 0,
    },
    {
      title: "Completed",
      value: stats?.totalCompleted ?? 0,
    },
    {
      title: "Pending",
      value: stats?.totalPending ?? 0,
    },
  ];

  const columns = [
    { title: "Center Name", key: "centerName" },
    { title: "District", key: "district" },
    { title: "Status", key: "status" },
    { title: "Actions", key: "actions" },
  ];

  const updateCurrentUserData = (currentItem: any) => {
    const jsonUI = dynamicModal;
    console.log("jsonUI", jsonUI);

    const getNestedValue = (path: any, obj: any) =>
      path
        .split(".")
        .reduce((acc: any, key: any) => (acc ? acc[key] : "NA"), obj);

    return jsonUI.map((section: any) => {
      if (section?.titleEnglish) {
        const updatedData = section?.fields?.map((detail: any) => {
          return {
            ...detail,
            value: getNestedValue(detail.key, currentItem) || "NA",
          };
        });
        return { ...section, fields: updatedData };
      }
      return section;
    });
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "district":
          return <p className="capitalize">{item?.district?.name}</p>;
        case "centerName":
          return <p className="capitalize">{item?.school_name}</p>;
        case "status":
          return (
            <Chip
              variant="flat"
              color={item?.isCenterAuditDataSubmitted ? "success" : "warning"}
            >
              {item?.isCenterAuditDataSubmitted ? "Completed" : "Pending"}
            </Chip>
          );
        case "actions":
          return item?.isCenterAuditDataSubmitted ? (
            <Tooltip content="View" showArrow={true}>
              <Button
                color="primary"
                radius="full"
                variant="light"
                size="sm"
                isIconOnly
                onPress={() => {
                  getCenterAuditData(item?._id);
                  onOpen();
                }}
                startContent={
                  <span className="material-symbols-rounded">visibility</span>
                }
              ></Button>
            </Tooltip>
          ) : (
            "-"
          );
        default:
          return cellValue;
      }
    },
    [dynamicModal],
  );

  const getCenters = async (filter: boolean) => {
    setIsLoading(true);
    try {
          const filterON = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10&district=${filterData?.district}&status=${filterData?.status}`;
    const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;

      const { data, error } = (await CallGetCenters( filter ? filterON : filterOFF,)) as any;
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
      getCenters(false);
    }
  }, [page,currentAdvertisementID]);

  const getDynamicAccordian = async () => {
    try {
      const query = `advertisementId=${currentAdvertisementID}&key=center_audit_form_cbt_mobile`;
      const { data, error } = (await CallGetVenueDynamicAccordians(
        query,
      )) as any;
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
    if (currentAdvertisementID) {
      getDynamicAccordian();
      getStats();
    }
  }, [currentAdvertisementID]);

  const getCenterAuditData = async (centerId: string) => {
    try {
      const query = `advertisementId=${currentAdvertisementID}&centerId=${centerId}`;
      const { data, error } = (await CallGetCBTCenterVerificationData(
        query,
      )) as any;
      // console.log("getCenterAuditData", { data, error });
      if (data) {
        const updatedJson = updateCurrentUserData(data?.data);
        setCurrentCenter(updatedJson);
      }

      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  useEffect(() => {
    getAllDistricts();
  }, []);

  const clearFilter = () => {
    setFitlerData({
      status: "",
      district: "",
    });
    getCenters(false);
  };

  const getStats = async () => {
    try {
      const query = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetCenterAuditStats(query)) as any;
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

  // console.log("dynamicModal", dynamicModal);
  // console.log("allData", allData);
  // console.log("currentCenter", currentCenter);

  return (
    <>
      <FlatCard heading="Center Audit Data Overview">
        <CardGrid columns={4} data={cardData} />
      </FlatCard>

      <Table
        isStriped
        color="default"
        topContent={
          <>
            <h2 className="text-xl font-semibold">Center Audit Data</h2>
            <div className="grid grid-cols-4 flex-col gap-4 mob:flex tab:grid-cols-1">
              <div className="col-span-2 flex gap-2">
                <Select
                  items={[
                    { key: "Matched", label: "Matched" },
                    { key: "Unmatched", label: "Unmatched" },
                    { key: "Pending", label: "Pending" },
                  ]}
                  selectedKeys={[filterData?.status]}
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Select"
                  onChange={(e) => {
                    setFitlerData((prev: any) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                  }}
                >
                  {(item: any) => (
                    <SelectItem key={item?.key}>{item?.label}</SelectItem>
                  )}
                </Select>

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
              </div>
               <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(`v1/admin/downloadCenterByDistrictExcel?advertisementId=${currentAdvertisementID}&district=${filterData?.district}&status=${filterData?.status}`, "Center Audit Data", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(`v1/admin/downloadCenterByDistrictPDF?advertisementId=${currentAdvertisementID}&district=${filterData?.district}&status=${filterData?.status}`, "Center Audit Data", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
              <FilterSearchBtn
                searchFunc={()=>getCenters(true)}
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
              key={column?.key}
              align={column?.key === "actions" ? "center" : "start"}
              className="text-wrap tab:text-nowrap mob:text-nowrap"
            >
              {column?.title}
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
            <TableRow key={item?._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
                <Accordion defaultExpandedKeys="all">
                  {currentCenter?.map((section: any, index: number) => (
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
                        {section?.fields?.map((field: any, index: number) => (
                          <FieldDisplay key={index} field={field} />
                        ))}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
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
    </>
  );
};

export default CenterAuditData;
