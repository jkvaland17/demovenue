"use client";
import FlatCard from "@/components/FlatCard";
import { Button, Input, Tab, Tabs } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";

type Props = {};

const PromotionEventManagement = (props: Props) => {
  return (
    <>
      <FlatCard>
        <h1 className="text-2xl font-semibold mb-8">Event management</h1>

        <Select
          items={[{ _id: "noData", name: "--" }]}
          label="Select Promotion"
          labelPlacement="outside"
          placeholder="Select"
        >
          {(item: any) => <SelectItem key={item?._id}>{item?.name}</SelectItem>}
        </Select>
      </FlatCard>

      <FlatCard>
        <Tabs
          aria-label="Options"
          variant="bordered"
          color="primary"
          size="lg"
          radius="full"
          classNames={{
            base: "mb-4",
            tab: "px-6 w-fit",
            tabContent: "font-medium",
            cursor: "w-full",
          }}
        >
          <Tab key="promotion" title="Promotion">
            <div className="grid grid-cols-1 gap-6">
              <Input
                type="date"
                label="Promotion start date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Promotion end date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Final result date and time"
                labelPlacement="outside"
              />
              <Button color="primary">Save Promotion Information</Button>
            </div>
          </Tab>
          <Tab key="seniority" title="Seniority List">
            <div className="grid grid-cols-1 gap-6">
              <Input
                type="date"
                label="Arrival date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Closure date and time"
                labelPlacement="outside"
              />
              <Button color="primary">Save Seniority List Information</Button>
            </div>
          </Tab>
          <Tab key="eligibility" title="Eligibility List">
            <div className="grid grid-cols-1 gap-6">
              <Input
                type="date"
                label="Arrival date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Closure date and time"
                labelPlacement="outside"
              />
              <Button color="primary">Save Eligibility List Information</Button>
            </div>
          </Tab>
          <Tab key="dpc" title="DPC Form">
            <div className="grid grid-cols-1 gap-6">
              <Input
                type="date"
                label="Arrival date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Closure date and time"
                labelPlacement="outside"
              />
              <Button color="primary">Save DPC Form Information</Button>
            </div>
          </Tab>
          <Tab key="verification" title="DPC Verification">
            <div className="grid grid-cols-1 gap-6">
              <Input
                type="date"
                label="Arrival date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Closure date and time"
                labelPlacement="outside"
              />
              <Button color="primary">Save DPC Verification Information</Button>
            </div>
          </Tab>
        </Tabs>
      </FlatCard>
    </>
  );
};

export default PromotionEventManagement;
