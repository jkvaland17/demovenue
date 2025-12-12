"use client";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import Link from "next/link";

type Props = {};

const PromotionDashboard = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const func = () => console.log("promotion");

  const cardData = [
    {
      title: "Total number of completed Promotions Event",
      value: 0,
      link: "/admin/promotion-management/promotion/all-promotions",
    },
    { title: "Total number of Employees selected for the Promotion", value: 0 },
  ];

  return (
    <>
      <div className="flex justify-between gap-4 mob:flex-col">
        <h1 className="text-3xl font-semibold mob:text-2xl">
          Promotion Management
        </h1>
        {/* <Button color="primary" onPress={onOpen}>
          Create New Promotion Event
        </Button> */}
        <Link href={`/admin/promotion-management/promotion/all-promotions`}>
          <div className="live_session_btn_kushal">
            <span className="material-symbols-outlined">circle</span>
            Status of Live Examinations
          </div>
        </Link>
      </div>
      <FlatCard heading="All Promotions Overview">
        <CardGrid data={cardData} columns={3} />
      </FlatCard>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Promotion Event
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[{ key: "noData", name: "--" }]}
                  label="Select Adhiyaachan"
                  labelPlacement="outside"
                  placeholder="Select"
                  isRequired
                >
                  {(item) => (
                    <SelectItem key={item.key}>{item.name}</SelectItem>
                  )}
                </Select>
                <Input
                  type="text"
                  label="Promotion event name"
                  labelPlacement="outside"
                  placeholder="Enter promotion event name"
                  isRequired
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  type="date"
                  label="Event start date"
                  labelPlacement="outside"
                />
                <Input
                  type="date"
                  label="Event target date"
                  labelPlacement="outside"
                />
                <Select
                  items={[{ key: "noData", name: "--" }]}
                  label="Status"
                  labelPlacement="outside"
                  placeholder="Select"
                  isRequired
                >
                  {(item) => (
                    <SelectItem key={item.key}>{item.name}</SelectItem>
                  )}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PromotionDashboard;
