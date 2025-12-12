"use client";
import FlatCard from "@/components/FlatCard";
import { Button, Input, Tab, Tabs } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";

type Props = {};

const EventManagement = (props: Props) => {
  return (
    <>
      <FlatCard>
        <h1 className="text-2xl font-semibold mb-8">Event management</h1>

        <Select
          items={[
            { _id: "6779167301d754ec41746fd6", name: "Constable" },
            {
              _id: "6779171f01d754ec41746fe3 ",
              name: "Sub-Inspector(SI)",
            },
          ]}
          label="Select Recruitment"
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
          <Tab key="recruitment" title="Recruitment">
            <div className="grid grid-cols-1 gap-6">
              <Input
                type="date"
                label="Application start date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Application end date and time"
                labelPlacement="outside"
              />
              <Input
                type="date"
                label="Admit card release date and time"
                labelPlacement="outside"
              />
              <Button color="primary">Save Recruitment Information</Button>
            </div>
          </Tab>
          <Tab key="application" title="Application">
            <div className="grid grid-cols-1 gap-6">
              <Input
                type="text"
                label="General Category. सामान्य वर्ग"
                labelPlacement="outside"
                placeholder=" "
                endContent={
                  <span className="material-symbols-rounded">tag</span>
                }
              />
              <Input
                type="text"
                label="Other Backward Classes. अन्य पिछड़ा वर्ग"
                labelPlacement="outside"
                placeholder=" "
                endContent={
                  <span className="material-symbols-rounded">tag</span>
                }
              />
              <Input
                type="text"
                label="Economically Weaker Sections. आर्थिक रूप से कमजोर वर्ग"
                labelPlacement="outside"
                placeholder=" "
                endContent={
                  <span className="material-symbols-rounded">tag</span>
                }
              />
              <Input
                type="text"
                label="Scheduled Castes. अनुसूचित जाति"
                labelPlacement="outside"
                placeholder=" "
                endContent={
                  <span className="material-symbols-rounded">tag</span>
                }
              />
              <Input
                type="text"
                label="Scheduled Tribes. अनुसूचित जनजाति"
                labelPlacement="outside"
                placeholder=" "
                endContent={
                  <span className="material-symbols-rounded">tag</span>
                }
              />

              <Button color="primary">Save Application Fee Information</Button>
            </div>
          </Tab>
          <Tab key="scrutiny" title="Application Scrutiny">
            <div className="grid grid-cols-1 gap-6">
              <Select
                label="Select Post"
                labelPlacement="outside"
                placeholder="Select"
              >
                <SelectItem key="data">data</SelectItem>
              </Select>

              <div className="border border-slate-400 p-6 rounded-2xl grid grid-cols-1 gap-6">
                <p className="font-medium text-xl">Team 1</p>
                <Input
                  type="date"
                  label="Application scrutiny start date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
                <Input
                  type="date"
                  label="Application scrutiny end date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
              </div>

              <Button color="primary">
                Save Application Scrutiny Information
              </Button>
            </div>
          </Tab>
          <Tab key="dv" title="Document Verification">
            <div className="grid grid-cols-1 gap-6">
              <Select
                label="Select Post"
                labelPlacement="outside"
                placeholder="Select"
              >
                <SelectItem key="data">data</SelectItem>
              </Select>

              <div className="border border-slate-400 p-6 rounded-2xl grid grid-cols-1 gap-6">
                <p className="font-medium text-xl">Vollyball</p>
                <Input
                  type="date"
                  label="Application scrutiny start date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
                <Input
                  type="date"
                  label="Application scrutiny end date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
              </div>

              <Button color="primary">
                Save Document Verification Information
              </Button>
            </div>
          </Tab>
          <Tab key="trails" title="Trails Marks">
            <div className="grid grid-cols-1 gap-6">
              <Select
                label="Select Post"
                labelPlacement="outside"
                placeholder="Select"
              >
                <SelectItem key="data">data</SelectItem>
              </Select>

              <div className="border border-slate-400 p-6 rounded-2xl grid grid-cols-1 gap-6">
                <p className="font-medium text-xl">Vollyball</p>
                <Input
                  type="date"
                  label="Application scrutiny start date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
                <Input
                  type="date"
                  label="Application scrutiny end date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
              </div>

              <Button color="primary">Save Trail Marks Information</Button>
            </div>
          </Tab>
          <Tab key="dv_marks" title="Document Verification Marks">
            <div className="grid grid-cols-1 gap-6">
              <Select
                label="Select Post"
                labelPlacement="outside"
                placeholder="Select"
              >
                <SelectItem key="data">data</SelectItem>
              </Select>

              <div className="border border-slate-400 p-6 rounded-2xl grid grid-cols-1 gap-6">
                <p className="font-medium text-xl">Vollyball</p>
                <Input
                  type="date"
                  label="Application scrutiny start date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
                <Input
                  type="date"
                  label="Application scrutiny end date and time"
                  labelPlacement="outside"
                  placeholder=" "
                />
              </div>

              <Button color="primary">
                Save Document Verification Marks Information
              </Button>
            </div>
          </Tab>
        </Tabs>
      </FlatCard>
    </>
  );
};

export default EventManagement;
