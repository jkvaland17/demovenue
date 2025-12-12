import { Button, Input } from "@nextui-org/react";
import React from "react";
import VenueShiftCard from "./VenueShiftCard";

type Props = {};

const VenueEventCard = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-4">
      <div className="flex justify-between">
        <p className="text-lg font-semibold">Schedule 1</p>
        <Button
          color="danger"
          size="sm"
          variant="light"
          startContent={
            <span className="material-symbols-rounded">delete</span>
          }
        >
          Remove Event
        </Button>
      </div>
      <Input type="date" label="Date" labelPlacement="outside" />

      <VenueShiftCard />

      <Button
        color="secondary"
        variant="flat"
        startContent={<span className="material-symbols-rounded">add</span>}
      >
        Add Shift
      </Button>
    </div>
  );
};

export default VenueEventCard;
