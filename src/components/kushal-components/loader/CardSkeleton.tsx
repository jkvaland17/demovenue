"use client";
import React from "react";
import { Skeleton } from "@nextui-org/skeleton";

type CardSkeletonProps = {
  cardsCount?: number;
  columns?: number;
};

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  cardsCount = 6,
  columns = 3,
}) => {
  return (
    <div
      className="grid gap-4 mt-5"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {[...Array(cardsCount)].map((_, index) => (
        <div
          key={`card-${index}`}
          className="flex flex-col rounded-lg bg-default-200 p-4 shadow-sm"
        >
          <Skeleton className="w-full h-32 mb-4 rounded-md bg-default-300" />
          <Skeleton className="h-6 mb-2 w-3/4 rounded-lg bg-default-400" />
          <Skeleton className="h-4 w-full rounded-lg bg-default-300" />
          <Skeleton className="h-4 w-5/6 mt-2 rounded-lg bg-default-300" />
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
