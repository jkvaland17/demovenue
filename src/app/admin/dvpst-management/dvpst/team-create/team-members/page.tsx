"use client";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

const DVPSTTeamMembers = (props: Props) => {
  const [data] = useState<any[]>([
    {
      _id: 1,
      fullName: "data",
      rollNo: "data",
      gender: "data",
      age: "data",
    },
  ]);

  const columns = [
    { title: "Full name", key: "fullName" },
    { title: "Roll No.", key: "rollNo" },
    { title: "Gender", key: "gender" },
    { title: "Age", key: "age" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="option">option</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <Link href={`/admin/dvpst-management/master-data/team-create`}>
        <Button className="mb-3 w-[40px] min-w-fit rounded-full bg-transparent p-0 font-medium">
          <span className="material-symbols-rounded">arrow_back</span> Back to
          teams
        </Button>
      </Link>

      <Table
        color="default"
        topContent={
          <h2 className="text-xl font-semibold">DV/PST Team Members</h2>
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
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
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

export default DVPSTTeamMembers;
