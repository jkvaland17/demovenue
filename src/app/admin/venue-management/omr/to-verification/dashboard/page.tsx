"use client";
import {
  CallDistrictJsonExcel,
  CallGetAllDistricts,
  CallGetDistrictDashboardTable,
  CallGetDistrictExcel,
  CallGetTODashboard,
} from "@/_ServerActions";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import UPMapDistrict from "@/components/UPMapDistrict";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
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
import React, { useEffect, useState, useCallback } from "react";
import { useAdvertisement } from "@/components/AdvertisementContext";
import moment from "moment";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const Dashboard = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
  const [loader, setLoader] = useState<any>({ table: false, excel: false });
  const [isExcelDownloading, setIsExcelDownloading] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<any>({
    status: "",
    district: "",
    date: "",
    userType: "",
  });
  const [stats, setStats] = useState<any>({
    totalUniqueDistrict: 0,
    totalDistrict: 0,
    totalSubmitted: 0,
    totalPending: 0,
  });

  const statusColorMap: { [key: string]: ChipColor } = {
    Submitted: "success",
    Unmatched: "success",
    Pending: "warning",
    Matched: "success",
    undefined: "default",
  };

  const cardData = [
    { title: "Total Unique District", value: stats.totalUniqueDistrict },
    { title: "Total District", value: stats.totalDistrict },
    { title: "Submitted", value: stats.totalSubmitted },
    { title: "Pending", value: stats.totalPending },
  ];

  const columns = [
    { title: "District", key: "name" },
    { title: "District Code", key: "code" },
    { title: "Date", key: "verificationsDate" },
    { title: "Treasury Officer", key: "treasuryOfficer" },
    { title: "Nodal Officer", key: "nodalOfficer" },
    { title: "Status", key: "treasuryStatus" },
    { title: "Actions", key: "actions" },
  ];

  const getDashboardData = async (filter: boolean = false) => {
    if (!currentAdvertisementID) return;
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&district=${filterData.district ?? ""}&user=${filterData.userType ?? ""}&verificationStatus=${filterData.status ?? ""}&date=${filterData.date ?? ""}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetTODashboard(
        filter ? filterON : filterOFF,
      )) as any;
      if (data) {
        setStats({
          totalUniqueDistrict: data?.data.totalUniqueDistrict || 0,
          totalDistrict: data?.data.totalDistrict || 0,
          totalSubmitted: data?.data.totalSubmitted || 0,
          totalPending: data?.data.totalPending || 0,
        });
      }

      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    }
  };

  const districtTableData = async (filter: boolean) => {
    try {
      setIsLoading(true);
      const filterON = `advertisementId=${currentAdvertisementID}&district=${filterData.district ?? ""}&user=${filterData.userType ?? ""}&verificationStatus=${filterData.status ?? ""}&date=${filterData.date ?? ""}&page=${page}&limit=10`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetDistrictDashboardTable(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("District Table Data", data);
      if (data) {
        setAllData(data?.data || []);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
      }
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllDistricts = async () => {
    try {
      const { data, error } = (await CallGetAllDistricts()) as any;
      if (data) setAllDistricts(data?.data);
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllDistricts();
      getDashboardData(false);
      districtTableData(false);
    }
  }, [currentAdvertisementID, page]);

  const clearFilter = () => {
    setFilterData({ status: "", district: "", date: "", userType: "" });
    getDashboardData(false);
    districtTableData(false);
    setPage(1);
  };

  const downloadTreasuryExcel = async () => {
    setIsExcelDownloading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&district=${filterData.district ?? ""}&user=${filterData.userType ?? ""}&verificationStatus=${filterData.status ?? ""}&date=${filterData.date ?? ""}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}`;

      const query: string =
        filterData.district ||
        filterData.status ||
        filterData.date ||
        filterData.userType
          ? filterON
          : filterOFF;
      const { data, error } = (await CallGetDistrictExcel(query)) as any;

      if (data?.fileUrl) {
        const link = document.createElement("a");
        link.href = data.fileUrl;
        link.setAttribute("download", "district_data.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    } finally {
      setIsExcelDownloading(false);
    }
  };

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "treasuryOfficer":
        const treasuryOfficers: string[] =
          item?.treasuryVerification
            ?.filter(
              (i: any) => i?.user?.role?.title === "Chief Treasury Officer",
            )
            .map((i: any) => String(i?.user?.userId)) || [];

        // remove duplicates
        const uniqueOfficers = Array.from(new Set(treasuryOfficers));
        return (
          <div className="flex flex-wrap gap-2">
            {uniqueOfficers?.length > 0 ? (
              uniqueOfficers?.map((userId: string, idx: number) => (
                <Chip size="sm" key={userId + idx}>
                  {userId}
                </Chip>
              ))
            ) : (
              <p>-</p>
            )}
          </div>
        );

      case "nodalOfficer":
        const nodalOfficers: string[] =
          item?.treasuryVerification
            ?.filter((i: any) => i?.user?.role?.title === "Nodal Officer")
            .map((i: any) => String(i?.user?.userId)) || [];

        // remove duplicates
        const nodalOfficer = Array.from(new Set(nodalOfficers)) as string[];
        return (
          <div className="flex flex-wrap gap-2">
            {nodalOfficer?.length > 0 ? (
              nodalOfficer?.map((userId: string, idx: number) => (
                <Chip size="sm" key={userId + idx}>
                  {userId}
                </Chip>
              ))
            ) : (
              <p>-</p>
            )}
          </div>
        );

      case "verificationsDate":
        return (
          <p>
            {item?.verificationsDate
              ? moment(item?.verificationsDate).format("DD-MM-YYYY hh:mm A")
              : "-"}
          </p>
        );

      // case "treasuryStatus":
      //   let displayStatus = "Pending";
      //   if (cellValue === "Matched" || cellValue === "Unmatched")
      //     displayStatus = "Submitted";
      //   return (
      //     <Chip
      //       color={statusColorMap[cellValue] || "default"}
      //       variant="flat"
      //       radius="full"
      //     >
      //       {displayStatus}
      //     </Chip>
      //   );

      case "treasuryStatus": {
        const status = item?.treasuryStatus;
        const displayStatus =
          status === "Matched" || status === "Unmatched"
            ? "Submitted"
            : "Pending";

        return (
          <Chip
            color={statusColorMap[displayStatus] || "default"}
            variant="flat"
            radius="full"
          >
            {displayStatus}
          </Chip>
        );
      }

      case "actions":
        return (
          <Tooltip content="View" showArrow>
            <Button
              as={Link}
              href={`/admin/venue-management/omr/to-verification/verification/${item?._id}?date=${moment(
                item?.verificationsDate,
              ).format("DD-MM-YYYY")}`}
              color="primary"
              radius="full"
              variant="light"
              size="sm"
              isIconOnly
              startContent={
                <span className="material-symbols-rounded">visibility</span>
              }
            />
          </Tooltip>
        );

      default:
        return <p className="capitalize">{cellValue || "-"}</p>;
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
  const downlaodInfraExcel = async () => {
    setLoader((prev: any) => ({
      ...prev,
      DistrictJsonExcel: true,
    }));
    try {
      const query = `advertisementId=${currentAdvertisementID}&date=${filterData?.date}&user=${filterData?.userType}`;
      const { data, error } = (await CallDistrictJsonExcel(query)) as any;
      if (data?.fileUrl) {
        downloadExcel(data?.fileUrl);
        setLoader((prev: any) => ({
          ...prev,
          DistrictJsonExcel: false,
        }));
      }
      if (error) {
        handleCommonErrors(error);
        setLoader((prev: any) => ({
          ...prev,
          DistrictJsonExcel: false,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="hidden mob:flex mob:justify-end">
        <Button
          color="primary"
          variant="shadow"
          className="mb-4 px-8 mob:px-2"
          isLoading={isExcelDownloading}
          onPress={downloadTreasuryExcel}
          startContent={
            !isExcelDownloading && (
              <span className="material-symbols-rounded text-white">
                download
              </span>
            )
          }
        >
          Download Excel
        </Button>
      </div>

      <FlatCard heading="T/O Verification Dashboard">
        <div className="flex justify-center">
          <div className="w-1/2 mob:w-80">
            <UPMapDistrict />
          </div>
        </div>
        <CardGrid columns={3} data={cardData} />
      </FlatCard>

      <Table
        isStriped
        color="default"
        aria-label="District Verification Table"
        className="mb-4"
        topContent={
          <div className="grid grid-cols-4 gap-2 mob:flex tab:grid-cols-1">
            <Autocomplete
              defaultItems={allDistricts}
              selectedKey={filterData?.district}
              label="District"
              labelPlacement="outside"
              placeholder="Select"
              onSelectionChange={(e) =>
                setFilterData((prev: any) => ({ ...prev, district: e }))
              }
            >
              {(item: any) => (
                <AutocompleteItem key={item?._id}>
                  {item?.district}
                </AutocompleteItem>
              )}
            </Autocomplete>

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
                setFilterData((prev: any) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              {(item: any) => (
                <SelectItem key={item?.key}>{item?.label}</SelectItem>
              )}
            </Select>

            <Input
              type="date"
              label="Date"
              labelPlacement="outside"
              value={filterData?.date}
              onChange={(e) =>
                setFilterData((prev: any) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />

            <Select
              items={[
                {
                  key: "cto",
                  label: "Chief Treasury Officer",
                },
                { key: "nodal", label: "Nodal Officer" },
              ]}
              selectedKeys={[filterData?.userType]}
              label="User Type"
              labelPlacement="outside"
              placeholder="Select"
              onChange={(e) =>
                setFilterData((prev: any) => ({
                  ...prev,
                  userType: e.target.value,
                }))
              }
            >
              {(item: any) => (
                <SelectItem key={item?.key}>{item?.label}</SelectItem>
              )}
            </Select>

            <ExcelPdfDownload
              excelFunction={() =>
                DownloadKushalExcel(
                  `v1/district/downloadAlldistrictExcel?advertisementId=${currentAdvertisementID}&district=${filterData.district ?? ""}&verificationStatus=${filterData.status ?? ""}&date=${filterData.date ?? ""}&user=${filterData.userType}`,
                  "TO Verification",
                  setLoader,
                )
              }
              pdfFunction={() =>
                DownloadKushalPdf(
                  `v1/district/downloadAllDistrictPdf?advertisementId=${currentAdvertisementID}&district=${filterData.district ?? ""}&verificationStatus=${filterData.status ?? ""}&date=${filterData.date ?? ""}&user=${filterData.userType}`,
                  "TO Verification",
                  setLoader,
                )
              }
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
            <Button
              isDisabled={!currentAdvertisementID || !filterData?.date}
              color="primary"
              onPress={downlaodInfraExcel}
              startContent={
                loader?.DistrictJsonExcel ? (
                  <Spinner color="default" size="sm" />
                ) : (
                  <span className="material-symbols-rounded">description</span>
                )
              }
            >
              Download All Treasury Details
            </Button>
            <FilterSearchBtn
              searchFunc={() => {
                setPage(1);
                getDashboardData(true);
                districtTableData(true);
              }}
              clearFunc={clearFilter}
            />
          </div>
        }
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
          emptyContent="No data found"
        >
          {(item: any) => (
            <TableRow key={`${item._id}-${item.verificationsDate}`}>
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
