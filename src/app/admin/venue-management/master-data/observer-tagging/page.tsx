"use client";
import {
  CallCreateObserver,
  CallDownloadObserverExcel,
  CallGetAllCenters,
  CallGetAllDistricts,
  CallGetAllObservers,
  CallGetStates,
  CallUpdateObserver,
  CallUploadObserver,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import ButtonAction from "@/components/ButtonAction/ButtonAction";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import Note from "@/components/kushal-components/Note";
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

const ObserverTagging = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
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
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [currentObserver, setCurrentObserver] = useState<any>();
  // loaders
  const [isDistrictLoading, setIsDistrictLoading] = useState<boolean>(false);
  const [isCenterLoading, setIsCenterLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExcelUploading, setIsExcelUploading] = useState<boolean>(false);
  const [isExcelDownloading, setIsExcelDownloading] = useState<boolean>(false);
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });
  const [filterData, setFitlerData] = useState<any>({
    search: "",
  });

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };

  const columns = [
    { title: "Name", key: "name" },
    { title: "Role", key: "role" },
    { title: "Center Name", key: "center" },
    { title: "District", key: "district" },
    // { title: "Skill", key: "skill" },
    { title: "Email", key: "email" },
    { title: "Mobile Number", key: "mobile" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "district":
        return <p>{item?.district?.name}</p>;
      case "center":
        return <p>{item?.centerName}</p>;
      case "name":
        return <p>{item?.user?.name}</p>;
      case "role":
        return <p>{item?.user?.role?.title}</p>;
      case "email":
        return <p>{item?.user?.email}</p>;
      case "mobile":
        return <p>{item?.user?.phone}</p>;
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
                  setCurrentObserver(item);
                  setFormValues(item);
                  setModalType("edit");
                  getAllDistricts(item?.state?._id);
                  // if (currentAdvertisementID) {
                  getAllCenters(item?.district?._id);
                  // } else {
                  //   toast.error("currentAdvertisementID is not available when editing observer.");
                  // }
                  setIsResource(false);
                  onOpen();
                }}
              >
                Edit
              </DropdownItem>
              {/* <DropdownItem key="reset">Reset Password</DropdownItem>
              <DropdownItem key="delete" color="danger" className="text-danger">
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

  const getAllCenters = async (district: string) => {
    setIsCenterLoading(true);
    // if (!currentAdvertisementID) {
    //   setIsCenterLoading(false);
    //   return;
    // }
    try {
      const query = `district=${district}&type=sorting&advertisementId=${currentAdvertisementID}`;
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

  const getAllObservers = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10&search=${filterData?.search}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllObservers(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("getAllObservers", { data, error });

      if (data) {
        setAllData(data?.data?.centerData);
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
      getAllObservers(false);
    }
  }, [currentAdvertisementID]);

  const createObserver = async (observerData: any) => {
    try {
      const submitData = {
        ...observerData,
        file: null,
        advertisementId: currentAdvertisementID,
        password: "",
      };
      console.log("submitData", submitData);
      const { data, error } = (await CallCreateObserver(submitData)) as any;
      console.log("createObserver", { data, error });

      if (data) {
        toast.success(data?.message);
        onClose();
        getAllObservers(false);
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateObserver = async (observerData: any) => {
    try {
      const submitData = {
        ...observerData,
        advertisementId: currentAdvertisementID,
        userId: currentObserver?.user?._id,
        password: "",
      };
      console.log("submitData", submitData);
      const { data, error } = (await CallUpdateObserver(submitData)) as any;
      console.log("updateObserver", { data, error });

      if (data) {
        toast.success(data?.message);
        onClose();
        getAllObservers(false);
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
    const newArray = ["district", "centerId", "name", "email", "phone"];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const uploadObserverExcel = async () => {
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
      const { data, error } = (await CallUploadObserver(formData)) as any;
      console.log("uploadObserverExcel", { data, error });

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

  const downlaodObserverExcel = async () => {
    setIsExcelDownloading(true);
    try {
      const { data, error } = (await CallDownloadObserverExcel()) as any;
      console.log("downlaodObserverExcel", { data, error });

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
    setValue("centerId", item?._id || "");
    setValue("name", item?.user?.name || "");
    setValue("email", item?.user?.email || "");
    setValue("phone", item?.user?.phone || "");
  };

  const clearFilter = () => {
    setFitlerData({
      search: "",
    });
    getAllObservers(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Observer Tagging</h2>
        <ButtonAction
          onUpload={onUpload}
          downlaodExcel={downlaodObserverExcel}
          isExcelDownloading={isExcelDownloading}
          name="Add Observer"
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
            onPress={downlaodObserverExcel}
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
              setFormValues();
              setModalType("add");
              onOpen();
            }}
            startContent={<span className="material-symbols-rounded">add</span>}
          >
            Add Observer
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
                DownloadKushalExcel(`v1/center/downloadCenterObserverExcelByFilter?advertisementId=${currentAdvertisementID}`, "Observer Tagging", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(`v1/center/downloadCenterObserverPdfByFilter?advertisementId=${currentAdvertisementID}`, "Observer Tagging", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            /> */}
              <FilterSearchBtn
                col="col-start-4 mob:col-start-2"
                searchFunc={() => {
                  getAllObservers(true);
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
                {modalType === "add" ? "Add Observer" : "Edit Observer"}
              </ModalHeader>
              <ModalBody className="gap-5">
                <form
                  className="grid grid-cols-2 gap-4"
                  onSubmit={handleSubmit(
                    modalType === "add" ? createObserver : updateObserver,
                  )}
                >
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Name"
                        labelPlacement="outside"
                        placeholder="Enter Name"
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
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Enter Email"
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
                        label="Mobile number"
                        labelPlacement="outside"
                        placeholder="Enter Mobile number"
                        startContent={<p className="text-sm">+91</p>}
                        endContent={
                          <span className="material-symbols-rounded">call</span>
                        }
                        isRequired
                      />
                    )}
                  />
                  <Controller
                    name="stateId"
                    control={control}
                    rules={{ required: "State is required" }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={states}
                        label="Center State"
                        labelPlacement="outside"
                        placeholder="Select"
                        isRequired
                        isDisabled={modalType === "edit" ? true : false}
                        selectedKey={value ?? null}
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            getAllDistricts(selectedKey.toString());
                            onChange(selectedKey.toString());
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
                      field: { value, onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={districts}
                        label="Center District"
                        labelPlacement="outside"
                        placeholder="Select"
                        isRequired
                        isDisabled={modalType === "edit" ? true : false}
                        isLoading={isDistrictLoading}
                        selectedKey={value ?? null}
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            if (currentAdvertisementID) {
                              getAllCenters(selectedKey.toString());
                            } else {
                              toast.error(
                                "currentAdvertisementID is not available when selecting district.",
                              );
                            }
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
                    name="centerId"
                    control={control}
                    rules={{ required: "Center is required" }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        // {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={centers}
                        label="Center Name"
                        labelPlacement="outside"
                        placeholder="Select"
                        isLoading={isCenterLoading}
                        isRequired
                        isDisabled={modalType === "edit" ? true : false}
                        // selectedKey={currentObserver?._id}
                        selectedKey={value}
                        onSelectionChange={(selectedKey) => {
                          if (selectedKey) {
                            setCurrentObserver((prev: any) => ({
                              ...prev,
                              _id: selectedKey.toString(),
                            }));
                            onChange(selectedKey.toString());
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

                  <div className="col-span-2">
                    <Note
                      note={`Username and Temporary Password will be delivered to Mobile number and Email provided`}
                    />
                    <div className="flex justify-end">
                      <Button
                        isLoading={isSubmitting}
                        type="submit"
                        color="primary"
                        className="my-2 px-8"
                      >
                        Submit
                      </Button>
                    </div>
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
                  onPress={uploadObserverExcel}
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

export default ObserverTagging;
