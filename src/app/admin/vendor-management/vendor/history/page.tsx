"use client";

import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { useForm } from "react-hook-form";
import VendorForm from "@/components/VendorForm";
import toast from "react-hot-toast";
import {
  CallAddHistory,
  CallGetAllHistory,
  CallUpdateHistory,
} from "@/_ServerActions";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import { useRouter } from "next/navigation";

type VendorData = {
  isOutSide: string;
  stateRegion: string;
  vendorCode: string;
  vendorName: string;
  address: string;
  phone: string;
  panCard: string;
  gstNumber: string;
  workExperience: string;
  rating: string;
  govtProjectsHandled: string;
};

const Page = () => {
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<VendorData>({
    defaultValues: {
      isOutSide: "Yes",
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allData, setAllData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [modalType, setModalType] = useState("add");
  const [historyId, setCurrentZone] = useState<string>("");
  const route = useRouter();
  const [loader, setLoader] = useState<any>({
    table: false,
    updateDetails: false,
    submitLoader: false,
    excel: false,
    pdf: false,
  });
  const [filterData, setFilterData] = useState<any>({
    experience: "",
    rating: "",
    capacity: "",
    name: "",
  });

  const columns = [
    { title: "Vendor Code", key: "vendorCode" },
    { title: "Vendor Name", key: "vendorName" },
    { title: "Address", key: "address" },
    { title: "Mobile Number", key: "phone" },
    { title: "Pan Card", key: "panCard" },
    { title: "GST Number", key: "gstNumber" },
    { title: "Work Experience (Year)", key: "workExperience" },
    { title: "Total Number of Work Done", key: "historyCount" },
    { title: "Total Number of Legal Case", key: "legalCaseCount" },
    { title: "Is Govt Project Handle?", key: "govtProjectsHandled" },
    { title: "Action", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "vendorName":
        return (
          <p className="capitalize">
            {item?.isOutSide === "Yes" ? item?.vendorName : item?.vendor}
          </p>
        );
      case "vendorCode":
        return (
          <p className="capitalize">
            {item?.isOutSide === "Yes" ? item?.vendorCode : item?.codeName}
          </p>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button className="border-none" isIconOnly variant="light">
                <span className="material-symbols-outlined">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="edit"
                onPress={() => {
                  setCurrentZone(item?._id);
                  setFormValues(item);
                  setModalType("edit");
                  onOpen();
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="view"
                onPress={() => {
                  setFormValues(item);
                  setModalType("view");
                  onOpen();
                }}
              >
                View
              </DropdownItem>
              <DropdownItem
                key="add-history"
                onPress={() => {
                  route.push(
                    `/admin/vendor-management/vendor/history/view/${item?._id}`,
                  );
                }}
              >
                Add History
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  const getAllVendorHistory = async (isFilter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const filterOn = `page=${page}&limit=10&workExperience=${filterData?.experience}&rating=${filterData?.rating}&volumeOfWork=${filterData?.capacity}&vendorName=${filterData?.name}`;
      const filterOff = `page=${page}&limit=10`;
      const { data, error } = (await CallGetAllHistory(
        isFilter ? filterOn : filterOff,
      )) as any;
      console.log("getAllVendorHistory", { data, error });
      if (data) {
        setAllData(data?.vendors);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.currentPage);
        setLoader((prev: any) => ({
          ...prev,
          table: false,
        }));
      }
      if (error) {
        toast.error(error);
        setLoader((prev: any) => ({
          ...prev,
          table: false,
        }));
      }
    } catch (error) {
      console.log(error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const onSubmit = async (data: VendorData) => {
    console.log("Form Data:", data);
    setLoader((prev: any) => ({
      ...prev,
      submitLoader: true,
    }));
    try {
      const { data: response, error } = (await CallAddHistory(data)) as any;
      console.log("AddHistory", { response, error });
      if (response) {
        toast.success(response?.message);
        onClose();
        reset({});
        getAllVendorHistory(false);
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
      if (error) {
        toast.error(error);
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateHistory = async (data: VendorData) => {
    setLoader((prev: any) => ({
      ...prev,
      submitLoader: true,
    }));
    try {
      const submitData = { ...data, vendorId: historyId };
      const { data: response, error } = (await CallUpdateHistory(
        submitData,
      )) as any;
      console.log("UpdateHistory", { response, error });
      if (response) {
        toast.success(response?.message);
        onClose();
        reset({});
        getAllVendorHistory(false);
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
      if (error) {
        toast.error(error);
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllVendorHistory(false);
  }, []);

  const setFormValues = (item?: any) => {
    if (!item) return;
    setValue("vendorCode", item?.vendorCode || "");
    setValue("vendorName", item?.vendorName || "");
    setValue("stateRegion", item?.stateRegion || "");
    setValue("address", item?.address || "");
    setValue("phone", item?.phone || "");
    setValue("panCard", item?.panCard || "");
    setValue("gstNumber", item?.gstNumber || "");
    setValue("workExperience", item?.workExperience || "");
    setValue("rating", item?.rating || "");
    setValue("govtProjectsHandled", item?.govtProjectsHandled || "");
    setValue("isOutSide", item?.isOutSide || "");
  };

  const clearFilter = () => {
    setFilterData({
      experience: "",
      rating: "",
      capacity: "",
      name: "",
    });
    getAllVendorHistory(false);
  };

  return (
    <>
      <FlatCard heading="Vendor History">
        <div className="grid grid-cols-3 items-end gap-4 md:grid-cols-3">
          <Input
            label="Experience"
            labelPlacement="outside"
            placeholder="Experience"
            className="rounded"
            type="text"
            startContent={
              <span className="material-symbols-rounded">playlist_add</span>
            }
            value={filterData?.experience}
            onChange={(e) =>
              setFilterData((prev: any) => ({
                ...prev,
                experience: e.target.value,
              }))
            }
          />

          {/* <Input
            label="Rating"
            labelPlacement="outside"
            placeholder="Rating"
            className="rounded"
            type="text"
            startContent={
              <span className="material-symbols-rounded">person</span>
            }
            value={filterData?.rating}
            onChange={(e) =>
              setFilterData((prev: any) => ({
                ...prev,
                rating: e.target.value,
              }))
            }
          /> */}

          {/* <Input
            label="Capacity/Volume"
            labelPlacement="outside"
            placeholder="Capacity/Volume"
            className="rounded"
            type="text"
            startContent={
              <span className="material-symbols-rounded">phone</span>
            }
            value={filterData?.capacity}
            onChange={(e) =>
              setFilterData((prev: any) => ({
                ...prev,
                capacity: e.target.value,
              }))
            }
          /> */}

          <Input
            label="Vendor Name"
            labelPlacement="outside"
            placeholder="Vendor Name"
            className="rounded"
            type="text"
            startContent={
              <span className="material-symbols-rounded">
                format_list_numbered_rtl
              </span>
            }
            value={filterData?.name}
            onChange={(e) =>
              setFilterData((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <div className="flex gap-2">
            <FilterSearchBtn
              searchFunc={() => getAllVendorHistory(true)}
              clearFunc={clearFilter}
            />
          </div>
          <div className="flex gap-2">
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  `v1/admin/vendor/downloadVendorHistoryExcel?workExperience=${filterData?.experience}&rating=${filterData?.rating}&volumeOfWork=${filterData?.capacity}&vendorName=${filterData?.name}`,
                  "Vendor History",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/vendor/downloadVendorHistoryPdf?workExperience=${filterData?.experience}&rating=${filterData?.rating}&volumeOfWork=${filterData?.capacity}&vendorName=${filterData?.name}`,
                  "Vendor History",
                  setLoader,
                );
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
          </div>
        </div>
      </FlatCard>

      <Table
        isStriped
        color="default"
        topContent={
          <div className="flex w-full justify-end mob:justify-start">
            <Button
              color="primary"
              onPress={() => {
                onOpen();
                setFormValues();
                setModalType("add");
                reset({ isOutSide: "Yes" });
              }}
              className="px-4 text-white"
              startContent={
                <span className="material-symbols-outlined">add</span>
              }
            >
              Add Vendor
            </Button>
          </div>
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
          isLoading={loader?.table}
          loadingContent={<Spinner />}
          emptyContent="No data"
        >
          {(item) => (
            <TableRow key={""}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        size="2xl"
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {{
                  add: "Add Vendor",
                  edit: "Edit Vendor",
                  view: "View Vendor",
                }[modalType] || ""}
              </ModalHeader>
              <ModalBody>
                <VendorForm control={control} modalType={modalType} />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={loader?.submitLoader}
                  color="primary"
                  onPress={() =>
                    handleSubmit(
                      modalType === "add" ? onSubmit : UpdateHistory,
                    )()
                  }
                >
                  {modalType === "add" ? "Submit" : "Update"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Page;
