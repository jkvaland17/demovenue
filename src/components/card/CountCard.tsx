"use client";
import { Chip } from "@nextui-org/react";
import React from "react";
type InterviewCandidateCardType = {
  title?: string;
  count?: number | undefined;
  onClick?: any;
  bgColor?: string;
  chipColor?: any;
};
const CountCard: React.FC<InterviewCandidateCardType> = ({
  title,
  count,
  onClick,
  bgColor,
  chipColor,
}) => {
  return (
    <div
      className={`overview_card flex h-fit justify-between gap-2 rounded-lg cursor-pointer p-2 w-full ${bgColor}`}
      onClick={onClick}
    >
      <p className="text-md font-semibold text-nowrap">{title}</p>
      <Chip variant="flat" color={chipColor} size="md">
        {count || 0}
      </Chip>
    </div>
  );
};
export default CountCard;
