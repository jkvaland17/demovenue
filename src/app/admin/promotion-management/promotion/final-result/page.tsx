"use client";
import {
  CallFindMasterByCodePromotion,
  CallPromotionFinalResult,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import {
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
  Select,
  SelectItem,
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
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const FinalResult = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allresult, setAllResult] = useState<any[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  // const [advertisementId, setAdvertisementId] = useState<any>("");
  const { currentAdvertisementID } = useAdvertisement();
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderDownload, setLoaderDownload] = useState<any>({
    excel: false,
    pdf: false,
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filter, setFilter] = useState<any>({
    search: "",
  });

  const {
    isOpen: isQualified,
    onOpen: onQualified,
    onOpenChange: onOpenQualified,
  } = useDisclosure();

  const getResultList = async (isFilter: boolean) => {
    try {
      setIsLoading(true);
      const filterOn = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}&search=${filter?.search}`;
      const filterOff = `page=${page}&limit=10&advertisementId=${currentAdvertisementID}`;
      let query = isFilter ? filterOn : filterOff;
      const { data, error } = (await CallPromotionFinalResult(query)) as any;
      console.log("getResultList", { data, error });
      if (data) {
        setAllResult(data?.data?.DcpPromotionData);
        setPage(data?.data.currentPage);
        setTotalPage(data?.data?.totalPages);
      }
      if (error) {
        toast?.error(error);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getResultList(false);
    getCourseListData();
  }, [page, currentAdvertisementID]);

  const getCourseListData = async () => {
    setLoader(true);
    try {
      const { data, error } = (await CallFindMasterByCodePromotion()) as any;
      console.log("CallFindMasterByCodePromotion", data, error);

      if (data.statu_code === 200) {
        setCourseList(data?.data);
        setLoader(false);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  const getEventListData = async (courseId: string) => {
    setLoader(true);
    try {
      const { data, error } = (await CallUserFindAllAdvertisement(
        `parentMasterId=${courseId}`,
      )) as any;
      console.log("CallUserFindAllAdvertisement", data, error);

      if (data?.message === "Success") {
        setEventList(data?.data);
        setLoader(false);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const columns = [
    { title: "Seniority List Serial No.", key: "seniorityListSerialNo" },
    { title: "Eligibility List Serial No.", key: "eligibilityListSerialNo" },
    { title: "Rank", key: "rank" },
    { title: "Employee Name", key: "employeeName" },
    { title: "Father's Name", key: "fatherName" },
    { title: "PNO No.", key: "pnoNumber" },
    { title: "Current Posting", key: "currentPosting" },
    { title: "Date of Birth", key: "dateOfBirth" },
    {
      title: "Date of Promotion to the Post of Head Constable",
      key: "promotionDate",
    },
    { title: "Date of Joining", key: "recruitmentDate" },
    {
      title: "Physical Efficiency Test Qualified/No Qualified",
      key: "physicalQualification",
    },
    // { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "employeeName":
        return <p>{item?.seniorityPromotionList?.employeeName}</p>;
      case "eligibilityListSerialNo":
        return <p>{item?.seniorityPromotionList?.eligibilityListSerialNo}</p>;
      case "fatherName":
        return <p>{item?.seniorityPromotionList?.fatherName}</p>;
      case "promotionDate":
        return (
          <p>
            {moment(item?.seniorityPromotionList?.promotionDate).format(
              "DD-MM-YYYY",
            )}
          </p>
        );
      case "recruitmentDate":
        return (
          <p>
            {moment(item?.seniorityPromotionList?.recruitmentDate).format(
              "DD-MM-YYYY",
            )}
          </p>
        );
      case "currentPosting":
        return <p>{item?.seniorityPromotionList?.currentPosting}</p>;
      case "dateOfBirth":
        return <p>{moment(cellValue).format("DD-MM-YYYY")}</p>;
      case "physicalQualification":
        return (
          <Chip
            variant="flat"
            color={
              item?.isQulifiedForFinalResult === "qualified"
                ? "success"
                : item?.isQulifiedForFinalResult === "notQualified"
                  ? "danger"
                  : "warning"
            }
            classNames={{ content: "capitalize" }}
          >
            {item?.isQulifiedForFinalResult === "qualified"
              ? "Qualified"
              : item?.isQulifiedForFinalResult === "notQualified"
                ? "Not Qualified"
                : "Pending"}
          </Chip>
        );
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="test" onPress={onOpen}>
                View
              </DropdownItem>
              <DropdownItem key="test" onPress={onQualified}>
                Submit Physical Efficiency Test Qualified/Not Qualified
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const clearFilter = () => {
    setFilter({
      search: "",
    });
    getResultList(false);
  };

  return (
    <>
      <FlatCard heading="Final Result">
        <Table
          classNames={{
            wrapper: "p-1 overflow-auto scrollbar-hide",
          }}
          shadow="none"
          color="default"
          topContent={
            <div className="flex flex-wrap items-end gap-3">
              <Input
                placeholder="Search PNO No."
                type="text"
                value={filter?.search}
                onChange={(e) => {
                  setFilter({ ...filter, search: e.target.value });
                  setPage(1);
                }}
                label="Search"
                labelPlacement="outside"
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
                className="max-w-xs"
              />

              <div className="flex gap-3">
                <FilterSearchBtn
                  searchFunc={() => getResultList(true)}
                  clearFunc={clearFilter}
                />

                <ExcelPdfDownload
                  excelFunction={() =>
                    DownloadKushalExcel(
                      `v1/promotion/downloadFinalResultListForPromotionExcel?advertisementId=${currentAdvertisementID}&search=${filter?.search}`,
                      "Final Result",
                      setLoaderDownload,
                    )
                  }
                  pdfFunction={() =>
                    DownloadKushalPdf(
                      `v1/promotion/downloadFinalResultListForPromotionPdf?advertisementId=${currentAdvertisementID}&search=${filter?.search}`,
                      "Final Result",
                      setLoaderDownload,
                    )
                  }
                  excelLoader={loaderDownload?.excel}
                  pdfLoader={loaderDownload?.pdf}
                />

                <Button color="primary" variant="shadow">
                  Download Final Results
                </Button>
              </div>
            </div>
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
                className="text-wrap mob:text-nowrap"
              >
                {column.title}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={allresult}
            emptyContent="No data"
            isLoading={isLoading}
            loadingContent={<Spinner />}
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
      </FlatCard>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Details
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isQualified} onOpenChange={onOpenQualified} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Submit Physical Efficiency Test Qualified/Not Qualified
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[
                    { key: "qualified", name: "Qualified" },
                    { key: "notQualified", name: "Not Qualified" },
                  ]}
                  label="Qualified/Not Qualified"
                  labelPlacement="outside"
                  placeholder="Select"
                >
                  {(item) => (
                    <SelectItem key={item?.key}>{item?.name}</SelectItem>
                  )}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FinalResult;
