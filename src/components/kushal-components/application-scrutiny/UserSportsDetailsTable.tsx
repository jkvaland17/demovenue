import { Chip, Spinner } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Image from "next/image";
import Link from "next/link";
import React, { Key, useCallback, useState } from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

type UserSportsDetailsTableTypes = {
  data: any;
};

const columns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Sub-Sports",
    key: "subSports",
  },
  {
    title: "Certificate",
    key: "certificate",
  },
  {
    title: "Status",
    key: "status",
  },
];

export default function UserSportsDetailsTable({
  data,
}: UserSportsDetailsTableTypes) {
  const [page, setPage] = useState(1);
  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "warning",
    Returned: "danger",
    Ongoing: "secondary",
    ForthComing: "default",
    Completed: "success",
    Release: "primary",
  };

  const renderCell = useCallback(
    (item: any, columnKey: Key, index: number) => {
      const cellValue = item[columnKey as any];
      const actualIndex = Math.abs(page - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "No":
          return <p className="text-bold text-sm capitalize">{actualIndex}</p>;
        case "name":
        case "subSports":
          return <p>{cellValue}</p>;
        case "certificate":
          return cellValue !== "" ? (
            <Link href={cellValue} target="_blank">
              <Image
                src={pdf}
                className="h-[30px] w-[30px] object-contain"
                alt="pdf"
              />
            </Link>
          ) : (
            <p>N/A</p>
          );
        case "status":
          return cellValue !== "" ? (
            <Chip
              color={statusColorMap[item?.status]}
              variant="flat"
              radius="full"
              size="md"
            >
              {item?.status}
            </Chip>
          ) : (
            <p>N/A</p>
          );

        default:
          return cellValue;
      }
    },
    [page],
  );
  return (
    <div>
      <Table
        shadow="none"
        classNames={{
          wrapper: "p-0 overflow-auto scrollbar-hide",
        }}
        topContentPlacement="outside"
        topContent={
          <>
            <h4 className="font-semibold">Sports Details</h4>
          </>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column?.key}>{column?.title}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data}
          emptyContent={"No Data!"}
          loadingContent={<Spinner />}
        >
          {data?.map((item: any, index: number) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, index)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
