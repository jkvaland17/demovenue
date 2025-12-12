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

const DVPSTUserManagement = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data] = useState<any[]>([]);

  const columns = [
    { title: "Full name", key: "fullName" },
    { title: "Organisation", key: "org" },
    { title: "Designation", key: "designation" },
    { title: "Email", key: "email" },
    { title: "Mobile number", key: "mobile" },
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
        <h2 className="mb-6 text-2xl font-semibold">DV/PST User Management</h2>
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
            <Button color="primary" onPress={onOpen}>
              <span className="material-symbols-rounded">person_add</span> Add
              User
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add User
              </ModalHeader>
              <ModalBody className="gap-6">
                <Input
                  label="Full name"
                  labelPlacement="outside"
                  placeholder=" Enter fullname"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  label="Organisation name"
                  labelPlacement="outside"
                  placeholder=" Enter Organisation name"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  label="Designation name"
                  labelPlacement="outside"
                  placeholder=" Enter Designation name"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
                <Input
                  label="Email"
                  labelPlacement="outside"
                  placeholder=" Enter email"
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
                <Note
                  note={`Username and Temporary Password will be delivered to Mobile number and Email provided`}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Add User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DVPSTUserManagement;
