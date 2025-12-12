"use client";
import FlatCard from "@/components/FlatCard";
import Note from "@/components/kushal-components/Note";
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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

const DPCTeamMembers = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data] = useState<any[]>([]);

  const columns = [
    { title: "Full name", key: "fullName" },
    { title: "Roll No.", key: "rollNo" },
    { title: "Gender", key: "gender" },
    { title: "Age", key: "age" },
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
    <>
      <Link href={`/admin/promotion-management/master-data/dpc-committee`}>
        <Button className="mb-3 w-[40px] min-w-fit rounded-full bg-transparent p-0 font-medium">
          <span className="material-symbols-rounded">arrow_back</span> Back to
          teams
        </Button>
      </Link>

      <FlatCard
        heading="DPC Committee Team Members"
        ButtonLabel="Add Member"
        onClick={onOpen}
      >
        <Table
          removeWrapper
          className="mt-3"
          color="default"
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
          <TableBody items={data} emptyContent="No data">
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </FlatCard>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add DPC Member</ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[
                    {
                      key: "noData",
                      name: "--",
                    },
                  ]}
                  label="User"
                  labelPlacement="outside"
                  placeholder="Select"
                >
                  {(item) => (
                    <SelectItem key={item.key}>{item.name}</SelectItem>
                  )}
                </Select>
                <Select
                  items={[
                    {
                      key: "noData",
                      name: "--",
                    },
                  ]}
                  label="Role"
                  labelPlacement="outside"
                  placeholder="Select"
                >
                  {(item) => (
                    <SelectItem key={item.key}>{item.name}</SelectItem>
                  )}
                </Select>
                <Input
                  type="text"
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Enter email"
                  endContent={
                    <span className="material-symbols-rounded">mail</span>
                  }
                />
                <Input
                  type="text"
                  label="Mobile number"
                  labelPlacement="outside"
                  placeholder="Enter mobile number"
                  endContent={
                    <span className="material-symbols-rounded">call</span>
                  }
                />
                <Note
                  note={
                    "Username and Temporary Password will be delivered to Mobile number and Email provided"
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Add member
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DPCTeamMembers;
