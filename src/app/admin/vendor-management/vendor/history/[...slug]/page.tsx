"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
  Spinner,
  Input,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import {
  User,
  MapPin,
  Phone,
  CreditCard,
  FileText,
  Briefcase,
  Award,
  Building2,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CallAddHistory,
  CallAddHistoryData,
  CallGetAllHistory,
  CallHistoryData,
  CallHistoryGetById,
} from "@/_ServerActions";
import VendorForm from "@/components/VendorForm";
import { Controller, useForm, useWatch } from "react-hook-form";
import FlatCard from "@/components/FlatCard";
import moment from "moment";

type HistoryForm = {
  workName: string;
  institution: string;
  workExperienceType: string;
  volumeOfWork: string;
  legalCases: string;
  timelyDelivery: string;
  finalDeliverables: string;
  banStatus: string;
  banDurationEndDate: string;
  banDurationStartDate: string;
};

const Page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { slug } = useParams();
  const [allData, setAllData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [modalType, setModalType] = useState("add");
  const route = useRouter();
  const [loader, setLoader] = useState<any>({
    table: false,
    updateDetails: false,
    submitLoader: false,
  });
  const [vendorHistoryData, setVendorHistoryData] = useState<any>({});
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<HistoryForm>({
    defaultValues: {
      banStatus: "No",
    },
  });
  const banStatus = useWatch({
    control,
    name: "banStatus",
  });

  const vendorHistory = [
    {
      label: "Vendor Code",
      value:
        vendorHistoryData?.isOutSide === "Yes"
          ? vendorHistoryData?.vendorCode
          : vendorHistoryData?.codeName || "-",
      icon: FileText,
    },
    {
      label: "Vendor Name",
      value:
        vendorHistoryData?.isOutSide === "Yes"
          ? vendorHistoryData?.vendorName
          : vendorHistoryData?.vendor || "-",
      icon: User,
    },
    {
      label: "State/Region",
      value: vendorHistoryData?.stateRegion || "-",
      icon: MapPin,
    },
    {
      label: "Address",
      value: vendorHistoryData?.address || "-",
      icon: MapPin,
    },
    { label: "Phone", value: vendorHistoryData?.phone || "-", icon: Phone },
    {
      label: "PAN Card",
      value: vendorHistoryData?.panCard || "-",
      icon: CreditCard,
    },
    {
      label: "GST Number",
      value: vendorHistoryData?.gstNumber || "-",
      icon: FileText,
    },
    {
      label: "Work Experience",
      value: vendorHistoryData?.workExperience || "-",
      icon: Briefcase,
    },
    // {
    //   label: "Experience Type",
    //   value: vendorHistoryData?.workExperienceType || "-",
    //   icon: Briefcase,
    // },
    // {
    //   label: "Legal Cases",
    //   value: vendorHistoryData?.legalCases || "-",
    //   icon: AlertTriangle,
    // },
    // {
    //   label: "Volume of Work",
    //   value: vendorHistoryData?.volumeOfWork || "-",
    //   icon: Building2,
    // },
    { label: "Rating", value: vendorHistoryData?.rating || "-", icon: Award },
    {
      label: "Govt Projects Handled",
      value: vendorHistoryData?.govtProjectsHandled || "-",
      icon: ShieldCheck,
    },
    // {
    //   label: "Blacklisted Status",
    //   value: vendorHistoryData?.blacklistedStatus || "-",
    //   icon: AlertTriangle,
    // },
    // {
    //   label: "Blacklisted Duration Start",
    //   value: vendorHistoryData?.blacklistedDurationStart
    //     ? moment(vendorHistoryData?.blacklistedDurationStart).format(
    //         "DD/MM/YYYY",
    //       )
    //     : "-",
    //   icon: Clock,
    // },
    // {
    //   label: "Blacklisted Duration End",
    //   value: vendorHistoryData?.blacklistedDurationEnd
    //     ? moment(vendorHistoryData?.blacklistedDurationEnd).format("DD/MM/YYYY")
    //     : "-",
    //   icon: Clock,
    // },
    // {
    //   label: "Final Deliverables",
    //   value: vendorHistoryData?.finalDeliverables || "-",
    //   icon: CheckCircle,
    // },
    // {
    //   label: "Timely Delivery",
    //   value: vendorHistoryData?.timelyDelivery || "-",
    //   icon: Clock,
    // },
    {
      label: "Is Outside",
      value: vendorHistoryData?.isOutSide || "-",
      icon: MapPin,
    },
  ];

  const columns = [
    { title: "Sr. No", key: "srNo" },
    { title: "Work Name", key: "workName" },
    { title: "Institution", key: "institution" },
    { title: "Volume of Work", key: "volumeOfWork" },
    { title: "Timely Deliver", key: "timelyDelivery" },
    { title: "No. Of Cases", key: "legalCases" },
    { title: "Ban Status", key: "banStatus" },
    { title: "Ban Duration", key: "banDuration" },
  ];

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, pageNo: number, index: number) => {
      const cellValue = item[columnKey as any];
      const srNo = (pageNo - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "srNo":
          return srNo < 10 ? `0${srNo}` : srNo;
        case "banDuration": {
          const start = item?.banDurationStartDate
            ? moment(item.banDurationStartDate).format("DD/MM/YYYY")
            : null;
          const end = item?.banDurationEndDate
            ? moment(item.banDurationEndDate).format("DD/MM/YYYY")
            : null;
          if (!start && !end) {
            return "-";
          }
          return `${start ?? "-"} To ${end ?? "-"}`;
        }

        default:
          return <p className="capitalize">{cellValue}</p>;
      }
    },
    [],
  );

  const getHistoryGetById = async () => {
    try {
      const query = `vendorId=${slug[1]}`;
      const { data, error } = (await CallHistoryGetById(query)) as any;
      console.log("getHistoryGetById", { data, error });
      if (data) {
        setVendorHistoryData(data?.vendorHistory);
        setAllData(data?.vendorHistory?.history);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const getHistory = async () => {
  //   try {
  //     const query = `vendorId=${slug[1]}`;
  //     const { data, error } = (await CallHistoryGetById(query)) as any;
  //     console.log("CallHistoryData", { data, error });
  //     if (data) {
  //       setAllData(data?.vendorHistory?.history);
  //     }
  //     if (error) {
  //       toast.error(error);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // getHistory();
    getHistoryGetById();
  }, [slug[1]]);

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);
    setLoader((prev: any) => ({
      ...prev,
      submitLoader: true,
    }));
    try {
      const submitData = { ...data, vendorId: slug[1] };
      const { data: response, error } = (await CallAddHistoryData(
        submitData,
      )) as any;
      console.log("AddHistory", { response, error });
      if (response) {
        toast.success(response?.message);
        onClose();
        reset({});
        getHistoryGetById();
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

  return (
    <>
      <FlatCard>
        <div className="flex w-full items-center justify-between gap-x-3 text-2xl">
          <p className="font-semibold">Vendor History</p>
          <Button
            radius="full"
            onPress={() => route.back()}
            className="font-medium"
          >
            <span className="material-symbols-outlined">arrow_back</span> Go
            Back
          </Button>
        </div>
        <div className="my-6 grid grid-cols-3 gap-6 rounded-xl bg-white p-10">
          {vendorHistory?.map(({ label, value, icon: Icon }, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h6 className="flex items-center gap-2 font-semibold text-gray-600">
                <Icon size={18} /> {label}
              </h6>
              <p className="ps-8 text-sm font-semibold">{value || "—"}</p>
            </div>
          ))}
        </div>
      </FlatCard>
      <Table
        isStriped
        color="default"
        className="mb-6"
        topContent={
          <div className="flex w-full justify-end mob:justify-start">
            <Button
              color="primary"
              onPress={() => {
                onOpen();
              }}
              className="px-4 text-white"
              startContent={
                <span className="material-symbols-outlined">add</span>
              }
            >
              Add History
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
          {allData?.map((item: any, index: number) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey, page, index)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        size="3xl"
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add History
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4 p-3 mob:p-0">
                  <Controller
                    name="workName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Work Name"
                        labelPlacement="outside"
                        placeholder="Enter Work Name"
                        type="text"
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="institution"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Institution Name"
                        labelPlacement="outside"
                        type="text"
                        placeholder="Enter Institution Name"
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="workExperienceType"
                    control={control}
                    rules={{ required: "Work Experience Type is required" }}
                    render={({ field, fieldState }) => (
                      <Input
                        isDisabled={modalType === "view"}
                        labelPlacement="outside"
                        label="Type of Work Experience"
                        placeholder="e.g., Printing, Logistics"
                        {...field}
                        isInvalid={fieldState.invalid}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="volumeOfWork"
                    control={control}
                    rules={{ required: "Volume of Work is required" }}
                    render={({ field, fieldState }) => (
                      <Input
                        isDisabled={modalType === "view"}
                        labelPlacement="outside"
                        label="Volume of Work"
                        placeholder="Enter Volume"
                        type="number"
                        {...field}
                        isInvalid={fieldState.invalid}
                        errorMessage={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="legalCases"
                    control={control}
                    render={({ field }) => (
                      <Input
                        isDisabled={modalType === "view"}
                        labelPlacement="outside"
                        label="Number of Legal Cases Filed"
                        type="number"
                        placeholder="Number of Legal Cases Filed"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="timelyDelivery"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup
                        isDisabled={modalType === "view"}
                        {...field}
                        orientation="horizontal"
                        label="Timely Delivery"
                        classNames={{
                          label: "text-black",
                        }}
                      >
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </RadioGroup>
                    )}
                  />
                  <Controller
                    name="finalDeliverables"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup
                        isDisabled={modalType === "view"}
                        {...field}
                        orientation="horizontal"
                        label="Final Deliverables Submitted"
                        classNames={{
                          label: "text-black",
                        }}
                      >
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </RadioGroup>
                    )}
                  />
                  <Controller
                    name="banStatus"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup
                        isDisabled={modalType === "view"}
                        {...field}
                        orientation="horizontal"
                        label="Ban Status"
                        classNames={{
                          label: "text-black",
                        }}
                      >
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </RadioGroup>
                    )}
                  />
                  {banStatus === "Yes" && (
                    <>
                      <Controller
                        name="banDurationStartDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            isDisabled={modalType === "view"}
                            labelPlacement="outside"
                            label="Ban Duration Start Date"
                            type="date"
                            placeholder="Enter Ban Duration Start Date"
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name="banDurationEndDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            isDisabled={modalType === "view"}
                            labelPlacement="outside"
                            label="Ban Duration End Date"
                            type="date"
                            placeholder="Enter Ban Duration End Date"
                            {...field}
                          />
                        )}
                      />
                    </>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={loader?.submitLoader}
                  color="primary"
                  onPress={() => handleSubmit(onSubmit)()}
                >
                  Submit
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
