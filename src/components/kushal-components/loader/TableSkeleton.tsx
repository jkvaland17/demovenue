"use client";
import React from "react";
import { Skeleton } from "@nextui-org/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

type TableSkeletonProps = {
  columnsCount: number;
  rowsCount?: number;
  filters?: boolean;
  filtersCount?: number;
  isTitle?: boolean;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columnsCount,
  rowsCount = 10,
  filters = false,
  filtersCount = 4,
  isTitle = false,
}) => {
  return (
    <div>
      {/* title */}
      {isTitle && (
        <div className="mb-3">
          <Skeleton className="h-10 rounded-md bg-default-500" />{" "}
        </div>
      )}

      {/* Filters Skeleton */}
      {filters && (
        <div className="mb-4 grid grid-cols-4 gap-4">
          {[...Array(filtersCount)].map((_, index) => (
            <Skeleton
              key={`filter-${index}`}
              className="h-10 rounded-md bg-default-300"
            />
          ))}
          {/* filter buttons */}
          <Skeleton className="h-10 rounded-md bg-default-500" />{" "}
          <Skeleton className="h-10 rounded-md bg-danger-500" />{" "}
        </div>
      )}

      {/* Table Skeleton */}
      <Table removeWrapper className="mt-10">
        <TableHeader>
          {[...Array(columnsCount)].map((_, colIndex) => (
            <TableColumn key={`header-${colIndex}`}>
              <Skeleton className="h-5 rounded-lg bg-default-300" />
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {[...Array(rowsCount)].map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {[...Array(columnsCount)].map((_, cellIndex) => (
                <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                  <Skeleton className="h-5 rounded-lg bg-default-200" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
