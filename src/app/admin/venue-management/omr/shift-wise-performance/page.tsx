"use client";
import {
  CallGetAllCenters,
  CallGetAllDistricts,
  CallGetCenterShiftDashboard,
  CallGetSWPDistrict,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {};
type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const ShiftWisePerformance = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [allData, setAllData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>("");
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
  const [allCenter, setAllCenter] = useState<any[]>([]);
  const [filterData, setFitlerData] = useState<any>({
    user: "CIP",
    status: "",
    district: "",
    center: "",
    date: "",
  });
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
    dashboardLoader: false,
  });
  const [summary, setSummary] = useState({
    totalCentres: 0,
    uniqueCentres: 0,
    submittedCentres: 0,
    pendingCentres: 0,
  });

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "warning",
    Submitted: "success",
  };

  const columns = [
    { title: "Center Name", key: "center_name" },
    { title: "District", key: "district_name" },
    { title: "Date", key: "exam_date" },
    { title: "Shift", key: "shift" },
    { title: "Assign User", key: "assignUser" },
    { title: "Status", key: "status" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "shift":
        return (
          <div className="flex gap-2">
            {item?.shift_time ? (
              <Chip size="sm" variant="flat" className="font-semibold">
                Shift-{item.shift_time}
              </Chip>
            ) : (
              "-"
            )}
          </div>
        );
      case "exam_date":
        return (
          <span>
            {item?.exam_date
              ? moment(item?.exam_date).format("DD-MM-YYYY")
              : "-"}
          </span>
        );
      case "assignUser":
        return (
          <Link
            href={`/admin/venue-management/omr/shift-wise-performance/center-users/${item?.center_id}`}
            className="cursor-pointer text-nowrap text-blue-500 hover:underline"
          >
            View Users
          </Link>
        );
      case "status":
        return (
          <Chip
            color={statusColorMap[item.status]}
            variant="flat"
            radius="full"
            className="capitalize"
          >
            {item.status}
          </Chip>
        );
      case "actions":
        return (
          <Button
            as={Link}
            href={`/admin/venue-management/omr/shift-wise-performance/ShiftWisePerformance/${item?.center_id}/${item?.userId}/${item?.shift_time}/${item?.advertisementId}/${moment(
              item?.exam_date,
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
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  const getSWPDistricts = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const FilterOff = `advertisementId=${currentAdvertisementID}&user=CIP&page=${page}&limit=10`;
      const FilterOn = `advertisementId=${currentAdvertisementID}&search=${searchValue}&user=${filterData?.user}&status=${filterData?.status}&district=${filterData?.district}&center=${filterData?.center}&date=${
        filterData?.date ? moment(filterData.date).format("DD-MM-YYYY") : ""
      }&page=${page}&limit=10`;
      const { data, error } = (await CallGetSWPDistrict(
        filter ? FilterOn : FilterOff,
      )) as any;
      console.log("SWP Districts", data);
      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
        setIsLoading(false);
      }
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCenterShiftDashboard = async (filter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      dashboardLoader: true,
    }));
    try {
      const FilterOff = `advertisementId=${currentAdvertisementID}&user=CIP`;
      const FilterOn = `advertisementId=${currentAdvertisementID}&date=${
        filterData?.date ? moment(filterData.date).format("DD-MM-YYYY") : ""
      }&status=${filterData?.status}&district=${filterData?.district}&center=${filterData?.center}&user=${filterData?.user}`;
      const { data, error } = (await CallGetCenterShiftDashboard(
        filter ? FilterOn : FilterOff,
      )) as any;
      console.log("Center Shift Dashboard", data);
      if (data?.status_code === 200) {
        setSummary({
          totalCentres: data?.totalCenter || 0,
          uniqueCentres: data?.totalUniqueDistrict || 0,
          submittedCentres: data?.totalSubmitted || 0,
          pendingCentres: data?.totalPending || 0,
        });
        setLoader((prev: any) => ({
          ...prev,
          dashboardLoader: false,
        }));
      }
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader((prev: any) => ({
        ...prev,
        dashboardLoader: false,
      }));
    }
  };

  const getAllDistricts = async () => {
    try {
      const { data, error } = (await CallGetAllDistricts(
        "type=sorting",
      )) as any;
      if (data) setAllDistricts(data?.data);
      if (error) handleCommonErrors(error);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCenters = async (districtId: string) => {
    try {
      const query = `district=${districtId}&type=sorting`;
      const { data, error } = (await CallGetAllCenters(query)) as any;
      if (data) setAllCenter(data?.data);
      if (error) {
        handleCommonErrors(error);
        setAllCenter([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      getSWPDistricts(true);
    }
  }, [page]);

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllDistricts();
      getSWPDistricts(false);
      getCenterShiftDashboard(false);
    }
  }, [currentAdvertisementID]);

  const clearFilter = () => {
    setSearchValue("");
    setFitlerData({
      user: "CIP",
      status: "",
      district: "",
      center: "",
      date: "",
    });
    getSWPDistricts(false);
    getCenterShiftDashboard(false);
  };

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 p-3 shadow-md">
          <CardBody>
            <h4 className="text-sm text-gray-600">Total Centres</h4>
            <h2 className="text-2xl font-bold text-blue-600">
              {loader?.dashboardLoader ? (
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-7 w-4/5 rounded-lg" />
                </div>
              ) : (
                summary?.totalCentres
              )}
            </h2>
          </CardBody>
        </Card>
        <Card className="border border-gray-200 p-3 shadow-md">
          <CardBody>
            <h4 className="text-sm text-gray-600">Total Unique Centres</h4>
            <h2 className="text-2xl font-bold text-purple-600">
              {loader?.dashboardLoader ? (
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-7 w-4/5 rounded-lg" />
                </div>
              ) : (
                summary?.uniqueCentres
              )}
            </h2>
          </CardBody>
        </Card>
        <Card className="border border-gray-200 p-3 shadow-md">
          <CardBody>
            <h4 className="text-sm text-gray-600">Total Submitted Centres</h4>
            <h2 className="text-2xl font-bold text-green-600">
              {loader?.dashboardLoader ? (
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-7 w-4/5 rounded-lg" />
                </div>
              ) : (
                summary?.submittedCentres
              )}
            </h2>
          </CardBody>
        </Card>
        <Card className="border border-gray-200 p-3 shadow-md">
          <CardBody>
            <h4 className="text-sm text-gray-600">Total Pending Centres</h4>
            <h2 className="text-2xl font-bold text-yellow-600">
              {loader?.dashboardLoader ? (
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-7 w-4/5 rounded-lg" />
                </div>
              ) : (
                summary?.pendingCentres
              )}
            </h2>
          </CardBody>
        </Card>
      </div>

      <Table
        isStriped
        color="default"
        topContent={
          <>
            <h2 className="mb-4 text-xl font-semibold">
              Shift Wise Performance Report
            </h2>
            <div className="flex flex-wrap gap-2">
              <Input
                label="Search"
                labelPlacement="outside"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-60"
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              />

              <Input
                type="date"
                label="Exam Date"
                labelPlacement="outside"
                className="w-64"
                value={filterData?.date}
                onChange={(e) =>
                  setFitlerData((prev: any) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />

              <Select
                label="District"
                className="w-64"
                labelPlacement="outside"
                placeholder="Select"
                items={allDistricts}
                selectedKeys={filterData?.district ? [filterData.district] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFitlerData((prev: any) => ({
                    ...prev,
                    district: selectedKey,
                    center: "",
                  }));
                  if (selectedKey) getAllCenters(selectedKey);
                }}
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.district}</SelectItem>
                )}
              </Select>

              <Select
                label="Center"
                className="w-64"
                labelPlacement="outside"
                placeholder="Select"
                items={allCenter}
                selectedKeys={filterData?.center ? [filterData.center] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFitlerData((prev: any) => ({
                    ...prev,
                    center: selectedKey,
                  }));
                }}
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.school_name}</SelectItem>
                )}
              </Select>

              <Select
                label="User"
                className="w-64"
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
                label="Status"
                className="w-64"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={[filterData?.status]}
                onChange={(e) =>
                  setFitlerData((prev: any) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <SelectItem key="Submitted">Submitted</SelectItem>
                <SelectItem key="Pending">Pending</SelectItem>
              </Select>

              <FilterSearchBtn
                searchFunc={() => {
                  getSWPDistricts(true);
                  getCenterShiftDashboard(true);
                }}
                clearFunc={clearFilter}
              />

              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/shiftWise/downloadCentersByAdvertisementExcel?advertisementId=${currentAdvertisementID}&search=${searchValue}&user=${filterData?.user}&status=${filterData?.status}&district=${filterData?.district}&center=${filterData?.center}&date=${
                      filterData?.date
                        ? moment(filterData.date).format("DD-MM-YYYY")
                        : ""
                    }`,
                    "Shift Wise Report",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/shiftWise/downloadCentersByAdvertisementPDF?advertisementId=${currentAdvertisementID}&search=${searchValue}&user=${filterData?.user}&status=${filterData?.status}&district=${filterData?.district}&center=${filterData?.center}&date=${
                      filterData?.date
                        ? moment(filterData.date).format("DD-MM-YYYY")
                        : ""
                    }`,
                    "Shift Wise Report",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              />
            </div>
          </>
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
          {(item) => (
            <TableRow key={item?._id}>
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

export default ShiftWisePerformance;
