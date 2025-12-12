"use client";
import {
  CallCreateAllOfficer,
  CallGetAllOfficer,
  CallGetModuleList,
  CallGetUserDetails,
  CallUpdateAllOfficer,
} from "@/_ServerActions";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
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
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const SectionOfficer = (props: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isModuleOpen,
    onOpen: onModuleOpen,
    onOpenChange: onModuleOpenChange,
    onClose: onModuleClose,
  } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [filterData, setFilterData] = useState<any>({
    searchValue: "",
    module: "",
  });
  const [officerData, setOfficerData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ userId: "", moduleIds: [] });
  const [userData, setUserData] = useState([]);
  const [modulesData, setModulesData] = useState([]);
  const [selectedModules, setSelectedModules] = useState<any[]>([]);
  const [updateid, setUpdateId] = useState("");
  const [loader, setLoader] = useState<any>({ excel: false, pdf: false });
  // console.log("formData", formData);
  // console.log("modulesData", modulesData);
  // console.log("modalType", modalType);
  // console.log("isOpen", isOpen);

  const columns = [
    { title: "Sr. No", key: "srNo" },
    { title: "Name", key: "name" },
    { title: "Mobile no.", key: "mobile" },
    { title: "Email", key: "email" },
    { title: "Modules", key: "modules" },
    { title: "Actions", key: "actions" },
  ];

  useEffect(() => {
    if (isOpen == false) {
      setFormData({ userId: "", moduleIds: [] });
    }
  }, [isOpen]);

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, pageNo: number, index: number) => {
      const cellValue = item[columnKey as any];
      const srNo = (pageNo - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "srNo":
          return srNo < 10 ? `0${srNo}` : srNo;
        case "name":
          return <p>{item?.userData?.name}</p>;
        case "mobile":
          return <p>{item?.userData?.phone}</p>;
        case "email":
          return <p>{item?.userData?.email}</p>;
        case "modules":
          return (
            <Chip
              className="cursor-pointer rounded-full bg-green-300 px-4 py-1 font-bold transition-all hover:bg-green-200"
              onClick={() => {
                onModuleOpen();
                setSelectedModules(item?.dashboardModules || []);
              }}
            >
              View
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
                    setModalType("view");
                    onOpen();
                    setFormData({
                      userId: item?.userId || "",
                      moduleIds:
                        item?.dashboardModules?.map(
                          (module: { key: any }) => module.key,
                        ) || [],
                    });
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    setModalType("edit");
                    onOpen();
                    setUpdateId(item?._id);
                    setFormData({
                      userId: item?.userId || "",
                      moduleIds:
                        item?.dashboardModules?.map(
                          (module: { key: any }) => module.key,
                        ) || [],
                    });
                  }}
                  key="edit"
                >
                  Edit
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

  const clearFilter = () => {
    setFilterData({
      searchValue: "",
      module: "",
    });
  };

  const getAllSectionOfficers = async () => {
    try {
      setTableLoading(true);
      let params = `page=${page}&limit=10&isDecending=`;
      if (filterData?.searchValue) {
        params += `&search=${filterData?.searchValue}`;
      }
      if (filterData?.module) {
        params += `&module=${filterData?.module}`;
      }
      const { data, error } = (await CallGetAllOfficer(params)) as any;
      console.log("CallGetAllOfficer", data, error);
      if (data) {
        setOfficerData(data?.permissionOfficer);
        setTotalPage(data?.totalPages);
        setPage(data?.currentPage);
        setTableLoading(false);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUserList = async () => {
    try {
      const { data, error } = (await CallGetUserDetails()) as any;
      // console.log("CallGetUserDetails", data, error);
      if (data) {
        setUserData(data?.data?.userdetails);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllModulesList = async () => {
    try {
      setTableLoading(true);
      const { data, error } = (await CallGetModuleList()) as any;
      // console.log("CallGetModuleList", data, error);
      if (data) {
        setModulesData(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitSectionOfficers = async () => {
    try {
      setIsSubmitting(true);
      const { data, error } = (await CallCreateAllOfficer(formData)) as any;
      console.log("CallCreateAllOfficer", { data, error });
      if (data?.status_code === 200) {
        toast.success(data.message);
        setIsSubmitting(false);
        setFormData({
          userId: "",
          moduleIds: [],
        });
        onClose();
        getAllSectionOfficers();
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSectionOfficers = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        id: updateid,
      };
      console.log("payload", payload);
      const { data, error } = (await CallUpdateAllOfficer(formData)) as any;
      console.log("CallUpdateAllOfficer", { data, error });
      if (data?.status_code === 200) {
        toast.success(data.message);
        setIsSubmitting(false);
        setFormData({
          userId: "",
          moduleIds: [],
        });
        onClose();
        getAllSectionOfficers();
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModulesChange = (selectedKeys: any) => {
    setFormData((prev) => ({
      ...prev,
      moduleIds: Array.from(selectedKeys),
    }));
  };

  useEffect(() => {
    getAllSectionOfficers();
    getAllUserList();
    getAllModulesList();
  }, []);

  useEffect(() => {
    if (filterData?.search) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        getAllSectionOfficers();
        timeoutRef.current = null;
      }, 400);
    } else {
      getAllSectionOfficers();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filterData?.searchValue, page]);

  return (
    <>
      <Table
        isStriped
        topContent={
          <>
            <div className="flex flex-row justify-between gap-2 mob:flex-col">
              <h2 className="text-xl font-semibold">
                Section Officer Account Management
              </h2>
              <Button
                onPress={() => {
                  setModalType("add");
                  onOpen();
                }}
                color="primary"
                variant="shadow"
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "white" }}
                >
                  add
                </span>
                Add a Section Officer
              </Button>
            </div>
            <div className="grid grid-cols-3 items-end gap-4 mob:grid-cols-1">
              <Input
                type="text"
                label="Search"
                labelPlacement="outside"
                placeholder="Search by name, email or mobile no."
                value={filterData?.searchValue}
                onChange={(e) => {
                  setFilterData((prev: any) => ({
                    ...prev,
                    searchValue: e.target.value,
                  }));
                  setPage(1);
                }}
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              />
<ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(``, "Document verification", setLoader);
              }}
              pdfFunction={() => {
                DownloadKushalPdf(``, "Document verification", setLoader);
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
              {/* <Select
                items={modulesData}
                label="Modules"
                labelPlacement="outside"
                placeholder="Select"
                onChange={(e) => {
                  setFilterData((prev: any) => ({
                    ...prev,
                    module: e.target.value,
                  }));
                }}
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.title}</SelectItem>
                )}
              </Select> */}

              {/* <FilterSearchBtn
                searchFunc={getAllSectionOfficers}
                clearFunc={clearFilter}
              /> */}
            </div>
          </>
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
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={officerData}
          emptyContent="No data"
          isLoading={tableLoading}
          loadingContent={<Spinner />}
        >
          {officerData?.map((item: any, index: number) => (
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add"
                  ? "Add a Section Officer"
                  : modalType === "view"
                    ? "View a Section Officer"
                    : modalType === "edit"
                      ? "Edit Section Officer details"
                      : modalType === "password"
                        ? "Reset Password"
                        : ""}
              </ModalHeader>
              <ModalBody className="gap-6">
                <>
                  <Select
                    items={userData ?? []}
                    isDisabled={modalType === "view"}
                    label="User"
                    labelPlacement="outside"
                    selectedKeys={[formData?.userId]}
                    placeholder="Select"
                    errorMessage={"You must select a course."}
                    onChange={(e) => {
                      setFormData({ ...formData, userId: e.target.value });
                    }}
                  >
                    {(item: any) => (
                      <SelectItem key={item?._id}>{item?.name}</SelectItem>
                    )}
                  </Select>
                  <Select
                    items={modulesData}
                    isDisabled={modalType === "view"}
                    label="Modules"
                    labelPlacement="outside"
                    placeholder="Select"
                    selectionMode="multiple"
                    selectedKeys={new Set(formData.moduleIds)}
                    onSelectionChange={handleModulesChange}
                    classNames={{
                      trigger: "h-fit py-2",
                      label: "top-[20px]",
                    }}
                    renderValue={(items: any) => (
                      <div className="flex flex-wrap gap-2">
                        {items?.map((item: any) => (
                          <Chip variant="flat" key={item?.key}>
                            {item?.data?.title}
                          </Chip>
                        ))}
                      </div>
                    )}
                  >
                    {(item: any) => (
                      <SelectItem key={item.key} textValue={item.title}>
                        {item.title}
                      </SelectItem>
                    )}
                  </Select>
                </>
              </ModalBody>
              <ModalFooter>
                {modalType === "add" ? (
                  <Button
                    color="primary"
                    className="w-full"
                    onPress={() => {
                      submitSectionOfficers();
                    }}
                    isLoading={isSubmitting}
                  >
                    Add section officer
                  </Button>
                ) : modalType === "edit" ? (
                  <Button
                    color="primary"
                    className="w-full"
                    isLoading={isSubmitting}
                    onPress={() => {
                      updateSectionOfficers();
                    }}
                  >
                    Update
                  </Button>
                ) : (
                  ""
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* view modules */}
      <Modal isOpen={isModuleOpen} onOpenChange={onModuleOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                View Module
              </ModalHeader>
              <ModalBody className="gap-6">
                <>
                  {selectedModules?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedModules.map((mod, idx) => (
                        <Chip key={idx} variant="flat">
                          {`${idx + 1}. ${mod.title}`}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <p>No modules assigned.</p>
                  )}
                </>
              </ModalBody>
              <ModalFooter>
                {/* <Button onPress={onModuleClose} color="danger">
                  Cancel
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SectionOfficer;
