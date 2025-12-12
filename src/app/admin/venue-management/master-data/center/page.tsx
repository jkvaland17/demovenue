"use client";
import {
  CallCreateCenter,
  CallDeleteVenueCenter,
  CallDownloadCenterExcel,
  CallGetAllCenters,
  CallGetAllDistricts,
  CallGetModuleWiseUsers,
  CallUpdateCenter,
  CallUploadCenter,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import ButtonAction from "@/components/ButtonAction/ButtonAction";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import MultiSelect from "@/components/MultiSelect";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
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
import Link from "next/link";
import React, { act, useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

const Center = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  // Venue Management Module ID
  const moduleId = "67d7e6b1787a93da30837574";
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
    onClose: onUploadClose,
  } = useDisclosure();
  const [modalType, setModalType] = useState("add");
  const [upload, setUpload] = useState<any>([]);
  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isResource, setIsResource] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentCenter, setCurrentCenter] = useState<any>();
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });
  const [filterData, setFitlerData] = useState<any>({
    search: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExcelUploading, setIsExcelUploading] = useState<boolean>(false);
  const [isExcelDownloading, setIsExcelDownloading] = useState<boolean>(false);

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };

  const columns = [
    { title: "Center Name", key: "school_name" },
    // { title: "Center Exam Grade", key: "exam_center_grade" },
    // { title: "Principal Name", key: "principal_name" },
    // { title: "Principal Email", key: "principal_email" },
    // { title: "Active CCTVs", key: "active_cctvs" },
    { title: "District", key: "district" },
    { title: "Assigned Users", key: "assignUser" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "district":
        return <p className="capitalize">{item?.district?.name}</p>;
      case "assignUser":
        return (
          <Link
            href={`/admin/venue-management/master-data/center/center-users/${item?._id}`}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            View Users
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
              <DropdownItem
                key="edit"
                onPress={() => {
                  setSelectedUsers(item?.user);
                  setCurrentCenter(item);
                  setFormValues(item);
                  setModalType("edit");
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
                  deleteCenter(item?._id);
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

  const getAllCenters = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10&search=${filterData?.search}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllCenters(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllCenters", { data, error });

      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.currentPage);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getAllDistricts = async () => {
    try {
      const { data, error } = (await CallGetAllDistricts()) as any;
      console.log("getAllDistricts", { data, error });

      if (data) {
        setAllDistricts(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getModuleWiseUsers = async () => {
    try {
      const query = `advertisementId=${currentAdvertisementID}&moduleId=${moduleId}`;
      const { data, error } = (await CallGetModuleWiseUsers(query)) as any;
      console.log("getModuleWiseUsers", { data, error });

      if (data) {
        setUsers(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getAllDistricts();
      getModuleWiseUsers();
    }
  }, []);

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllCenters(false);
    }
  }, [currentAdvertisementID, page]);

  const createCenter = async (submitData: any) => {
    console.log("submitData", submitData);
    try {
      const centerData = {
        ...submitData,
        advertisementId: currentAdvertisementID,
        principal_mobile: +submitData?.principal_mobile,
        num_physical_rooms: +submitData?.num_physical_rooms,
        total_exam_rooms: +submitData?.total_exam_rooms,
        total_seating_capacity: +submitData?.total_seating_capacity,
        total_teachers: +submitData?.total_teachers,
        active_cctvs: +submitData?.active_cctvs,
        // user: submitData?.user?.split(","),
        user: selectedUsers,
      };
      console.log("centerData", centerData);
      const { data, error } = (await CallCreateCenter(centerData)) as any;
      console.log("createCenter", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
        onClose();
        getAllCenters(false);
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateCenter = async (submitData: any) => {
    console.log("submitData", submitData);
    try {
      const centerData = {
        ...submitData,
        advertisementId: currentAdvertisementID,
        centerId: currentCenter?._id,
        principal_mobile: +submitData?.principal_mobile,
        num_physical_rooms: +submitData?.num_physical_rooms,
        total_exam_rooms: +submitData?.total_exam_rooms,
        total_seating_capacity: +submitData?.total_seating_capacity,
        total_teachers: +submitData?.total_teachers,
        active_cctvs: +submitData?.active_cctvs,
        // user: submitData?.user?.split(","),
        user: selectedUsers,
      };
      console.log("centerData", centerData);
      const { data, error } = (await CallUpdateCenter(centerData)) as any;
      console.log("createCenter", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
        onClose();
        getAllCenters(false);
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
      "district",
      "school_name",
      "center_code",
      "user",
      "school_address",
      "principal_name",
      "principal_mobile",
      "principal_email",
      "exam_center_grade",
      "num_physical_rooms",
      "total_exam_rooms",
      "total_seating_capacity",
      "total_teachers",
      "exam_experience",
      "center_within_city",
      "active_cctvs",
      "no_adverse_fact",
    ];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const uploadCenterExcel = async () => {
    setIsExcelUploading(true);
    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("excel", item);
      });
    }
    formData.append("advertisementId", currentAdvertisementID);
    console.log("formData", formData);
    try {
      const { data, error } = (await CallUploadCenter(formData)) as any;
      console.log("uploadCenterExcel", { data, error });
      if (data) {
        toast.success(data?.message);
        onUploadClose();
        setUpload([]);
        getAllCenters(false)
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsExcelUploading(false);
  };

  const downloadExcel = (fileUrl: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "final_result.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downlaodCenterExcel = async () => {
    setIsExcelDownloading(true);
    try {
      const { data, error } = (await CallDownloadCenterExcel()) as any;
      console.log("downlaodCenterExcel", { data, error });

      if (data?.fileUrl) {
        downloadExcel(data?.fileUrl);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsExcelDownloading(false);
  };

  const setFormValues = (item?: any) => {
    setValue("district", item?.district?._id || "");
    setValue("school_name", item?.school_name || "");
    setValue("center_code", item?.center_code || "");
    setValue("user", item?.user || []);
    setValue("school_address", item?.school_address || "");
    setValue("principal_name", item?.principal_name || "");
    setValue("principal_mobile", item?.principal_mobile || "");
    setValue("principal_email", item?.principal_email || "");
    setValue("exam_center_grade", item?.exam_center_grade || "");
    setValue("num_physical_rooms", item?.num_physical_rooms || "");
    setValue("total_exam_rooms", item?.total_exam_rooms || "");
    setValue("total_seating_capacity", item?.total_seating_capacity || "");
    setValue("total_teachers", item?.total_teachers || "");
    setValue("exam_experience", item?.exam_experience || "");
    setValue("center_within_city", item?.center_within_city || "");
    setValue("active_cctvs", item?.active_cctvs || "");
    setValue("no_adverse_fact", item?.no_adverse_fact || "");
  };

  // console.log("selectedUsers", selectedUsers);

  const clearFilter = () => {
    setFitlerData({
      search: "",
    });
    getAllCenters(false);
  };

  const deleteCenter = async (id: string) => {
    try {
      const { data, error } = (await CallDeleteVenueCenter(id)) as any;
      console.log("deleteCenter", { data, error });
      if (data) {
        toast.success(data?.message);
        getAllCenters(false);
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
        <h2 className="text-xl font-semibold">Center</h2>

        <ButtonAction
          name="Add New Center"
          onUpload={onUpload}
          downlaodExcel={downlaodCenterExcel}
          isExcelDownloading={isExcelDownloading}
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
            className="text-white mob:w-full"
            onPress={onUpload}
            startContent={
              <span className="material-symbols-rounded">upload</span>
            }
          >
            Upload Excel
          </Button>
          <Button
            className="mob:w-full"
            onPress={downlaodCenterExcel}
            isLoading={isExcelDownloading}
            color="secondary"
            variant="shadow"
            startContent={
              !isExcelDownloading && (
                <span className="material-symbols-rounded">download</span>
              )
            }
          >
            Download Excel Template
          </Button>
          <Button
            className="mob:w-full"
            color="primary"
            variant="shadow"
            onPress={() => {
              setFormValues();
              setModalType("add");
              onOpen();
            }}
            startContent={<span className="material-symbols-rounded">add</span>}
          >
            Add New Center
          </Button>
          {/* <Button
            color="success"
            variant="shadow"
            className="text-white"
            startContent={
              <span className="material-symbols-rounded">description</span>
            }
          >
            Export to excel
          </Button> */}
        </div>
      </div>

      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        topContent={
          <>
            <div className="grid grid-cols-3 flex-col gap-4">
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
                    `v1/center/downloadCentersExcelByFilter`,
                    "Center",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/center/downloadCentersPdfByFilter`,
                    "Center",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              />
              <FilterSearchBtn
                col="col-start-4 mob:col-start-2"
                searchFunc={() => {
                  getAllCenters(true);
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
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              className="text-wrap mob:text-nowrap"
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
        size="5xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add Center" : "Edit Center"}
              </ModalHeader>
              <ModalBody className="gap-4">
                <form
                  className="grid grid-cols-3 flex-col gap-5 mob:flex"
                  onSubmit={handleSubmit(
                    modalType === "add" ? createCenter : updateCenter,
                  )}
                >
                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: "District is required" }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        defaultItems={allDistricts}
                        label="District"
                        labelPlacement="outside"
                        placeholder="Select"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                        selectedKey={value}
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            onChange(selectedKey.toString());
                          }
                        }}
                      >
                        {(item: any) => (
                          <AutocompleteItem key={item?._id}>
                            {item?.district}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                  <Controller
                    name="school_name"
                    control={control}
                    rules={{ required: "School name is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        label="School Name"
                        labelPlacement="outside"
                        placeholder="Enter school name"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="center_code"
                    control={control}
                    rules={{ required: "Center code is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        label="Center Code"
                        labelPlacement="outside"
                        placeholder="Enter center code"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />

                  <MultiSelect
                    label="Assign Users"
                    options={users}
                    selectedKeys={selectedUsers}
                    stateFunc={setSelectedUsers}
                  />

                  {/* <Controller
                    name="user"
                    control={control}
                    rules={{ required: "Assign user is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Select
                        {...field}
                        items={users}
                        // selectedKeys={value ? [value] : []}
                        label="Assign User"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectionMode="multiple"
                        classNames={{
                          trigger: "h-fit py-2",
                          label: "top-[20px]",
                        }}
                        multiple
                        renderValue={(items: any) => {
                          return (
                            <div className="flex flex-wrap gap-2">
                              {items.map((item: any) => (
                                <Chip variant="flat" key={item?.key}>
                                  {item?.data?.name}
                                </Chip>
                              ))}
                            </div>
                          );
                        }}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      >
                        {(item) => (
                          <SelectItem key={item?._id}>
                            <div>
                              <p className="text-small">{item?.name}</p>
                              <p className="text-tiny text-default-400">
                                {item?.userId}
                              </p>
                            </div>
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  /> */}
                  <Controller
                    name="school_address"
                    control={control}
                    rules={{ required: "School address is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        label="School Address"
                        labelPlacement="outside"
                        placeholder="Enter school address"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="principal_name"
                    control={control}
                    rules={{ required: "Principal name is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        label="Principal Name"
                        labelPlacement="outside"
                        placeholder="Enter principal name"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="principal_mobile"
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
                        label="Principal Mobile"
                        labelPlacement="outside"
                        placeholder="Enter principal mobile"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                        startContent={<p className="text-sm">+91</p>}
                        endContent={
                          <span className="material-symbols-rounded">call</span>
                        }
                      />
                    )}
                  />
                  <Controller
                    name="principal_email"
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
                        label="Principal Email"
                        labelPlacement="outside"
                        placeholder="Enter principal email"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                        endContent={
                          <span className="material-symbols-rounded">mail</span>
                        }
                      />
                    )}
                  />
                  <Controller
                    name="exam_center_grade"
                    control={control}
                    rules={{ required: "Exam Center Grade is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        // {...field}
                        items={[
                          { key: "A", label: "A" },
                          { key: "B", label: "B" },
                          { key: "C", label: "C" },
                          { key: "D", label: "D" },
                          { key: "E", label: "E" },
                        ]}
                        label="Exam Center Grade"
                        labelPlacement="outside"
                        placeholder="Select"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={value ? [value] : []}
                        isRequired
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey);
                        }}
                      >
                        {(item: any) => (
                          <SelectItem key={item?.key}>{item?.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />
                  <Controller
                    name="num_physical_rooms"
                    control={control}
                    rules={{ required: "Number of physical rooms is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Num Physical Rooms"
                        labelPlacement="outside"
                        placeholder="Enter num physical rooms"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="total_exam_rooms"
                    control={control}
                    rules={{ required: "Total exam rooms are required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Total Exam Rooms"
                        labelPlacement="outside"
                        placeholder="Enter total exam rooms"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="total_seating_capacity"
                    control={control}
                    rules={{ required: "Total seating capacity is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Total Seating Capacity"
                        labelPlacement="outside"
                        placeholder="Enter total seating capacity"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="total_teachers"
                    control={control}
                    rules={{ required: "Total teachers are required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Total Teachers"
                        labelPlacement="outside"
                        placeholder="Enter total teachers"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="exam_experience"
                    control={control}
                    rules={{ required: "Exam Experience is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        // {...field}
                        items={[
                          { key: "YES", label: "YES" },
                          { key: "NO", label: "NO" },
                        ]}
                        label="Exam Experience"
                        labelPlacement="outside"
                        placeholder="Select"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={value ? [value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey);
                        }}
                        isRequired
                      >
                        {(item: any) => (
                          <SelectItem key={item?.key}>{item?.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />
                  <Controller
                    name="center_within_city"
                    control={control}
                    rules={{ required: "Center within city is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        // {...field}
                        items={[
                          { key: "YES", label: "YES" },
                          { key: "NO", label: "NO" },
                        ]}
                        label="Center within city"
                        labelPlacement="outside"
                        placeholder="Select"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={value ? [value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey);
                        }}
                        isRequired
                      >
                        {(item: any) => (
                          <SelectItem key={item?.key}>{item?.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />
                  <Controller
                    name="active_cctvs"
                    control={control}
                    rules={{ required: "Active CCTVs are required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Active CCTVs"
                        labelPlacement="outside"
                        placeholder="Enter active CCTVs"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="no_adverse_fact"
                    control={control}
                    rules={{ required: "No Adverse facts is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        // {...field}
                        items={[
                          { key: "YES", label: "YES" },
                          { key: "NO", label: "NO" },
                        ]}
                        label="No Adverse facts"
                        labelPlacement="outside"
                        placeholder="Select"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={value ? [value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey);
                        }}
                        isRequired
                      >
                        {(item: any) => (
                          <SelectItem key={item?.key}>{item?.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <div className="col-span-3 mb-2 flex justify-end">
                    <Button
                      isLoading={isSubmitting}
                      type="submit"
                      color="primary"
                      className="px-12"
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
                {/* <div className="flex justify-end">
                  <Button
                    color="secondary"
                    size="sm"
                    startContent={
                      <span className="material-symbols-rounded">download</span>
                    }
                  >
                    Download Sample File
                  </Button>
                </div> */}
                <CustomMultipleUpload
                  {...register("file")}
                  title="Center Data"
                  preview={upload}
                  setPreview={setUpload}
                  handleChange={handleChangeST}
                  setValue={setValue}
                  accept={".xlsx"}
                  type="single"
                  name="Attachments"
                  placeholder="Upload Excel"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isExcelUploading}
                  onPress={uploadCenterExcel}
                  color="primary"
                  className="w-full"
                  startContent={
                    <span className="material-symbols-rounded">upload</span>
                  }
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

export default Center;
