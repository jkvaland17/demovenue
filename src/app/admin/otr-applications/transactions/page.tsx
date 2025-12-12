"use client";
import {
  CallFindAllTransactionsForAdmin,
  CallFindMasterByCode,
  CallFindTransactionsStats,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import moment from "moment";
import React, { useEffect, useState } from "react";

type Props = {};
type FilterData = {
  candidateId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  advertisementId: string | any;
  transactionId: string;
  summary: string;
};

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const Transactions = (props: Props) => {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [allData, setAllData] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>({ summary: [] });
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advertisementList, setAdvertisementList] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    candidateId: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    advertisementId: "",
    transactionId: "",
    summary: "",
  });
  const [loader, setLoader] = useState<any>({
    excel: false,
    pdf: false,
  });

  const columns = [
    { title: "Sr. No", key: "srNo" },
    { title: "Candidate", key: "name" },
    { title: "Candidate ID", key: "candidateId" },
    { title: "Date/Time", key: "date" },
    { title: "Method", key: "method" },
    { title: "Payment Mode", key: "modeOfPayment" },
    { title: "Amount (₹)", key: "amount" },
    { title: "Transaction ID", key: "transactionId" },
    { title: "Status", key: "status" },
    // { title: "Print", key: "print" },
  ];

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "warning",
    Failure: "danger",
    Ongoing: "secondary",
    ForthComing: "default",
    Success: "success",
    Release: "primary",
  };

  useEffect(() => {
    if (!courseList?.length) {
      getCourseListData("showSkeleton");
    }
  }, []);

  useEffect(() => {
    if (filterData?.advertisementId) {
      GetData(filterData, page);
    }
  }, [page, filterData?.advertisementId]);

  const getCourseListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallFindMasterByCode()) as any;

      if (data.message === "Success") {
        setCourseList(data?.data);
        if (data?.data?.length) {
          getEventListData("showSkeleton", data?.data[0]?._id);
          if (typeof window !== "undefined" && data?.data?.length) {
            const globalCourseId = localStorage.getItem(
              "globalCourseId",
            ) as string;
            if (data?.data?.some((item: any) => item?._id === globalCourseId)) {
              setCourseId(globalCourseId);
            } else {
              setCourseId(data?.data[0]?._id);
            }
          }
        }
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const getEventListData = async (loaderType: string, courseId: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallUserFindAllAdvertisement(
        `parentMasterId=${courseId}`,
      )) as any;
      if (data?.message === "Success") {
        setAdvertisementList(data?.data);
        if (typeof window !== "undefined" && data?.data?.length) {
          const globalAdvertisementId = localStorage.getItem(
            "globalAdvertisementID",
          );
          if (
            data?.data?.some((item: any) => item?._id === globalAdvertisementId)
          ) {
            setFilterData({
              ...filterData,
              advertisementId: globalAdvertisementId,
            });
          }
        }
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  function buildQueryString(page: number, filterData?: FilterData): string {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });

    if (filterData) {
      Object.entries(filterData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });
    }

    return params.toString();
  }
  const GetData = async (filterData: any, page: number): Promise<void> => {
    try {
      setIsLoading(true);

      const queryString = buildQueryString(page, filterData);
      const { data, error } = (await CallFindAllTransactionsForAdmin(
        queryString,
      )) as any;

      if (error) {
        handleCommonErrors(error);
      } else if (data?.data) {
        setAllData(data?.data);
        setTotalPage(Math.ceil(data?.totalCounts / 10));
        GetStatsData();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const parsedValue = (key: string) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^./, (str: string) => str.toUpperCase());
  const GetStatsData = async (): Promise<void> => {
    try {
      const { data, error } = (await CallFindTransactionsStats(
        filterData?.advertisementId,
      )) as any;

      if (error) {
        handleCommonErrors(error);
      } else if (data?.statusCode === 200) {
        setStatsData({
          totalTransactionCount: data?.totalTransactionCount,
          totalSuccessAmount: data?.totalSuccessAmount,
          summary: Object?.entries(data?.summary).map(([key, value]: any) => {
            return {
              title: parsedValue(key),
              value,
            };
          }),
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, pageNo: number, index: number) => {
      const cellValue = item[columnKey as any];
      const srNo = (pageNo - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "srNo":
          return srNo < 10 ? `0${srNo}` : srNo;

        case "name":
          return (
            <div className="flex items-center gap-2">
              <Avatar radius="md" size="lg" src={item?.photograph ?? ""} />
              <div className="">
                <p className="gap-1 text-[15px] font-medium">
                  {item?.fullName}
                </p>
                <p className="mb-0 flex items-center gap-1 text-[0.85rem]">
                  <span className="material-symbols-outlined text-[1rem] text-blue-500">
                    mail
                  </span>
                  {item?.email || ""}
                </p>

                <p className="flex items-center gap-1 text-[0.85rem]">
                  <span className="material-symbols-outlined text-[1rem] text-blue-500">
                    call
                  </span>
                  {item?.mobileNumber || ""}
                </p>
              </div>
            </div>
          );
        case "print":
          return (
            <span className="material-symbols-rounded cursor-pointer text-blue-600">
              print
            </span>
          );
        case "date":
          return (
            <span className="text-nowrap">
              {moment(item?.createdAt).format("lll")}
            </span>
          );

        case "status":
          return (
            <Chip
              color={statusColorMap[cellValue]}
              variant="flat"
              radius="full"
              size="md"
            >
              {cellValue}
            </Chip>
          );
        default:
          return cellValue || "";
      }
    },
    [],
  );

  const clearFilter = () => {
    setFilterData({
      ...filterData,
      candidateId: "",
      fullName: "",
      email: "",
      mobileNumber: "",
      transactionId: "",
      summary: "",
    });
    if (page === 1) {
      GetData(
        {
          ...filterData,
          candidateId: "",
          fullName: "",
          email: "",
          mobileNumber: "",
          transactionId: "",
          summary: "",
        },
        page,
      );
    } else {
      setPage(1);
    }
  };
  const toCamelCase = (str: string) => {
    if (!/[_\s]/.test(str)) return str; // If there's no space or underscore, return as-is

    return str
      .toLowerCase()
      .replace(/[_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""));
  };
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transactions Dashboard</h2>
        {/* <ExcelPdfDownload excelFunction={() => {}} pdfFunction={() => {}} /> */}
      </div>

      <FlatCard>
        <div className="grid grid-cols-1 gap-4">
          <div className="">
            <Select
              label="Select Course"
              labelPlacement="outside"
              placeholder="Select"
              items={courseList}
              selectedKeys={[courseId]}
              isRequired
              required
              onSelectionChange={(e: any) => {
                const value = Array.from(e)[0] as string;
                if (typeof window !== "undefined") {
                  localStorage.setItem("globalCourseId", value);
                }
                if (page > 1) {
                  setPage(1);
                }
                setCourseId(value);
                getEventListData("workScope", value);
              }}
            >
              {(item) => (
                <SelectItem key={item?._id} className="capitalize">
                  {item?.name}
                </SelectItem>
              )}
            </Select>
          </div>
          <div className="">
            <Select
              label="Select Event/Recruitment"
              labelPlacement="outside"
              placeholder="Select"
              isLoading={loader === "workScope"}
              isDisabled={loader === "workScope"}
              items={advertisementList}
              isRequired
              required
              selectedKeys={[filterData?.advertisementId]}
              onSelectionChange={(e: any) => {
                const value = Array.from(e)[0] as string;
                if (typeof window !== "undefined") {
                  localStorage.setItem("globalAdvertisementID", value);
                }
                if (page > 1) {
                  setPage(1);
                }
                setFilterData({ ...filterData, advertisementId: value });
              }}
            >
              {(item) => (
                <SelectItem
                  key={item?._id}
                  className="capitalize"
                  classNames={{
                    title: "whitespace-normal break-words",
                  }}
                >
                  {`${item?.advertisementNumberInEnglish} (${item?.titleInEnglish})`}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
      </FlatCard>

      <FlatCard>
        <div className="mb-5 flex justify-between mob:flex-col">
          <h1 className="mb-5 text-xl font-semibold mob:mb-1">
            Total Transactions:{" "}
            <span>{statsData?.totalTransactionCount ?? 0}</span>
          </h1>

          <Chip color="success" variant="flat" size="lg" radius="sm">
            Total Amount: ₹ <span>{statsData?.totalSuccessAmount ?? 0}</span>
          </Chip>
        </div>
        <CardGrid
          data={statsData?.summary}
          columns={4}
          hasCallback={true}
          handleClick={(value: any) => {
            const parsedValue = toCamelCase(value);
            setFilterData({ ...filterData, summary: parsedValue });
            if (page === 1) {
              GetData({ ...filterData, summary: parsedValue }, page);
            } else {
              setPage(1);
            }
          }}
          activeValue={parsedValue(filterData?.summary)}
        />
      </FlatCard>

      <Table
        isStriped
        className="mb-6"
        color="default"
        aria-label="Example static collection table"
        topContent={
          <div className="grid grid-cols-1 flex-col gap-4 md:grid-cols-2 lg:grid-cols-4 mob:flex">
            <div className="">
              <Input
                label="Candidate ID"
                value={filterData?.candidateId}
                onChange={(e) => {
                  setFilterData({ ...filterData, candidateId: e.target.value });
                }}
                labelPlacement="outside"
                placeholder="Enter candidate ID"
                endContent={
                  <span className="material-symbols-rounded">badge</span>
                }
              />
            </div>
            <div className="">
              <Input
                label="Candidate Name"
                value={filterData?.fullName}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    fullName: e.target.value,
                  });
                }}
                labelPlacement="outside"
                placeholder="Enter candidate name"
                endContent={
                  <span className="material-symbols-rounded">person</span>
                }
              />
            </div>
            <div className="">
              <Input
                label="Email"
                value={filterData?.email}
                onChange={(e) => {
                  setFilterData({ ...filterData, email: e.target.value });
                }}
                labelPlacement="outside"
                placeholder="Enter email"
                endContent={
                  <span className="material-symbols-rounded">mail</span>
                }
              />
            </div>
            <div className="">
              <Input
                label="Mobile Number"
                value={filterData?.mobileNumber}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    mobileNumber: e.target.value,
                  });
                }}
                labelPlacement="outside"
                placeholder="Enter Mobile Number"
                endContent={
                  <span className="material-symbols-rounded">call</span>
                }
              />
            </div>
            <Input
              label="Transaction Id"
              value={filterData?.transactionId}
              onChange={(e) => {
                setFilterData({
                  ...filterData,
                  transactionId: e.target.value,
                });
              }}
              labelPlacement="outside"
              placeholder="Enter transaction id"
              endContent={<span className="material-symbols-rounded">tag</span>}
            />
             <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  `v1/admin/downloadTransactionsExcel?advertisementId=${filterData?.advertisementId}&candidateId=${filterData?.candidateId}&fullName=${filterData?.fullName}&email=${filterData?.email}&mobileNumber=${filterData?.mobileNumber}&transactionId=${filterData?.transactionId}`,
                  "Document verification",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/downloadTransactionsPdf?advertisementId=${filterData?.advertisementId}&candidateId=${filterData?.candidateId}&fullName=${filterData?.fullName}&email=${filterData?.email}&mobileNumber=${filterData?.mobileNumber}&transactionId=${filterData?.transactionId}`,
                  "Document verification",
                  setLoader,
                );
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
            {/* <Select
              items={[
                { key: "initiated", label: "Initiated" },
                { key: "success", label: "Success" },
                { key: "pending", label: "Pending" },
                { key: "failed", label: "Failed" },
              ]}
              label="Status"
              selectedKeys={[filterData.status]}
              onSelectionChange={(e: any) => {
                const value = Array.from(e)[0] as string;
                setFilterData({
                  ...filterData,
                  status: value,
                });
              }}
              labelPlacement="outside"
              placeholder="Select"
            >
              {(item: any) => (
                <SelectItem key={item?.key}>{item?.label}</SelectItem>
              )}
            </Select> */}
            <FilterSearchBtn
              clearFunc={clearFilter}
              searchFunc={() => {
                if (page === 1) {
                  GetData(filterData, page);
                } else {
                  setPage(1);
                }
              }}
            />
          </div>
        }
        bottomContent={
          totalPage > 1 ? (
            <div className="flex w-full justify-end">
              <Pagination
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPage}
                onChange={(page: any) => setPage(page)}
              />
            </div>
          ) : null
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
          {allData?.map((item: any, index: number) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey, page, index)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Transactions;
