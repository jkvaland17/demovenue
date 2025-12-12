"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from "@nextui-org/react";
import React, { useState } from "react";

interface DynamicTableProps {
  data: any[];
  rowsPerPage?: number;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  data,
  rowsPerPage = 10,
}) => {
  const headers = Object.keys(
    data.reduce((acc: any, obj: any) => {
      return { ...acc, ...obj };
    }, {}),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Table
      bottomContent={
        <div className="flex items-center justify-center">
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            onChange={handlePageChange}
            aria-label="Table Pagination"
          />
        </div>
      }
      aria-label="Example table with dynamic content"
    >
      <TableHeader>
        {headers?.map((column) => (
          <TableColumn key={column}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {currentData?.map((item: any, index: number) => (
          <TableRow key={index}>
            {headers.map((header) => (
              <TableCell key={header}>{item[header] ?? "-"}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DynamicTable;
