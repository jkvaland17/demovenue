"use client";
import {
  CallFindcandidateOtrDetailsStats,
  CallGetOtrCandidateDetail,
} from "@/_ServerActions";
import dynamicData from "@/assets/data/viewOTRModal.json";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import {
  Avatar,
  Button,
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
import moment from "moment";
import CandidateDetailsModal from "@/components/kushal-components/application-scrutiny/CandidateDetailsModal";
import { handleCommonErrors } from "@/Utils/HandleError";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type Props = {};

type FilterData = {
  candidateId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  category: string;
  admission: string;
  otrProcess: string;
};

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const OTR = (props: Props) => {
  const [allStats, setAllStats] = useState<any>({
    admission: [],
    category: [],
    gender: [],
  });
  const [isStatsData, setIsStatsData] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [advertisementList, setAdvertisementList] = useState<any[]>([]);
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);
  const [viewModal, setViewModal] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    candidateId: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    category: "",
    admission: "",
    otrProcess: "",
  });
  const [allData, setAllData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loader, setLoader] = useState<any>({ excel: false, pdf: false });

  const columns = [
    { title: "Sr. No", key: "srNo" },
    { title: "Candidate", key: "candidate" },
    { title: "Category", key: "category" },
    { title: "Candidate Id", key: "candidateId" },
    { title: "otrProcess", key: "otrProcess" },
    { title: "Date", key: "date" },
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
                  {item?.fullName}
                </p>
                <p className="mb-0 flex items-center gap-1 text-[0.85rem]">
                  <span className="material-symbols-outlined text-[1rem] text-blue-500">
                    mail
                  </span>
                  {item?.user?.email || ""}
                </p>

                <p className="flex items-center gap-1 text-[0.85rem]">
                  <span className="material-symbols-outlined text-[1rem] text-blue-500">
                    call
                  </span>
                  {item?.user?.mobileNumber || ""}
                </p>
              </div>
            </div>
          );

        case "category":
          return item?.reservationCategory;

        case "candidateId":
          return item?.user?.candidateId;

        case "postAppliedFor":
          return item?.postId?.name;

        case "otrProcess":
          return (
            <Chip
              color={otrProcessColorMap[item?.otrProcess]}
              variant="flat"
              radius="full"
              size="md"
            >
              {item?.otrProcess}
            </Chip>
          );

        case "date":
          return (
            <span className="text-nowrap">
              {moment(item?.user?.createdAt).format("ll")}
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
    GetData(filterData, page);
  }, [page]);

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
  const GetData = async (filterData: any, page: number): Promise<void> => {
    try {
      //object wise loop and stringfy
      setIsLoading(true);

      const queryString = buildQueryString(page, filterData);
      const { data, error } = (await CallGetOtrCandidateDetail(
        queryString,
      )) as any;

      if (error) {
        handleCommonErrors(error);
      } else if (data?.statusCode === 200) {
        setAllData(data?.data);
        setTotalPage(Math.ceil(data?.totalCount / 10));
        GetStatsData(filterData?.admission);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const parsedValue = (key: string) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^./, (str: string) => str.toUpperCase());
  };
  const GetStatsData = async (filter: string): Promise<void> => {
    try {
      const { data, error } = (await CallFindcandidateOtrDetailsStats(
        `admission=${filter ? filter : ""}`,
      )) as any;

      if (error) {
        handleCommonErrors(error);
      } else if (data?.statusCode === 200) {
        setIsStatsData(true);
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

  // const getCourseListData = async (loaderType: string) => {
  //   setLoader(loaderType);
  //   try {
  //     const { data, error } = (await CallFindMasterByCode()) as any;
  //     console.log("CallFindMasterByCode", data, error);

  //     if (data.message === "Success") {
  //       setCourseList(data?.data);
  //       if (data?.data?.length) {
  //         getEventListData("showSkeleton", data?.data[0]?._id);
  //         setCourseId(data?.data[0]?._id);
  //       }
  //     }
  //     if (error) console.error(error);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoader("");
  //   }
  // };

  // const getEventListData = async (loaderType: string, courseId: string) => {
  //   setLoader(loaderType);
  //   try {
  //     const { data, error } = (await CallUserFindAllAdvertisement(
  //       `parentMasterId=${courseId}`,
  //     )) as any;
  //     console.log("CallUserFindAllAdvertisement", data, error);

  //     if (data?.message === "Success") {
  //       setAdvertisementList(data?.data);
  //     }
  //     if (error) console.error(error);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoader("");
  //   }
  // };

  const otrProcessColorMap: { [key: string]: ChipColor } = {
    STARTED: "warning",
    COMPLETED: "success",
  };

  const clearFilter = () => {
    setFilterData({
      candidateId: "",
      fullName: "",
      email: "",
      mobileNumber: "",
      gender: "",
      category: "",
      admission: "",
      otrProcess: "",
    });
    if (page === 1) {
      GetData(
        {
          candidateId: "",
          fullName: "",
          email: "",
          mobileNumber: "",
          gender: "",
          category: "",
          admission: "",
          otrProcess: "",
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
        <h2 className="text-xl font-semibold">OTR Dashboard</h2>
        {/* <ExcelPdfDownload excelFunction={() => {}} pdfFunction={() => {}} /> */}
      </div>

      {/* <FlatCard>
        <div className="grid grid-cols-2 gap-4">
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
                setCourseId(value);
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
              selectedKeys={[filterData?.advertisement_noId]}
              onSelectionChange={(e: any) => {
                const value = Array.from(e)[0] as string;
                setFilterData({ ...filterData, advertisement_noId: value });
              }}
            >
              {(item) => (
                <SelectItem key={item?._id} className="capitalize">
                  {`${item?.advertisementNumberInEnglish} (${item?.titleInEnglish})`}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
      </FlatCard> */}

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
              <h2 className="mb-3 mt-6 text-xl font-semibold">Gender</h2>
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
        </FlatCard>
      )}

      <Table
        isStriped
        className="mb-6"
        color="default"
        aria-label="Example static collection table"
        topContent={
          <div className="grid grid-cols-3 flex-col gap-4 mob:flex">
            <div className="">
              <Input
                label="Candidate ID"
                value={filterData?.candidateId}
                onChange={(e) => {
                  setFilterData({ ...filterData, candidateId: e.target.value });
                }}
                labelPlacement="outside"
                placeholder="Enter candidate ID"
                endContent={
                  <span className="material-symbols-rounded">badge</span>
                }
              />
            </div>
            <div className="">
              <Input
                label="Candidate Name"
                value={filterData?.fullName}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    fullName: e.target.value,
                  });
                }}
                labelPlacement="outside"
                placeholder="Enter candidate name"
                endContent={
                  <span className="material-symbols-rounded">person</span>
                }
              />
            </div>
            <div className="">
              <Input
                label="Email"
                value={filterData?.email}
                onChange={(e) => {
                  setFilterData({ ...filterData, email: e.target.value });
                }}
                labelPlacement="outside"
                placeholder="Enter email"
                endContent={
                  <span className="material-symbols-rounded">mail</span>
                }
              />
            </div>
            <div className="">
              <Input
                label="Mobile Number"
                value={filterData?.mobileNumber}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    mobileNumber: e.target.value,
                  });
                }}
                labelPlacement="outside"
                placeholder="Enter mobileNumber"
                endContent={
                  <span className="material-symbols-rounded">call</span>
                }
              />
            </div>
            <div className="col">
              <Select
                labelPlacement="outside"
                classNames={{ label: "text-md mt-1" }}
                label="Application Status"
                items={[
                  { value: "Pending", name: "Pending" },
                  { value: "COMPLETED", name: "Completed" },
                ]}
                selectedKeys={[filterData.otrProcess]}
                onSelectionChange={(e: any) => {
                  const value = Array.from(e)[0] as string;
                  setFilterData({
                    ...filterData,
                    otrProcess: value,
                  });
                }}
                placeholder="status"
                startContent={
                  <span className="material-symbols-outlined">filter_list</span>
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
                  `v1/admin/downloadCandidateOtrExcel?candidateId=${filterData?.candidateId}&fullName=${filterData?.fullName}&email=${filterData?.email}&mobileNumber=${filterData?.mobileNumber}&otrProcess=${filterData?.otrProcess}`,
                  "Document verification",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/downloadCandidateOtrPdf?candidateId=${filterData?.candidateId}&fullName=${filterData?.fullName}&email=${filterData?.email}&mobileNumber=${filterData?.mobileNumber}&otrProcess=${filterData?.otrProcess}`,
                  "Document verification",
                  setLoader,
                );
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
            <FilterSearchBtn
              clearFunc={clearFilter}
              searchFunc={() => {
                if (page === 1) {
                  GetData(filterData, page);
                } else {
                  setPage(1);
                }
              }}
            />
          </div>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination
              showShadow
              color="primary"
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

export default OTR;
