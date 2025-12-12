"use client";
import {
  CallGetAllAdhiyaachanList,
  CallGetDashboardStat,
} from "@/_ServerActions";
import SearchInput from "@/components/Custom/SearchInput";
import FlatCard from "@/components/FlatCard";
import DashboardCards from "@/components/Adhiyaachan/DashboardCards";
import CardSkeleton from "@/components/kushal-components/loader/CardSkeleton";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const columns = [
  { title: "Title", key: "title" },
  { title: "Reference number", key: "referenceNumber" },
  { title: "Department", key: "departments_To_Sent" },
  { title: "Status", key: "status" },
];

const AdhiyaachanDashboard = () => {
  const [allList, setAllList] = useState<any>([]);
  const [dashboardStat, setDashboardStat] = useState<any>([]);
  const [totalPages, setTotalPages] = useState<any>("");
  const [loader, setLoader] = useState<any>({
    table: false,
    cards: false,
  });
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<any>("");

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "warning",
    Returned: "danger",
    Ongoing: "secondary",
    ForthComing: "default",
    Completed: "success",
    Release: "primary",
  };

  const cardData = [
    {
      title: "Total Adhiyaachan",
      count: dashboardStat?.totalDocuments,
      status: "Total",
    },
    {
      title: "Total Completed",
      count: dashboardStat?.Completed,
      status: "Completed",
    },
    {
      title: "Total Ongoing",
      count: dashboardStat?.Ongoing,
      status: "Ongoing",
    },
    {
      title: "Total Pending",
      count: dashboardStat?.Pending,
      status: "Pending",
    },
    {
      title: "Total Returned",
      count: dashboardStat?.ForthComing,
      status: "Returned",
    },
  ];

  const getAdhiyaachanList = async () => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    const query = `page=${page}&limit=10&title=${searchValue}`;
    try {
      const { data, error } = (await CallGetAllAdhiyaachanList(query)) as any;
      if (data?.data) {
        setAllList(data?.data);
        setTotalPages(data?.data?.totalPages);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const getDashboardCounts = async () => {
    setLoader((prev: any) => ({
      ...prev,
      cards: true,
    }));
    try {
      const { data, error } = (await CallGetDashboardStat()) as any;
      if (data?.data) {
        setDashboardStat(data?.data);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        cards: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        cards: false,
      }));
    }
  };

  useEffect(() => {
    getDashboardCounts();
    getAdhiyaachanList();
  }, [page]);

  const renderCell = useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "status":
          return (
            <Chip
              color={statusColorMap[item?.status]}
              className="text-white"
              radius="full"
              size="md"
            >
              {item?.status}
            </Chip>
          );
        default:
          return <p>{cellValue}</p>;
      }
    },
    [page],
  );

  return (
    <>
      <div className="mb-10">
        <FlatCard>
          <h1 className="mb-5 text-2xl font-semibold">Adhiyaachan Status</h1>
          {loader.cards ? (
            <CardSkeleton cardsCount={5} columns={3} />
          ) : (
            <div className="grid grid-cols-4 gap-4 mob:grid-cols-2 tab:grid-cols-3">
              {cardData.map((card, index) => (
                <DashboardCards
                  key={index}
                  title={card.title}
                  count={card.count}
                  status={card.status}
                />
              ))}
            </div>
          )}
        </FlatCard>
        <FlatCard>
          <h1 className="mb-6 text-2xl font-semibold mob:mb-2">
            Adhiyaachan Table
          </h1>
          {loader.table ? (
            <TableSkeleton columnsCount={5} rowsCount={10} />
          ) : (
            <Table
              color="default"
              aria-label="Example static collection table"
              shadow="none"
              topContentPlacement="outside"
              classNames={{
                wrapper: "p-0",
              }}
              topContent={
                <SearchInput
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  functionCall={getAdhiyaachanList}
                />
              }
              bottomContentPlacement="outside"
              bottomContent={
                <div className="flex justify-end">
                  <Pagination
                    showControls
                    initialPage={1}
                    page={page}
                    total={totalPages ?? 0}
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
                  >
                    {column.title}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={allList}>
                {(item: any) => (
                  <TableRow key={item._id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </FlatCard>
      </div>
    </>
  );
};

export default AdhiyaachanDashboard;
