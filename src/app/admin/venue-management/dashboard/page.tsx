"use client";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
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
import React, { useState } from "react";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const statusColorMap: { [key: string]: ChipColor } = {
    Rejected: "danger",
    Absent: "danger",
    Ineligible: "danger",
    Pending: "warning",
    Accepted: "success",
    Eligible: "success",
    Present: "success",
    undefined: "default",
  };

  const cardData = [
    {
      title: "Total District",
      value: 0,
      link: "#",
    },
    {
      title: "Verified",
      value: 0,
      link: "#",
    },
    {
      title: "Unmatched",
      value: 0,
      link: "#",
    },
    {
      title: "Pending",
      value: 0,
      link: "#",
    },
  ];

  const columns = [
    { title: "District", key: "district" },
    { title: "Treasury Officer", key: "treasuryOfficer" },
    { title: "Nodal Officer", key: "treasuryOfficer" },
    { title: "District Manager", key: "districtManager" },
    { title: "Status", key: "status" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "status":
        return (
          <Chip color={statusColorMap[cellValue]} variant="flat" radius="full">
            {cellValue}
          </Chip>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  return (
    <>
      <FlatCard heading="Dashboard">
        <CardGrid columns={4} data={cardData} />
      </FlatCard>

      <div className="flex justify-end">
        <Button
          color="primary"
          variant="shadow"
          className="mb-4 px-8"
          startContent={
            <span
              className="material-symbols-rounded"
              style={{ color: "white" }}
            >
              download
            </span>
          }
        >
          Download Excel
        </Button>
      </div>

      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        topContent={
          <div className="grid grid-cols-4 items-end gap-4">
            <Select
              items={[{ key: "na", label: "--" }]}
              label="Status"
              labelPlacement="outside"
              placeholder="Select"
            >
              {(item: any) => (
                <SelectItem key={item?.key}>{item?.label}</SelectItem>
              )}
            </Select>

            <Input
              placeholder="Search"
              endContent={
                <span className="material-symbols-rounded">search</span>
              }
            />

            <FilterSearchBtn searchFunc={() => {}} clearFunc={() => {}} />
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

export default Dashboard;
