"use client";
import { CallGetObserverFeedback } from "@/_ServerActions";
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
  Tooltip,
} from "@nextui-org/react";
import moment from "moment";
import React, { useEffect, useState } from "react";

type Props = {};

const ExamMockTest = (props: Props) => {
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
    { title: "Rating", key: "ratings" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "date":
        return <p className="text-nowrap">{moment.utc(item?.exam_date).format("DD-MM-YYYY")}</p>;
      case "actions":
        return (
          <Tooltip content="View" showArrow={true}>
            <Button
              color="primary"
              radius="full"
              variant="light"
              size="sm"
              isIconOnly
              startContent={
                <span className="material-symbols-rounded">visibility</span>
              }
            ></Button>
          </Tooltip>
        );
      default:
        return cellValue;
    }
  }, []);

  const getObserverFeedback = async () => {
    setIsLoading(true);
    try {
      const { data, error } = (await CallGetObserverFeedback()) as any;
      console.log("getObserverFeedback", { data, error });

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
      getObserverFeedback();
    }
  }, [currentAdvertisementID]);
  useEffect(() => {
    if (currentAdvertisementID) {
      getObserverFeedback();
    }
  }, [page]);
  return (
    <Table
      isStriped
      color="default"
      topContent={
        <>
          <h2 className="text-xl font-semibold">Observer Feedback Report</h2>
          <div className="grid grid-cols-4 items-end gap-4 mob:flex flex-col mob:items-stretch">
            <Input
            className="col-span-1"
              placeholder="Search"
              endContent={
                <span className="material-symbols-rounded">search</span>
              }
            />
             <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(`v1/center/downloadCentersObserverFeedbackExcel?advertisementId=${currentAdvertisementID}`, "Observer Feedback Report", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(`v1/center/downloadCentersObserverFeedbackPdf?advertisementId=${currentAdvertisementID}`, "Observer Feedback Report", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
            <FilterSearchBtn col="col-start-4 mob:col-start-2" searchFunc={() => {}} clearFunc={() => {}} />
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

export default ExamMockTest;
