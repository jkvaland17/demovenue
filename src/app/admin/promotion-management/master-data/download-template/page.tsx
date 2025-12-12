"use client";
import FlatCard from "@/components/FlatCard";
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";

type Props = {};

const PromotionTemplate = (props: Props) => {
  return (
    <FlatCard heading="Download Templates for Data Upload">
      <Select
        items={[
          {
            key: "user",
            name: "User Account Data",
          },
          {
            key: "seniority",
            name: "Seniority List Data",
          },
          {
            key: "eligibility",
            name: "Eligibility List Data",
          },
          {
            key: "dpc",
            name: "DPC Committee ",
          },
        ]}
        label="Select Template"
        labelPlacement="outside"
        placeholder="Select"
      >
        {(item) => <SelectItem key={item.key}>{item.name}</SelectItem>}
      </Select>
      <div className="flex justify-end mob:w-auto">
        <Button
          color="primary"
          variant="shadow"
          className="mt-3 w-fit px-12 mob:w-full mob:px-4"
        >
          <span className="material-symbols-rounded">download</span> Download
        </Button>
      </div>
    </FlatCard>
  );
};

export default PromotionTemplate;
