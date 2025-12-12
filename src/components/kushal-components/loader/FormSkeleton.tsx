"use client";
import React from "react";
import { Skeleton } from "@nextui-org/skeleton";

type FormSkeletonTypes = {
  inputCount: number;
};

const FormSkeleton: React.FC<FormSkeletonTypes> = ({ inputCount }) => {
  return (
    <div className="mt-5 space-y-6">
      <div className="mb-4">
        <Skeleton className="h-8 w-1/3 rounded-lg bg-default-300" />
      </div>

      {[...Array(inputCount)].map((_, index) => (
        <div key={`input-skeleton-${index}`} className="space-y-2">
          <Skeleton className="h-5 w-1/4 rounded-lg bg-default-300" />
          <Skeleton className="h-10 w-full rounded-lg bg-default-200" />
        </div>
      ))}
    </div>
  );
};

export default FormSkeleton;
