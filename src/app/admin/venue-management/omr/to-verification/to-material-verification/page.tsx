"use client";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import { Input } from "@nextui-org/input";
import {
  Button,
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

type Props = {};

const MaterialVerification = (props: Props) => {
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allData, setAllData] = useState<any[]>([
    {
      id: "--",
      district: "--",
      districtCode: "--",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columns = [
    { title: "ID", key: "id" },
    { title: "District", key: "district" },
    { title: "District Code", key: "districtCode" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "actions":
        return (
          <Button
            color="primary"
            variant="flat"
            radius="full"
            startContent={
              <span className="material-symbols-rounded">visibility</span>
            }
          >
            View
          </Button>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);
  return (
    <Table
      isStriped
      color="default"
      aria-label="Example static collection table"
      className="mb-6"
      topContent={
        <>
          <h2 className="text-xl font-semibold">T/O Material verification</h2>

          <div className="grid grid-cols-4 items-end gap-4">
            <Select
              items={[{ key: "na", label: "--" }]}
              label="Event"
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
        </>
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
  );
};

export default MaterialVerification;
