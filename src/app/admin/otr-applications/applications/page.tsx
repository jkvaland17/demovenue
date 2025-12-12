"use client";
import {
  CallFindApplicationStats,
  CallFindMasterByCode,
  CallGetAllApplications,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CandidateDetailsModal from "@/components/kushal-components/application-scrutiny/CandidateDetailsModal";
import CardGrid from "@/components/kushal-components/CardGrid";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useEffect, useState } from "react";
import dynamicData from "@/assets/data/viewApplicationModal.json";
import moment from "moment";
import { set } from "react-hook-form";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type Props = {};

type FilterData = {
  candidateId: string;
  candidateName: string;
  email: string;
  mobileNumber: string;
  application_status: string | any;
  gender: string;
  category: string;
  admission: string;
  paymentStatus: string | any;
  post_applied_forId: string | any;
  advertisementId: string | any;
};

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const Applications = (props: Props) => {
  const [allData, setAllData] = useState<any[]>([]);
  const [allStats, setAllStats] = useState<any>({
    admission: [],
    category: [],
    gender: [],
  });
  const [isStatsData, setIsStatsData] = useState<boolean>(false);
  const [stats, setStats] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);
  const [viewModal, setViewModal] = useState(false);
  const [advertisementList, setAdvertisementList] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    candidateId: "",
    candidateName: "",
    email: "",
    mobileNumber: "",
    application_status: "",
    gender: "",
    category: "",
    admission: "",
    paymentStatus: "",
    post_applied_forId: "",
    advertisementId: "",
  });
  const [loader, setLoader] = useState<any>({
    excel: false,
    pdf: false,
  });

  const admission = [
    { title: "All Applications", value: 0 },
    { title: "Completed", value: 0 },
    { title: "Incomplete", value: 0 },
    { title: "Exempted", value: 0 },
    { title: "Paid", value: 0 },
    { title: "Pending Payment", value: 0 },
    { title: "Photo", value: 0 },
    { title: "Signature", value: 0 },
    { title: "Thumbprint", value: 0 },
    { title: "Aadhaar Verified", value: 0 },
  ];
  const category = [
    { title: "UR", value: 0 },
    { title: "ST", value: 0 },
  ];
  const gender = [
    { title: "Male", value: 0 },
    { title: "Female", value: 0 },
  ];

  const aadhaar = [
    { title: "Male", value: stats?.VerifiedbyAadhaar?.Male ?? 0 },
    { title: "Female", value: stats?.VerifiedbyAadhaar?.Female ?? 0 },
  ];
  const driving = [
    { title: "Male", value: stats?.VerifiedbyPan?.Male ?? 0 },
    { title: "Female", value: stats?.VerifiedbyPan?.Female ?? 0 },
  ];
  const pan = [
    { title: "Male", value: stats?.VerifiedbyDrivingLicense?.Male ?? 0 },
    { title: "Female", value: stats?.VerifiedbyDrivingLicense?.Female ?? 0 },
  ];

  const columns = [
    { title: "Sr. No", key: "srNo" },
    { title: "Candidate", key: "candidate" },
    { title: "Category", key: "category" },
    // { title: "Registration Id", key: "registrationId" },
    { title: "Candidate Id", key: "candidateId" },
    { title: "Post Applied For", key: "postAppliedFor" },
    { title: "Status", key: "status" },
    { title: "Date", key: "date" },
    { title: "Payment", key: "payment" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, pageNo: number, index: number) => {
      const cellValue = item[columnKey as any];
      const srNo = (pageNo - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "srNo":
          return srNo < 10 ? `0${srNo}` : srNo;

        case "candidate":
          return (
            <div className="flex items-center gap-2">
              <Avatar radius="md" size="lg" src={item?.photograph ?? ""} />
              <div className="">
                <p className="gap-1 text-[15px] font-medium">
                  {item?.personalDetails?.fullName}
                </p>
                <p className="mb-0 text-[0.75rem]">
                  {item?.personalDetails?.email || ""}
                </p>

                <p className="text-[0.75rem]">
                  {item?.personalDetails?.mobileNumber || ""}
                </p>
              </div>
            </div>
          );

        case "category":
          return item?.personalDetails?.reservationCategory;

        case "candidateId":
          return item?.user?.candidateId;

        case "postAppliedFor":
          return item?.postId?.name;

        case "status":
          return (
            <Chip
              color={statusColorMap[item?.applicationStatus]}
              variant="flat"
              radius="full"
              size="md"
            >
              {item?.applicationStatus}
            </Chip>
          );

        case "payment":
          return (
            <Chip
              color={statusColorMap[item?.paymentStatus]}
              variant="flat"
              radius="full"
              size="md"
            >
              {item?.paymentStatus}
            </Chip>
          );

        case "date":
          return (
            <span className="text-nowrap">
              {moment(item?.createdAt).format("ll")}
            </span>
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
                  key="view"
                  onPress={() => {
                    const updatedJson = updateCurrentUserData(item);
                    setCurrentApplicationData(updatedJson);
                    setViewModal(true);
                    setSelectedItem(item);
                  }}
                >
                  View
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );

        default:
          return cellValue;
      }
    },
    [],
  );

  useEffect(() => {
    if (!courseList?.length) {
      getCourseListData("showSkeleton");
    }
  }, []);

  useEffect(() => {
    if (filterData?.advertisementId) {
      GetData(filterData, page);
    }
  }, [page, filterData?.advertisementId]);

  function buildQueryString(page: number, filterData?: FilterData): string {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });

    if (filterData) {
      Object.entries(filterData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });
    }

    return params.toString();
  }
  const GetData = async (filterData: any, page: number) => {
    try {
      //object wise loop and stringfy
      setIsLoading(true);

      const queryString = buildQueryString(page, filterData);
      const { data, error } = (await CallGetAllApplications(
        queryString,
      )) as any;

      if (error) {
        handleCommonErrors(error);
      } else if (data?.statusCode === 200) {
        setAllData(data?.applications);
        setTotalPage(data?.totalPages ?? 1);
        GetStatsData(filterData?.advertisementId, filterData?.admission);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const parsedValue = (key: string) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^./, (str: string) => str.toUpperCase());

  const GetStatsData = async (
    advertisementId: string,
    filter: string,
  ): Promise<void> => {
    try {
      const { data, error } = (await CallFindApplicationStats(
        `${advertisementId}&admission=${filter ? filter : ""}`,
      )) as any;
      console.log("datakk", data);
      if (error) {
        handleCommonErrors(error);
      } else if (data?.statusCode === 200) {
        setIsStatsData(true);
        setStats(data);
        setAllStats({
          admission: Object?.entries(data?.admissionSummary).map(
            ([key, value]: any) => {
              return {
                title: parsedValue(key),
                value,
              };
            },
          ),
          gender: Object?.entries(data?.genderSummary).map(
            ([key, value]: any) => {
              return {
                title: parsedValue(key),
                value,
              };
            },
          ),
          category: Object?.entries(data?.categorySummary).map(
            ([key, value]: any) => {
              return {
                title: parsedValue(key),
                value,
              };
            },
          ),
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getCourseListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallFindMasterByCode()) as any;

      if (data.message === "Success") {
        setCourseList(data?.data);
        if (data?.data?.length) {
          getEventListData("showSkeleton", data?.data[0]?._id);
          if (typeof window !== "undefined" && data?.data?.length) {
            const globalCourseId = localStorage.getItem(
              "globalCourseId",
            ) as string;
            if (data?.data?.some((item: any) => item?._id === globalCourseId)) {
              setCourseId(globalCourseId);
            } else {
              setCourseId(data?.data[0]?._id);
            }
          }
        }
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const getEventListData = async (loaderType: string, courseId: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallUserFindAllAdvertisement(
        `parentMasterId=${courseId}`,
      )) as any;
      if (data?.message === "Success") {
        setAdvertisementList(data?.data);
        if (typeof window !== "undefined" && data?.data?.length) {
          const globalAdvertisementId = localStorage.getItem(
            "globalAdvertisementID",
          );
          if (
            data?.data?.some((item: any) => item?._id === globalAdvertisementId)
          ) {
            setFilterData({
              ...filterData,
              advertisementId: globalAdvertisementId,
            });
          }
        }
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const updateCurrentUserData = (currentItem: any) => {
    const jsonUI = currentApplicationData.accordionItems;

    const getNestedValue = (path: any, obj: any) =>
      path
        .split(".")
        .reduce((acc: any, key: any) => (acc ? acc[key] : "NA"), obj);

    return jsonUI.map((section: any) => {
      if (section.title) {
        const updatedData = section?.data?.map((detail: any) => {
          const value = getNestedValue(detail.key, currentItem);
          return { ...detail, value: value || "NA" };
        });
        return { ...section, data: updatedData };
      }
      return section;
    });
  };

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "warning",
    Returned: "danger",
    Ongoing: "secondary",
    ForthComing: "default",
    Completed: "success",
    Submitted: "success",
    Release: "primary",
  };

  const clearFilter = () => {
    setFilterData({
      ...filterData,
      candidateId: "",
      candidateName: "",
      email: "",
      mobileNumber: "",
      application_status: "",
      gender: "",
      category: "",
      admission: "",
      paymentStatus: "",
      post_applied_forId: "",
    });
    if (page === 1) {
      GetData(
        {
          ...filterData,
          candidateId: "",
          candidateName: "",
          email: "",
          mobileNumber: "",
          application_status: "",
          gender: "",
          category: "",
          admission: "",
          paymentStatus: "",
          post_applied_forId: "",
        },
        page,
      );
    } else {
      setPage(1);
    }
  };
  const toCamelCase = (str: string) => {
    if (!/[_\s]/.test(str)) return str; // If there's no space or underscore, return as-is

    return str
      .toLowerCase()
      .replace(/[_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""));
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Applications Dashboard</h2>
        {/* <ExcelPdfDownload excelFunction={() => {}} pdfFunction={() => {}} /> */}
      </div>

      <FlatCard>
        <div className="grid grid-cols-1 gap-4">
          <div className="">
            <Select
              label="Select Course"
              labelPlacement="outside"
              placeholder="Select"
              items={courseList}
              selectedKeys={[courseId]}
              isRequired
              required
              onSelectionChange={(e: any) => {
                const value = Array.from(e)[0] as string;
                if (typeof window !== "undefined") {
                  localStorage.setItem("globalCourseId", value);
                }
                setCourseId(value);
                if (page > 1) {
                  setPage(1);
                }
                getEventListData("workScope", value);
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
              isLoading={loader === "workScope"}
              isDisabled={loader === "workScope"}
              items={advertisementList}
              isRequired
              required
              selectedKeys={[filterData?.advertisementId]}
              onSelectionChange={(e: any) => {
                const value = Array.from(e)[0] as string;
                if (typeof window !== "undefined") {
                  localStorage.setItem("globalAdvertisementID", value);
                }
                if (page > 1) {
                  setPage(1);
                }
                setFilterData({ ...filterData, advertisementId: value });
              }}
            >
              {(item) => (
                <SelectItem
                  classNames={{
                    title: "whitespace-normal break-words",
                  }}
                  key={item?._id}
                  className="capitalize"
                >
                  {`${item?.advertisementNumberInEnglish} (${item?.titleInEnglish})`}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
      </FlatCard>

      {isStatsData && (
        <FlatCard>
          <h2 className="mb-3 text-xl font-semibold">Addmission</h2>
          <CardGrid
            data={allStats?.admission}
            columns={6}
            hasCallback={true}
            handleClick={(value: any) => {
              const parsedValue = toCamelCase(value);
              setFilterData({ ...filterData, admission: parsedValue });
              if (page === 1) {
                GetData({ ...filterData, admission: parsedValue }, page);
              } else {
                setPage(1);
              }
            }}
            activeValue={parsedValue(filterData?.admission)}
          />

          <div className="grid grid-cols-2 gap-4 mob:grid-cols-1">
            <div>
              <h2 className="mb-3 mt-6 text-xl font-semibold">Category</h2>
              <CardGrid
                data={allStats?.category}
                columns={3}
                hasCallback={true}
                handleClick={(value: any) => {
                  const parsedValue = toCamelCase(value);
                  setFilterData({ ...filterData, category: parsedValue });
                  if (page === 1) {
                    GetData({ ...filterData, category: parsedValue }, page);
                  } else {
                    setPage(1);
                  }
                }}
                activeValue={parsedValue(filterData?.category)}
              />
            </div>

            <div>
              <h2 className="mb-3 mt-6 text-xl font-semibold mob:grid-cols-1">
                Gender
              </h2>
              <CardGrid
                data={allStats?.gender}
                columns={3}
                hasCallback={true}
                handleClick={(value: any) => {
                  const parsedValue = toCamelCase(value);
                  setFilterData({ ...filterData, gender: parsedValue });
                  if (page === 1) {
                    GetData({ ...filterData, gender: parsedValue }, page);
                  } else {
                    setPage(1);
                  }
                }}
                activeValue={parsedValue(filterData?.gender)}
              />
            </div>
          </div>

          {/* <h2 className="mt-6 text-xl font-semibold">Verified by</h2> */}
          <div className="grid grid-cols-3 gap-4 mob:grid-cols-1">
            <div>
              <h2 className="mb-3 mt-6 text-xl font-semibold">
                Verified by Aadhaar
              </h2>
              <CardGrid data={aadhaar} columns={2} />
            </div>
            <div>
              <h2 className="mb-3 mt-6 text-xl font-semibold">
                Verified by PAN
              </h2>
              <CardGrid data={pan} columns={2} />
            </div>
            <div>
              <h2 className="mb-3 mt-6 text-xl font-semibold">
                Verified by Driving License
              </h2>
              <CardGrid data={driving} columns={2} />
            </div>
          </div>
        </FlatCard>
      )}

      <Table
        isStriped
        className="mb-6"
        color="default"
        aria-label="Example static collection table"
        topContent={
          <div className="grid grid-cols-4 flex-col gap-4 mob:flex">
            <div className="col">
              <Input
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Candidate Id"
                placeholder="Candidate Id"
                className="rounded"
                value={filterData.candidateId}
                type="search"
                onChange={(e: { target: { value: any } }) =>
                  setFilterData({
                    ...filterData,
                    candidateId: e.target.value,
                  })
                }
                startContent={
                  <span className="material-symbols-outlined">
                    playlist_add
                  </span>
                }
              />
            </div>
            <div className="col">
              <Input
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Candidate Name"
                placeholder="Candidate Name"
                className="rounded"
                value={filterData.candidateName}
                type="search"
                onChange={(e: { target: { value: any } }) =>
                  setFilterData({
                    ...filterData,
                    candidateName: e.target.value,
                  })
                }
                startContent={
                  <span className="material-symbols-outlined">person</span>
                }
              />
            </div>
            <div className="col">
              <Input
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Email"
                placeholder="Email address"
                className="rounded"
                value={filterData.email}
                type="search"
                onChange={(e: { target: { value: any } }) =>
                  setFilterData({ ...filterData, email: e.target.value })
                }
                startContent={
                  <span className="material-symbols-outlined">email</span>
                }
              />
            </div>
            <div className="col">
              <Input
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Mobile Number"
                placeholder="Mobile Number"
                className="rounded"
                value={filterData.mobileNumber}
                type="search"
                onChange={(e: { target: { value: any } }) =>
                  setFilterData({ ...filterData, mobileNumber: e.target.value })
                }
                startContent={
                  <span className="material-symbols-outlined">phone</span>
                }
              />
            </div>
            {/* <div className="col">
              <Input
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Registration Number"
                placeholder="Registration Number"
                className="rounded"
                value={filterData.regNo}
                type="search"
                onChange={(e: { target: { value: any } }) =>
                  setFilterData({ ...filterData, regNo: e.target.value })
                }
                startContent={
                  <span className="material-symbols-outlined">
                    format_list_numbered_rtl
                  </span>
                }
              />
            </div> */}
            <div className="col">
              <Select
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Application Status"
                items={[
                  { value: "pending", name: "Pending" },
                  { value: "submitted", name: "Submitted" },
                  // {
                  //   value: "accepted",
                  //   name: "Accepted",
                  // },
                  // {
                  //   value: "rejected",
                  //   name: "Rejected",
                  // },
                ]}
                value={filterData.application_status}
                selectedKeys={[filterData.application_status]}
                onSelectionChange={(e: any) => {
                  setFilterData({
                    ...filterData,
                    application_status: Array.from(e)[0],
                  });
                }}
                placeholder="Status"
                startContent={
                  <span className="material-symbols-outlined">filter_list</span>
                }
              >
                {(option: any) => (
                  <SelectItem key={option?.value}>{option?.name}</SelectItem>
                )}
              </Select>
            </div>
            <div className="col">
              <Select
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Payment"
                items={[
                  { value: "Completed", name: "Completed" },
                  { value: "Pending", name: "Pending" },
                  { value: "Exempted", name: "Exempted" },
                ]}
                value={filterData.paymentStatus}
                selectedKeys={[filterData.paymentStatus]}
                onSelectionChange={(e: any) => {
                  setFilterData({
                    ...filterData,
                    paymentStatus: Array.from(e)[0],
                  });
                }}
                placeholder="Payment Status"
                startContent={
                  <span className="material-symbols-outlined">
                    currency_rupee_circle
                  </span>
                }
              >
                {(option: any) => (
                  <SelectItem key={option?.value}>{option?.name}</SelectItem>
                )}
              </Select>
            </div>
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  `v1/admin/downloadApplicationsExcel?advertisementId=${filterData?.advertisementId}&candidateId=${filterData?.candidateId}&candidateName=${filterData?.candidateName}&email=${filterData?.email}&mobileNumber=${filterData?.mobileNumber}&application_status=${filterData?.application_status}&paymentStatus=${filterData?.paymentStatus}`,
                  "Document verification",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/downloadApplicationsPdf?advertisementId=${filterData?.advertisementId}&candidateId=${filterData?.candidateId}&candidateName=${filterData?.candidateName}&email=${filterData?.email}&mobileNumber=${filterData?.mobileNumber}&application_status=${filterData?.application_status}&paymentStatus=${filterData?.paymentStatus}`,
                  "Document verification",
                  setLoader,
                );
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
            {/* <div className="col">
              <Select
                labelPlacement="outside"
                classNames={{ label: "text-md" }}
                label="State"
                items={stateList}
                value={filterData.state}
                selectedKeys={[filterData.state]}
                onSelectionChange={(e: any) => {
                  setFilterData({ ...filterData, state: Array.from(e)[0] });
                }}
                placeholder="Select State"
                startContent={
                  <span className="material-symbols-outlined">post_add</span>
                }
              >
                {(option: any) => (
                  <SelectItem key={option?.name}>{option?.name}</SelectItem>
                )}
              </Select>
            </div> */}
            {/* <div className="col">
              <Select
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Preference"
                items={[
                  { value: "1", name: "1" },
                  { value: "2", name: "2" },
                  { value: "3", name: "3" },
                  { value: "4", name: "4" },
                ]}
                value={filterData.preference}
                selectedKeys={[filterData.preference]}
                onSelectionChange={(e: any) => {
                  setFilterData({
                    ...filterData,
                    preference: Array.from(e)[0],
                  });
                }}
                placeholder="Select Preference"
                startContent={
                  <span className="material-symbols-outlined">post_add</span>
                }
              >
                {(option: any) => (
                  <SelectItem key={option?.value}>{option?.name}</SelectItem>
                )}
              </Select>
            </div> */}
            <FilterSearchBtn
              searchFunc={() => {
                if (page === 1) {
                  GetData(filterData, page);
                } else {
                  setPage(1);
                }
              }}
              clearFunc={clearFilter}
            />
          </div>
        }
        bottomContent={
          totalPage > 1 ? (
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
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

      <CandidateDetailsModal
        currentApplicationData={currentApplicationData}
        selectedItem={selectedItem}
        setViewModal={setViewModal}
        viewModal={viewModal}
        hideSportsDetails={true}
      />
    </>
  );
};

export default Applications;
