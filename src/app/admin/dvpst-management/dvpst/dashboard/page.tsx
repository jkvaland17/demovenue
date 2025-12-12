"use client";

import { CallDvpstDashboard } from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Pagination,
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

const DVPSTDashboard = (props: Props) => {
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<any>([]);
  const { currentAdvertisementID } = useAdvertisement();
  const [loader, setLoader] = useState<any>({ excel: false, pdf: false });


  const DvpstDashboard = async () => {
    setLoading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallDvpstDashboard(query)) as any;
      console.log("DvpstDashboard", data);
      if (data?.data) {
        setDashboardData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DvpstDashboard();
  }, [page, currentAdvertisementID]);

  const columns = [
    { title: "Date", key: "date" },
    { title: "District", key: "district" },
    { title: "Center", key: "center" },
    { title: "Candidates Called for DV/PST", key: "candidatesCalled" },
    { title: "Candidates Present for DV/PST", key: "candidatesPresent" },
    { title: "Candidates Processed for DV/PST", key: "candidatesProcessed" },
    { title: "Files Completed (Feeding/Scanning)", key: "filesCompleted" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "date":
        return <span className="text-nowrap">{moment(item?.exam_date).format("DD-MM-YYYY")}</span>;
      case "district":
        return item?.totalDistricts;
      case "center":
        return item?.totalCenters;
      case "candidatesCalled":
        return item?.totalApplicants;
      case "candidatesPresent":
        return item?.totalPresentCandidate;
      case "candidatesProcessed":
        return item?.applicationStatusFitCount;
      case "filesCompleted":
        return item?.bothStatusesEligible;
      default:
        return "-";
    }
  }, []);

  return (
    <div>
      {/* <FlatCard>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </FlatCard> */}
      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        bottomContent={
          totalPage > 0 && (
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
        topContent={ 
          <div className="flex justify-end">
          <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(``, "Document verification", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(``, "Document verification", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
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
          items={dashboardData}
          isLoading={loading}
          loadingContent={<Spinner />}
          emptyContent="No data found!"
        >
          {(item: any) => (
            <TableRow key={item.exam_date}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DVPSTDashboard;
