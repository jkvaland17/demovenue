"use client";
import {
  CallDownloadFinalResult,
  CallGetAllSports,
  CallGetFinalResult,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  Chip,
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
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FinalResult = () => {
  const { currentAdvertisementID } = useAdvertisement();
  // const [allSports, setAllSports] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const columns = [
    { title: "Chest no.", key: "chestNo" },
    { title: "Sports", key: "sportName" },
    { title: "Full name", key: "fullName" },
    { title: "Total Marks(out of 80)", key: "totalTrialMarks" },
    {
      title: "Marks out of 20 on Sports Certificate",
      key: "sportsCertificateMarks",
    },
    { title: "Total Marks", key: "totalMarks" },
    { title: "Result", key: "result" },
    { title: "Remarks", key: "remark" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "fullName":
        return <p className="capitalize">{cellValue}</p>;
      case "result":
        if (item?.isVerified === true) {
          return (
            <Chip
              classNames={{
                content: ["text-green-600"],
              }}
              color="success"
              variant="flat"
              radius="full"
              size="md"
            >
              Eligible
            </Chip>
          );
        }
        if (cellValue === "Unselected") {
          return (
            <Chip color="danger" variant="flat" radius="full" size="md">
              {cellValue}
            </Chip>
          );
        }
      default:
        return cellValue;
    }
  }, []);

  const downloadExcel = (fileUrl: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "final_result.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadFinalResult = async () => {
    setIsDownloading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallDownloadFinalResult(query)) as any;
      console.log("downloadFinalResult", { data, error });

      if (data) {
        downloadExcel(data?.fileUrl);
      }
      if (error) {
        toast.error(error);
      }
      setIsDownloading(false);
    } catch (error) {
      console.log(error);
      setIsDownloading(false);
    }
  };
  const getFinalResult = async () => {
    setIsLoading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetFinalResult(query)) as any;
      console.log("getFinalResult", { data, error });

      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.currentPage);
        setIsLoading(false);
      }
      if (error) {
        toast.error(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getFinalResult();
    }
  }, [currentAdvertisementID, page]);

  // const getAllSports = async () => {
  //   try {
  //     const { data, error } = (await CallGetAllSports("")) as any;
  //     if (data) {
  //       setAllSports(data?.data);
  //     }
  //     if (error) {
  //       toast.error(error);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };
  // useEffect(() => {
  //   getAllSports();
  // }, []);

  return (
    <>
      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        topContent={
          <div className="flex justify-between gap-12 mob:flex-col mob:gap-4">
            <h2 className="text-xl font-semibold">
              Final Results After Certificates Verification from Issuing
              Authority
            </h2>
            <Button
              color="primary"
              variant="shadow"
              isLoading={isDownloading}
              onPress={downloadFinalResult}
              startContent={
                !isDownloading && (
                  <span
                    className="material-symbols-rounded"
                    style={{ color: "white" }}
                  >
                    download
                  </span>
                )
              }
            >
              Download Final Results
            </Button>
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
              className="text-wrap"
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
          {(item: any) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default FinalResult;
