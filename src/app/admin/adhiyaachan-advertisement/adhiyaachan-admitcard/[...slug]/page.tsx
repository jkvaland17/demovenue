"use client";
import UseMasterByCodeSelect from "@/components/Adhiyaachan/UseMasterByCodeSelect";
import { Input } from "@nextui-org/input";
import { Controller, useForm } from "react-hook-form";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { use, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  CallAdhiyaachanAdmitCardGetById,
  CallCreateAdhiyaachanAdmitCard,
  CallGetAllExamType,
  CallGetAllSpecialtiesId,
  CallGetAllVenue,
  CallUpdateAdhiyaachanAdmitCard,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { MasterCode } from "@/app/admin/adhiyaachan-advertisement/adhiyaachan-submission/types";

const AdhiyaachanAdmitCard: React.FC = () => {
  const { control, handleSubmit, watch, resetField, setValue } = useForm();
  const router = useRouter();
  const [examList, setExamList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<any>("");
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [allList, setAllList] = useState<any[]>([]);
  const [allMaster, setAllMaster] = useState<any[]>([]);
  const { slug } = useParams();
  const [loader, setLoader] = useState<any>({
    table: false,
    updateDetails: false,
    submitLoader: false,
  });
  const advertisementId = watch("advertisementId");
  const zone = watch("zone");

  const disabledIds = allMaster
    .filter((item: any) => examList.includes(item?._id))
    .map((item: any) => item._id);

  const onSubmit = async (admitData: any) => {
    setLoader((prev: any) => ({
      ...prev,
      submitLoader: true,
    }));

    try {
      const UserApplications =
        selectedVenue === "all"
          ? allList?.map((dto: any) => dto?._id)
          : [...selectedVenue];
      const formData = {
        ...admitData,
        venueId: UserApplications,
      };
      console.log("Form submitted with data:", formData);
      const { data, error } = (await CallCreateAdhiyaachanAdmitCard(
        formData,
      )) as any;
      if (data) {
        toast.success(data?.message);
        router.push("/admin/adhiyaachan-advertisement/adhiyaachan-admitcard");
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
      if (error) {
        handleCommonErrors(error);
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSubmit = async (admitData: any) => {
    setLoader((prev: any) => ({
      ...prev,
      submitLoader: true,
    }));

    try {
      const UserApplications =
        selectedVenue === "all"
          ? allList?.map((dto: any) => dto?._id)
          : [...selectedVenue];
      const formData = {
        ...admitData,
        venueId: UserApplications,
      };
      console.log("updateSubmit", formData);
      const { data, error } = (await CallUpdateAdhiyaachanAdmitCard(
        formData,
      )) as any;
      if (data) {
        toast.success(data?.message);
        router.push("/admin/adhiyaachan-advertisement/adhiyaachan-admitcard");
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
      if (error) {
        handleCommonErrors(error);
        setLoader((prev: any) => ({
          ...prev,
          submitLoader: false,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const AdhiyaachanAdmitCardGetById = async () => {
    try {
      const query = `id=${slug[1]}&examTypeId=${slug[2]}`;
      const { data, error } = (await CallAdhiyaachanAdmitCardGetById(
        query,
      )) as any;
      console.log("CallAdhiyaachanAdmitCardGetById", { data, error });
      if (data?.data) {
        setValue("id", data?.data?._id);
        setValue("advertisementId", data?.data?.advertisementId?._id || "");
        setValue(
          "masterDataIds",
          data?.data?.admitCardStages?.masterDataIds || [],
        );
        setValue("zone", data?.data?.admitCardStages?.zone || []);
        setValue("examTypeId", data?.data?.admitCardStages?._id);
        setSelectedVenue(new Set(data?.data?.admitCardStages?.venueId || []));
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllExamlist = async (): Promise<void> => {
    try {
      const query = advertisementId;
      const { data, error } = (await CallGetAllExamType(query)) as any;
      console.log("Exam data", data);
      if (error) {
        console.log(error);
      }
      if (data) {
        setExamList(data?.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  const getAllExamMaster = async (): Promise<void> => {
    try {
      const { data, error } = (await CallGetAllSpecialtiesId(
        "68590f5fbd59ae8abb898fb6",
      )) as any;
      console.log("Specialties data", data);
      if (error) {
        console.log(error);
      }
      if (data) {
        setAllMaster(data?.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  const getVenueTableList = async () => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const query = `advertisementId=${advertisementId}&zone=${zone}&type=sorting`;
      const { data, error } = (await CallGetAllVenue(query)) as any;
      console.log("data", data);
      if (data?.data) {
        setAllList(data?.data);
        setTotalPages(data?.data?.totalPages);
      } else {
        setAllList([]);
      }
      if (error) {
        console.log(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  useEffect(() => {
    getAllExamMaster();
  }, []);

  useEffect(() => {
    if (slug && slug[0] === "edit") {
      AdhiyaachanAdmitCardGetById();
    }
  }, [slug]);

  useEffect(() => {
    if (advertisementId && zone && zone.length > 0) {
      getVenueTableList();
    } else {
      setAllList([]);
    }
    getAllExamlist();
  }, [advertisementId, zone]);

  const columns = [
    { key: "select", title: "" },
    { title: "Venue Name", key: "school_name" },
    { title: "Venue Capacity", key: "total_seating_capacity" },
  ];

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "school_name":
        return <p>{item?.school_name || "-"}</p>;
      case "total_seating_capacity":
        return <p>{item?.total_seating_capacity || "-"}</p>;
      case "action":
        return (
          <Dropdown
            classNames={{ content: "min-w-[150px]" }}
            placement="bottom-end"
          >
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem
                key={"edit"}
                startContent={
                  <span className="material-symbols-outlined">box_edit</span>
                }
              >
                Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return "";
    }
  }, []);


  useEffect(() => {
    resetField("masterDataIds");
    resetField("zone");
  }, [advertisementId, resetField]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8">
      <div className="flex items-center justify-end">
        <Button
          radius="md"
          className="mb-4 font-medium"
          onPress={() => {
            router.back();
          }}
          startContent={
            <span className="material-symbols-rounded">arrow_back</span>
          }
        >
          Go Back
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(slug[0] === "edit" ? updateSubmit : onSubmit)}
      >
        <div className="mb-5 flex gap-6">
          <Controller
            name={`advertisementId`}
            control={control}
            rules={{ required: "Please select advertisement" }}
            render={({
              field: { value, onChange },
              fieldState: { error, invalid },
            }) => (
              <UseMasterByCodeSelect
                code={MasterCode?.Advertisement}
                isRequired
                label="Advertisement"
                isDisabled={slug[0] === "edit"}
                placeholder="Select Advertisement"
                labelPlacement="outside"
                size="md"
                multiple="single"
                value={value}
                isInvalid={invalid}
                errorMessage={error?.message}
                onChange={(e) => {
                  onChange(e);
                }}
              />
            )}
          />
        </div>
        <div className="mb-5 flex gap-6">
          <Controller
            name={`masterDataIds`}
            control={control}
            rules={{ required: "Please select Zone" }}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid },
            }) => {
              return (
                <Select
                  items={allMaster}
                  isRequired
                  isDisabled={slug[0] === "edit" || !advertisementId}
                  fullWidth
                  selectionMode="multiple"
                  label="Exam Type"
                  placeholder="Select Exam Type"
                  labelPlacement="outside"
                  selectedKeys={value || []}
                  onSelectionChange={(keys) => onChange(Array.from(keys))}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  disabledKeys={disabledIds}
                >
                  {(item) => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.name}
                    </SelectItem>
                  )}
                </Select>
              );
            }}
          />
        </div>
        <div className="mb-5 flex gap-6">
          <Controller
            name={`zone`}
            control={control}
            rules={{ required: "Please select Zone" }}
            render={({
              field: { value, onChange },
              fieldState: { error, invalid },
            }) => (
              <UseMasterByCodeSelect
                code={MasterCode?.Zone}
                isDisabled={slug[0] === "edit"}
                isRequired
                label="Zone"
                placeholder="Select Zone"
                labelPlacement="outside"
                size="md"
                multiple={"multiple"}
                value={value}
                isInvalid={invalid}
                errorMessage={error?.message}
                onChange={(e) => {
                  onChange(e);
                }}
              />
            )}
          />
        </div>

        <div>
          <h1 className="mb-5 text-2xl font-semibold">Venue Table</h1>
          {loader.table ? (
            <TableSkeleton columnsCount={5} />
          ) : (
            <Table
              selectionMode="multiple"
              selectedKeys={selectedVenue}
              onSelectionChange={setSelectedVenue}
              className="mt-8 max-h-[40vh] overflow-auto"
              color="default"
              aria-label="Example static collection table"
              // bottomContent={
              //   <div className="flex justify-end">
              //     <Pagination
              //       showControls
              //       page={page}
              //       total={totalPages ?? 0}
              //       onChange={(page) => setPage(page)}
              //     />
              //   </div>
              // }
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    align={column.key === "actions" ? "center" : "start"}
                  >
                    {column.title}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={allList}>
                {(item: any) => (
                  <TableRow key={item._id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <Button
          isLoading={loader?.submitLoader}
          variant="solid"
          type="submit"
          className="mt-6 bg-blue-500 text-white"
        >
          {slug[0] === "edit" ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default AdhiyaachanAdmitCard;
