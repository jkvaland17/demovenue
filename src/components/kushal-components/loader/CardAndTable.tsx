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

type FullSkeletonProps = {
  cardCount: number;
  filterCount: number;
  tableColumns: number;
  tableRows?: number;
};

const CardAndTable: React.FC<FullSkeletonProps> = ({
  cardCount,
  filterCount,
  tableColumns,
  tableRows = 10,
}) => {
  return (
    <div className="space-y-6 rounded-xl border bg-white p-5 shadow-md">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-4 gap-5">
        {[...Array(cardCount)].map((_, index) => (
          <div
            key={`stat-${index}`}
            className="h-16 flex-1 rounded-lg bg-default-300"
          >
            <Skeleton className="h-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Filter Skeleton */}
      <div className="flex flex-wrap gap-4">
        {[...Array(filterCount)].map((_, index) => (
          <div
            key={`filter-${index}`}
            className="h-10 w-36 rounded-lg bg-default-200"
          >
            <Skeleton className="h-full rounded-lg" />
          </div>
        ))}
        {/* Optional Buttons */}
        <div className="h-10 w-36 rounded-lg bg-default-200">
          <Skeleton className="h-full rounded-lg" />
        </div>
        <div className="h-10 w-48 rounded-lg bg-default-200">
          <Skeleton className="h-full rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
      <Table removeWrapper>
        <TableHeader>
          {[...Array(tableColumns)].map((_, colIndex) => (
            <TableColumn key={`header-${colIndex}`}>
              <Skeleton className="h-5 rounded-lg bg-default-300" />
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {[...Array(tableRows)].map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {[...Array(tableColumns)].map((_, cellIndex) => (
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

export default CardAndTable;
