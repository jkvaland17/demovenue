"use client";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import React, { useState } from "react";

type Props = {};

const DVPSTCenters = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();

  const [data] = useState<any[]>([]);

  const columns = [
    { title: "District", key: "district" },
    { title: "City", key: "city" },
    { title: "Name", key: "name" },
    { title: "Code", key: "code" },
    { title: "Address", key: "address" },
    { title: "Added at", key: "addedAt" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="option">option</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <FlatCard>
        <h2 className="mb-6 text-2xl font-semibold">DV/PST Centers</h2>
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
        >
          {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
        </Select>
      </FlatCard>

      <Table
        className="my-6"
        color="default"
        topContent={
          <div className="grid grid-cols-4 gap-4">
            <Input
              placeholder="Search"
              endContent={
                <span className="material-symbols-rounded">search</span>
              }
            />
            <Button color="primary" onPress={onOpen}>
              <span className="material-symbols-rounded">add</span>Add New
              DV/PST Center
            </Button>
            <Button color="primary" onPress={onUpload}>
              <span className="material-symbols-rounded">upload</span>Upload
              DV/PST Centers
            </Button>
            <Button color="primary">
              <span className="material-symbols-rounded">download</span>Download
              Upload Format
            </Button>
          </div>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination showControls total={1} initialPage={1} />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New DV/PST Center
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[
                    {
                      key: "noData",
                      name: "--",
                    },
                  ]}
                  isRequired
                  label="Center District"
                  labelPlacement="outside"
                  placeholder="Select"
                >
                  {(item) => (
                    <SelectItem key={item?.key}>{item?.name}</SelectItem>
                  )}
                </Select>
                <Input
                  label="Center City"
                  labelPlacement="outside"
                  placeholder=" Enter center city"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  label="Center name"
                  labelPlacement="outside"
                  placeholder=" Enter center name"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  label="Center code"
                  labelPlacement="outside"
                  placeholder=" Enter center code"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  label="Center Address"
                  labelPlacement="outside"
                  placeholder=" Enter center address"
                  endContent={
                    <span className="material-symbols-rounded">mail</span>
                  }
                />
                <Input
                  label="Mobile number"
                  labelPlacement="outside"
                  placeholder=" Enter mobile number"
                  endContent={
                    <span className="material-symbols-rounded">call</span>
                  }
                />
                <Select
                  items={[
                    {
                      key: "noData",
                      name: "--",
                    },
                  ]}
                  isRequired
                  selectionMode="multiple"
                  label="Center Availability Dates"
                  labelPlacement="outside"
                  placeholder="Select"
                >
                  {(item) => (
                    <SelectItem key={item?.key}>{item?.name}</SelectItem>
                  )}
                </Select>
                <Input
                  label="Center Capacity"
                  labelPlacement="outside"
                  placeholder=" Enter center capacity"
                  endContent={
                    <span className="material-symbols-rounded">call</span>
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Add DV/PST Center
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isUpload} onOpenChange={onOpenUpload} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload DV/PST Centers
              </ModalHeader>
              <ModalBody className="gap-6">
                <Button variant="bordered" className="justify-between">
                  Upload Data File{" "}
                  <span className="material-symbols-rounded">upload_file</span>
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Validate and Upload File
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DVPSTCenters;
