"use client";
import {
  CallFindMasterByCode,
  CallGetAllVendors,
  CallGetAllWorkScope,
  CallUserFindAllAdvertisement,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
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
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";

type Props = {};

const VendorTable = (props: Props) => {
  const [loader, setLoader] = useState<string>("");
  const [eventList, setEventList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [workScopeList, setWorkScopeList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [advertisementId, setAdvertisementId] = useState<any>("");
  const [document, setDocument] = useState("");
  const [workScopeId, setWorkScopeId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const columns = [
    { title: "Work Scope", key: "workScopeId" },
    { title: "Vendor name", key: "vendorName" },
    { title: "Date of Signing MOU", key: "vendorAgreements" },
    { title: "Date of Work Order Release", key: "workOrders" },
    { title: "Date of Government Approval", key: "governmentApproval" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    console.log("item::: ", item);
    console.log("columnKey::: ", columnKey);
    console.log("cellValue::: ", cellValue);
    console.log(
      "cellValue::: ",
      cellValue?.length > 0 ? cellValue[0]?.dateOfGovernmentApproval : "",
    );
    switch (columnKey) {
      case "workScopeId":
        return cellValue?.workScopeTitle;
      case "vendorAgreements":
        return cellValue?.length > 0
          ? cellValue[0]?.dateOfMou
            ? moment(cellValue[0]?.dateOfMou).format("ll")
            : "N/A"
          : "-";
      case "workOrders":
        return cellValue?.length > 0
          ? cellValue[0]?.dateOfWorkReleased
            ? moment(cellValue[0]?.dateOfWorkReleased).format("ll")
            : "N/A"
          : "-";
      case "governmentApproval":
        return item?.vendorAgreements?.length > 0
          ? item?.vendorAgreements[0]?.dateOfGovernmentApproval
            ? moment(
                item?.vendorAgreements[0]?.dateOfGovernmentApproval,
              ).format("ll")
            : "N/A"
          : "-";
      case "actions":
        return (
          // <Dropdown placement="bottom-end">
          //   <DropdownTrigger>
          //     <Button className="more_btn rounded-full px-0" disableRipple>
          //       <span className="material-symbols-rounded">more_vert</span>
          //     </Button>
          //   </DropdownTrigger>
          //   <DropdownMenu aria-label="Static Actions">
          //     <DropdownItem
          //       key="mou"
          //       onPress={() => {
          //         setDocument(item?.vendorAgreements[0]?.uploadSignMou);
          //         onOpen();
          //       }}
          //     >
          //       View MOU
          //     </DropdownItem>
          //     <DropdownItem
          //       key="work"
          //       onPress={() => {
          //         setDocument(item?.workOrders[0]?.uploadWorkOrder);
          //         onOpen();
          //       }}
          //     >
          //       View Work Order
          //     </DropdownItem>
          //   </DropdownMenu>
          // </Dropdown>
          <div className="flex gap-2">
            {item?.vendorAgreements[0]?.uploadSignMou && (
              <Tooltip content="View MOU">
                <Image
                  onClick={() => {
                    setDocument(item?.vendorAgreements[0]?.uploadSignMou);
                    onOpen();
                  }}
                  src={pdf}
                  style={{
                    height: "25px",
                    width: "25px",
                    objectFit: "contain",
                  }}
                  alt="pdf"
                  className="cursor-pointer"
                />
              </Tooltip>
            )}

            {item?.workOrders[0]?.uploadWorkOrder && (
              <Tooltip content="View Work Order">
                <Image
                  onClick={() => {
                    setDocument(item?.workOrders[0]?.uploadWorkOrder);
                    onOpen();
                  }}
                  src={pdf}
                  style={{
                    height: "25px",
                    width: "25px",
                    objectFit: "contain",
                  }}
                  alt="pdf"
                  className="cursor-pointer"
                />
              </Tooltip>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  useEffect(() => {
    getCourseListData("showSkeleton");
    getWorkScopeListData("");
  }, []);
  useEffect(() => {
    if (advertisementId) {
      getAllVendors("tableData", advertisementId);
    }
  }, [workScopeId, page]);

  useEffect(() => {
    if (advertisementId) {
      getAllVendors("tableData", advertisementId);
    }
  }, [advertisementId]);
  
  const getWorkScopeListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallGetAllWorkScope()) as any;
      console.log("CallGetAllWorkScope", data, error);

      if (data.statusCode === 200) {
        setWorkScopeList([
          { workScopeTitle: "All", _id: "" },
          ...data?.data?.records,
        ]);
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
      let params = `status=Approved&advertisementId=${advertisementId}`;
      if (workScopeId) {
        params += `&workScopeId=${workScopeId}`;
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

  return (
    <>
      <FlatCard heading="Vendor Table">
        <div className="grid grid-cols-1 items-end gap-4">
          <div className="col-span-2">
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
          <div className="col-span-2">
            <Select
              className="text-nowrap"
              label="Select Event/Recruitment"
              labelPlacement="outside"
              placeholder="Select"
              items={eventList}
              isRequired
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
          <div className="col-span-4 md:col-span-2">
            <Select
              label="Work Scope"
              labelPlacement="outside"
              placeholder="Select"
              selectedKeys={[workScopeId]}
              onSelectionChange={(e) => {
                const value = Array.from(e)[0] as string;
                setWorkScopeId(value);
              }}
              items={workScopeList}
            >
              {(item) => (
                <SelectItem key={item._id}>{item.workScopeTitle}</SelectItem>
              )}
            </Select>
          </div>
        </div>
      </FlatCard>
      <Table
        isStriped
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
        className="z-50"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Document
              </ModalHeader>
              <ModalBody>
                <div>
                  <iframe src={document} width="100%" height="450px"></iframe>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    onClose();
                  }}
                  color="danger"
                >
                  close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default VendorTable;
