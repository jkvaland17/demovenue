"use client";
import { CallGetExamInspection } from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
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
} from "@nextui-org/react";
import moment from "moment";
import React, { useEffect, useState } from "react";

type Props = {};

const InspectionReport = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allData, setAllData] = useState<any[]>([]);
    const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });


  const columns = [
    { title: "Date", key: "date" },
    { title: "District", key: "district_name" },
    { title: "Center Name", key: "center_name" },
    { title: "Slot", key: "slot" },
    { title: "Present Count", key: "count" },
    { title: "Any Observation", key: "observation" },
    // { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "date":
        return <p className="text-nowrap">{moment.utc(item?.exam_date).format("DD-MM-YYYY")}</p>;
      case "slot":
        return <p>{item?.shift?.shift_time}</p>;
      case "count":
        return <p>{item?.shift?.presentCount}</p>;
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="view">--</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const getExamInspection = async () => {
    setIsLoading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetExamInspection(query)) as any;
      console.log("getExamInspection", { data, error });

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
      getExamInspection();
    }
  }, [currentAdvertisementID]);
  useEffect(() => {
    if (currentAdvertisementID) {
      getExamInspection();
    }
  }, [page]);

  return (
    <Table
      isStriped
      color="default"
      topContent={
        <>
          <h2 className="text-xl font-semibold">Exam Day Inspection Report</h2>
          <div className="grid grid-cols-4 items-end gap-4 mob:flex flex-col mob:items-stretch">
            <Input
              placeholder="Search"
              endContent={
                <span className="material-symbols-rounded">search</span>
              }
            />
             <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(`v1/center/downloadCenterInspectionExcel?advertisementId=${currentAdvertisementID}`, "Exam Day Inspection Report", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(`v1/center/downloadCenterInspectionPdf?advertisementId=${currentAdvertisementID}`, "Exam Day Inspection Report", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
            <FilterSearchBtn searchFunc={() => {}} clearFunc={() => {}} />
          </div>
        </>
      }
      bottomContent={
        <div className="flex justify-end">
          <Pagination showControls total={1} initialPage={1} />
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
  );
};

export default InspectionReport;
