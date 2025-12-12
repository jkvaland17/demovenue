"use client";
import FlatCard from "@/components/FlatCard";
import {
  Accordion,
  AccordionItem,
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
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dynamicData from "@/assets/data/viewVendorApproval.json";
import moment from "moment";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import {
  CallFindMasterByCode,
  CallGetAllVendors,
  CallGetAllWorkScope,
  CallUpdateVendorStatus,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import toast from "react-hot-toast";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type Props = {};

const CreationApproval = (props: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isView,
    onOpen: onView,
    onOpenChange: onOpenView,
  } = useDisclosure();
  const [loader, setLoader] = useState<string>("");
  const [eventList, setEventList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [workScopeList, setWorkScopeList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    vendorId: "",
    remark: "",
  });
  const [loaderDownload, setLoaderDownload] = useState<any>({
    excel: false,
    pdf: false,
  });
  const [filterData, setFilterData] = useState({
    search: "",
    status: "",
    workScopeId: "",
  });
  const [advertisementId, setAdvertisementId] = useState<any>("");
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);

  const [data, setData] = useState<any[]>([]);

  const columns = [
    { title: "Work Scope", key: "workScopeId" },
    { title: "Vendor name", key: "vendorName" },
    { title: "GSTN", key: "gstnNumber" },
    { title: "PAN", key: "panNumber" },
    { title: "Authority Person Full name", key: "authorityPerson" },
    { title: "Status", key: "status" },
    { title: "Remark", key: "remark" },
    { title: "Actions", key: "actions" },
  ];

  useEffect(() => {
    getCourseListData("showSkeleton");
    getWorkScopeListData("");
  }, []);

  const getWorkScopeListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallGetAllWorkScope()) as any;
      console.log("CallGetAllWorkScope", data, error);

      if (data.statusCode === 200) {
        setWorkScopeList(data?.data?.records);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };
  const getCourseListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallFindMasterByCode()) as any;
      console.log("CallFindMasterByCode", data, error);

      if (data.message === "Success") {
        setCourseList(data?.data);
        if (data?.data?.length) {
          getEventListData("showSkeleton", data?.data[0]?._id);
          setCourseId(data?.data[0]?._id);
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
      console.log("CallUserFindAllAdvertisement", data, error);

      if (data?.message === "Success") {
        setEventList(data?.data);
        if (data?.data?.length) {
          setAdvertisementId(data?.data[0]?._id);
        }
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };
  const getAllVendors = async (loaderType: string, advertisementId: string) => {
    setLoader(loaderType);
    try {
      let params = `advertisementId=${advertisementId}&page=${page}&limit=10`;
      if (loaderType === "filter") {
        if (filterData.search) {
          params += `&search=${filterData.search}`;
        }
        if (filterData.workScopeId) {
          params += `&workScopeId=${filterData.workScopeId}`;
        }
        if (filterData.status) {
          params += `&status=${filterData.status}`;
        }
      }
      const { data, error } = (await CallGetAllVendors(params)) as any;
      console.log("CallGetAllVendors", data, error);

      if (data?.statusCode === 200) {
        setData(data?.data);
        setTotalPages(
          data?.totalRecord ? Math.ceil(data?.totalRecord / 10) : 0,
        );
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

    const getNestedValue = (path: any, obj: any) => {
      return path
        .split(".")
        .reduce((acc: any, key: any) => (acc ? acc[key] : "NA"), obj);
    };

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

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "authorityPerson":
        return cellValue?.fullName;
      case "workScopeId":
        return cellValue?.workScopeTitle;
      case "status":
        return (
          <Chip
            variant="flat"
            color={
              cellValue === "Approved"
                ? "success"
                : cellValue === "Rejected"
                  ? "danger"
                  : "primary"
            }
            classNames={{ content: "capitalize" }}
          >
            {cellValue}
          </Chip>
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
                  onView();
                  setAdvertisementId(item?.userId?.candidateId);
                }}
              >
                View
              </DropdownItem>
              <DropdownItem
                key="approval"
                onPress={() => {
                  setFormData({ remark: item?.remark, vendorId: item?._id });
                  onOpen();
                }}
              >
                Enter Approval
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const modalRenderCell = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "competitionCertificate":
        return (
          <Button
            size="sm"
            variant="light"
            className="text-sm font-medium text-green-700"
          >
            <span
              className="material-symbols-rounded"
              style={{ color: "rgb(100 116 139)" }}
            >
              draft
            </span>
            View
          </Button>
        );
      default:
        return cellValue;
    }
  };

  const modalRenderTable = (columns: any[], rows: any[]) => (
    <div className="overflow-x-scroll">
      <Table removeWrapper className="mb-6">
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{modalRenderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
  const handleApproval = async (status: string, vendorData: any) => {
    try {
      setLoader(status);
      const formData = { ...vendorData, status };
      console.log("formData::: ", formData);
      const { data, error } = (await CallUpdateVendorStatus(formData)) as any;
      console.log("CallSaveVendorDetail", data, error);

      if (data?.statusCode === 200) {
        toast.success(data.message);
        setFormData({
          vendorId: "",
          remark: "",
        });
        onClose();
        getAllVendors("showSkeleton", advertisementId);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader("");
    }
  };
  useEffect(() => {
    if (advertisementId) {
      getAllVendors("tableData", advertisementId);
    }
  }, [page]);

  useEffect(() => {
    if (advertisementId) {
      setPage(1);
      getAllVendors("tableData", advertisementId);
    }
  }, [advertisementId]);
  
  return (
    <>
      <FlatCard heading="Vendor Creation Approval">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
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

            <div>
              <Select
                className="text-nowrap"
                label="Select Event/Recruitment"
                labelPlacement="outside"
                placeholder="Select"
                items={eventList}
                isRequired
                required
                selectedKeys={[advertisementId]}
                onSelectionChange={(e: any) => {
                  const value = Array.from(e)[0] as string;
                  setAdvertisementId(value);
                }}
              >
                {(item) => (
                  <SelectItem key={item?._id} className="capitalize">
                    {`${item?.advertisementNumberInEnglish} (${item?.description})`}
                  </SelectItem>
                )}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Input
                type="text"
                label="Search"
                labelPlacement="outside"
                placeholder="Search"
                value={filterData.search}
                onChange={(e) =>
                  setFilterData({ ...filterData, search: e.target.value })
                }
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              />
            </div>

            <div>
              <Select
                label="Work Scope"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={[filterData.workScopeId]}
                onSelectionChange={(e) => {
                  const value = Array.from(e)[0] as string;
                  setFilterData({ ...filterData, workScopeId: value });
                }}
                items={workScopeList}
              >
                {(item) => (
                  <SelectItem key={item._id}>{item.workScopeTitle}</SelectItem>
                )}
              </Select>
            </div>

            <div>
              <Select
                label="Status"
                labelPlacement="outside"
                placeholder="Select"
                selectedKeys={[filterData.status]}
                onSelectionChange={(e) => {
                  const value = Array.from(e)[0] as string;
                  setFilterData({ ...filterData, status: value });
                }}
                items={[
                  { key: "", name: "All" },
                  { key: "Approved", name: "Approved" },
                  { key: "Pending", name: "Pending" },
                ]}
              >
                {(item) => <SelectItem key={item.key}>{item.name}</SelectItem>}
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  getAllVendors("filter", advertisementId);
                }}
                className="px-4"
              >
                <i className="fas fa-search" />
              </Button>
              <Button
                variant="bordered"
                size="sm"
                color="danger"
                onPress={() => {
                  getAllVendors("removeFilter", advertisementId);
                  setFilterData({
                    search: "",
                    status: "",
                    workScopeId: "",
                  });
                }}
                className="px-4"
              >
                <i className="fas fa-times text-red" />
              </Button>
            </div>
          </div>

          <div className="flex justify-start">
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  ``,
                  "Document verification",
                  setLoaderDownload,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  ``,
                  "Document verification",
                  setLoaderDownload,
                );
              }}
              excelLoader={loaderDownload?.excel}
              pdfLoader={loaderDownload?.pdf}
            />
          </div>
        </div>
      </FlatCard>
      <Table
        // removeWrapper
        // color="default"
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
          isLoading={loader === "tableData"}
          items={data}
          emptyContent="No data"
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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setFormData({
            vendorId: "",
            remark: "",
          });
          onClose();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-1">
                Are you sure to approve the vendor?
              </ModalHeader>
              <ModalBody>
                <Textarea
                  variant="bordered"
                  label="Enter remark"
                  value={formData?.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
                  }
                  labelPlacement="outside"
                  placeholder="Enter your remark"
                />
              </ModalBody>
              <ModalFooter>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Button
                    color="danger"
                    isLoading={loader === "Pending"}
                    isDisabled={!!loader}
                    onPress={() => handleApproval("Pending", formData)}
                  >
                    Keep it Awaited
                  </Button>
                  <Button
                    isLoading={loader === "Approved"}
                    isDisabled={!!loader}
                    onPress={() => handleApproval("Approved", formData)}
                    color="primary"
                  >
                    Approve
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isView}
        onOpenChange={onOpenView}
        placement="top"
        className="max-w-[100rem]"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">
                  Application number: <span>{advertisementId}</span>
                </h1>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-6">
                <Accordion className="rounded-lg" defaultExpandedKeys="all">
                  {currentApplicationData?.map((item: any, index: number) => (
                    <AccordionItem
                      key={index}
                      title={
                        <h5 className="text-xl font-semibold">{item?.title}</h5>
                      }
                    >
                      {item?.renderElement === "table" ? (
                        <div>{modalRenderTable(item?.columns, item?.rows)}</div>
                      ) : (
                        <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 mob:grid-cols-1">
                          {item?.data?.map((item: any, index: number) => (
                            <div className="grid grid-cols-2 gap-6" key={index}>
                              {/* Heading */}
                              <div className="flex">
                                <div>
                                  <span
                                    className="material-symbols-rounded me-2 align-bottom"
                                    style={{ color: "rgb(100 116 139)" }}
                                  >
                                    {item?.icon}
                                  </span>
                                </div>
                                <div className="font-semibold">
                                  {item?.title}
                                </div>
                              </div>
                              {item?.dataType === "document" &&
                              item?.value !== "NA" ? (
                                <Link href={item?.value} target="_blank">
                                  <Button
                                    variant="bordered"
                                    className="border py-6 font-medium"
                                  >
                                    <Image
                                      src={pdf}
                                      className="h-[30px] w-[30px] object-contain"
                                      alt="pdf"
                                    />
                                    Document
                                  </Button>
                                </Link>
                              ) : item?.dataType === "date" ? (
                                moment(item?.value).format("ll")
                              ) : (
                                <p className="font-medium">{item?.value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreationApproval;
