"use client";

import {
  CallAddOtherWork,
  CallOtherWorkList,
  CallUpdateOtherWork,
  // CallWorkOrderDelete,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import Image from "next/image";
import moment from "moment";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

type WorkOrder = {
  _id: string;
  title: string;
  templateFile: string;
  createdAt: string;
  action: any;
  version: string;
};
type FormState = {
  mouTitle: string;
  otherTemplateFile: File | string | any;
  isEdit: boolean;
  version: string;
};

type Column = {
  title: string;
  key: keyof TableRowData;
};

interface TableRowData extends WorkOrder {
  srNo: number;
}

const MOUTemplate = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenFile,
    onOpen: onOpenFile,
    onClose: onCloseFile,
    onOpenChange: onOpenChangeFile,
  } = useDisclosure();

  const [loader, setLoader] = useState<string>("");
  const [workOrderList, setWorkOrderList] = useState<WorkOrder[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [formData, setFormData] = useState<FormState>({
    mouTitle: "",
    otherTemplateFile: "",
    isEdit: false,
    version: "",
  });
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(
    null,
  );
  const [workOrderListFileLink, setWorkOrderListFileLink] =
    useState<string>("");

  const columns: Column[] = [
    { title: "Sr. No.", key: "srNo" },
    { title: "Work Order Title", key: "title" },
    { title: "Work Order File", key: "templateFile" },
    { title: "Version", key: "version" },
    { title: "Work Order created date", key: "createdAt" },
    { title: "Action", key: "action" },
  ];

  const renderCell = (item: TableRowData, columnKey: keyof TableRowData) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "createdAt":
        return cellValue ? moment(cellValue).format("ll") : " -- ";
      case "templateFile":
        return (
          <Button
            variant="bordered"
            className="min-h-1 min-w-1 border-none p-0"
            onPress={() => {
              setWorkOrderListFileLink(cellValue as string);
              onOpenFile();
            }}
          >
            <Image
              src={pdf}
              style={{ height: "40px", width: "40px", objectFit: "contain" }}
              alt="pdf"
            />
          </Button>
        );
      case "action":
        return (
          <>
            <Dropdown
              classNames={{ content: "min-w-[150px]" }}
              placement="bottom-end"
            >
              <DropdownTrigger>
                <Button className="more_btn rounded-full px-0" disableRipple>
                  <span className="material-symbols-rounded">more_vert</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="mou"
                  onPress={() => {
                    setSelectedWorkOrderId(item?._id);
                    setFormData({
                      mouTitle: item?.title,
                      otherTemplateFile: item?.templateFile,
                      isEdit: true,
                      version: item?.version,
                    });
                    onOpen();
                  }}
                  startContent={
                    <span className="material-symbols-outlined">box_edit</span>
                  }
                  color="default"
                  variant="flat"
                >
                  Edit
                </DropdownItem>
                {/* <DropdownItem
                  color="danger"
                  variant="flat"
                  key="work"
                  onClick={() => {
                    setSelectedWorkOrderId(item?._id);
                    setShowDeleteModal(true);
                  }}
                  startContent={
                    <span className="material-symbols-outlined">delete</span>
                  }
                >
                  Delete
                </DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </>
        );
      default:
        return cellValue;
    }
  };

  useEffect(() => {
    getMOUListData("showSkeleton");
  }, [page]);

  const getMOUListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallOtherWorkList("")) as any;
      console.log("data", data);
      if (data?.statusCode === 200) {
        setWorkOrderList(data?.data?.records);
        setTotalPages(data?.data?.totalPages);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const handleSubmitAgreement = async (
    event: React.FormEvent,
    loaderType: string,
    vendorData: FormState,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);

      const submissionData = new FormData();
      submissionData.append("title", vendorData.mouTitle);
      submissionData.append("version", vendorData.version);
      if (formData?.isEdit && formData?.otherTemplateFile?.name) {
        submissionData.append(
          "templateFile",
          vendorData.otherTemplateFile as File,
        );
      } else if (!formData?.isEdit) {
        submissionData.append(
          "templateFile",
          vendorData.otherTemplateFile as File,
        );
      }
      const { data, error } = formData?.isEdit
        ? ((await CallUpdateOtherWork({
            id: selectedWorkOrderId,
            data: submissionData,
          })) as any)
        : ((await CallAddOtherWork(submissionData)) as any);

      if (data?.statusCode === 200) {
        toast.success(data?.message);
        getMOUListData("");
        resetFormFields();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const resetFormFields = () => {
    setFormData({
      mouTitle: "",
      otherTemplateFile: "",
      isEdit: false,
      version: "",
    });
    onClose();
  };

  //   if (!selectedWorkOrderId) return;
  //   try {
  //     setLoader("delete");
  //     const { data, error } = (await CallWorkOrderDelete(
  //       selectedWorkOrderId,
  //     )) as any;
  //     if (data?.message) {
  //       toast.success(data?.message);
  //     }
  //     if (error) {
  //       handleCommonErrors(error);
  //     }
  //     getMOUListData("");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete");
  //   } finally {
  //     setLoader("");
  //     setSelectedWorkOrderId(null);
  //     setShowDeleteModal(false);
  //   }
  // };

  return (
    <>
      {/* <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteWorkOrder}
        isLoading={loader === "delete"}
        title="Delete Work Order"
        message="Are you sure you want to delete this work order? This action cannot be undone."
      /> */}
      <FlatCard
        heading="Work Order"
        ButtonLabel="Add New Work Order"
        onClick={onOpen}
        button
      >
        <Table
          className="mt-3"
          shadow="none"
          classNames={{
            wrapper: "p-0",
          }}
          bottomContent={
            totalPages > 0 && (
              <div className="flex justify-end">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  className="me-2"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
            )
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column?.key}
                className="text-wrap mob:text-nowrap"
              >
                {column?.title}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loader === "showSkeleton"}
            items={workOrderList?.map((item, index) => ({
              ...item,
              srNo: (page - 1) * 10 + (index + 1),
            }))}
            emptyContent="No data"
          >
            {(item) => (
              <TableRow key={item?._id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey as keyof TableRowData)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </FlatCard>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          onClose();
          resetFormFields();
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {formData?.isEdit ? "Update" : "Add New"} Work Order
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Work Order title"
                  labelPlacement="outside"
                  value={formData?.mouTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, mouTitle: e.target.value })
                  }
                  placeholder="Enter Work Order title"
                  endContent={
                    <span className="material-symbols-rounded">edit</span>
                  }
                />

                <p className="mb-2 mt-4 text-sm">Upload work order template</p>

                {formData?.otherTemplateFile ? (
                  <div className="flex w-full items-center gap-3">
                    <Input
                      value={
                        typeof formData?.otherTemplateFile === "string"
                          ? "Uploaded File"
                          : formData?.otherTemplateFile?.name
                      }
                      type="text"
                      readOnly
                      startContent={
                        <span className="material-symbols-rounded">
                          upload_file
                        </span>
                      }
                      endContent={
                        <div className="flex items-center gap-2">
                          {typeof formData?.otherTemplateFile === "string" && (
                            <Tooltip content="View">
                              <a
                                href={formData?.otherTemplateFile}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span className="material-symbols-outlined">
                                  description
                                </span>
                              </a>
                            </Tooltip>
                          )}
                          <Button
                            size="sm"
                            color="danger"
                            onPress={() =>
                              setFormData({
                                ...formData,
                                otherTemplateFile: "",
                              })
                            }
                          >
                            <span className="material-symbols-rounded">
                              close
                            </span>
                            Remove
                          </Button>
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <Input
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otherTemplateFile: e.target.files?.[0] || "",
                      })
                    }
                    startContent={
                      <span className="material-symbols-rounded">
                        upload_file
                      </span>
                    }
                  />
                )}
                <div className="">
                  <Input
                    type="text"
                    label="Version"
                    labelPlacement="outside"
                    value={formData?.version}
                    onChange={(e: any) => {
                      setFormData({
                        ...formData,
                        version: e.target.value,
                      });
                    }}
                    placeholder="Enter Version"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={(event) =>
                    handleSubmitAgreement(event, "submitForm", formData)
                  }
                  isLoading={loader === "submitForm"}
                  className="w-full"
                >
                  {formData?.isEdit ? "Update" : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* View PDF Modal */}
      <Modal
        className="z-50"
        isOpen={isOpenFile}
        onOpenChange={onOpenChangeFile}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>View Document</ModalHeader>
              <ModalBody>
                <iframe
                  src={workOrderListFileLink}
                  width="100%"
                  height="450px"
                ></iframe>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => {
                    setWorkOrderListFileLink("");
                    onCloseFile();
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MOUTemplate;
