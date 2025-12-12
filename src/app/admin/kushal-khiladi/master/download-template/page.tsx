"use client";
import FlatCard from "@/components/FlatCard";
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";

type Props = {};

const DownloadTemplate = (props: Props) => {
  return (
    <FlatCard heading="Download Templates for Data Upload">
      <Select
        items={[
          {
            key: 1,
            label: "Candidates Application Data",
          },
          {
            key: 2,
            label: "User Account Data",
          },
          {
            key: 3,
            label: "Scrutiny Team User Data",
          },
          {
            key: 4,
            label: "Trial Committee Member Data",
          },
          {
            key: 5,
            label: "DV-Marking Committee Member Data",
          },
        ]}
        label="Select Template"
        labelPlacement="outside"
        placeholder="Select"
        classNames={{ label: "font-medium" }}
      >
        {(option) => <SelectItem key={option?.key}>{option?.label}</SelectItem>}
      </Select>

      <Button color="primary" variant="shadow" className="mt-4 w-fit px-12">
        <span className="material-symbols-rounded" style={{ color: "white" }}>
          download
        </span>{" "}
        Download
      </Button>
    </FlatCard>
  );
};

export default DownloadTemplate;
