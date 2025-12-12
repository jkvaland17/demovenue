"use client";
import { CallGetAllMembers } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Avatar,
  AvatarGroup,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {};

const DVPSTTeamCreate = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { control, handleSubmit, setValue } = useForm();
  const [AllMembersData, setAllMembersData] = useState<any>([]);
  const [totalPages, setTotalPages] = useState<any>("");
  const [loader, setLoader] = useState<any>({
    table: false,
    addTeam: false,
  });
  const [page, setPage] = useState<number>(1);
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();

  const [data] = useState<any[]>([
    {
      _id: 1,
      center: "data",
      district: "data",
      city: "data",
      addedOn: "data",
      members: "data",
    },
  ]);

  const columns = [
    { title: "Center", key: "center" },
    { title: "Members", key: "members" },
    { title: "District", key: "district" },
    { title: "City", key: "city" },
    { title: "Added on", key: "addedOn" },
    { title: "View Members", key: "viewMembers" },
    { title: "Actions", key: "actions" },
  ];

  const GetAllMembers = async () => {
    setLoader((prev: any) => ({
      ...prev,
      cards: true,
    }));
    try {
      const { data, error } = (await CallGetAllMembers()) as any;
      console.log("getallMembers", data, error);
      if (data?.message === "Success") {
        setAllMembersData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        cards: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        cards: false,
      }));
    }
  };

  const addTeam = async (data: any) => {
    console.log("data", data);
    // setLoader((prev: any) => ({
    //   ...prev,
    //   addTeam: true,
    // }));
    // try {
    //   const { data, error } = (await CallGetDashboardStat()) as any;
    //   // if (data?.data) {
    //   //   setaddTeamData(data?.data);
    //   // }
    //   if (error) {
    //     handleCommonErrors(error);
    //   }
    //   setLoader((prev: any) => ({
    //     ...prev,
    //     addTeam: false,
    //   }));
    // } catch (error) {
    //   console.log("error", error);
    //   setLoader((prev: any) => ({
    //     ...prev,
    //     addTeam: false,
    //   }));
    // }
  };

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "members":
        return (
          <AvatarGroup size="sm" isBordered>
            <Avatar showFallback />
            <Avatar showFallback />
            <Avatar showFallback />
          </AvatarGroup>
        );
      case "viewMembers":
        return (
          <Link
            href={`/admin/dvpst-management/master-data/team-create/team-members`}
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

  useEffect(() => {
    GetAllMembers();
  }, []);

  return (
    <div>
      <Table
        className="my-5"
        color="default"
        topContent={
          <div className="grid grid-cols-4 items-end gap-4">
            <h2 className="col-span-4 text-2xl font-semibold">
              DV/PST Team Create
            </h2>
            <Select
              items={[
                {
                  key: "noData",
                  name: "--",
                },
              ]}
              label="District"
              labelPlacement="outside"
              placeholder="Select"
            >
              {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
            </Select>
            <Select
              items={[
                {
                  key: "noData",
                  name: "--",
                },
              ]}
              label="City"
              labelPlacement="outside"
              placeholder="Select"
            >
              {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
            </Select>
            <Button color="primary" onPress={onOpen}>
              <span className="material-symbols-rounded">add</span>Add Team
            </Button>
            <Button color="primary" onPress={onUpload}>
              <span className="material-symbols-rounded">upload</span>Upload
              DV/PST Team Data
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Team</ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(addTeam)}
                  className="flex flex-col gap-5"
                >
                  <Controller
                    name="District"
                    control={control}
                    rules={{ required: "Select District" }}
                    render={({
                      fieldState: { invalid, error },
                      field: { onChange, value },
                    }) => (
                      <Select
                        placeholder="Select District"
                        label="District"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        selectedKeys={[value]}
                        errorMessage={error?.message}
                        onChange={(e: any) => {
                          onChange(e.target.value);
                        }}
                        items={[]}
                      >
                        {(option: any) => (
                          <SelectItem key={option?._id}>
                            {option?.titleInEnglish}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="City"
                    control={control}
                    rules={{ required: "Select City" }}
                    render={({
                      fieldState: { invalid, error },
                      field: { onChange, value },
                    }) => (
                      <Select
                        placeholder="Select City"
                        label="City"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        selectedKeys={[value]}
                        errorMessage={error?.message}
                        onChange={(e: any) => {
                          onChange(e.target.value);
                        }}
                        items={[]}
                      >
                        {(option: any) => (
                          <SelectItem key={option?._id}>
                            {option?.titleInEnglish}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="Center"
                    control={control}
                    rules={{ required: "Select Center" }}
                    render={({
                      fieldState: { invalid, error },
                      field: { onChange, value },
                    }) => (
                      <Select
                        placeholder="Select center"
                        label="Center"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        selectedKeys={[value]}
                        errorMessage={error?.message}
                        onChange={(e: any) => {
                          onChange(e.target.value);
                        }}
                        items={[]}
                      >
                        {(option: any) => (
                          <SelectItem key={option?._id}>
                            {option?.titleInEnglish}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="member"
                    rules={{
                      required: "Sports is Required",
                    }}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        selectionMode="multiple"
                        items={AllMembersData}
                        label="Add team member"
                        labelPlacement="outside"
                        placeholder="Select"
                        isInvalid={invalid}
                        selectedKeys={value || []}
                        errorMessage={error?.message}
                        onSelectionChange={(e) => {
                          let selectedValue = Array.from(e);
                          onChange(selectedValue);
                        }}
                      >
                        {(item: any) => (
                          <SelectItem key={item?._id}>{item?.name}</SelectItem>
                        )}
                      </Select>
                    )}
                  />
                  <Button
                    color="primary"
                    onPress={onClose}
                    className="mb-3 w-full"
                  >
                    Add Team
                  </Button>
                </form>
              </ModalBody>
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

export default DVPSTTeamCreate;
