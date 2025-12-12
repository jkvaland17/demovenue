import React from "react";
import { Skeleton } from "@nextui-org/react";

interface Props {
  count: number;
}

const SkeletonCustom: React.FC<Props> = ({ count }) => {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      {Array.from({ length: count }, (_v, i) => (
        <div key={i} className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonCustom;
