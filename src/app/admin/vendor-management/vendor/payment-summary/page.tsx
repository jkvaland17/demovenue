"use client";
import {
  CallFindMasterByCode,
  CallGetAllVendors,
  CallGetAllWorkScope,
  CallGetVendorByWorkScope,
  CallGetVendorPaymentDetails,
  CallGetWorkScopeByAdvId,
  CallSaveUpdateVendorPaymentDetails,
  CallUserFindAllAdvertisement,
  CallVendorByWorkScopeData,
  CallVendorPaymentDetails,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
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
  Spinner,
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
import moment from "moment";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ViwePayment from "./ViwePayment";

type Props = {};

const PaymentSummary = (props: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenFile,
    onOpen: onOpenFile,
    onClose: onCloseFile,
    onOpenChange: onOpenChangeFile,
  } = useDisclosure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalType, setModalType] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<any>([]);
  const [workScopeList, setWorkScopeList] = useState<any[]>([]);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [filterData, setFilterData] = useState({
    workScopeId: "",
    search: "",
  });
  const [paymentList, setPaymentList] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    vendorId: "",
    workScopeId: "",
    name: "",
    ifscCode: "",
    beneficiaryId: "",
    utrNumber: "",
    status: "",
    paymentDate: "",
    creditAmount: "",
    committeeReport: "",
    bankname: "",
    accountNumber: "",
    courseId: "",
    advertisementId: "",
  });
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [eventList, setEventList] = useState<any[]>([]);
  const [workScopeData, setWorkScopeData] = useState<any[]>([]);
  const [loader, setLoader] = useState<any>({
    tableLoader: false,
    eventLoader: false,
  });

  const workScopeDataList = async () => {
    try {
      const { data, error } = (await CallGetAllWorkScope()) as any;
      if (data.statusCode === 200) {
        setWorkScopeData(data?.data?.records);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const columns = [
    { title: "Vendor name", key: "vendorId" },
    { title: "Beneficiary ID", key: "beneficiaryId" },
    { title: "UTR No.", key: "utrNumber" },
    { title: "Status", key: "status" },
    { title: "Payment Date", key: "paymentDate" },
    { title: "Credit Amount", key: "creditAmount" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "vendorId":
        return cellValue?.vendorName;
      case "creditAmount":
        return <p className="text-green-600">₹ {cellValue}</p>;
      case "status":
        return cellValue ? (
          <Chip
            variant="flat"
            color={
              cellValue === "Completed"
                ? "success"
                : cellValue === "Rejected"
                  ? "danger"
                  : "primary"
            }
            classNames={{ content: "capitalize" }}
          >
            {cellValue}
          </Chip>
        ) : (
          "-"
        );
      case "paymentDate":
        return cellValue ? moment(cellValue).format("ll") : "-";
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
                  handleViewPayment(item._id);
                }}
                key="view"
              >
                View
              </DropdownItem>
              <DropdownItem
                onPress={() => {
                  handleEditPayment(item);
                }}
                key="edit"
              >
                Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleViewPayment = async (id: any) => {
    const { data, error } = (await CallVendorByWorkScopeData(id)) as any;
    if (data.statusCode === 200) {
      setSelectedPayment(data?.data);
    } else {
      handleCommonErrors(error);
    }
    onOpenFile();
  };

  const handleEditPayment = async (item: any) => {
    try {
      const { data, error } = (await CallVendorByWorkScopeData(
        item._id,
      )) as any;
      console.log("CallVendorByWorkScopeData", data);
      if (data?.statusCode !== 200) {
        handleCommonErrors(error);
        return;
      }
      const paymentData = data?.data;
      setSelectedPayment(paymentData);

      setFormData({
        paymentId: paymentData?._id || "",
        workScopeId: paymentData?.workScopeId?._id || "",
        vendorId: paymentData?.vendorId?._id || "",
        name: paymentData?.name || "",
        ifscCode: paymentData?.ifscCode || "",
        beneficiaryId: paymentData?.beneficiaryId || "",
        utrNumber: paymentData?.utrNumber || "",
        status: paymentData?.status || "",
        paymentDate: paymentData?.paymentDate
          ? moment(paymentData?.paymentDate).format("YYYY-MM-DD")
          : "",
        creditAmount: paymentData?.creditAmount || "",
        bankname: paymentData?.bankname || "",
        accountNumber: paymentData?.accountNumber || "",
        committeeReport: paymentData?.document || "",
        advertisementId: paymentData?.advertisementId || "",
        courseId: paymentData?.courseId || "",
      });
      setModalType("edit");
      onOpen();
    } catch (error) {
      console.error("Error preparing edit modal:", error);
      toast.error("Failed to load payment details");
    } finally {
      setLoader("");
    }
  };
  useEffect(() => {
    getCourseListData();
    workScopeDataList();
  }, []);

  useEffect(() => {
    getPaymentDetailsList();
  }, [page]);

  const getCourseListData = async () => {
    try {
      const { data, error } = (await CallFindMasterByCode()) as any;
      console.log("CallFindMasterByCode", data, error);
      if (data.message === "Success") {
        setCourseList(data?.data);
        if (data?.data?.length) {
          getEventListData(data?.data[0]?._id);
        }
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const getEventListData = async (courseId: string) => {
    setLoader((prevLoader: any) => ({
      ...prevLoader,
      eventLoader: true,
    }));
    try {
      const { data, error } = (await CallUserFindAllAdvertisement(
        `parentMasterId=${courseId}`,
      )) as any;
      console.log("CallUserFindAllAdvertisement", data, error);

      if (data?.message === "Success") {
        setEventList(data?.data);
        setLoader((prevLoader: any) => ({
          ...prevLoader,
          eventLoader: false,
        }));
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prevLoader: any) => ({
        ...prevLoader,
        eventLoader: false,
      }));
    }
  };

  const getWorkScopeListData = async (id: string) => {
    try {
      const { data, error } = (await CallGetWorkScopeByAdvId(
        `advertisementId=${id}`,
      )) as any;
      if (data.statusCode === 200) {
        setWorkScopeList(data?.data);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    }
  };

  const getVendorByWorkScopeList = async (workScopeId: string) => {
    try {
      let params = `workScopeId=${workScopeId}`;
      const { data, error } = (await CallGetVendorByWorkScope(params)) as any;
      console.log("CallGetVendorByWorkScope", data);
      if (data.statusCode === 200) {
        setVendorList(data?.data?.records);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentDetails = async (
    event: any,
    loaderType: string,
    vendorData: any,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      const dto = { ...vendorData };
      if (modalType === "add") {
        delete dto._id;
      }
      const formData = new FormData();
      if (modalType !== "add") {
        formData.append("paymentId", dto?.paymentId);
      }
      formData.append("workScopeId", dto?.workScopeId);
      formData.append("vendorId", dto?.vendorId);
      formData.append("name", dto?.name);
      formData.append("ifscCode", dto?.ifscCode);
      formData.append("beneficiaryId", dto?.beneficiaryId);
      formData.append("advertisementId", dto?.advertisementId);
      formData.append("utrNumber", dto?.utrNumber);
      formData.append("status", dto?.status);
      formData.append("paymentDate", dto?.paymentDate);
      formData.append("creditAmount", dto?.creditAmount);
      formData.append("bankname", dto?.bankname);
      formData.append("accountNumber", dto?.accountNumber);
      formData.append("courseId", courseId);
      if (dto?.committeeReport) {
        formData.append("committeeReport", dto?.committeeReport);
      }
      const { data, error } = (await CallSaveUpdateVendorPaymentDetails(
        formData,
      )) as any;
      console.log("data::: ", data);
      if (data?.statusCode === 200) {
        toast.success(data.message);
        getPaymentDetailsList();
        resetFormFields();
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader("");
    } catch (error) {
      console.log("error::: ", error);
    }
  };

  const getPaymentDetailsList = async () => {
    setLoader((prevLoader: any) => ({
      ...prevLoader,
      tableLoader: true,
    }));
    try {
      let params = `page=${page}&limit=10`;
      if (filterData.search) {
        params += `&search=${filterData.search}`;
      }
      if (filterData.workScopeId) {
        params += `&workScopeId=${filterData.workScopeId}`;
      }
      const { data, error } = (await CallGetVendorPaymentDetails(
        params,
      )) as any;
      console.log("CallGetVendorPaymentDetails", data);
      if (data.statusCode === 200) {
        setPaymentList(data?.data);
        setTotalPages(data?.totalPages);
        setLoader((prevLoader: any) => ({
          ...prevLoader,
          tableLoader: false,
        }));
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prevLoader: any) => ({
        ...prevLoader,
        tableLoader: false,
      }));
    }
  };

  const resetFormFields = () => {
    setFormData({
      vendorId: "",
      workScopeId: "",
      name: "",
      ifscCode: "",
      beneficiaryId: "",
      utrNumber: "",
      status: "",
      paymentDate: "",
      creditAmount: "",
      bankname: "",
      accountNumber: "",
      _id: "",
    });
    onClose();
  };

  const handleOpenAddModal = () => {
    resetFormFields();
    setModalType("add");
    onOpen();
  };

  useEffect(() => {
    if (formData.advertisementId) {
      getWorkScopeListData(formData.advertisementId);
    }
    if (formData.workScopeId) {
      getVendorByWorkScopeList(formData.workScopeId);
    }
  }, [formData.advertisementId, formData.workScopeId]);

  const getFileNameFromUrl = (url: string): string => {
    if (!url) return "";
    try {
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const cleanFileName = fileName.includes("_")
        ? fileName.split("_").slice(1).join("_")
        : fileName;
      return cleanFileName || fileName;
    } catch (error) {
      console.error("Error extracting filename from URL:", error);
      return "Downloaded file";
    }
  };

  const getVendorPaymentDetails = async (vendorId: string) => {
    try {
      const query = `id=${vendorId}`;
      const { data, error } = (await CallVendorPaymentDetails(query)) as any;
      console.log("CallVendorPaymentDetails", data);
      if (data.statusCode === 200) {
        const bankDetails = data?.data?.vendor?.bankDetails;
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          vendorId,
          name: bankDetails?.chequeInFavour || "",
          bankname: bankDetails?.bankName || "",
          accountNumber: bankDetails?.bankAccountNo || "",
          ifscCode: bankDetails?.ifscCode || "",
        }));
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FlatCard
        heading="Vendor Payment Summary"
        button
        ButtonLabel="Add payment"
        onClick={handleOpenAddModal}
      >
        <Table
          shadow="none"
          classNames={{
            wrapper: "p-0",
          }}
          color="default"
          topContent={
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <div className="">
                <Select
                  labelPlacement="outside"
                  placeholder="Select Work Scope"
                  items={workScopeData}
                  value={filterData.workScopeId}
                  selectedKeys={
                    filterData.workScopeId ? [filterData.workScopeId] : []
                  }
                  onSelectionChange={(e: any) => {
                    const value = Array.from(e)[0] as string;
                    setFilterData({
                      ...filterData,
                      workScopeId: value,
                    });
                  }}
                >
                  {(item) => (
                    <SelectItem key={item?._id} className="capitalize">
                      {item?.workScopeTitle}
                    </SelectItem>
                  )}
                </Select>
              </div>
              <div className="">
                <Input
                  type="text"
                  placeholder="Search Vendor name"
                  value={filterData.search}
                  onChange={(e) =>
                    setFilterData({ ...filterData, search: e.target.value })
                  }
                  endContent={
                    <span className="material-symbols-rounded">search</span>
                  }
                />
              </div>
              <div className="col-span-1 flex justify-end lg:col-span-2">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      getPaymentDetailsList();
                    }}
                    className="me-2 px-4"
                  >
                    <i className="fas fa-search" />
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    color="danger"
                    onPress={() => {
                      setFilterData({ workScopeId: "", search: "" });
                      getPaymentDetailsList();
                    }}
                    className="me-2 px-4"
                  >
                    <i className="fas fa-times text-red" />
                  </Button>
                </div>
              </div>
            </div>
          }
          bottomContent={
            totalPages > 0 ? (
              <div className="flex justify-end">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  className="me-2"
                  page={page}
                  total={totalPages}
                  onChange={(page: any) => setPage(page)}
                />
              </div>
            ) : (
              ""
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
            items={paymentList}
            emptyContent="No data"
            isLoading={loader?.tableLoader}
            loadingContent={<Spinner />}
          >
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        placement="top"
        className="max-h-[90vh] overflow-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "edit"
                  ? "Edit Payment Details"
                  : "Add Payment Details"}
              </ModalHeader>
              <ModalBody className="gap-5">
                <div className="grid grid-cols-1 gap-4">
                  <div className="">
                    <Select
                      label="Select Course"
                      labelPlacement="outside"
                      placeholder="Select"
                      items={courseList}
                      // selectedKeys={[courseId]}
                      isDisabled={modalType === "edit"}
                      selectedKeys={
                        formData?.courseId ? [formData?.courseId] : []
                      }
                      isRequired
                      required
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setCourseId(value);
                        getEventListData(value);
                        setFormData({ ...formData, courseId: value });
                      }}
                    >
                      {(item) => (
                        <SelectItem key={item?._id} className="capitalize">
                          {item?.name}
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="">
                    <Select
                      label="Select Event/Recruitment"
                      labelPlacement="outside"
                      placeholder="Select"
                      isLoading={loader?.eventLoader}
                      isDisabled={modalType === "edit"}
                      items={eventList}
                      isRequired
                      required
                      selectedKeys={
                        formData?.advertisementId
                          ? [formData?.advertisementId]
                          : []
                      }
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setFormData({
                          ...formData,
                          advertisementId: value,
                        });
                        getWorkScopeListData(value);
                        setVendorList([]);
                      }}
                    >
                      {(item) => (
                        <SelectItem key={item?._id} className="capitalize">
                          {`${item?.advertisementNumberInEnglish} (${item?.titleInEnglish})`}
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="">
                    <Select
                      label="Work Scope"
                      labelPlacement="outside"
                      placeholder="Select"
                      items={workScopeList}
                      isRequired
                      required
                      isDisabled={modalType === "edit"}
                      selectedKeys={
                        formData?.workScopeId ? [formData?.workScopeId] : []
                      }
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setFormData({
                          ...formData,
                          workScopeId: value,
                          // vendorId: "",
                        });
                        if (value) {
                          getVendorByWorkScopeList(value);
                        } else {
                          setVendorList([]);
                        }
                      }}
                    >
                      {(item) => (
                        <SelectItem key={item?._id} className="capitalize">
                          {item?.workScopeTitle}
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="">
                    <Select
                      isDisabled={modalType === "edit"}
                      label="Select Vendor"
                      labelPlacement="outside"
                      placeholder="Select"
                      isRequired
                      items={vendorList}
                      selectedKeys={
                        formData?.vendorId ? [formData?.vendorId] : []
                      }
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        getVendorPaymentDetails(value);
                        setFormData({
                          ...formData,
                          vendorId: value,
                        });
                      }}
                    >
                      {(item) => (
                        <SelectItem key={item?._id} className="capitalize">
                          {item?.vendorName}
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="">
                    <Input
                      isDisabled={modalType === "edit"}
                      type="text"
                      label="Name"
                      labelPlacement="outside"
                      value={formData?.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter name"
                      endContent={
                        <span className="material-symbols-rounded">person</span>
                      }
                    />
                  </div>
                  <div className="">
                    <Input
                      isDisabled={modalType === "edit"}
                      isRequired
                      type="text"
                      label="Bank Name"
                      labelPlacement="outside"
                      value={formData?.bankname}
                      onChange={(e) =>
                        setFormData({ ...formData, bankname: e.target.value })
                      }
                      placeholder="Enter Bank Name"
                      endContent={
                        <span className="material-symbols-rounded">person</span>
                      }
                    />
                  </div>
                  <div className="">
                    <Input
                      isDisabled={modalType === "edit"}
                      isRequired
                      type="number"
                      label="Account Number"
                      labelPlacement="outside"
                      value={formData?.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value,
                        })
                      }
                      placeholder="Enter Account Number"
                      endContent={
                        <span className="material-symbols-rounded">person</span>
                      }
                    />
                  </div>
                  <div className="">
                    <Input
                      isDisabled={modalType === "edit"}
                      type="text"
                      label="IFSC Code"
                      labelPlacement="outside"
                      placeholder="Enter IFSC code"
                      value={formData?.ifscCode}
                      onChange={(e) =>
                        setFormData({ ...formData, ifscCode: e.target.value })
                      }
                      endContent={
                        <span className="material-symbols-rounded">
                          account_balance
                        </span>
                      }
                    />
                  </div>
                  <div className="">
                    <Input
                      isDisabled={modalType === "edit"}
                      type="text"
                      label="Beneficiary ID"
                      labelPlacement="outside"
                      placeholder="Enter Beneficiary ID"
                      value={formData?.beneficiaryId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          beneficiaryId: e.target.value,
                        })
                      }
                      endContent={
                        <span className="material-symbols-rounded">person</span>
                      }
                    />
                  </div>
                  <div className="">
                    <Input
                      isDisabled={modalType === "edit"}
                      type="text"
                      label="UTR Number"
                      labelPlacement="outside"
                      placeholder="Enter UTR number"
                      value={formData?.utrNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, utrNumber: e.target.value })
                      }
                      endContent={
                        <span className="material-symbols-rounded">tag</span>
                      }
                    />
                  </div>
                  <div className="">
                    <Select
                      items={[
                        { key: "Pending", name: "Pending" },
                        { key: "Completed", name: "Completed" },
                        { key: "Rejected", name: "Rejected" },
                      ]}
                      label="Status"
                      labelPlacement="outside"
                      placeholder="Select"
                      selectedKeys={[formData?.status]}
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setFormData({
                          ...formData,
                          status: value,
                        });
                      }}
                    >
                      {(item) => (
                        <SelectItem key={item.key}>{item.name}</SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="">
                    <Input
                      type="date"
                      label="Payment Date"
                      max={moment().format("YYYY-MM-DD")}
                      labelPlacement="outside"
                      value={formData?.paymentDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="">
                    <Input
                      isDisabled={modalType === "edit"}
                      type="number"
                      label="Credit Amount"
                      labelPlacement="outside"
                      placeholder="Enter credit amount"
                      value={formData?.creditAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          creditAmount: e.target.value,
                        })
                      }
                      endContent={
                        <span className="material-symbols-rounded">
                          currency_rupee
                        </span>
                      }
                    />
                  </div>
                  <div className="">
                    <p className="text-sm">Upload Payment Advice Slip</p>
                    {formData?.committeeReport ? (
                      <Input
                        isDisabled={modalType === "edit"}
                        value={
                          typeof formData?.committeeReport === "string"
                            ? getFileNameFromUrl(formData?.committeeReport)
                            : formData?.committeeReport?.name || ""
                        }
                        type="text"
                        readOnly
                        startContent={
                          <span className="material-symbols-rounded">
                            upload_file
                          </span>
                        }
                        endContent={
                          <div className="flex gap-2">
                            {typeof formData?.committeeReport === "string" && (
                              <Button
                                variant="flat"
                                size="sm"
                                color="primary"
                                onPress={() => {
                                  window.open(
                                    formData?.committeeReport,
                                    "_blank",
                                  );
                                }}
                                className="text-primary"
                              >
                                <span className="material-symbols-rounded">
                                  visibility
                                </span>
                                View
                              </Button>
                            )}
                            <Button
                              variant="flat"
                              size="sm"
                              color="danger"
                              onPress={() => {
                                setFormData({
                                  ...formData,
                                  committeeReport: "",
                                });
                              }}
                              className="text-danger"
                            >
                              <span className="material-symbols-rounded">
                                close
                              </span>
                              Remove
                            </Button>
                          </div>
                        }
                      />
                    ) : (
                      <Input
                        onChange={(e: any) => {
                          setFormData({
                            ...formData,
                            committeeReport: e.target.files[0],
                          });
                        }}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        startContent={
                          <span className="material-symbols-rounded">
                            upload_file
                          </span>
                        }
                      />
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={resetFormFields}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={loader === "submit"}
                  onPress={(e) => handlePaymentDetails(e, "submit", formData)}
                >
                  {modalType === "edit" ? "Update Payment" : "Add Payment"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        className="z-50"
        isOpen={isOpenFile}
        onOpenChange={onOpenChangeFile}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Payment Details
              </ModalHeader>
              <ModalBody>
                <ViwePayment selectedPayment={selectedPayment} />
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    setSelectedPayment(null);
                    onCloseFile();
                  }}
                  color="danger"
                >
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

export default PaymentSummary;
