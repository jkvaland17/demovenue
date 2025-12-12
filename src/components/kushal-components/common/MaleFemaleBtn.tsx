import { Button } from "@nextui-org/react";
import React from "react";

type MaleFemaleButtonProps = {
  filterFunction: any;
  selectedBtn?: string;
};

export default function MaleFemaleButton({
  selectedBtn,
  filterFunction,
}: MaleFemaleButtonProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        variant="solid"
        onPress={() => {
          filterFunction((prev: any) => ({ ...prev, gender: "" }));
        }}
        startContent={<span className="material-symbols-rounded">groups</span>}
        isDisabled={selectedBtn === ""}
      >
        All
      </Button>
      <Button
        variant="solid"
        color="primary"
        onPress={() => {
          filterFunction((prev: any) => ({ ...prev, gender: "male" }));
        }}
        startContent={<span className="material-symbols-rounded">male</span>}
        isDisabled={selectedBtn === "male"}
      >
        Male
      </Button>
      <Button
        variant="solid"
        className="bg-[#E53888] text-white"
        onPress={() => {
          filterFunction((prev: any) => ({ ...prev, gender: "female" }));
        }}
        startContent={<span className="material-symbols-rounded">female</span>}
        isDisabled={selectedBtn === "female"}
      >
        Female
      </Button>
    </div>
  );
}
