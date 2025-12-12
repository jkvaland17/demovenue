"use client";
import {
  CallCreateZone,
  CallDownloadZoneExcel,
  CallGetAllZone,
  CallGetStates,
  CallUpdateZone,
  CallUploadZone,
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
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

const Zone = (props: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
    onClose: onUploadClose,
  } = useDisclosure();
  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { isSubmitting },
  } = useForm();
  const [modalType, setModalType] = useState("add");
  const [upload, setUpload] = useState<any>([]);
  const [states, setStates] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allZones, setAllZones] = useState<any[]>([]);
  const [currentZone, setCurrentZone] = useState<any>();
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });
  const { currentAdvertisementID } = useAdvertisement();
  const [filterData, setFilterData] = useState<any>({
    stateId: "",
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
    { title: "State", key: "state" },
    { title: "Zone", key: "zone" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "zone":
        return <p>{item?.name}</p>;
      case "state": {
        return <p>{item?.parentGlobalMasterId?.name}</p>;
      }
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
                  setCurrentZone(item);
                  setFormValues(item);
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

  const getAllZones = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `stateId=${filterData?.stateId}&advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllZone(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllZones", { data, error });

      if (data) {
        setAllZones(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        onClose();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
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
    // getAllZones();
    getStates();
  }, []);
  useEffect(() => {
    getAllZones(false);
  }, [page, currentAdvertisementID]);

  const createZone = async (zoneData: any) => {
    try {
      // console.log("zoneData", zoneData);
      const { data, error } = (await CallCreateZone(zoneData)) as any;
      console.log("createZone", { data, error });

      if (data?.message) {
        toast.success(data?.message);
        onClose();
        getAllZones(false);
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateZone = async (zoneData: any) => {
    try {
      const submitData = { ...zoneData, zoneId: currentZone?._id };
      console.log("zoneData", submitData);
      const { data, error } = (await CallUpdateZone(submitData)) as any;
      console.log("updateZone", { data, error });

      if (data?.message) {
        toast.success(data?.message);
        onClose();
        getAllZones(false);
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
    const newArray = ["stateId", "name"];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const uploadRoleExcel = async () => {
    setIsExcelUploading(true);
    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("excel", item);
      });
    }
    console.log("formData", formData);
    try {
      const { data, error } = (await CallUploadZone(formData)) as any;
      console.log("uploadRoleExcel", { data, error });

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

  const downlaodZoneExcel = async () => {
    setIsExcelDownloading(true);
    try {
      const { data, error } = (await CallDownloadZoneExcel()) as any;
      console.log("downlaodZoneExcel", { data, error });

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
    setValue("stateId", item?.parentGlobalMasterId?._id || ""),
      setValue("name", item?.name || "");
  };

  // console.log("currentZone", currentZone);

  const clearFilter = () => {
    setFilterData({
      stateId: "",
      search: "",
    });
    getAllZones(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Zone</h2>

        <ButtonAction
          name="Add Zone"
          onUpload={onUpload}
          downlaodExcel={downlaodZoneExcel}
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
            onPress={() => {
              onUpload();
            }}
            startContent={
              <span className="material-symbols-rounded">upload</span>
            }
          >
            Upload Excel
          </Button>

          <Button
            onPress={downlaodZoneExcel}
            isLoading={isExcelDownloading}
            color="secondary"
            variant="shadow"
            className="mob:w-full"
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
            Add Zone
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
            <div className="grid grid-cols-4 items-end gap-4 mob:grid-cols-1">
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
                selectedKeys={[filterData?.stateId]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] ?? "";
                  setFilterData({ ...filterData, stateId: selectedKey ?? "" });
                }}
              >
                {states.map((item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                ))}
              </Select>

              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/district/downloadZoneExcel?stateId=${filterData?.stateId}`,
                    "Zone",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/district/downloadZoneDataPdf?stateId=${filterData?.stateId}`,
                    "Zone",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              />

              <FilterSearchBtn
                col="col-start-4 mob:col-start-2"
                searchFunc={() => {
                  getAllZones(true);
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
              className="text-wrap"
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={allZones}
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add Zone" : "Edit Zone"}
              </ModalHeader>
              <ModalBody className="gap-4">
                <form
                  className="grid grid-cols-1 gap-5"
                  onSubmit={handleSubmit(
                    modalType === "add" ? createZone : updateZone,
                  )}
                >
                  <Controller
                    name="stateId"
                    control={control}
                    rules={{ required: "State is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={value ? [value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          onChange(selectedKey);
                        }}
                        items={states}
                        label="State"
                        labelPlacement="outside"
                        placeholder="Select"
                        isRequired
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
                    rules={{ required: "Zone name is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Zone name"
                        labelPlacement="outside"
                        placeholder="Enter zone name"
                        // defaultValue={
                        //   modalType === "edit" ? currentZone?.name : ""
                        // }
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
                <div className="flex justify-end">
                  {/* <Button
                    color="secondary"
                    size="sm"
                    startContent={
                      <span className="material-symbols-rounded">download</span>
                    }
                  >
                    Download Sample File
                  </Button> */}
                </div>
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
                  onPress={uploadRoleExcel}
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

export default Zone;
