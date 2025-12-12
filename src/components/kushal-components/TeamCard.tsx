"use client";
import React from "react";
import TeamMemberCard from "./TeamMemberCard";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Chip,
} from "@nextui-org/react";
import moment from "moment";

const TeamCard = ({ item }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="shadow-small p-6 rounded-xl">
        <div className="flex justify-between pb-4 border-b">
          <div>
            <p>{item?.name}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {item?.expertise?.map((item: any, index: any) => (
                <Chip
                  key={index}
                  color="warning"
                  variant="flat"
                  classNames={{
                    content: "text-orange-500",
                    base: "bg-orange-100",
                  }}
                >
                  {item?.expertiseId?.name}
                </Chip>
              ))}
            </div>
          </div>

          <p>Added on: {moment(item?.createdAt).format("DD-MM-YYYY")}</p>
        </div>
        <h6 className="font-medium text-lg my-4">Members</h6>
        <div className="grid grid-cols-2 gap-6">
          {item?.members?.map((item: any, index: any) => (
            <TeamMemberCard item={item} key={index} />
          ))}
          <Button onPress={onOpen} color="primary" className="font-medium">
            <span
              className="material-symbols-rounded"
              style={{ color: "white" }}
            >
              add
            </span>
            Add a Member
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add a Member
              </ModalHeader>
              <ModalBody className="flex flex-col gap-6">
                <Select
                  label="User"
                  labelPlacement="outside"
                  placeholder="Select"
                >
                  <SelectItem key="data">data</SelectItem>
                </Select>
                <Select
                  label="Role"
                  labelPlacement="outside"
                  placeholder="Select"
                >
                  <SelectItem key="data">data</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" className="w-full">
                  Add Member
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TeamCard;
