import React from "react";

import { useSearchParams } from "next/navigation";
import { Card, CardFooter, Switch } from "@nextui-org/react";

export default function CustomCheckbox({
  onChange,
  value,
  title,
  desc,
  icon,
  name,
  isEditAllow,
}: {
  onChange: (value: boolean) => void;
  value: boolean | undefined;
  title: string;
  icon: string;
  desc?: string;
  name?: string;
  isEditAllow?: boolean;
}) {
  const searchParams = useSearchParams();
  const existingDraftId = searchParams.get("id");
  const isDisabled =
    name === "isAgeRelaxation"
      ? !!existingDraftId
      : isEditAllow === false
        ? true
        : false;
  return (
    <Card
      className={`mb-3 border border-gray-300 shadow-none hover:border-primary`}
    >
      <CardFooter className="items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined me-2 text-primary">
            {icon}
          </span>
          <div>
            <p>{title}</p>
            {desc && (
              <span className="text-tiny text-primary">( {desc} ) </span>
            )}
          </div>
        </div>
        <Switch
          isSelected={value}
          onValueChange={onChange}
          title={title}
          isDisabled={isDisabled || !isEditAllow}
        />
      </CardFooter>
    </Card>
  );
}
