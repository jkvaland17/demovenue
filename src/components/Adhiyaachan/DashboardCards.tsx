import { Chip } from "@nextui-org/react";
import React from "react";

interface InfoCardProps {
  title: string;
  count: number;
  status: string;
}

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const statusColorMap: { [key: string]: ChipColor } = {
  Pending: "warning",
  Returned: "danger",
  Ongoing: "secondary",
  ForthComing: "default",
  Total: "primary",
  Completed: "success",
  Release: "primary",
};

const DashboardCards: React.FC<InfoCardProps> = ({ title, count, status }) => {
  return (
    <div className={`flex h-full flex-col rounded-xl bg-slate-100 p-4`}>
      <p className="mb-4 font-medium">{title}</p>
      <Chip
        size="lg"
        color={statusColorMap[status]}
        className={`mt-auto text-white`}
      >
        {count || 0}
      </Chip>
    </div>
  );
};

export default DashboardCards;
