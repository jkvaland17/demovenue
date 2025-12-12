import { Chip } from "@nextui-org/react";
import React from "react";

type Props = {
  details: any;
  title: string;
};

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

export default function PerformanceSummeryStats({ title, details }: Props) {
  const HightedDetails = [
    {
      name: "Trial Marks",
      value: details?.trialMarks,
      type: "text",
    },
    {
      name: "20 Marks",
      value: details?.commiteeMarks,
      type: "text",
    },
    { name: "DV Status", value: details?.dvStatus, type: "chip" },
    {
      name: "Certification Shortlist Status",
      value: details?.certificateShortlistStatus,
      type: "chip",
    },
    {
      name: "Chest Number",
      value: details?.chestNo,
      type: "text",
    },
  ];

  const statusColorMap: { [key: string]: ChipColor } = {
    Eligible: "success",
    Passed: "success",
    Pending: "warning",
    Failed: "danger",
  };
  return (
    <div className="my-2">
      <h3 className="my-1 font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-5">
        {HightedDetails?.map((item: any) => (
          <div key={item?.name} className="rounded-lg bg-gray-100 p-3">
            <p className="text-sm text-gray-500">{item?.name}</p>
            <div className="text-xl font-bold">
              {item?.type === "chip" ? (
                <Chip
                  variant="solid"
                  color={statusColorMap[item?.value]}
                  className="mt-1 text-white"
                >
                  {item?.value}
                </Chip>
              ) : (
                item?.value || "-"
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
