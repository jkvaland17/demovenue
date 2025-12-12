"use client";
import {
  CallCreateMember,
  CallDeleteMember,
  CallGetAllMembers,
  CallUpdateMember,
} from "@/_ServerActions";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import Note from "@/components/kushal-components/Note";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Input } from "@nextui-org/input";
import {
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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

type FilterData = {
  name: string;
  email: string;
  phone: string;
};

const UserManagement = (props: Props) => {
  const [allUser, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();
  const { isOpen, onOpen, onOpenChange, onClose: closeModal } = useDisclosure();
  const {
    isOpen: isView,
    onOpen: onView,
    onOpenChange: onOpenView,
  } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [filterData, setFilterData] = useState<FilterData>({
    email: "",
    phone: "",
    name: "",
  });

  const createUser = async (userData: object) => {
    try {
      console.log("Create user data:", userData);
      const { data, error } = (await CallCreateMember(userData)) as any;

      if (data) {
        console.log(data);
      }
      if (data?.message === "Success") {
        toast.success("User created successfully!");
        handleCloseModel();
        closeModal();
        // refresh the user table data to see new user
        getAllUsers(true);
      }
      if (error) {
        toast.error(error);
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (userData: any) => {
    const structuredData = {
      userId: currentUser?._id,
      name: userData?.name,
      orgName: userData?.orgName,
      designation: userData?.designation,
      email: userData?.email,
      phone: userData?.phone,
    };
    try {
      console.log("Update user data:", structuredData);
      const { data, error } = (await CallUpdateMember(structuredData)) as any;
      console.log({ data, error });

      if (data?.message === "User updated successfully") {
        toast.success(data?.message);
        handleCloseModel();
        closeModal();
        // refresh the user table data to see updated user
        getAllUsers(true);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id: string) => {
    console.log("id", id);
    try {
      const { data, error } = (await CallDeleteMember(id)) as any;
      console.log({ data, error });
      if (data?.status_code == 200) {
        toast.success(data?.message);
        getAllUsers(true);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async (isFilter: boolean) => {
    try {
      const filterOn = `page=${page}&limit=10&name=${filterData?.name}&email=${filterData?.email}&phone=${filterData?.phone}`;
      const filterOff = `page=${page}&limit=10`;
      const { data, error } = (await CallGetAllMembers(
        isFilter ? filterOn : filterOff,
      )) as any;
      console.log(data, error);
      if (data) {
        setAllUsers(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
      }
      if (error) console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers(false);
  }, []);
  useEffect(() => {
    getAllUsers(true);
  }, [page]);

  const columns = [
    { title: "Full name", key: "name" },
    { title: "Organisation", key: "orgName" },
    { title: "Designation name", key: "designation" },
    { title: "Email", key: "email" },
    { title: "Mobile number", key: "phone" },
    { title: "Action", key: "actions" },
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
                onPress={() => {
                  setCurrentUser(item);
                  onView();
                }}
                key="view"
              >
                View
              </DropdownItem>
              <DropdownItem
                onPress={() => {
                  setCurrentUser(item);
                  setFormValues(item, "edit");
                }}
                key="edit"
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
                onPress={() => {
                  deleteUser(item?._id);
                }}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  // Clear modal data when user is created
  const handleCloseModel = () => {
    const newArray = ["name", "orgName", "designation", "email", "phone"];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const setFormValues = (item: any, modalType = "") => {
    setValue("name", item?.name || "");
    setValue("orgName", item?.orgName || "");
    setValue("designation", item?.designation || "");
    setValue("email", item?.email || "");
    setValue("phone", item?.phone || "");
    setModalType(modalType);
    onOpen();
  };

  const clearFilter = () => {
    setFilterData({
      ...filterData,
      email: "",
      phone: "",
      name: "",
    });
    getAllUsers(false);
  };

  // console.log("currentUser", currentUser);

  return (
    <>
      <Table
        isStriped={true}
        color="default"
        topContent={
          <>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Button
                color="primary"
                variant="shadow"
                className="mb-2 px-12 mob:px-2"
                startContent={
                  <span
                    className="material-symbols-rounded"
                    style={{ color: "white" }}
                  >
                    person_add
                  </span>
                }
                onPress={() => {
                  setFormValues("", "add");
                }}
              >
                Add user
              </Button>
            </div>

            <div className="grid grid-cols-1 flex-col items-center gap-4 lg:grid-cols-2 lg:items-end xl:grid-cols-4 mob:flex mob:items-stretch">
              <Input
                placeholder="Name"
                value={filterData.name}
                type="search"
                endContent={
                  <span className="material-symbols-rounded">person</span>
                }
                onChange={(e) =>
                  setFilterData({ ...filterData, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={filterData.email}
                type="search"
                endContent={
                  <span className="material-symbols-rounded">mail</span>
                }
                onChange={(e) =>
                  setFilterData({ ...filterData, email: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={filterData.phone}
                type="search"
                endContent={
                  <span className="material-symbols-rounded">call</span>
                }
                onChange={(e) =>
                  setFilterData({ ...filterData, phone: e.target.value })
                }
              />

              <FilterSearchBtn
                searchFunc={() => {
                  setPage(1);
                  getAllUsers(true);
                }}
                clearFunc={() => {
                  setPage(1);
                  getAllUsers(true);
                }}
              />
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
              key={column?.key}
              align={column?.key === "actions" ? "center" : "start"}
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={allUser} emptyContent={"No Data"}>
          {(item: any) => (
            <TableRow key={item?._id}>
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
        onClose={handleCloseModel}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add a User" : "Edit User Details"}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-6">
                <form
                  className="grid grid-cols-1 gap-5"
                  onSubmit={handleSubmit(
                    modalType === "add" ? createUser : updateUser,
                  )}
                >
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Full name is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="text"
                        label="Full name"
                        labelPlacement="outside"
                        placeholder="Enter full name"
                        isRequired
                        endContent={
                          <span className="material-symbols-rounded">edit</span>
                        }
                      />
                    )}
                  />

                  <Controller
                    name="orgName"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="text"
                        label="Organisation name"
                        labelPlacement="outside"
                        placeholder="Enter organisation name"
                        endContent={
                          <span className="material-symbols-rounded">edit</span>
                        }
                      />
                    )}
                  />

                  <Controller
                    name="designation"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="text"
                        label="Designation name"
                        labelPlacement="outside"
                        placeholder="Enter designation name"
                        endContent={
                          <span className="material-symbols-rounded">edit</span>
                        }
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="email"
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Enter email"
                        isRequired
                        endContent={
                          <span className="material-symbols-rounded">mail</span>
                        }
                      />
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Mobile no. is required",
                      minLength: {
                        value: 10,
                        message: "Mobile number must be exactly 10 digits",
                      },
                      maxLength: {
                        value: 10,
                        message: "Mobile number must be exactly 10 digits",
                      },
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="number"
                        label="Mobile number"
                        labelPlacement="outside"
                        placeholder="Enter mobile number"
                        isRequired
                        startContent={<p className="text-sm">+91</p>}
                        endContent={
                          <span className="material-symbols-rounded">call</span>
                        }
                      />
                    )}
                  />

                  <Note
                    note={`Username and Temporary Password will be delivered to Mobile number and Email provided`}
                  />

                  <Button
                    type="submit"
                    color="primary"
                    className="mb-4 w-full"
                    isLoading={isSubmitting}
                  >
                    {modalType === "add" ? "Add user" : "Save"}
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isView} size="xl" onOpenChange={onOpenView}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                User Details
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded me-2 align-bottom"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        person
                      </span>
                    </div>
                    <div className="font-semibold">Fullname</div>
                  </div>
                  <p className="font-medium">
                    <span className="-ms-6 me-6 font-medium">:</span>
                    {currentUser?.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded me-2 align-bottom"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        apartment
                      </span>
                    </div>
                    <div className="font-semibold">Organization Name</div>
                  </div>
                  <p className="font-medium">
                    <span className="-ms-6 me-6 font-medium">:</span>
                    {currentUser?.orgName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded me-2 align-bottom"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        business_center
                      </span>
                    </div>
                    <div className="font-semibold">Designation Name</div>
                  </div>
                  <p className="font-medium">
                    <span className="-ms-6 me-6 font-medium">:</span>
                    {currentUser?.designation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded me-2 align-bottom"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        mail
                      </span>
                    </div>
                    <div className="font-semibold">Email</div>
                  </div>
                  <p className="font-medium">
                    <span className="-ms-6 me-6 font-medium">:</span>
                    {currentUser?.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex">
                    <div>
                      <span
                        className="material-symbols-rounded me-2 align-bottom"
                        style={{ color: "rgb(100 116 139)" }}
                      >
                        call
                      </span>
                    </div>
                    <div className="font-semibold">Phone</div>
                  </div>
                  <p className="font-medium">
                    <span className="-ms-6 me-6 font-medium">:</span>+91{" "}
                    {currentUser?.phone}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserManagement;
