"use client";
import {
  CallGetAllManpower,
  CallGetCenterManpowerStats,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
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
import React, { useEffect, useState } from "react";

type Props = {};

const ManpowerAttendance = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allData, setAllData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>();
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const cardData = [
    {
      title: "Total Centers",
      value: stats?.totalCenter ?? 0,
    },
    {
      title: "Total Pending Attendance",
      value: stats?.presentCount ?? 0,
    },
    {
      title: "Total Completed Attendance",
      value: stats?.absentCount ?? 0,
    },
    {
      title: "Total Pending Attendance",
      value: stats?.pendingCount ?? 0,
    },
  ];
  const columns = [
    { title: "Center Name", key: "centerName" },
    { title: "Full Name", key: "name" },
    { title: "Skill", key: "skill" },
    { title: "Role", key: "role" },
    { title: "Mobile Number", key: "mobile" },
    { title: "Attendance", key: "attendance" },
  ];

  const getAllManpower = async () => {
    setIsLoading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllManpower(query)) as any;
      console.log("getAllManpower", { data, error });

      if (data) {
        setAllData(data?.manpowerList);
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
      getAllManpower();
    }
  }, [page]);

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "centerName":
        return <p>{item?.centerData?.name}</p>;
      case "attendance":
        return (
          <Chip
            variant="flat"
            color={
              cellValue === "Present"
                ? "success"
                : cellValue === "Absent"
                  ? "danger"
                  : "warning"
            }
            classNames={{ content: "capitalize" }}
          >
            {cellValue}
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
              <DropdownItem key="view">--</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const getStats = async () => {
    try {
      const query = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetCenterManpowerStats(query)) as any;
      console.log("getStats", { data, error });

      if (data) {
        setStats(data?.manpowerData);
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
      getAllManpower();
    }
  }, [currentAdvertisementID]);

  return (
    <>
      <FlatCard heading="Manpower Attendance Overview">
        <CardGrid columns={4} data={cardData} />
      </FlatCard>

      <Table
        isStriped
        color="default"
        topContent={
          <>
            <h2 className="text-xl font-semibold">Manpower Attendance</h2>
            <div className="flex flex-wrap items-end gap-4">
              <Select
                items={[
                  { key: "Present", label: "Present" },
                  { key: "Absent", label: "Absent" },
                  { key: "Pending", label: "Pending" },
                ]}
                label="Attendance"
                labelPlacement="outside"
                placeholder="Select"
                className="w-[180px]"
              >
                {(item: any) => (
                  <SelectItem key={item?.key}>{item?.label}</SelectItem>
                )}
              </Select>

              <Select
                items={[{ key: "na", label: "--" }]}
                label="Role"
                labelPlacement="outside"
                placeholder="Select"
                className="w-[180px]"
              >
                {(item: any) => (
                  <SelectItem key={item?.key}>{item?.label}</SelectItem>
                )}
              </Select>

              <Select
                items={[{ key: "na", label: "--" }]}
                label="Center"
                labelPlacement="outside"
                placeholder="Select"
                className="w-[180px]"
              >
                {(item: any) => (
                  <SelectItem key={item?.key}>{item?.label}</SelectItem>
                )}
              </Select>

              <div className="flex items-end gap-2">
                <ExcelPdfDownload
                  excelFunction={() =>
                    DownloadKushalExcel(`v1/center/downloadManPowerByFilterExcelAttandance?advertisementId=${currentAdvertisementID}`, "Manpower Attendance", setLoader)
                  }
                  pdfFunction={() =>
                    DownloadKushalPdf(`v1/center/downloadManPowerAttandancePdf?advertisementId=${currentAdvertisementID}`, "Manpower Attendance", setLoader)
                  }
                  excelLoader={loader?.excel}
                  pdfLoader={loader?.pdf}
                />
                <FilterSearchBtn searchFunc={() => {}} clearFunc={() => {}} />
              </div>
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

export default ManpowerAttendance;
