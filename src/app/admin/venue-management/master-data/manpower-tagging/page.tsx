"use client";
import {
  CallCreateManpower,
  CallDownloadManpowerExcel,
  CallGetAllCenters,
  CallGetAllDistricts,
  CallGetAllManpower,
  CallGetDatesByCenter,
  CallGetStates,
  CallUpdateManpower,
  CallUploadManpower,
} from "@/_ServerActions";
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
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

const ManpowerTagging = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [filterData, setFitlerData] = useState<any>({
    search: "",
  });
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
  const [allData, setAllData] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [examDates, setExamDates] = useState<any[]>([]);
  const [currentManpower, setCurrentManpower] = useState<any>([]);
  // loader states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDistrictLoading, setIsDistrictLoading] = useState<boolean>(false);
  const [isCenterLoading, setIsCenterLoading] = useState<boolean>(false);
  const [isDateLoading, setIsDateLoading] = useState<boolean>(false);
  const [isExcelUploading, setIsExcelUploading] = useState<boolean>(false);
  const [isExcelDownloading, setIsExcelDownloading] = useState<boolean>(false);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };

  const columns = [
    { title: "Full Name", key: "name" },
    { title: "District", key: "district" },
    { title: "Center Name", key: "center" },
    { title: "Skill", key: "skill" },
    { title: "Role", key: "role" },
    { title: "Mobile Number", key: "mobile" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "district":
        return <p className="capitalize">{item?.district?.name}</p>;
      case "center":
        return <p className="capitalize">{item?.centerData?.name}</p>;
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
                  setCurrentManpower(item);
                  setFormValues(item);
                  setModalType("edit");
                  getAllDistricts(item?.state?._id);
                  getAllCenters(item?.district?._id);
                  getDatesByCenter(item?.centerId);
                  onOpen();
                }}
              >
                Edit
              </DropdownItem>
              {/* <DropdownItem key="delete" color="danger" className="text-danger">
                Delete
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  const getStates = async () => {
    try {
      const { data, error } = (await CallGetStates()) as any;
      console.log("getStates", { data, error });

      if (data) {
        setStates(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStates();
  }, []);
  const getAllManpower = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10&search=${filterData?.search}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllManpower(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllManpower", { data, error });

      if (data) {
        setAllData(data?.manpowerList);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getAllManpower(false);
    }
  }, [page]);

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllManpower(false);
    }
  }, [currentAdvertisementID]);

  const getAllDistricts = async (stateId: string) => {
    setIsDistrictLoading(true);
    try {
      const query = `stateId=${stateId}`;
      const { data, error } = (await CallGetAllDistricts(query)) as any;
      console.log("getAllDistricts", { data, error });

      if (data) {
        setDistricts(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDistrictLoading(false);
  };

  const getAllCenters = async (districtId: string) => {
    setIsCenterLoading(true);
    try {
      const query = `district=${districtId}`;
      const { data, error } = (await CallGetAllCenters(query)) as any;
      console.log("getAllCenters", { data, error });

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

  const getDatesByCenter = async (centerId: string) => {
    setIsDateLoading(true);
    try {
      const query = `centerId=${centerId}`;
      const { data, error } = (await CallGetDatesByCenter(query)) as any;
      console.log("getDatesByCenter", { data, error });

      if (data) {
        setExamDates(data?.data?.seating_arrangment);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsDateLoading(false);
  };

  const updateManpower = async (formData: any) => {
    try {
      const submitData = {
        advertisementId: currentAdvertisementID,
        manPowerId: currentManpower?._id,
        centerId: formData?.centerId,
        exam_date: formData?.exam_date,
        manPowerData: {
          manpowerId: formData?.manpowerId,
          manpowerIdNo: formData?.manpowerIdNo,
          skill: formData?.skill,
          mobile: formData?.mobile,
          name: formData?.name,
          role: formData?.role,
        },
      };
      console.log("submitData", submitData);
      const { data, error } = (await CallUpdateManpower(submitData)) as any;
      console.log("updateManpower", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
        onClose();
        getAllManpower(false);
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createManpower = async (formData: any) => {
    try {
      const submitData = {
        advertisementId: currentAdvertisementID,
        centerId: formData?.centerId,
        exam_date: formData?.exam_date,
        manPowerData: {
          manpowerId: formData?.manpowerId,
          manpowerIdNo: formData?.manpowerIdNo,
          skill: formData?.skill,
          mobile: formData?.mobile,
          name: formData?.name,
          role: formData?.role,
        },
      };
      console.log("submitData", submitData);

      const { data, error } = (await CallCreateManpower(submitData)) as any;
      console.log("createManpower", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
        onClose();
        getAllManpower(false);
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
      "centerId",
      "name",
      "role",
      "skill",
      "manpowerId",
      "manpowerIdNo",
      "mobile",
    ];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const uploadManpowerExcel = async () => {
    setIsExcelUploading(true);
    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("excel", item);
      });
    }
    console.log("formData", formData);
    try {
      const { data, error } = (await CallUploadManpower(formData)) as any;
      console.log("uploadManpowerExcel", { data, error });

      if (data) {
        toast.success(data?.message);
        onUploadClose();
        setUpload([]);
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

  const downlaodManpowerExcel = async () => {
    setIsExcelDownloading(true);
    try {
      const { data, error } = (await CallDownloadManpowerExcel()) as any;
      console.log("downlaodManpowerExcel", { data, error });

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
    setValue("stateId", item?.state?._id || "");
    setValue("district", item?.district?._id || "");
    setValue("centerId", item?.centerId || "");
    setValue("exam_date", item?.examDate || "");
    setValue("name", item?.name || "");
    setValue("role", item?.role || "");
    setValue("skill", item?.skill || "");
    setValue("manpowerId", item?.manpowerId || "");
    setValue("manpowerIdNo", item?.manpowerIdNo || "");
    setValue("mobile", item?.mobile || "");
  };

  const clearFilter = () => {
    setFitlerData({
      search: "",
    });
    getAllManpower(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manpower Tagging</h2>

        <ButtonAction
          name="Add Manpower"
          onUpload={onUpload}
          downlaodExcel={downlaodManpowerExcel}
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
            className="text-white"
            onPress={onUpload}
            startContent={
              <span className="material-symbols-rounded">upload</span>
            }
          >
            Upload Excel
          </Button>
          <Button
            onPress={downlaodManpowerExcel}
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
            color="primary"
            variant="shadow"
            onPress={() => {
              setModalType("add");
              setFormValues();
              onOpen();
            }}
            startContent={<span className="material-symbols-rounded">add</span>}
          >
            Add Manpower
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
              {/* <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/center/downloadManPowerByFilterExcel`,
                    "Manpoer Tagging",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/center/downloadManPowerPdf`,
                    "Manpoer Tagging",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              /> */}
              <FilterSearchBtn
                col="col-start-4 mob:col-start-2"
                searchFunc={() => {
                  getAllManpower(true);
                }}
                clearFunc={clearFilter}
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
            <TableRow key={item?._id}>
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
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add Manpower" : "Edit Manpower"}
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(
                    modalType === "add" ? createManpower : updateManpower,
                  )}
                  className="grid grid-cols-2 gap-5"
                >
                  <Controller
                    name="stateId"
                    control={control}
                    rules={{ required: "State is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={states}
                        label="State"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectedKey={value ?? null}
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            getAllDistricts(selectedKey as string);
                            onChange(selectedKey?.toString());
                          }
                        }}
                      >
                        {(item: any) => (
                          <AutocompleteItem key={item?._id}>
                            {item?.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />

                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: "District is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={districts}
                        label="District"
                        labelPlacement="outside"
                        placeholder="Select"
                        isLoading={isDistrictLoading}
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            getAllCenters(selectedKey as string);
                            onChange(selectedKey?.toString());
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
                    name="centerId"
                    control={control}
                    rules={{ required: "Center is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={centers}
                        label="Center"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectedKey={value}
                        isLoading={isCenterLoading}
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            getDatesByCenter(selectedKey as string);
                            onChange(selectedKey?.toString());
                          }
                        }}
                      >
                        {(item: any) => (
                          <AutocompleteItem key={item?._id}>
                            {item?.school_name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />

                  <Controller
                    name="exam_date"
                    control={control}
                    // rules={{ required: "Exam date is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        // {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        items={examDates}
                        isLoading={isDateLoading}
                        label="Exam Date"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectedKeys={value ? [value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey);
                        }}
                        // isRequired
                      >
                        {(item: any) => (
                          <SelectItem key={item?.exam_date}>
                            {moment.utc(item?.exam_date).format("DD-MM-YYYY")}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Manpower Name is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Manpower Name"
                        labelPlacement="outside"
                        placeholder="Enter Name"
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Role"
                        labelPlacement="outside"
                        placeholder="Enter Role"
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="skill"
                    control={control}
                    rules={{ required: "Skill is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label=" Skill"
                        labelPlacement="outside"
                        placeholder="Enter Skill"
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="manpowerId"
                    control={control}
                    rules={{ required: "Manpower Person’s ID is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label=" Manpower Person’s ID"
                        labelPlacement="outside"
                        placeholder="Enter  Manpower Person’s ID"
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="manpowerIdNo"
                    control={control}
                    rules={{
                      required: "Manpower Person’s ID Number is required",
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="number"
                        label="Manpower Person’s ID Number"
                        labelPlacement="outside"
                        placeholder="Enter  Manpower Person’s ID Number"
                        isRequired
                        classNames={{
                          label: "whitespace-nowrap",
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="mobile"
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
                        label="Mobile Number"
                        labelPlacement="outside"
                        placeholder="Enter Mobile Number"
                        startContent={<p className="text-sm">+91</p>}
                        isRequired
                      />
                    )}
                  />

                  <div className="col-span-2 mb-2 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
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

      <Modal isOpen={isUpload} onOpenChange={onOpenUpload} size="3xl">
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
                  title=""
                  preview={upload}
                  setPreview={setUpload}
                  handleChange={handleChangeST}
                  setValue={setValue}
                  accept={".xlsx"}
                  name="Attachments"
                  placeholder="Upload Excel"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={uploadManpowerExcel}
                  isLoading={isExcelUploading}
                  color="primary"
                  className="w-full"
                  startContent={
                    !isExcelUploading && (
                      <span className="material-symbols-rounded">upload</span>
                    )
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

export default ManpowerTagging;
