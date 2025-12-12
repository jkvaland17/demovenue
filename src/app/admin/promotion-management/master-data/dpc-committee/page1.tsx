"use client";
import FlatCard from "@/components/FlatCard";
import {
  Avatar,
  AvatarGroup,
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
  useDisclosure,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

const DPCCommittee = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();

  const [data] = useState<any[]>([]);

  const columns = [
    { title: "Team Name", key: "teamName" },
    { title: "Members", key: "members" },
    { title: "Added on", key: "addedOn" },
    { title: "View Members", key: "viewMembers" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "members":
        return (
          <AvatarGroup size="sm" isBordered>
            <Avatar showFallback />
            <Avatar showFallback />
            <Avatar showFallback />
            <Avatar showFallback />
            <Avatar showFallback />
            <Avatar showFallback />
          </AvatarGroup>
        );
      case "viewMembers":
        return (
          <Link
            href={`/admin/promotion-management/master-data/dpc-committee/team-members`}
          >
            <Button
              color="primary"
              radius="full"
              size="sm"
              className="text-small"
            >
              <span className="material-symbols-rounded">groups</span>View
              Members
            </Button>
          </Link>
        );
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
        <h2 className="mb-6 text-2xl font-semibold">DPC Committee</h2>
        <Select
          items={[
            {
              key: "noData",
              name: "--",
            },
          ]}
          variant="bordered"
          label="Select Promotion"
          labelPlacement="outside"
          placeholder="Select"
        >
          {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
        </Select>
      </FlatCard>

      <FlatCard heading="Teams" ButtonLabel="Add Team" button onClick={onOpen}>
        <Table
          removeWrapper
          color="default"
          topContent={
            <div className="grid grid-cols-4 items-end gap-4">
              <Input
                type="text"
                placeholder="Search"
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              />
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
      </FlatCard>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Team
              </ModalHeader>
              <ModalBody className="gap-6">
                <Input
                  type="text"
                  label="Team name"
                  labelPlacement="outside"
                  placeholder="Enter team name"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Add Team
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
                Upload DV/PST Team Data
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

export default DPCCommittee;
