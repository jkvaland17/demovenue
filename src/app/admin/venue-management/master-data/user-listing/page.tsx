"use client";
import {
  CallCreateVenueUser,
  CallDeleteVenueUser,
  CallGetAllDistrict,
  CallGetAllUserRoles,
  CallGetAllUsers,
  CallGetCenterByDistrict,
  CallUpdateVenueUser,
  CallUserListingUpload,
} from "@/_ServerActions";
import { EyeFilledIcon } from "@/assets/img/svg/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/assets/img/svg/EyeSlashFilledIcon";
import { useAdvertisement } from "@/components/AdvertisementContext";
import ButtonAction from "@/components/ButtonAction/ButtonAction";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
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

const User = (props: Props) => {
  // const advertisementId = "679cfde930000d1df590aad1";
  const { currentAdvertisementID } = useAdvertisement();
  // Venue Management Module ID
  const moduleId = "67d7e6b1787a93da30837574";
  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { isSubmitting },
  } = useForm();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
    onClose: onCloseUpload,
  } = useDisclosure();
  const [modalType, setModalType] = useState("add");
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCenterLoading, setIsCenterLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
    Upload: false,
  });
  const [filterData, setFitlerData] = useState<any>({
    search: "",
  });
  const [preview, setPreview] = useState<any>([]);
  const [uploadFile, setUploadFile] = useState<any>([]);

  const columns = [
    { title: "Full Name", key: "name" },
    { title: "User ID", key: "userId" },
    { title: "Email", key: "email" },
    { title: "District", key: "district" },
    { title: "Phone", key: "phone" },
    { title: "Role", key: "role" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "name":
        return <p className="capitalize">{cellValue}</p>;
      case "role":
        return <p className="capitalize">{item?.role?.title}</p>;
      case "district":
        return <p className="capitalize">{item?.districts?.name}</p>;
      case "status":
        return (
          <Chip color={cellValue ? "success" : "danger"} variant="flat">
            {cellValue ? "Active" : "Inactive"}
          </Chip>
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
              <DropdownItem
                key="edit"
                onPress={() => {
                  setCurrentUser(item);
                  setFormValues(item);
                  setModalType("edit");
                  setIsChangePassword(true);
                  onOpen();
                }}
              >
                Edit
              </DropdownItem>
              {/* <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
                onPress={() => {
                  deleteUser(item?._id);
                }}
              >
                Delete
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const getAllUsers = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&moduleId=${moduleId}&page=${page}&limit=10&search=${filterData?.search}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllUsers(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllUsers", { data, error });

      if (data) {
        setUsers(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  const getAllDistrict = async () => {
    try {
      const { data, error } = (await CallGetAllDistrict()) as any;
      console.log("getAllDistrict", { data, error });

      if (data) {
        setDistricts(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllUserRoles = async () => {
    try {
      const { data, error } = (await CallGetAllUserRoles()) as any;
      console.log("getAllUserRoles", { data, error });

      if (data) {
        setRoles(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllUserRoles();
    getAllDistrict();
  }, []);
  useEffect(() => {
    if (currentAdvertisementID) {
      getAllUsers(false);
    }
  }, [page, currentAdvertisementID]);

  const getCenterByDistrict = async (district: string) => {
    setIsCenterLoading(true);
    try {
      const query = `district=${district}&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetCenterByDistrict(query)) as any;
      console.log("getCenterByDistrict", { data, error });

      if (data) {
        setCenters(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsCenterLoading(false);
  };

  const createUser = async (obj: any) => {
    try {
      const userData = {
        ...obj,
        advertisementId: currentAdvertisementID,
        moduleId,
      };
      const { data, error } = (await CallCreateVenueUser(userData)) as any;
      console.log("createUser", { data, error });

      if (data) {
        toast.success(data?.message);
        onClose();
        getAllUsers(false);
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateUser = async (obj: any) => {
    try {
      const userData = {
        ...obj,
        _id: currentUser?._id,
        name: obj?.name,
        email: obj?.email,
        phone: obj?.phone,
        userId: obj?.userId,
        password: obj?.password,
      };
      const { data, error } = (await CallUpdateVenueUser(userData)) as any;
      console.log("updateUser", { data, error });
      if (data) {
        toast.success(data?.message);
        onClose();
        getAllUsers(false);
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModel = () => {
    const newArray = [
      "name",
      "district",
      "centerId",
      "role",
      "phone",
      "email",
      "password",
      "userId",
    ];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const setFormValues = (item?: any) => {
    setValue("name", item?.name || "");
    setValue("district", item?.districts?._id || "");
    setValue("centerId", item?.centerId || "");
    setValue("phone", item?.phone || "");
    setValue("email", item?.email || "");
    setValue("role", item?.role?._id || "");
    setValue("userId", item?.userId || "");
    setValue("password", "");
  };

  // console.log("isChangePassword", isChangePassword);

  const clearFilter = () => {
    setFitlerData({
      user: "",
    });
    getAllUsers(false);
  };

  const handleChange = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUploadFile([...newFiles]);
    setPreview([...newFiles]);
  };

  const Upload = async (file: any) => {
    try {
      setLoader((prev: any) => ({
        ...prev,
        Upload: true,
      }));
      const formData = new FormData();
      formData.append("excel", file);
      formData.append("advertisementId", currentAdvertisementID);
      const { data, error, func } = (await CallUserListingUpload(
        formData,
      )) as any;
      console.log("CallUserListingUpload", { data, error });
      if (data) {
        toast.success(data?.message);
        onCloseUpload();
        setLoader((prev: any) => ({
          ...prev,
          Upload: false,
        }));
        setPreview([]);
        getAllUsers(false);
      }
      if (error) {
        handleCommonErrors(error);
        setLoader((prev: any) => ({
          ...prev,
          Upload: false,
        }));
      }
    } catch (error) {
      console.error("Error in handleCreateSeniority:", error);
    } finally {
      setLoader("");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { data, error } = (await CallDeleteVenueUser(id)) as any;
      console.log("deleteUser", { data, error });
      if (data) {
        toast.success(data?.message);
        getAllUsers(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">User List</h2>
        <ButtonAction
          name="Add New User"
          onUpload={onUpload}
          onAddNewCenter={() => {
            setFormValues();
            setModalType("add");
            onOpen();
          }}
        />

        <div className="flex gap-2 mob:hidden">
          <Button
            color="success"
            variant="shadow"
            className="px-6 text-white"
            onPress={onUpload}
            startContent={
              <span className="material-symbols-rounded">upload</span>
            }
          >
            Upload Excel
          </Button>
          <Button
            color="primary"
            variant="shadow"
            className="px-6"
            onPress={() => {
              setFormValues();
              setModalType("add");
              onOpen();
            }}
            startContent={
              <span className="material-symbols-rounded">person_add</span>
            }
          >
            Add New User
          </Button>
        </div>
      </div>

      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        topContent={
          <>
            <div className="grid grid-cols-4 flex-col items-end gap-4 mob:flex mob:items-stretch">
              <Input
                placeholder="Search"
                value={filterData?.search}
                onChange={(e) => {
                  setFitlerData((prev: any) => ({
                    ...prev,
                    search: e.target.value,
                  }));
                }}
                startContent={
                  <span className="material-symbols-rounded text-lg text-gray-500">
                    search
                  </span>
                }
              />
              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/admin/downloadSubAdminExcel?advertisementId=${currentAdvertisementID}`,
                    "User List",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/admin/downloadSubAdminPdf?advertisementId=${currentAdvertisementID}`,
                    "User List",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              />

              <FilterSearchBtn
                col="col-start-4 mob:col-start-2"
                searchFunc={() => {
                  getAllUsers(true);
                }}
                clearFunc={clearFilter}
              />
            </div>
          </>
        }
        bottomContent={
          totalPage > 0 && (
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column?.key}
              align={column?.key === "actions" ? "center" : "start"}
              className="text-wrap"
            >
              {column?.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={users}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No data"
        >
          {(item: any) => (
            <TableRow key={item?._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add User" : "Edit User"}
              </ModalHeader>
              <ModalBody>
                <form
                  className="grid grid-cols-2 gap-4"
                  onSubmit={handleSubmit(
                    modalType === "add" ? createUser : updateUser,
                  )}
                >
                  {modalType === "add" && (
                    <>
                      <Controller
                        name="role"
                        control={control}
                        rules={{ required: "User role is required" }}
                        render={({
                          field: { value, onChange },
                          fieldState: { error, invalid },
                        }) => (
                          <Select
                            isInvalid={invalid}
                            errorMessage={error?.message}
                            items={roles}
                            label="User Role"
                            labelPlacement="outside"
                            placeholder="Select"
                            isRequired
                            selectedKeys={value ? [value] : []}
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0];
                              onChange(selectedKey);
                            }}
                          >
                            {(item: any) => (
                              <SelectItem key={item?._id}>
                                {item?.title}
                              </SelectItem>
                            )}
                          </Select>
                        )}
                      />

                      <Controller
                        name="district"
                        control={control}
                        rules={{ required: "District is required" }}
                        render={({
                          field: { value, onChange },
                          fieldState: { error, invalid },
                        }) => (
                          <Autocomplete
                            isInvalid={invalid}
                            errorMessage={error?.message}
                            defaultItems={districts}
                            label="District"
                            labelPlacement="outside"
                            placeholder="Select"
                            isRequired
                            selectedKey={value}
                            onSelectionChange={(selectedKey) => {
                              if (selectedKey) {
                                onChange(selectedKey.toString());
                                getCenterByDistrict(selectedKey.toString());
                              }
                            }}
                          >
                            {(item: any) => (
                              <AutocompleteItem
                                key={item?._id}
                                value={item?._id}
                              >
                                {item?.name}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        )}
                      />

                      <Controller
                        name="centerId"
                        control={control}
                        rules={{ required: "Center is required" }}
                        render={({ field, fieldState: { error, invalid } }) => (
                          <Autocomplete
                            {...field}
                            isInvalid={invalid}
                            errorMessage={error?.message}
                            defaultItems={centers}
                            label="Center"
                            labelPlacement="outside"
                            placeholder="Select"
                            isRequired
                            isLoading={isCenterLoading}
                            onSelectionChange={(selectedKey) => {
                              if (selectedKey) {
                                field.onChange(selectedKey.toString());
                              }
                            }}
                          >
                            {(item: any) => (
                              <AutocompleteItem
                                key={item?._id}
                                value={item?._id}
                              >
                                {item?.school_name}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        )}
                      />
                    </>
                  )}

                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Fullname is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        label="Full Name"
                        labelPlacement="outside"
                        placeholder="Enter first name"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />

                  <Controller
                    name="userId"
                    control={control}
                    rules={{ required: "User ID is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        label="User ID"
                        labelPlacement="outside"
                        placeholder="Enter user ID"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        endContent={
                          <span className="material-symbols-rounded">
                            person
                          </span>
                        }
                        isRequired
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
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Enter email"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        endContent={
                          <span className="material-symbols-rounded">mail</span>
                        }
                        isRequired
                      />
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone no. is required",
                      minLength: {
                        value: 10,
                        message: "Phone number must be exactly 10 digits",
                      },
                      maxLength: {
                        value: 10,
                        message: "Phone number must be exactly 10 digits",
                      },
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Phone"
                        labelPlacement="outside"
                        placeholder="Enter phone"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        startContent={<p className="text-sm">+91</p>}
                        endContent={
                          <span className="material-symbols-rounded">call</span>
                        }
                        isRequired
                      />
                    )}
                  />

                  <div
                    className={`${modalType === "edit" ? "block" : "hidden"} col-span-2`}
                  >
                    <Checkbox
                      isSelected={isChangePassword}
                      onValueChange={setIsChangePassword}
                    >
                      Change your password
                    </Checkbox>
                  </div>

                  <Controller
                    name="password"
                    control={control}
                    // rules={
                    //   modalType === "add"
                    //     ? { required: "Password is required" }
                    //     : {}
                    // }
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        label="Password"
                        labelPlacement="outside"
                        placeholder="Enter password"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isDisabled={
                          modalType === "add" ? false : !isChangePassword
                        }
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label="toggle password visibility"
                          >
                            {isVisible ? (
                              <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                            ) : (
                              <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                            )}
                          </button>
                        }
                        type={isVisible ? "text" : "password"}
                      />
                    )}
                  />

                  <div className="col-span-2 mb-2 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      color="primary"
                      className="px-8"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isUpload} onOpenChange={onOpenUpload}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Import Data
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-end"></div>
                <CustomMultipleUpload
                  title="User Data File"
                  sampleDownload={true}
                  sampleExcelUrl="/file/User-List.xlsx"
                  preview={preview}
                  setPreview={setPreview}
                  handleChange={handleChange}
                  setValue={() => {}}
                  accept={".xlsx"}
                  type="single"
                  name="file"
                  placeholder="Upload file"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={loader?.Upload}
                  color="primary"
                  className="w-full"
                  startContent={
                    <span className="material-symbols-rounded">upload</span>
                  }
                  onPress={() => {
                    if (uploadFile.length) {
                      Upload(uploadFile[0]);
                    }
                  }}
                >
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default User;
