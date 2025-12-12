"use client";
import {
  CallCreateRole,
  CallGetAllRoles,
  CallUpdateRole,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import VenueRoleResource from "@/components/VenueRoleResource";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
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
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Resource {
  resource: string;
  actions: string[];
}
type Props = {};

const Role = (props: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUpload,
  } = useDisclosure();
  const [modalType, setModalType] = useState("add");
  const [upload, setUpload] = useState<any>([]);
  const { control, handleSubmit, setValue, register, reset } = useForm();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExcelUploading, setIsExcelUploading] = useState<boolean>(false);
  const [isExcelDownloading, setIsExcelDownloading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Role data
  const [currentRole, setCurrentRole] = useState<any>();
  const [roleName, setRoleName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [status, setStatus] = useState<boolean>(true);
  const [authority, setAuthority] = useState<string | null>("");
  const [errors, setErrors] = useState<any>({
    roleError: false,
    departmentError: false,
  });
  const [loader, setLoader] = useState<any>({
    table: false,
    excel: false,
  });
  const { currentAdvertisementID } = useAdvertisement();
  const [filterData, setFitlerData] = useState<any>({
    search: "",
  });

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };

  const departments = [
    { key: "Police", label: "Police" },
    { key: "Private", label: "Private" },
    { key: "Government", label: "Government" },
  ];
  const resourceOptions = [
    { key: "treasury verification", label: "Treasury Verification" },
    { key: "center verification", label: "Center Verification" },
  ];
  const columns = [
    { title: "Title", key: "title" },
    { title: "Department", key: "department" },
    // { title: "Status", key: "status" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "status":
        return (
          <Chip color={cellValue ? "success" : "danger"} variant="flat">
            {cellValue ? "Active" : "Inactive"}
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
                key="edit"
                onPress={() => {
                  setCurrentRole(item);
                  setFormValues(item?.title, item?.department, item?.resources);
                  setModalType("edit");
                  onOpen();
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem key="delete" color="danger" className="text-danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <p className="capitalize">{cellValue}</p>;
    }
  }, []);

  const getAllRoles = async (filter: boolean) => {
    setIsLoading(true);
    try {
      const filterON = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10&search=${filterData?.search}`;
      const filterOFF = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10&search=${filterData?.search}`;
      const { data, error } = (await CallGetAllRoles(filter ? filterON : filterOFF)) as any;
      console.log("getAllRoles", { data, error });

      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getAllRoles(false);
  }, [page,currentAdvertisementID]);

  const addNewResource = () => {
    setResources([...resources, { resource: "", actions: [] }]);
  };
  const updateResource = (
    index: number,
    key: keyof Resource,
    value: string | string[],
  ) => {
    setResources((prevResources) =>
      prevResources.map((res, i) =>
        i === index
          ? {
              ...res,
              [key]:
                key === "actions"
                  ? Array.isArray(value)
                    ? value
                    : [value]
                  : (value as string),
            }
          : res,
      ),
    );
  };
  const removeResource = (index: number) => {
    setResources((prevResources) =>
      prevResources.filter((_, i) => i !== index),
    );
  };

  const handleRoleSubmit = () => {
    setErrors({ ...errors, roleError: false, departmentError: false });

    if (roleName) {
      if (department) {
        const payload = {
          title: roleName,
          department: department,
          resources: resources.filter((r) => r.resource),
          status: status,
          authority: authority,
        };
        modalType === "add" ? createRole(payload) : updateRole(payload);
      } else {
        setErrors({ ...errors, departmentError: true });
      }
    } else {
      setErrors({ ...errors, roleError: true });
    }
  };

  const createRole = async (roleData: any) => {
    setIsSubmitting(true);
    try {
      console.log("submitData", roleData);
      const { data, error } = (await CallCreateRole(roleData)) as any;
      console.log("createRole", { data, error });

      if (data?.message) {
        toast.success(data?.message);
        onClose();
        getAllRoles(false);
        setResources([]);
        setRoleName("");
        setDepartment("");
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };
  const updateRole = async (roleData: any) => {
    setIsSubmitting(true);
    const submitData = {
      ...roleData,
      id: currentRole?._id,
    };
    console.log("submitData", submitData);
    try {
      const { data, error } = (await CallUpdateRole(submitData)) as any;
      console.log("createRole", { data, error });

      if (data?.message) {
        toast.success(data?.message);
        onClose();
        getAllRoles(false);
        setResources([]);
        setRoleName("");
        setDepartment("");
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  // disable add resource button if all resources are selected
  const selectedKeys = resources.map((res) => res.resource);
  const availableResourceOptions = resourceOptions.filter(
    (opt) => !selectedKeys.includes(opt.key),
  );

  const downloadExcel = (fileUrl: string) => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "final_result.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downlaodRoleExcel = async () => {
    setIsExcelDownloading(true);
    // try {
    //   const { data, error } = (await CallDownloadZoneExcel()) as any;
    //   console.log("downlaodRoleExcel", { data, error });

    //   if (data?.fileUrl) {
    //     downloadExcel(data?.fileUrl);
    //   }
    //   if (error) {
    //     handleCommonErrors(error);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    setIsExcelDownloading(false);
  };

  const setFormValues = (role?: string, department?: string, res?: any[]) => {
    setRoleName(role || "");
    setDepartment(department || "");
    setResources(res || []);
  };

      const clearFilter = () => {
    setFitlerData({
      search: "",
    });
    getAllRoles(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Role Listing</h2>
        <div className="flex gap-2">
          {/* <Button
            color="success"
            variant="shadow"
            className="text-white"
            onPress={onUpload}
            startContent={
              <span className="material-symbols-rounded">upload</span>
            }
          >
            Upload Excel
          </Button>
          <Button
            onPress={downlaodRoleExcel}
            isLoading={isExcelDownloading}
            color="secondary"
            variant="shadow"
            startContent={
              !isExcelDownloading && (
                <span className="material-symbols-rounded">download</span>
              )
            }
          >
            Download Excel Template
          </Button> */}
          <Button
            color="primary"
            variant="shadow"
            onPress={() => {
              setFormValues();
              setModalType("add");
              onOpen();
            }}
            startContent={<span className="material-symbols-rounded">add</span>}
          >
            Add New Role
          </Button>
        </div>
      </div>

      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        topContent={
          <>
            <div className="grid grid-cols-4 flex-col items-end gap-4 mob:flex mob:items-stretch">
              <Input
                placeholder="Search"
                value={filterData?.search}
                onChange={(e) => {
                  setFitlerData((prev: any) => ({
                    ...prev,
                    search: e.target.value,
                  }));
                }}
                startContent={
                  <span className="material-symbols-rounded text-lg text-gray-500">
                    search
                  </span>
                }
              />
              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/role/downloadAdminRolesExcel`,
                    "Role",
                    setLoader,
                  );
                }}
                pdfFunction={() => {
                  DownloadKushalPdf(
                    `v1/role/downloadAdminRolesPdf`,
                    "Role",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
                pdfLoader={loader?.pdf}
              />
              <FilterSearchBtn
                col="col-start-4 mob:col-start-2"
                searchFunc={() => {getAllRoles(true)}}
                clearFunc={clearFilter}
              />
            </div>
          </>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination
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
              className="text-wrap"
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
          {(item: any) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "add" ? "Add Role" : "Edit Role"}
              </ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  label="Role Name"
                  labelPlacement="outside"
                  placeholder="Enter role name"
                  defaultValue={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  isInvalid={errors?.roleError}
                  errorMessage="Please enter role name"
                  isRequired
                />

                <Select
                  items={departments}
                  defaultSelectedKeys={[department]}
                  onChange={(e) => setDepartment(e.target.value)}
                  isInvalid={errors?.departmentError}
                  label="Department"
                  labelPlacement="outside"
                  placeholder="Select"
                  errorMessage="Please select department"
                  isRequired
                >
                  {(item: any) => (
                    <SelectItem key={item?.key}>{item?.label}</SelectItem>
                  )}
                </Select>

                {resources.map((item, index) => (
                  <VenueRoleResource
                    key={index}
                    index={index}
                    resource={item}
                    resources={resources}
                    resourceOptions={resourceOptions}
                    updateResource={updateResource}
                    removeResource={removeResource}
                  />
                ))}

                <Button
                  color="secondary"
                  className="w-fit"
                  startContent={
                    <span className="material-symbols-rounded">add</span>
                  }
                  onPress={addNewResource}
                  isDisabled={availableResourceOptions.length === 0}
                >
                  Add New Resource
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={handleRoleSubmit}
                  className="w-full"
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isUpload} onOpenChange={onOpenUpload} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Import Data
              </ModalHeader>
              <ModalBody>
                {/* <div className="flex justify-end">
                  <Button
                    color="secondary"
                    size="sm"
                    startContent={
                      <span className="material-symbols-rounded">download</span>
                    }
                  >
                    Download Sample File
                  </Button>
                </div> */}
                <CustomMultipleUpload
                  {...register("file")}
                  title=""
                  preview={upload}
                  setPreview={setUpload}
                  handleChange={handleChangeST}
                  setValue={setValue}
                  accept={".xlsx"}
                  name="Attachments"
                  placeholder="Upload Excel"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isExcelUploading}
                  // onPress={downlaodCenterExcel}
                  color="primary"
                  className="w-full"
                  startContent={
                    <span className="material-symbols-rounded">upload</span>
                  }
                >
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Role;
