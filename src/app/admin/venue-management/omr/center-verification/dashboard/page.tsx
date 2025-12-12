"use client";
import {
  CallGetAllDistricts,
  CallGetCenterDashboard,
  CallGetCenterDashboardTable,
  CallGetCenterExcel,
} from "@/_ServerActions";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import UPMap from "@/components/UPMap";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
  user,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import VenueDashboardData from "@/components/VenueDashboardData/VenueDashboardData";
import { useAdvertisement } from "@/components/AdvertisementContext";
import CardGridCenterVerification from "@/components/Venue/CardGridCenterVerification";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

type Props = {};

const Dashboard = (props: Props) => {
  const [allData, setAllData] = useState<any[]>([]);
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalCenter: 0,
    totalSubmitted: 0,
    totalPendingVerification: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isExcelDownloading, setIsExcelDownloading] = useState<boolean>(false);
  const { currentAdvertisementID } = useAdvertisement();
  const [filterData, setFitlerData] = useState<any>({
    status: "",
    district: "",
    user: "CIP",
  });
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const statusColorMap: { [key: string]: ChipColor } = {
    Rejected: "danger",
    Absent: "danger",
    Ineligible: "danger",
    Unmatched: "danger",
    Pending: "warning",
    Accepted: "success",
    Eligible: "success",
    Present: "success",
    Matched: "success",
    undefined: "default",
  };

  const cardData = [
    {
      title: "Total Centres",
      value: stats?.totalCenter || 0,
      link: "#",
    },
    {
      title: "Total Submitted Centres",
      value: stats?.totalSubmitted || 0,
      link: "#",
    },
    {
      title: "Total Pending Centres",
      value: stats?.totalPendingVerification || 0,
      link: "#",
    },
  ];

  const columns = [
    { title: "Center Name", key: "school_name" },
    { title: "District", key: "district" },
    { title: "Assign User", key: "assignUser" },
    { title: "Status", key: "status" },
    // { title: "CIP Status", key: "cipStatus" },
    // { title: "CS Status", key: "csStatus" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "district":
        return <p>{item?.district?.name}</p>;
      case "assignUser":
        return (
          <Link
            href={`/admin/venue-management/omr/center-verification/dashboard/center-users/${item?._id}`}
            className="cursor-pointer text-nowrap text-blue-500 hover:underline"
          >
            View Users
          </Link>
        );
      case "isAllDataSubmitted": {
        const isSubmitted =
          item?.isAllDataSubmitted ??
          item?.center_verifications?.isAllDataSubmitted ??
          false;

        const statusText = isSubmitted ? "Submitted" : "Pending";
        const color = isSubmitted ? "success" : "warning";

        return (
          <Chip color={color} variant="flat" radius="full">
            {statusText}
          </Chip>
        );
      }
      case "status": {
        const status =
          filterData?.user === "CIP" ? item?.cipStatus : item?.csStatus;
        const statusText = status && status !== "" ? status : "-";
        const color =
          statusText === "Submitted"
            ? "success"
            : statusText === "-"
              ? "default"
              : "warning";
        return (
          <Chip color={color} variant="flat" radius="full">
            {statusText}
          </Chip>
        );
      }
      case "csStatus": {
        const status = item?.csStatus;
        const statusText = status && status !== "" ? status : "-";
        const color =
          statusText === "Submitted"
            ? "success"
            : statusText === "-"
              ? "default"
              : "warning";
        return (
          <Chip color={color} variant="flat" radius="full">
            {statusText}
          </Chip>
        );
      }

      case "actions":
        return (
          <Tooltip content="Verification" showArrow={true}>
            <Button
              as={Link}
              href={`/admin/venue-management/omr/center-verification/verification/${item?._id}`}
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
        return <p className="capitalize">{cellValue}</p>;
    }
  }, [filterData?.user]);
  const dashboardStats = async (filter: boolean) => {
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&user=${filterData?.user ?? ""}&status=${filterData?.status ?? ""}&district=${filterData?.district ?? ""}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&user=CIP`;
      const { data, error } = (await CallGetCenterDashboard(
        filter ? filterON : filterOFF,
      )) as any;

      if (data) {
        setStats({
          totalCenter: data?.data?.totalCenter ?? 0,
          totalSubmitted: data?.data?.totalSubmitted ?? 0,
          totalPendingVerification: data?.data?.totalPendingVerification ?? 0,
        });
      }

      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    }
  };

  const getCenterDashboardData = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&district=${filterData?.district ?? ""}&status=${filterData?.status ?? ""}&user=${filterData?.user ?? ""}&page=${page}&limit=10`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&user=CIP&page=${page}&limit=10`;
      const { data, error } = (await CallGetCenterDashboardTable(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("CallGetCenterDashboardTable", data);
      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setIsLoading(false);
      }
      if (error) {
        handleCommonErrors(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDistricts = async () => {
    try {
      const query = `stateId=${filterData?.stateId}&zoneId=${filterData?.zoneId}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllDistricts()) as any;

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
    if (!currentAdvertisementID) return;
    dashboardStats(false);
    getCenterDashboardData(false);
  }, [currentAdvertisementID]);

  useEffect(() => {
    if (!currentAdvertisementID) return;
    dashboardStats(true);
    getCenterDashboardData(true);
  }, [page]);

  useEffect(() => {
    getAllDistricts();
  }, []);

  const clearFilter = () => {
    setFitlerData({
      status: "",
      district: "",
      user: "CIP",
    });
    getCenterDashboardData(false);
    dashboardStats(false);
  };

  const downloadExcel = (fileUrl: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "final_result.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadCenterExcel = async () => {
    setIsExcelDownloading(true);
    try {
      const { data, error } = (await CallGetCenterExcel()) as any;
      if (data?.fileUrl) {
        downloadExcel(data?.fileUrl);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsExcelDownloading(false);
  };

  return (
    <>
      <div className="hidden items-end justify-end mob:flex">
        <Button
          color="primary"
          variant="shadow"
          className="mb-4 px-8 mob:px-2"
          isLoading={isExcelDownloading}
          onPress={downloadCenterExcel}
          startContent={
            !isExcelDownloading && (
              <span
                className="material-symbols-rounded"
                style={{ color: "white" }}
              >
                download
              </span>
            )
          }
        >
          Download Excel
        </Button>
      </div>

      <FlatCard heading="Center Verification Dashboard">
        <div className="grid grid-cols-2 gap-6">
          <UPMap currentAdvertisementID={currentAdvertisementID} user={filterData?.user} />

          <div>
            <CardGridCenterVerification columns={2} data={cardData} />
            <Button
              color="primary"
              variant="shadow"
              className="mt-4 w-full"
              as={Link}
              href="/admin/venue-management/omr/center-verification/dashboard/infra-report"
              startContent={
                <span className="material-symbols-rounded">description</span>
              }
            >
              View Centre Infrastructure & Staffing Report
            </Button>
          </div>
        </div>
      </FlatCard>
      <VenueDashboardData
        currentAdvertisementID={currentAdvertisementID}
        filterData={filterData}
        setFitlerData={setFitlerData}
        dashboardStats={dashboardStats}
        getCenterDashboardData={getCenterDashboardData}
      />
      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        topContent={
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4 mob:grid-cols-1 tab:grid-cols-2">
              <Select
                label="User"
                className="w-full"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={filterData?.user ? [filterData.user] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFitlerData((prev: any) => ({
                    ...prev,
                    user: selectedKey,
                  }));
                }}
              >
                <SelectItem key="CIP">CIP</SelectItem>
                <SelectItem key="CS">CS</SelectItem>
              </Select>

              <Select
                items={[
                  { key: "Submitted", label: "Submitted" },
                  { key: "Pending", label: "Pending" },
                ]}
                selectedKeys={[filterData?.status]}
                label="Status"
                labelPlacement="outside"
                placeholder="Select"
                onChange={(e) =>
                  setFitlerData((prev: any) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full"
              >
                {(item: any) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
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
                className="w-full"
              >
                {(item: any) => (
                  <AutocompleteItem key={item?._id}>
                    {item?.district}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/center/admin/downloadAllExcel?status=${filterData?.status}&advertisementId=${currentAdvertisementID}&district=${filterData?.district}&user=${filterData.user}`,
                    "Center Verification",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/center/downloadAllAdminCenterPdf?status=${filterData?.status}&advertisementId=${currentAdvertisementID}&district=${filterData?.district}&user=${filterData.user}`,
                    "Center Verification",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              />

              <FilterSearchBtn
                searchFunc={() => {
                  dashboardStats(true);
                  getCenterDashboardData(true);
                }}
                clearFunc={clearFilter}
              />
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

export default Dashboard;
