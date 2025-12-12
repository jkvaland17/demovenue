"use client";
import {
  CallCreateDistrict,
  CallDownloadDistrictExcel,
  CallGetAllDistricts,
  CallGetAllZone,
  CallGetStates,
  CallUpdateDistrict,
  CallUploadDistrict,
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
  Switch,
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

const District = (props: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
    onClose: onUploadClose,
  } = useDisclosure();
  const [modalType, setModalType] = useState("add");
  const { currentAdvertisementID } = useAdvertisement();
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
  const [allDistricts, setAllDistricts] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [allZones, setAllZones] = useState<any[]>([]);
  const [allFilterZones, setAllFilterZones] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any>({
    stateId: "",
    zoneId: "",
  });
  const [currentDistrict, setCurrentDistrict] = useState<any>();
  // loaders
  const [isZonesLoading, setIsZonesLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    { title: "District", key: "district" },
    { title: "District Code", key: "districtCode" },
    { title: "Zone", key: "zone" },
    { title: "State", key: "state" },
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
                  setCurrentDistrict(item);
                  setFormValues(item);
                  getAllZones(item?.stateId);
                  setModalType("edit");
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
  const getAllDistricts = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&stateId=${filterData?.stateId}&zoneId=${filterData?.zoneId}&page=${page}&limit=10`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllDistricts(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllDistricts", { data, error });
      if (data) {
        setAllDistricts(data?.data);
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

  useEffect(() => {
    // getAllDistricts();
    getStates();
  }, []);

  useEffect(() => {
    getAllDistricts(false);
  }, [page, currentAdvertisementID]);

  const getAllZones = async (stateId: string) => {
    setIsZonesLoading(true);
    try {
      const query = `stateId=${stateId}`;
      const { data, error } = (await CallGetAllZone(query)) as any;
      console.log("getAllZones", { data, error });

      if (data) {
        setAllZones(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsZonesLoading(false);
  };
  const getAllZones2 = async (stateId: string) => {
    setIsZonesLoading(true);
    try {
      const query = `stateId=${stateId}`;
      const { data, error } = (await CallGetAllZone(query)) as any;
      console.log("getAllZones2", { data, error });

      if (data) {
        setAllFilterZones(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsZonesLoading(false);
  };
  const updateDistrict = async (districtData: any) => {
    try {
      const submitData = { ...districtData, district: currentDistrict?._id };
      console.log("districtData", submitData);
      const { data, error } = (await CallUpdateDistrict(submitData)) as any;
      console.log("updateDistrict", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
        onClose();
        getAllDistricts(false);
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createDistrict = async (districtData: any) => {
    try {
      console.log("districtData", districtData);
      const { data, error } = (await CallCreateDistrict(districtData)) as any;
      console.log("createDistrict", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
        onClose();
        getAllDistricts(false);
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
    const newArray = ["name", "code", "zoneId"];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const uploadDistrictExcel = async () => {
    setIsExcelUploading(true);
    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("excel", item);
      });
    }
    console.log("formData", formData);
    try {
      const { data, error } = (await CallUploadDistrict(formData)) as any;
      console.log("uploadDistrictExcel", { data, error });

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

  const downlaodDistrictExcel = async () => {
    setIsExcelDownloading(true);
    try {
      const { data, error } = (await CallDownloadDistrictExcel()) as any;
      console.log("downlaodDistrictExcel", { data, error });

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
    setValue("zoneId", item?.zoneId || "");
    setValue("name", item?.district || "");
    setValue("code", item?.districtCode || "");
  };

  // console.log("currentDistrict", currentDistrict);

  const clearFilter = () => {
    setFilterData({
      stateId: "",
      zoneId: "",
    });
    getAllDistricts(false);
  };
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">District</h2>

        <ButtonAction
          name="Add District"
          onUpload={onUpload}
          downlaodExcel={downlaodDistrictExcel}
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
            onPress={downlaodDistrictExcel}
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
            Add District
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
            <div className="grid grid-cols-4 items-end gap-4 mob:grid-cols-2">
              {/* <Input
                placeholder="Search"
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              /> */}
              <Select
                label="State"
                labelPlacement="outside"
                placeholder="Select"
                selectionMode="single"
                selectedKeys={[filterData?.stateId]}
                onChange={(e) => {
                  const selectedKey = e.target.value ?? "";
                  setFilterData({ ...filterData, stateId: selectedKey });
                  getAllZones2(selectedKey);
                }}
              >
                {states.map((item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                ))}
              </Select>

              <Select
                label="Zone"
                labelPlacement="outside"
                placeholder="Select"
                selectionMode="single"
                selectedKeys={[filterData?.zoneId]}
                onChange={(e) => {
                  const selectedKey = e.target.value ?? "";
                  setFilterData({ ...filterData, zoneId: selectedKey });
                }}
              >
                {allFilterZones.map((item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                ))}
              </Select>
              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/district/downloadDistrictExcel?zoneId=${filterData?.zoneId}&stateId=${filterData?.stateId}`,
                    "District",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/district/downloadDistrictPdf?zoneId=${filterData?.zoneId}&stateId=${filterData?.stateId}`,
                    "District",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              />
              <FilterSearchBtn
                searchFunc={() => {
                  getAllDistricts(true);
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
          items={allDistricts}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No data found!"
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add District" : "Edit District"}
              </ModalHeader>
              <ModalBody className="gap-4">
                <form
                  className="grid grid-cols-1 gap-5"
                  onSubmit={handleSubmit(
                    modalType === "add" ? createDistrict : updateDistrict,
                  )}
                >
                  <Select
                    items={states}
                    defaultSelectedKeys={
                      modalType === "edit" ? [currentDistrict?.stateId] : []
                    }
                    label="State"
                    labelPlacement="outside"
                    placeholder="Select"
                    onChange={(e) => {
                      getAllZones(e.target.value);
                    }}
                  >
                    {(item: any) => (
                      <SelectItem key={item?._id}>{item?.name}</SelectItem>
                    )}
                  </Select>

                  <Controller
                    name="zoneId"
                    control={control}
                    rules={{ required: "Zone is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        items={allZones}
                        isLoading={isZonesLoading}
                        selectedKeys={value ? [value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey);
                        }}
                        label="Zone (Mandal)"
                        labelPlacement="outside"
                        placeholder="Select"
                      >
                        {(item: any) => (
                          <SelectItem key={item?._id}>{item?.name}</SelectItem>
                        )}
                      </Select>
                    )}
                  />
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "District name is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="District Name"
                        labelPlacement="outside"
                        placeholder="Enter district name"
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="code"
                    control={control}
                    rules={{ required: "District code is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="number"
                        label="District Code"
                        labelPlacement="outside"
                        placeholder="Enter district code"
                        isRequired
                      />
                    )}
                  />
                  <Button
                    isLoading={isSubmitting}
                    type="submit"
                    color="primary"
                    className="mb-2 w-full"
                  >
                    Submit
                  </Button>
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
                  isLoading={isExcelUploading}
                  onPress={uploadDistrictExcel}
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

export default District;
