"use client";
import React, { useState } from "react";
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
  Input,
  Chip,
} from "@nextui-org/react";
import CommitteeMemberCard from "./CommitteeMemberCard";
import { Controller, useForm } from "react-hook-form";

const CommitteeCard = ({ item }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [loader, setLoader] = useState({
    createMember: false,
  });
  const { control, handleSubmit, reset } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    reset();
  };
  const roles = [
    { _id: "1", value: "Constable" },
    { _id: "2", value: "Sub-Inspector (SI)" },
    { _id: "3", value: "Inspector" },
    { _id: "4", value: "Assistant Sub-Inspector (ASI)" },
    { _id: "5", value: "DSP (Deputy Superintendent of Police)" },
    { _id: "6", value: "SP (Superintendent of Police)" },
    { _id: "7", value: "ACP (Assistant Commissioner of Police)" },
    { _id: "8", value: "Commissioner of Police" },
    { _id: "9", value: "Cyber Crime Unit" },
    { _id: "10", value: "Traffic Police" },
    { _id: "11", value: "Special Operations Group (SOG)" },
    { _id: "12", value: "Crime Branch" },
    { _id: "13", value: "Forensic Unit" },
    { _id: "14", value: "Patrolling Officer" },
    { _id: "15", value: "Investigation Officer" },
    { _id: "16", value: "VIP Security" },
  ];

  return (
    <>
      <div className="shadow-small p-6 rounded-xl">
        <div className="flex justify-between pb-4 border-b">
          <div>
            <p>{item?.name}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Chip
                color="warning"
                variant="flat"
                classNames={{
                  content: "text-orange-500",
                  base: "bg-orange-100",
                }}
              >
                {item?.sport}
              </Chip>
            </div>
          </div>

          <p>Added on: {item?.added_on}</p>
        </div>
        <h6 className="font-medium text-lg my-4">Members</h6>
        <div className="grid grid-cols-2 gap-6">
          {item?.members?.map((item: any, index: any) => (
            <CommitteeMemberCard
              item={item}
              openModal={onOpen}
              modalType={setModalType}
              key={index}
            />
          ))}
          <Button
            onPress={() => {
              onOpen();
              setModalType("add");
            }}
            className="bg-black text-white font-medium"
          >
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        size="3xl"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add"
                  ? "Add a Committee Member"
                  : "Edit Committee Member Details"}
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: "Full Name is required",
                    }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        labelPlacement="outside"
                        variant="faded"
                        isRequired
                        label="Full Name"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Full Name"
                      />
                    )}
                  />

                  <Controller
                    name="orgName"
                    control={control}
                    rules={{
                      required: "Organization Name is required",
                    }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        labelPlacement="outside"
                        variant="faded"
                        isRequired
                        label="Organization Name"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Organization Name"
                      />
                    )}
                  />

                  <Controller
                    name="designationName"
                    control={control}
                    rules={{
                      required: "Designation Name is required",
                    }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        labelPlacement="outside"
                        variant="faded"
                        isRequired
                        label="Designation Name"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Designation Name"
                      />
                    )}
                  />
                  <Controller
                    name="expertise"
                    control={control}
                    rules={{ required: "Expertise is required" }}
                    render={({
                      fieldState: { invalid, error },
                      field: { onChange, value },
                    }) => (
                      <Select
                        labelPlacement="outside"
                        variant="faded"
                        placeholder="Select"
                        label="Expertise"
                        isInvalid={invalid}
                        selectedKeys={[value]}
                        errorMessage={error?.message}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        items={roles.filter(
                          (item: any) => item.value !== "All",
                        )}
                      >
                        {(option: any) => (
                          <SelectItem key={option?._id} value={option?._id}>
                            {option?.value}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Enter Valid Email",
                      },
                    }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        isRequired
                        labelPlacement="outside"
                        variant="faded"
                        label="Email"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Email"
                      />
                    )}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Enter a Valid Number",
                      },
                      max: {
                        value: 9999999999,
                        message: "Mobile Number Should be 10 Digits",
                      },
                    }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        type="number"
                        isRequired
                        labelPlacement="outside"
                        variant="faded"
                        label="Phone"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Phone"
                      />
                    )}
                  />
                  <div className="flex gap-2 items-center">
                    <span className="material-symbols-rounded text-2xl !text-slate-600">
                      info
                    </span>
                    <p className="text-slate-600 text-sm ">
                      Username and Temporary Password will be delivered to
                      Mobile number and Email provided
                    </p>
                  </div>

                  <div className="my-3 flex gap-2">
                    {modalType === "add" ? (
                      <Button
                        type="submit"
                        variant="shadow"
                        className="w-full bg-black text-white"
                        isLoading={loader.createMember}
                      >
                        Add member
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="shadow"
                        className="w-full bg-black text-white"
                        isLoading={loader.createMember}
                      >
                        Edit member
                      </Button>
                    )}
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommitteeCard;
