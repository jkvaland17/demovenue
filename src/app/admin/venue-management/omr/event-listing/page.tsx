"use client";
import { EyeFilledIcon } from "@/assets/img/svg/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/assets/img/svg/EyeSlashFilledIcon";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import VenueEventCard from "@/components/VenueEventCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
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
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {};

const Event = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalType, setModalType] = useState("add");
  const [upload, setUpload] = useState<any>([]);
  const { control, handleSubmit, setValue, register, reset } = useForm();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isResource, setIsResource] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([
    {
      id: "--",
      eventType: "--",
      name: "--",
      status: "--",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };

  const columns = [
    { title: "ID", key: "id" },
    { title: "Event Type", key: "eventType" },
    { title: "Name", key: "name" },
    { title: "Status", key: "status" },
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
              <DropdownItem
                key="edit"
                onPress={() => {
                  setModalType("edit");
                  setIsResource(false);
                  onOpen();
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem key="delete" color="danger" className="text-danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  return (
    <>
      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        topContent={
          <>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Event List</h2>
              <Button
                color="primary"
                variant="shadow"
                className="px-12"
                onPress={() => {
                  setModalType("add");
                  onOpen();
                }}
                startContent={
                  <span className="material-symbols-rounded">add</span>
                }
              >
                Add New Event
              </Button>
            </div>
            <div className="grid grid-cols-4 items-end gap-4">
              <Input
                placeholder="Search"
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              />

              <FilterSearchBtn searchFunc={() => {}} clearFunc={() => {}} />
            </div>
          </>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination
              showControls
              total={totalPage}
              page={page}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              className="text-wrap"
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={allData}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No data"
        >
          {(item: any) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add Event" : "Edit Event"}
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[{ key: "na", label: "--" }]}
                  label="Event Type"
                  labelPlacement="outside"
                  placeholder="Select"
                  isRequired
                >
                  {(item: any) => (
                    <SelectItem key={item?.key}>{item?.label}</SelectItem>
                  )}
                </Select>

                <Input
                  label="Event Name"
                  labelPlacement="outside"
                  placeholder="Enter event name"
                  isRequired
                />

                <VenueEventCard />

                <Button
                  color="secondary"
                  startContent={
                    <span className="material-symbols-rounded">add</span>
                  }
                >
                  Add Schedule
                </Button>

                {modalType === "edit" && (
                  <div>
                    <p className="mb-2">Status</p>
                    <Switch
                      defaultSelected={false}
                      aria-label="Automatic updates"
                    />
                  </div>
                )}
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

export default Event;
