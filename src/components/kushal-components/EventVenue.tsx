import {
  CallDeleteKushalVenues,
  CallGetAllSports,
  CallGetKushalAddVenues,
  CallGetKushalVenuesByEventID,
  CallUpdateKushalAddVenues,
} from "@/_ServerActions";
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
  ModalHeader,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAdvertisement } from "../AdvertisementContext";
import SearchInput from "../Custom/SearchInput";

const columns = [
  { title: "No.", key: "No" },
  { title: "Sports", key: "sports" },
  { title: "City", key: "venueCity" },
  { title: "Name", key: "venueName" },
  { title: "Venue Address", key: "venueAddress" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  // { title: "Capacity", key: "venueCapacity" },
  { title: "Actions", key: "actions" },
];

function EventVenue() {
  const { currentAdvertisementID } = useAdvertisement();
  const { control, handleSubmit, setValue } = useForm();
  const {
    isOpen: isOpenVenueModal,
    onOpen: onOpenVenueModal,
    onOpenChange: onOpenChangeVenueModal,
    onClose: onCloseChangeVenueModal,
  } = useDisclosure();
  const [modalType, setModalType] = useState<string>("");
  const [allVenues, setAllVenues] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<any>("");
  const [allSports, setAllSports] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    venueDetails: false,
    deleteVenue: false,
  });

  const getAllSports = async () => {
    try {
      const { data, error } = (await CallGetAllSports()) as any;
      if (data) {
        setAllSports(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAllVenues = async (filter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      venueDetails: true,
    }));
    const filterON = `advertisement=${currentAdvertisementID}&page=${page}&limit=10&search=${searchValue}`;
    const filterOFF = `advertisement=${currentAdvertisementID}&page=${page}&limit=10&search=`;
    console.log("filterOFF", filterOFF);

    try {
      const { data, error } = (await CallGetKushalVenuesByEventID(
        filter ? filterON : filterOFF,
      )) as any;
      if (data) {
        setAllVenues(data?.venues);
        setTotalPages(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        venueDetails: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        venueDetails: false,
      }));
    }
  };

  const deleteVenues = async (venueId: string) => {
    setLoader((prev: any) => ({
      ...prev,
      deleteVenue: true,
    }));
    try {
      const { data, error } = (await CallDeleteKushalVenues(venueId)) as any;
      if (data) {
        toast.success(data?.message);
        getAllVenues(false);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        deleteVenue: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        deleteVenue: false,
      }));
    }
  };

  const addVenue = async (venueData: any) => {
    const dto = {
      advertisement: currentAdvertisementID,
      ...venueData,
    };
    setLoader((prev: any) => ({
      ...prev,
      addVenue: true,
    }));
    try {
      const { data, error } = (await CallGetKushalAddVenues(dto)) as any;
      if (data) {
        toast.success(data?.message);
        getAllVenues(false);
        onCloseChangeVenueModal();
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        addVenue: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        addVenue: false,
      }));
    }
  };

  const UpdateVenue = async (venueData: any) => {
    setLoader((prev: any) => ({
      ...prev,
      addVenue: true,
    }));

    try {
      const { data, error } = (await CallUpdateKushalAddVenues(
        venueData,
      )) as any;
      if (data) {
        toast.success(data?.message);
        getAllVenues(false);
        onCloseChangeVenueModal();
        handleCloseModel();
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        addVenue: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        addVenue: false,
      }));
    }
  };

  const handleCloseModel = () => {
    const newArray = [
      "venueCity",
      "eventId",
      "venueName",
      "venueAddress",
      "sportsId",
      "startDate",
      "endDate",
      "venueCapacity",
    ];
    newArray.forEach((item: string) => {
      setValue(item, "");
    });
  };

  const setFormValues = (item: any, modalType = "") => {
    const sports = item?.sportsId?.map((sports: any) => {
      return sports?._id;
    });
    setValue("venueId", item?._id || "");
    setValue("venueCity", item?.venueCity || "");
    setValue("eventId", item?.eventId || "");
    setValue("venueName", item?.venueName || "");
    setValue("venueAddress", item?.venueAddress || "");
    setValue("sportsId", sports || []);
    setValue("startDate", moment(item?.startDate).format("YYYY-MM-DD") || "");
    setValue("endDate", moment(item?.endDate).format("YYYY-MM-DD") || "");
    setValue("venueCapacity", item?.venueCapacity || "");
    setModalType(modalType);
    onOpenChangeVenueModal();
  };

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllVenues(false);
    }
    getAllSports();
  }, [currentAdvertisementID]);

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllVenues(true);
    }
  }, [page]);

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, index: number) => {
      const cellValue = item[columnKey as any];
      const actualIndex = Math.abs(page - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "No":
          return <p className="text-bold text-sm capitalize">{actualIndex}</p>;
        case "venueAddress":
          return (
            <p className="text-bold max-w-[300px] truncate text-sm capitalize">
              <Tooltip
                placement="top-start"
                content={
                  <div className="w-fit max-w-[400px] p-2">{cellValue}</div>
                }
              >
                {cellValue}
              </Tooltip>
            </p>
          );
        case "startDate":
        case "endDate":
          return <p>{moment(cellValue).format("DD/MM/YYYY")}</p>;
        case "sports":
          return (
            <Popover placement="top">
              <PopoverTrigger>
                <Button
                  disableRipple
                  className="animate-none bg-transparent text-blue-500"
                >
                  View Sports
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid grid-cols-3 gap-2 overflow-y-auto px-1 py-2">
                  {item?.sportsId.map((sports: any, item: number) => (
                    <Chip
                      radius="sm"
                      key={item}
                      classNames={{
                        base: "!max-w-full",
                      }}
                    >
                      {sports?.name}
                    </Chip>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
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
                    setFormValues(item, "edit");
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="view"
                  color="danger"
                  variant="flat"
                  onPress={() => {
                    deleteVenues(item?._id);
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return <p>{cellValue}</p>;
      }
    },
    [page],
  );
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold mob:text-xl mob:mb-3">
        Admit Card Release
      </h1>
      <Table
        isStriped
        className="mb-6"
        color="default"
        aria-label="Example static collection table"
        topContent={
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mob:text-lg">Event Venue Data</h2>
                <Button
                  color="primary"
                  variant="shadow"
                  onPress={() => {
                    setFormValues("", "add");
                  }}
                >
                  Add Venue Data
                </Button>
              </div>
            </div>
            <div className="col-span-4 xl:col-span-3">
              <SearchInput
                functionCall={getAllVenues}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            </div>
          </div>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination
              showControls
              total={totalPages}
              initialPage={1}
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
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No data"
          isLoading={loader?.venueDetails}
          loadingContent={<Spinner />}
        >
          {allVenues?.map((item: any, index: number) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, index)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Venue Modal */}
      <Modal
        isOpen={isOpenVenueModal}
        onOpenChange={onOpenChangeVenueModal}
        size="xl"
        onClose={handleCloseModel}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "edit" ? `Edit Venue Data` : `Add Venue Data`}
              </ModalHeader>
              <ModalBody className="gap-6">
                <form
                  className="grid grid-cols-1 gap-4"
                  onSubmit={handleSubmit(
                    modalType === "edit" ? UpdateVenue : addVenue,
                  )}
                >
                  <Controller
                    name="venueCity"
                    control={control}
                    rules={{
                      required: "Venue City is Required",
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="text"
                        label="Venue City"
                        labelPlacement="outside"
                        placeholder="Enter venue city"
                        endContent={
                          <span className="material-symbols-rounded">edit</span>
                        }
                      />
                    )}
                  />

                  <Controller
                    name="sportsId"
                    rules={{
                      required: "Sports is Required",
                    }}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        selectionMode="multiple"
                        items={allSports || []}
                        label="Sports"
                        labelPlacement="outside"
                        placeholder="Select"
                        isInvalid={invalid}
                        selectedKeys={value || []}
                        errorMessage={error?.message}
                        onSelectionChange={(e) => {
                          let selectedValue = Array.from(e);
                          onChange(selectedValue);
                        }}
                      >
                        {(item: any) => (
                          <SelectItem key={item?._id}>{item?.name}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="venueName"
                    control={control}
                    rules={{
                      required: "Venue Name is Required",
                    }}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        type="text"
                        label="Venue Name"
                        labelPlacement="outside"
                        placeholder="Enter venue name"
                        endContent={
                          <span className="material-symbols-rounded">edit</span>
                        }
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="venueAddress"
                    control={control}
                    rules={{
                      required: "Venue Address is Required",
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        type="text"
                        label="Venue Address"
                        labelPlacement="outside"
                        placeholder="Enter venue address"
                        endContent={
                          <span className="material-symbols-rounded">
                            location_on
                          </span>
                        }
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="startDate"
                    control={control}
                    rules={{
                      required: "Venue Start Date is Required",
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="date"
                        label="Start Date"
                        labelPlacement="outside"
                        placeholder="Enter Start Date"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      required: "Venue End Date is Required",
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        type="date"
                        label="End Date"
                        labelPlacement="outside"
                        placeholder="Enter End Date"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="venueCapacity"
                    control={control}
                    rules={{
                      required: "Venue Address is Required",
                    }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        type="number"
                        label="Venue Capacity"
                        labelPlacement="outside"
                        placeholder="Enter venue capacity"
                        endContent={
                          <span className="material-symbols-rounded">tag</span>
                        }
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                  <div className="mb-3 mt-2">
                    <Button
                      color="primary"
                      variant="solid"
                      className="w-full"
                      type="submit"
                      isLoading={loader?.addVenue}
                    >
                      {modalType === "edit" ? `Edit Venue` : `Add Venue`}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventVenue;
