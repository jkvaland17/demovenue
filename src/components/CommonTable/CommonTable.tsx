"use client";
import React from "react";

import Link from "next/link";
import moment from "moment";
import { Switch } from "@nextui-org/switch";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

const CommonTable: React.FC<any> = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found.",
  basePath,
  onStatusChange,
  page,
  setPage,
  totalPage,
}) => {
  const renderCell = (item: any, column: any, index: number) => {
    const value = item[column];

    if (column.render) {
      return column.render(item, value, index);
    }

    switch (column) {
      case "status":
        return (
          <Switch
            isSelected={value}
            onValueChange={(e) => onStatusChange?.(item?._id, column, e)}
            color={column === "status" ? "primary" : "secondary"}
          />
        );
      case "Sr No":
        return index + 1;
      case "sport":
        return <p>{item?.name}</p>;
      case "subSport":
        return <p>{item?.parentSportsId?.name || "-"}</p>;
      case "zone":
        return <p>{item?.zoneDetails?.name}</p>;
      case "interviewStatus":
      case "screeningStatus":
        return (
          <Switch
            isSelected={value}
            onValueChange={(e) => onStatusChange?.(item?._id, column, e)}
            color={column === "status" ? "primary" : "secondary"}
          />
        );
      case "advertisementLink":
        return item?.advertisementLink ? (
          <Tooltip content="Prospectus">
            <a
              href={item.advertisementLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-file-lines text-xl" />
            </a>
          </Tooltip>
        ) : (
          "-"
        );
      case "prospectusLink":
        return item?.prospectusLink ? (
          <Tooltip content="Prospectus">
            <a
              href={item.prospectusLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-file-lines text-xl" />
            </a>
          </Tooltip>
        ) : (
          "-"
        );
      case "action":
        return basePath ? (
          <Tooltip content="Edit">
            <Button
              as={Link}
              href={`${basePath}/${item._id}/edit`}
              size="sm"
              className="rounded-md border border-[#718EBF] bg-white p-0 px-6 text-center text-sm text-[#718EBF] hover:bg-[#97b0dd] hover:text-white"
            >
              <i className="fa-solid fa-file-pen text-lg"></i>
            </Button>
          </Tooltip>
        ) : (
          "-"
        );
      case "created_at":
        return moment(value).format("YYYY-MM-DD") || "-";

      default:
        return value || "-";
    }
  };

  const columnLabelMap: Record<string, string> = {
    "Sr No": "Sr No",
    value: "Value",
    description: "Description",
    startDate: "Start Date",
    endDate: "End Date",
    created_at: "Created At",
    status: "Status",
    interviewStatus: "Interview Status",
    screeningStatus: "Screening Status",
    advertisement: "Advertisement",
    question: "Question",
    answer: "Answer",
    advertisementLink: "Advertisement Link",
    prospectusLink: "Prospectus Link",
    action: "Action",
  };

  return (
    <Table
      aria-label="Common Table"
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
      <TableHeader>
        {columns.map((column: any) => (
          <TableColumn key={column}>
            {columnLabelMap[column] || column}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        emptyContent={emptyMessage}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {data?.map((item: any, index: any) => (
          <TableRow key={item._id || index}>
            {columns.map((column: any) => (
              <TableCell key={`${item._id}-${column}`}>
                {renderCell(item, column, index)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CommonTable;
