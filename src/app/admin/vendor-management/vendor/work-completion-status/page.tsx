"use client";
import {
  CallFindMasterByCode,
  CallGetAllVendorWorkCompletions,
  CallGetAllWorkScope,
  CallGetVendorByWorkScope,
  CallGetWorkScopeByAdvId,
  CallSaveUpdateVendorWorkCompletion,
  CallUserFindAllAdvertisement,
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
  Select,
  SelectItem,
  Textarea,
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
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import pdf from "@/assets/img/icons/common/pdf-icon.png";

type Props = {};

const WorkCompletionStatus = (props: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [loader, setLoader] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalType, setModalType] = useState<string>("");
  const [workScopeList, setWorkScopeList] = useState<any[]>([]);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    workScopeId: "",
    vendorId: "",
    stage: "",
    description: "",
    workOrderCompletionStatus: "",
    committeeReport: "",
  });
  const [courseList, setCourseList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [eventList, setEventList] = useState<any[]>([]);

  const columns = [
    { title: "Work Scope", key: "workScopeId" },
    { title: "Vendor name", key: "vendorId" },
    { title: "Stage", key: "stage" },
    { title: "Description", key: "description" },
    { title: "Status", key: "workOrderCompletionStatus" },
    { title: "Committee Report", key: "committeeReport" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, handleEdit: any) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "workScopeId":
          return cellValue?.workScopeTitle;
        case "vendorId":
          return cellValue?.vendorName;
        case "workOrderCompletionStatus":
          return (
            <Chip
              variant="flat"
              color={
                cellValue === "Complete"
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
        case "committeeReport":
          return (
            <Button
              variant="bordered"
              className="min-h-1 min-w-1 border-none p-0"
              onPress={() => {
                const link = document.createElement("a");
                link.href = cellValue;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Image
                src={pdf}
                style={{ height: "40px", width: "40px", objectFit: "contain" }}
                alt="pdf"
              />
            </Button>
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
                <DropdownItem key="edit" onPress={() => handleEdit(item)}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="send"
                  isReadOnly={item?.workOrderCompletionStatus !== "Complete"}
                >
                  Send ASR for Approval
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
    getCourseListData("showSkeleton");
  }, []);
  useEffect(() => {
    getWorkCompletionsList("showSkeleton");
  }, [page]);

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
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const getWorkScopeListData = async (loaderType: string, id: string) => {
    setLoader(loaderType);
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
    } finally {
      setLoader("");
    }
  };

  const getVendorByWorkScopeList = async (
    loaderType: string,
    workScopeId: string,
  ) => {
    setLoader(loaderType);
    try {
      let params = `status=Approved&workScopeId=${workScopeId}`;
      const { data, error } = (await CallGetVendorByWorkScope(params)) as any;
      console.log("CallGetVendorByWorkScope", data, error);

      if (data.statusCode === 200) {
        setVendorList(data?.data?.records);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };
  const handleWorkCompletionStatus = async (
    event: any,
    loaderType: string,
    vendorData: any,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      const formData = new FormData();
      console.log("vendorData::: ", vendorData);
      if (modalType !== "add") {
        formData.append("_id", vendorData?._id);
      }
      formData.append("courseId", courseId);
      formData.append("advertisementId", vendorData?.advertisementId);
      if (vendorData?.committeeReport) {
        formData.append("committeeReport", vendorData?.committeeReport);
      }
      formData.append("description", vendorData?.description);
      formData.append("stage", vendorData?.stage);
      formData.append("vendorId", vendorData?.vendorId);
      formData.append("workScopeId", vendorData?.workScopeId);
      formData.append(
        "workOrderCompletionStatus",
        vendorData?.workOrderCompletionStatus,
      );
      const { data, error } = (await CallSaveUpdateVendorWorkCompletion(
        formData,
      )) as any;
      console.log("CallSaveVendorDetail", data, error);

      if (data?.statusCode === 200) {
        toast.success(data.message);
        resetFormFields();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error("Error in handleCreateEligibility:", error);
    } finally {
      setLoader("");
    }
  };

  const getWorkCompletionsList = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      let params = `page=${page}&limit=10`;
      const { data, error } = (await CallGetAllVendorWorkCompletions(
        params,
      )) as any;
      console.log("CallGetAllVendorWorkCompletions", data, error);

      if (data.status === "Success") {
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

  const resetFormFields = () => {
    setFormData({
      workScopeId: "",
      vendorId: "",
      stage: "",
      description: "",
      workOrderCompletionStatus: "",
    });
    getWorkCompletionsList("");
    onClose();
  };
  const handleEdit = (rowData: any) => {
    setFormData({
      workScopeId: rowData?.workScopeId?._id,
      vendorId: rowData?.vendorId?._id,
      stage: rowData?.stage,
      description: rowData?.description,
      workOrderCompletionStatus: rowData?.workOrderCompletionStatus,
      _id: rowData?._id,
    });
    getVendorByWorkScopeList("WorkScope", rowData?.workScopeId?._id);
    onOpen();
    setModalType("edit");
  };
  return (
    <>
      <FlatCard
        heading="Work Completion Status"
        button
        ButtonLabel="Add Work Completion Status"
        onClick={() => {
          onOpen();
          setModalType("add");
        }}
      >
        <Table
          classNames={{
            wrapper: "p-0",
          }}
          shadow="none"
          color="default"
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
          <TableBody items={data} emptyContent="No data">
            {(item) => (
              <TableRow className="mob:text-nowrap" key={item._id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey, handleEdit)}
                  </TableCell>
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "edit" ? "Edit" : "Add"} Work Completion Status
              </ModalHeader>
              <ModalBody className="gap-5">
                <div className="grid grid-cols-1 gap-4">
                  <div className="">
                    <Select
                      label="Select Course"
                      labelPlacement="outside"
                      placeholder="Select"
                      items={courseList}
                      selectedKeys={[courseId]}
                      isDisabled={modalType === "edit"}
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
                      isDisabled={modalType === "edit"}
                      items={eventList}
                      isRequired
                      required
                      selectedKeys={[formData?.advertisementId]}
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setFormData({
                          ...formData,
                          advertisementId: value,
                        });
                        getWorkScopeListData("showSkeleton", value);
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
                      selectedKeys={[formData?.workScopeId]}
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setFormData({
                          ...formData,
                          workScopeId: value,
                          vendorId: "",
                        });
                        if (value) {
                          getVendorByWorkScopeList("WorkScope", value);
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
                      label="Select Vendor"
                      labelPlacement="outside"
                      placeholder="Select"
                      isRequired
                      items={vendorList}
                      isDisabled={modalType === "edit"}
                      isLoading={loader === "WorkScope"}
                      selectedKeys={[formData?.vendorId]}
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
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
                    <Select
                      label="Select stage"
                      labelPlacement="outside"
                      placeholder="Select stage"
                      selectedKeys={[formData?.stage]}
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setFormData({
                          ...formData,
                          stage: value,
                        });
                      }}
                      items={[
                        { key: "Phase 1", name: "Phase 1" },
                        { key: "Phase 2", name: "Phase 2" },
                        { key: "Phase 3", name: "Phase 3" },
                      ]}
                    >
                      {(item) => (
                        <SelectItem key={item.key}>{item.name}</SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="">
                    <Select
                      label="Select status"
                      labelPlacement="outside"
                      placeholder="Select status"
                      selectedKeys={[formData?.workOrderCompletionStatus]}
                      onSelectionChange={(e: any) => {
                        const value = Array.from(e)[0] as string;
                        setFormData({
                          ...formData,
                          workOrderCompletionStatus: value,
                        });
                      }}
                      items={[
                        { key: "Pending", name: "Pending" },
                        { key: "Complete", name: "Complete" },
                      ]}
                    >
                      {(item) => (
                        <SelectItem key={item.key}>{item.name}</SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="">
                    <Textarea
                      label="Description"
                      value={formData?.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      labelPlacement="outside"
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="">
                    <p className="text-sm">
                      Committee Review and Feedback Report
                    </p>
                    {formData?.committeeReport ? (
                      <Input
                        value={formData?.committeeReport?.name}
                        type="text"
                        readOnly
                        startContent={
                          <span className="material-symbols-rounded">
                            upload_file
                          </span>
                        }
                        endContent={
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
                        }
                      />
                    ) : (
                      <Input
                        value={formData?.committeeReport?.name}
                        onChange={(e: any) => {
                          setFormData({
                            ...formData,
                            committeeReport: e.target.files[0],
                          });
                        }}
                        type="file"
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
                <Button
                  color="primary"
                  isLoading={loader === "submit"}
                  onClick={(e) =>
                    handleWorkCompletionStatus(e, "submit", formData)
                  }
                  className="w-full"
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

export default WorkCompletionStatus;
