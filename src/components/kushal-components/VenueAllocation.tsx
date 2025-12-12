import React, { Key, useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
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
import { Controller, useForm } from "react-hook-form";
import {
  CallAddCandidateToVenue,
  CallGetAdmitCardCandidateDetails,
  CallGetAllKushalFilters,
  CallGetAllSports,
  CallGetCandidateVenueAllocationDetails,
  CallGetVenueBySportId,
  CallGetVenueDetails,
  CallValidateVenueDates,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { handleCommonErrors } from "@/Utils/HandleError";
import TableSkeleton from "./loader/TableSkeleton";
import { useAdvertisement } from "../AdvertisementContext";
import CandidateVenueAllocation from "./admit-card-release/CandidateVenueAllocationTable";

type Props = {};

interface DataRowProps {
  icon: string;
  title: string;
  value: string;
}

const columns2 = [
  {
    title: "No",
    key: "No",
  },
  {
    title: "Sport",
    key: "sport",
  },
  {
    title: "State",
    key: "state",
  },
  {
    title: "Full Name",
    key: "fullName",
  },
  {
    title: "Application No.",
    key: "appNo",
  },
  {
    title: "Gender",
    key: "gender",
  },
];

const DataRow: React.FC<DataRowProps> = ({ icon, title, value }) => {
  return (
    <div className="mb-2 grid grid-cols-2 gap-6">
      <div className="flex gap-3">
        <span className="material-symbols-rounded" style={{ color: "#62748e" }}>
          {icon}
        </span>
        <p className="font-medium">{title}</p>
      </div>
      <p>{value}</p>
    </div>
  );
};

const VenueAllocation = (props: Props) => {
  const { currentAdvertisementID: advertisementId } = useAdvertisement();
  const { control, handleSubmit, watch, reset } = useForm();
  const [allSports, setAllSports] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [allVenue, setAllVenue] = useState<any[]>([]);
  const [allocatedCandidatesData, setAllocatedCandidatesData] = useState<any>(
    [],
  );
  const [allocatedCandidatePage, setAllocatedCandidatePage] =
    useState<number>(1);
  const [allocatedCandidateTotalPage, setAllocatedCandidateTotalPage] =
    useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [venueDetails, setVenueDetails] = useState<any>();
  const [candidateDetails, setCandidateDetails] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>(null);
  const [venueAllocationData, setVenueAllocationData] = useState<any>([]);

  const {
    isOpen: isVenueAllocation,
    onOpen: onVenueAllocation,
    onOpenChange: onOpenVenueAllocation,
    onClose: closeVenueAllocation,
  } = useDisclosure();
  const {
    isOpen: isVenueAllocation2,
    onOpen: onVenueAllocation2,
    onOpenChange: onOpenVenueAllocation2,
    onClose: onCloseVenueAllocation2,
  } = useDisclosure();
  const [loader, setLoader] = useState<any>({
    addCandidates: false,
    candidateDetails: false,
    addCandidate: false,
    venue: false,
    candidateAllocation: false,
    dateValidation: false,
  });
  const [filterData, setFilterData] = useState<any>({
    Gender: "",
    sort: "",
    limit: "",
    startDate: "",
    endDate: "",
  });
  const [venue] = watch(["venue"]);
  const allocateVenue = (data: object) => {
    setVenueAllocationData(data);
    ValidateVenueDates(data);
  };

  const getAllSports = async () => {
    try {
      const { data, error } = (await CallGetAllSports("")) as any;
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

  const getAllFilters = async () => {
    try {
      const { data, error } = (await CallGetAllKushalFilters()) as any;
      if (data) {
        setAllPosts(data?.data?.postNames);
      }
      if (error) {
        toast?.error(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAllVenue = async (sportsID: string) => {
    setLoader((prev: any) => ({
      ...prev,
      venue: true,
    }));
    try {
      const query = `advertisement=${advertisementId}&sportsId=${sportsID}`;
      const { data, error } = (await CallGetVenueBySportId(query)) as any;
      if (data) {
        setAllVenue(data?.venues);
      }
      if (error) {
        toast?.error(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        venue: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        venue: false,
      }));
    }
  };

  const ValidateVenueDates = async (formData: any) => {
    setLoader((prev: any) => ({
      ...prev,
      dateValidation: true,
    }));
    try {
      const dto = {
        venueId: formData?.venue,
        dvStartDate: formData?.dvStartDate,
        dvEndDate: formData?.dvEndDate,
        trialStartDate: formData?.trialStartDate,
        trialEndDate: formData?.trialEndDate,
      };
      const { data, error } = (await CallValidateVenueDates(dto)) as any;
      console.log("CallValidateVenueDates", data, error);
      if (data) {
        if (venueAllocationData?.sports) {
          getCandidateDetails();
        }
        closeVenueAllocation();
        onVenueAllocation2();
      }
      if (error) {
        toast?.error(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        dateValidation: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        dateValidation: false,
      }));
    }
  };

  const getCandidateDetails = async () => {
    setLoader((prev: any) => ({
      ...prev,
      candidateDetails: true,
    }));

    const query = `advertisementId=${advertisementId}&sportsId=${venueAllocationData?.sports}&gender=${filterData?.Gender}&oddEven=${filterData?.sort}&page=${page}&limit=${filterData?.limit || 10}&venueId=${venue ? venue : ""}`;
    try {
      const { data, error } = (await CallGetAdmitCardCandidateDetails(
        query,
      )) as any;

      console.log("CallGetAdmitCardCandidateDetails", data, error);

      if (data) {
        setCandidateDetails(data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        candidateDetails: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        candidateDetails: false,
      }));
    }
  };

  const AddCandidatesToVenue = async () => {
    setLoader((prev: any) => ({
      ...prev,
      addCandidate: true,
    }));

    const candidates =
      selectedKeys === "all"
        ? candidateDetails?.data?.map((dto: any) => dto?._id)
        : [...selectedKeys];
    const Data: any[] = [];

    candidateDetails?.data?.forEach((dto: any) => {
      if (candidates?.includes(dto?._id)) {
        Data?.push(dto?._id);
      }
    });
    const candidateData = {
      advertisement: advertisementId,
      isSelectAll: !filterData?.limit && selectedKeys === "all",
      sportsId: venueAllocationData?.sports,
      venueId: venueAllocationData?.venue,
      applicationIds: [...Data],
      dvStartDate: venueAllocationData?.dvStartDate,
      dvEndDate: venueAllocationData?.dvEndDate,
      trialStartDate: venueAllocationData?.trialStartDate,
      trialEndDate: venueAllocationData?.trialEndDate,
    };

    try {
      const { data, error } = (await CallAddCandidateToVenue(
        candidateData,
      )) as any;

      if (data) {
        toast.success(data?.message);
        onCloseVenueAllocation2();
        getAllocatedCandidates();
        clearAllocateVenueModalData();
        setSelectedKeys(null);
        clearFilter();
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        addCandidate: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        addCandidate: false,
      }));
    }
  };

  const getAllVenues = async () => {
    setLoader((prev: any) => ({
      ...prev,
      addCandidates: true,
    }));
    const query = `advertisement=${advertisementId}&venueId=${venueAllocationData?.venue}`;
    try {
      const { data, error } = (await CallGetVenueDetails(query)) as any;
      if (data) {
        setVenueDetails(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        addCandidates: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        addCandidates: false,
      }));
    }
  };

  const venueDetailsData = [
    {
      icon: "apartment",
      title: "Venue",
      value: venueDetails?.venueName,
    },
    {
      icon: "map",
      title: "Venue City",
      value: venueDetails?.venueCity,
    },
    {
      icon: "location_on",
      title: "Venue Address",
      value: venueDetails?.venueAddress,
    },
    {
      icon: "tag",
      title: "Venue Capacity",
      value: venueDetails?.venueCapacity,
    },
    // {
    //   icon: "tag",
    //   title: "Venue remaining Capacity",
    //   value: "data",
    // },
  ];

  const allocationDetails = [
    {
      icon: "tag",
      title: "Total Found Fit Candidates",
      value: candidateDetails?.stats?.totalApplications,
    },
    {
      icon: "group",
      title: "Allocated candidates",
      value: candidateDetails?.stats?.allocatedApplications,
    },
    {
      icon: "group",
      title: "Remaining candidates",
      value: candidateDetails?.stats?.remainingApplications,
    },
  ];

  const getAllocatedCandidates = async () => {
    setLoader((prev: any) => ({
      ...prev,
      candidateAllocation: true,
    }));
    try {
      const query = `advertisementId=${advertisementId}&startDate=${filterData?.startDate}&endDate=${filterData?.endDate}`;
      const { data, error } = (await CallGetCandidateVenueAllocationDetails(
        query,
      )) as any;
      if (data?.data) {
        setAllocatedCandidatesData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        candidateAllocation: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        candidateAllocation: false,
      }));
    }
  };

  const renderCell = useCallback(
    (item: any, columnKey: Key, index: number) => {
      const cellValue = item[columnKey as any];
      const actualIndex = Math.abs(page - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "No":
          return <p className="text-bold text-sm capitalize">{actualIndex}</p>;
        case "appNo":
          return <p>{item?.user?.candidateId || "N/A"}</p>;
        case "sport":
          return <p>{item?.sports?.name || "N/A"}</p>;
        case "state":
          return (
            <p className="capitalize">
              {item?.addressDetails?.presentAddress?.state || "N/A"}
            </p>
          );
        case "fullName":
          return <p>{item?.personalDetails?.fullName || "N/A"}</p>;
        case "gender":
          return (
            <p className="capitalize">
              {item?.personalDetails?.gender || "N/A"}
            </p>
          );
        default:
          return cellValue;
      }
    },
    [page],
  );

  const clearFilter = () => {
    setFilterData({
      Gender: "",
      sort: "",
      limit: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
    getCandidateDetails();
  };

  useEffect(() => {
    if (venueAllocationData?.venue && advertisementId) {
      getAllVenues();
    }
  }, [venueAllocationData?.venue, advertisementId]);

  useEffect(() => {
    getAllSports();
    getAllFilters();
  }, []);

  useEffect(() => {
    if (advertisementId) {
      getAllocatedCandidates();
    }
  }, [advertisementId]);

  useEffect(() => {
    if (venueAllocationData?.sports && advertisementId) {
      getCandidateDetails();
    }
  }, [venueAllocationData?.sports, advertisementId]);

  const clearAllocateVenueModalData = () => {
    reset({
      sports: null,
      post: [],
      venue: null,
      dvStartDate: "",
      dvEndDate: "",
      trialStartDate: "",
      trialEndDate: "",
    });
  };

  return (
    <>
      <CandidateVenueAllocation
        tableData={allocatedCandidatesData}
        page={allocatedCandidatePage}
        setPage={setAllocatedCandidatePage}
        setTotalPages={setAllocatedCandidateTotalPage}
        totalPages={allocatedCandidateTotalPage}
        loader={loader?.candidateAllocation}
        title="Candidates Venue Allocation"
        button={{
          title: "Allocate venue to candidates",
          onClick: onOpenVenueAllocation,
        }}
        setFilterData={setFilterData}
        filterData={filterData}
        type="candidateVenueAllocation"
        functionCall={getAllocatedCandidates}
        clearFilter={clearFilter}
      />

      <Modal
        isOpen={isVenueAllocation}
        onOpenChange={() => {
          onOpenVenueAllocation();
          clearAllocateVenueModalData();
        }}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add candidates to venue
              </ModalHeader>
              <ModalBody>
                <form
                  className="grid grid-cols-1 gap-5"
                  onSubmit={handleSubmit(allocateVenue)}
                >
                  <Controller
                    name="sports"
                    control={control}
                    rules={{ required: "Sports is required" }}
                    render={({
                      field: { onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Autocomplete
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={allSports}
                        label="Sports"
                        labelPlacement="outside"
                        selectedKey={filterData?.sports}
                        placeholder="Select"
                        onSelectionChange={(key: any) => {
                          onChange(key);
                          getAllVenue(key);
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
                    name="post"
                    rules={{
                      required: "Post is required",
                    }}
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { invalid, error },
                    }) => (
                      <Select
                        selectionMode="multiple"
                        items={allPosts.filter((item) => item?.postName) || []}
                        label="Post"
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
                          <SelectItem key={item?._id}>
                            {item?.postName}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="venue"
                    control={control}
                    rules={{ required: "Venue is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Select
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        items={allVenue}
                        label="Venue"
                        labelPlacement="outside"
                        placeholder="Select"
                        isLoading={loader?.venue}
                      >
                        {(item) => (
                          <SelectItem key={item?._id}>
                            {item?.venueName}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="dvStartDate"
                    control={control}
                    rules={{ required: "Start Date is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="date"
                        label="Document Verification Start Date"
                        labelPlacement="outside"
                        placeholder=" "
                      />
                    )}
                  />
                  <Controller
                    name="dvEndDate"
                    control={control}
                    rules={{ required: "End Date is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="date"
                        label="Document Verification End Date"
                        labelPlacement="outside"
                        placeholder=" "
                      />
                    )}
                  />
                  <Controller
                    name="trialStartDate"
                    control={control}
                    rules={{ required: "Start Date is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="date"
                        label="Trial Start Date"
                        labelPlacement="outside"
                        placeholder=" "
                      />
                    )}
                  />
                  <Controller
                    name="trialEndDate"
                    control={control}
                    rules={{ required: "End Date is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="date"
                        label="Trial End Date"
                        labelPlacement="outside"
                        placeholder=" "
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    color="primary"
                    variant="solid"
                    className="mb-2 w-full"
                    isLoading={loader?.dateValidation}
                  >
                    Add Candidates
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isVenueAllocation2}
        onOpenChange={onOpenVenueAllocation2}
        className="max-w-[70rem]"
        placement="top"
        isDismissable={false}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Candidate Venue Allocation
                (Venue-wise/Date-wise/Post-wise/Gender-wise Allocation)
              </ModalHeader>
              <ModalBody className="gx-8 grid grid-cols-2">
                {loader?.addCandidates ? (
                  <div className="col-span-2">
                    <TableSkeleton
                      columnsCount={5}
                      isTitle
                      filters
                      filtersCount={3}
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-medium">
                      Post:{" "}
                      <span className="font-normal">
                        Direct recruitment of skilled players to the posts of
                        Sub Inspector Civil Police in Uttar Pradesh Police-2023
                      </span>
                    </p>
                    <p className="font-medium">
                      Sport:{" "}
                      <span className="font-normal">
                        {venueDetails?.sportsId[0]?.name}
                      </span>
                    </p>

                    <div>
                      <h5 className="mb-3 font-semibold">Venue details</h5>
                      {venueDetailsData?.map((item, index) => (
                        <DataRow
                          key={index}
                          icon={item?.icon}
                          title={item?.title}
                          value={item?.value}
                        />
                      ))}
                    </div>

                    <div>
                      <h5 className="mb-3 font-semibold">Allocation details</h5>
                      {allocationDetails?.map((item, index) => (
                        <DataRow
                          key={index}
                          icon={item?.icon}
                          title={item?.title}
                          value={item?.value}
                        />
                      ))}
                    </div>

                    <Table
                      removeWrapper
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                      className="col-span-2"
                      topContentPlacement="outside"
                      bottomContentPlacement="outside"
                      topContent={
                        <>
                          <h4 className="font-semibold">Filter Candidates</h4>
                          <div className="grid grid-cols-3 gap-6">
                            <Select
                              items={[
                                { key: "male", label: "Male" },
                                { key: "female", label: "Female" },
                              ]}
                              selectedKeys={[filterData?.Gender]}
                              label="Gender"
                              labelPlacement="outside"
                              placeholder="Select"
                              onChange={(e) => {
                                setFilterData({
                                  ...filterData,
                                  Gender: e.target.value,
                                });
                              }}
                            >
                              {(option) => (
                                <SelectItem key={option?.key}>
                                  {option?.label}
                                </SelectItem>
                              )}
                            </Select>
                            <Input
                              type="text"
                              label="Number of candidates"
                              labelPlacement="outside"
                              placeholder="Enter number of candidates"
                              value={filterData?.limit}
                              onChange={(e) => {
                                setFilterData({
                                  ...filterData,
                                  limit: e.target.value,
                                });
                              }}
                            />
                            <Select
                              items={[
                                { key: "odd", label: "odd" },
                                { key: "even", label: "even" },
                              ]}
                              label="Application number odd even wise"
                              labelPlacement="outside"
                              placeholder="Select"
                              selectedKeys={[filterData?.sort]}
                              onChange={(e) => {
                                setFilterData({
                                  ...filterData,
                                  sort: e.target.value,
                                });
                              }}
                            >
                              {(option) => (
                                <SelectItem key={option?.key}>
                                  {option?.label}
                                </SelectItem>
                              )}
                            </Select>
                            <div className="col-start-3 grid grid-cols-2 gap-2">
                              <Button
                                color="primary"
                                variant="shadow"
                                onPress={() => getCandidateDetails()}
                                startContent={
                                  <span className="material-symbols-rounded">
                                    filter_list
                                  </span>
                                }
                              >
                                Filter
                              </Button>
                              <Button
                                color="danger"
                                variant="bordered"
                                onPress={() => clearFilter()}
                              >
                                <span
                                  className="material-symbols-rounded text-danger"
                                  style={{ color: "#f42f73" }}
                                >
                                  close
                                </span>{" "}
                                Clear filters
                              </Button>
                            </div>
                          </div>
                        </>
                      }
                      // bottomContent={
                      //   candidateDetails?.pagination?.totalPages > 1 ? (
                      //     <div className="flex w-full justify-end">
                      //       <Pagination
                      //         isCompact
                      //         showControls
                      //         showShadow
                      //         color="primary"
                      //         page={page}
                      //         onChange={(page) => setPage(page)}
                      //         total={candidateDetails?.pagination?.totalPages}
                      //       />
                      //     </div>
                      //   ) : (
                      //     ""
                      //   )
                      // }
                    >
                      <TableHeader columns={columns2}>
                        {(column) => (
                          <TableColumn key={column?.key}>
                            {column?.title}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody
                        emptyContent={"No Data!"}
                        isLoading={loader?.candidateDetails}
                        loadingContent={<Spinner />}
                      >
                        {candidateDetails?.data?.map(
                          (item: any, index: number) => (
                            <TableRow key={item._id}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderCell(item, columnKey, index)}
                                </TableCell>
                              )}
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full"
                  // onPress={onClose}
                  onPress={() => {
                    AddCandidatesToVenue();
                  }}
                  isLoading={loader?.addCandidate}
                >
                  Allocate Admit Card
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default VenueAllocation;
