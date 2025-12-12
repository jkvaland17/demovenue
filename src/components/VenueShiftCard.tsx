import { Button, Select, SelectItem, TimeInput } from "@nextui-org/react";
import React from "react";

type Props = {};

const VenueShiftCard = (props: Props) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-3">
      <div className="flex justify-between">
        <p className="text-lg font-semibold">Shift 1</p>
        <Button
          color="danger"
          size="sm"
          variant="light"
          startContent={
            <span className="material-symbols-rounded">delete</span>
          }
        >
          Remove Shift
        </Button>
      </div>

      <Select
        items={[
          { key: "morning", label: "Morning" },
          { key: "afternoon", label: "Afternoon" },
        ]}
        label="Shift"
        labelPlacement="outside"
        placeholder="Select"
      >
        {(item: any) => <SelectItem key={item?.key}>{item?.label}</SelectItem>}
      </Select>

      <TimeInput
        label="Start Time"
        labelPlacement="outside"
        endContent={<span className="material-symbols-rounded">schedule</span>}
      />
      <TimeInput
        label="End Time"
        labelPlacement="outside"
        endContent={<span className="material-symbols-rounded">schedule</span>}
      />
    </div>
  );
};

export default VenueShiftCard;
