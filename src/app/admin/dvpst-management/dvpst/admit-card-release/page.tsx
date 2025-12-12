"use client";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import Image from "next/image";
import React from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";

type Props = {};

const DVPSTAdmitCardRelease = (props: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isVenue,
    onOpen: onVenue,
    onOpenChange: onOpenVenue,
  } = useDisclosure();
  const {
    isOpen: isRelease,
    onOpen: onRelease,
    onOpenChange: onOpenRelease,
  } = useDisclosure();

  const rows: any = [];
  const columns2 = [
    {
      title: "Sport",
      key: "sport",
    },
    {
      title: "State",
      key: "state",
    },
    {
      title: "Full Name",
      key: "fullName",
    },
    {
      title: "Application No.",
      key: "appNo",
    },
    {
      title: "Gender",
      key: "gender",
    },
  ];

  return (
    <div>
      <FlatCard>
        <h2 className="mb-6 text-2xl font-semibold">Admit Card Release</h2>
        <Select
          items={[
            {
              key: "noData",
              name: "--",
            },
          ]}
          variant="bordered"
          isRequired
          label="Select Event/Recruitment"
          labelPlacement="outside"
          placeholder="Select"
          className="mb-6"
        >
          {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
        </Select>
      </FlatCard>

      <FlatCard>
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">
            Candidates Center Allocation
          </h2>
          <Button color="primary" variant="shadow" onPress={onOpen}>
            Add candidates to venue
          </Button>
        </div>
      </FlatCard>

      <FlatCard>
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">Release Admit Card</h2>
            <p className="text-red-600">Complete Center Allocation First</p>
          </div>
          <Button color="secondary" variant="shadow" onPress={onRelease}>
            <span className="material-symbols-rounded">description</span>Release
            Admit Card
          </Button>
        </div>
      </FlatCard>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add candidates to venue
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[{ key: "data", label: "data" }]}
                  label="Post"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectionMode="multiple"
                >
                  {(option) => (
                    <SelectItem key={option?.key}>{option?.label}</SelectItem>
                  )}
                </Select>
                <Select
                  items={[{ key: "data", label: "data" }]}
                  label="Center District"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectionMode="multiple"
                >
                  {(option) => (
                    <SelectItem key={option?.key}>{option?.label}</SelectItem>
                  )}
                </Select>
                <Input
                  type="text"
                  label="Center City"
                  labelPlacement="outside"
                  placeholder="Enter center city"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  type="text"
                  label="Center name"
                  labelPlacement="outside"
                  placeholder="Enter Center name"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  type="date"
                  label="Select available date"
                  labelPlacement="outside"
                />
                <Select
                  items={[{ key: "data", label: "data" }]}
                  label="Slot/Timings"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectionMode="multiple"
                >
                  {(option) => (
                    <SelectItem key={option?.key}>{option?.label}</SelectItem>
                  )}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  className="w-full"
                  onPress={() => {
                    onClose();
                    onVenue();
                  }}
                >
                  Add Candidate
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isVenue}
        onOpenChange={onOpenVenue}
        className="max-w-[70rem]"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Candidate Venue Allocation
                (Venue-wise/Date-wise/Post-wise/Gender-wise Allocation)
              </ModalHeader>
              <ModalBody className="grid grid-cols-2 gap-8">
                <p className="font-medium">
                  Post: <span className="font-normal">XXXXXX</span>
                </p>
                <p className="font-medium">
                  Sport: <span className="font-normal">XXXXXX</span>
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <h5 className="mb-3 font-semibold">Venue details</h5>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        person
                      </span>
                      Center
                    </p>
                    <p>Mini stadium </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        location_on
                      </span>
                      Center City
                    </p>
                    <p>Lucknow</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        map
                      </span>
                      Center Address
                    </p>
                    <p>Mini stadium Gomti Nagar</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        tag
                      </span>
                      Center Capacity
                    </p>
                    <p>-</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        tag
                      </span>
                      Center remaining Capacity
                    </p>
                    <p>-</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <h5 className="mb-3 font-semibold">Allocation Details</h5>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        calendar_today
                      </span>
                      Date
                    </p>
                    <p>12-12-2022</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        schedule
                      </span>
                      Slot/Timings
                    </p>
                    <p>01:00 PM</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        groups
                      </span>
                      Total number of candidates
                    </p>
                    <p>-</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        groups
                      </span>
                      Allocated candidates
                    </p>
                    <p>-</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <p className="font-medium">
                      <span className="material-symbols-rounded me-2 align-bottom">
                        groups
                      </span>
                      Remaining candidates
                    </p>
                    <p>-</p>
                  </div>
                </div>

                <Table
                  removeWrapper
                  selectionMode="multiple"
                  className="col-span-2"
                  topContentPlacement="outside"
                  bottomContentPlacement="outside"
                  topContent={
                    <>
                      <h4 className="font-semibold">Filter Candidates</h4>
                      <div className="grid grid-cols-3 gap-6">
                        <Select
                          items={[
                            { key: "male", label: "Male" },
                            { key: "female", label: "Female" },
                            { key: "other", label: "Other" },
                          ]}
                          label="Gender"
                          labelPlacement="outside"
                          placeholder="Select"
                          selectionMode="multiple"
                        >
                          {(option) => (
                            <SelectItem key={option?.key}>
                              {option?.label}
                            </SelectItem>
                          )}
                        </Select>
                        <Input
                          type="text"
                          label="Number of candidates"
                          labelPlacement="outside"
                          placeholder="Enter number of candidates"
                        />
                        <Select
                          items={[
                            { key: "odd", label: "Odd" },
                            { key: "even", label: "Even" },
                            { key: "none", label: "None" },
                          ]}
                          label="Application number odd even wise"
                          labelPlacement="outside"
                          placeholder="Select"
                          selectionMode="multiple"
                        >
                          {(option) => (
                            <SelectItem key={option?.key}>
                              {option?.label}
                            </SelectItem>
                          )}
                        </Select>
                      </div>
                    </>
                  }
                  bottomContent={
                    <div className="flex w-full justify-end">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={1}
                        total={1}
                      />
                    </div>
                  }
                >
                  <TableHeader columns={columns2}>
                    {(column) => (
                      <TableColumn key={column?.key}>
                        {column?.title}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={rows}>
                    {(item: any) => (
                      <TableRow key={item?._id}>
                        {(columnKey) => (
                          <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" className="w-full">
                  Allocate Admit Card
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isRelease} onOpenChange={onOpenRelease} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Release Admit Card
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[{ key: "noData", label: "--" }]}
                  label="Sport"
                  labelPlacement="outside"
                  placeholder="Select"
                  selectionMode="multiple"
                >
                  {(option) => (
                    <SelectItem key={option?.key}>{option?.label}</SelectItem>
                  )}
                </Select>
                <div className="grid grid-cols-2 gap-6">
                  <Button variant="bordered" className="border font-medium">
                    Select Predefined Template
                  </Button>
                  <Button variant="bordered" className="border font-medium">
                    Upload Admit Card Template
                    <Image
                      src={pdf}
                      className="h-[25px] w-[25px] object-contain"
                      alt="pdf"
                    />
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" className="w-full">
                  Release Admit Card
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DVPSTAdmitCardRelease;
