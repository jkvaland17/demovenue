"use client";

import {
  CallAddWorkScope,
  CallGetAllWorkScope,
  CallUpdateEditWorkScope,
  // CallWorkScopeDelete,
} from "@/_ServerActions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
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
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import pdf from "@/assets/img/icons/common/pdf-icon.png";

type WorkScopeItem = {
  _id: string;
  workScopeTitle: string;
  createdAt: string;
  mouTemplateFile?: string;
};

const WorkScope = () => {
  const columns = [
    { title: "Sr. No.", key: "srNo" },
    { title: "Scope of Work", key: "workScopeTitle" },
    { title: "Scope of Work created date", key: "createdAt" },
    { title: "Work Scope File", key: "templateFile" },
    { title: "Action", key: "action" },
  ];

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loader, setLoader] = useState<string>("");
  const [workScopeList, setWorkScopeList] = useState<WorkScopeItem[]>([]);
  const [formData, setFormData] = useState<any>({
    workScopeTitle: "",
    isEdit: false,
    mouTemplateFile: "",
  });
  const [workOrderListFileLink, setWorkOrderListFileLink] =
    useState<string>("");
  // const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    isOpen: isOpenFile,
    onOpen: onOpenFile,
    onClose: onCloseFile,
    onOpenChange: onOpenChangeFile,
  } = useDisclosure();

  useEffect(() => {
    getWorkScopeListData("showSkeleton");
  }, [page]);

  const getWorkScopeListData = async (loaderType: string) => {
    try {
      setLoader(loaderType);
      const params = `page=${page}&limit=10`;
      const { data, error } = (await CallGetAllWorkScope(params)) as any;
      console.log("data", data);

      if (data?.statusCode === 200) {
        setWorkScopeList(data?.data?.records);
        setTotalPages(data?.data?.totalPages);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent,
    loaderType: string,
    formDataToSubmit: { workScopeTitle: string },
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      const payload = new FormData();
      payload.append("workScopeTitle", formDataToSubmit.workScopeTitle);
      if (
        formData?.mouTemplateFile &&
        formData?.mouTemplateFile instanceof File
      ) {
        payload.append("mouTemplateFile", formData.mouTemplateFile);
      }
      let response;
      if (formData?.isEdit && selectedId) {
        response = await CallUpdateEditWorkScope({
          id: selectedId,
          data: payload,
        });
      } else {
        response = await CallAddWorkScope(payload);
      }

      const { data, error } = response as any;

      if (data?.statusCode === 200) {
        toast.success(data.message);
        getWorkScopeListData("");
        resetFormFields();
      }

      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting.");
    } finally {
      setLoader("");
    }
  };

  const resetFormFields = () => {
    setFormData({ workScopeTitle: "" });
    onClose();
  };

  const renderCell = (item: WorkScopeItem, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof WorkScopeItem];

    switch (columnKey) {
      case "createdAt":
        return cellValue ? moment(cellValue as string).format("ll") : "--";
      case "templateFile":
        return (
          <Button
            variant="bordered"
            className="min-h-1 min-w-1 border-none p-0"
            onPress={() => {
              setWorkOrderListFileLink(item?.mouTemplateFile as string);
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
          <Dropdown
            classNames={{ content: "min-w-[150px]" }}
            placement="bottom-end"
          >
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem
                key={"edit"}
                onPress={() => {
                  setSelectedId(item._id);
                  setFormData({
                    workScopeTitle: item.workScopeTitle,
                    isEdit: true,
                    mouTemplateFile: item.mouTemplateFile,
                  });
                  onOpen();
                }}
                startContent={
                  <span className="material-symbols-outlined">box_edit</span>
                }
              >
                Edit
              </DropdownItem>
              {/* <DropdownItem
                key={"delete"}
                color="danger"
                onClick={() => {
                  setSelectedId(item._id);
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
        );

      default:
        return cellValue;
    }
  };

  // const handleDelete = async () => {
  //   if (!selectedId) return;
  //   try {
  //     setLoader("delete");
  //     const { data, error } = (await CallWorkScopeDelete(selectedId)) as any;

  //     if (data?.message) toast.success(data.message);
  //     if (error) handleCommonErrors(error);

  //     getWorkScopeListData("showSkeleton");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete");
  //   } finally {
  //     setLoader("");
  //     setSelectedId(null);
  //     setShowDeleteModal(false);
  //   }
  // };

  return (
    <>
      {/* <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={loader === "delete"}
        title="Delete Scope of Work"
        message="Are you sure you want to delete this Scope of Work? This action cannot be undone."
      /> */}

      <FlatCard
        heading="Scope of Work"
        button
        ButtonLabel="Add New Scope of Work"
        onClick={onOpen}
      >
        <Table
          className="mt-3"
          removeWrapper
          bottomContent={
            totalPages > 1 && (
              <div className="flex justify-end">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={(p) => setPage(p)}
                />
              </div>
            )
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.title}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loader === "showSkeleton"}
            items={workScopeList.map((item, index) => ({
              ...item,
              srNo: (page - 1) * 10 + (index + 1),
            }))}
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
      </FlatCard>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          onClose();
          resetFormFields();
        }}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              {formData?.isEdit
                ? "Edit Scope of Work"
                : "Add New Scope Of Work"}
            </ModalHeader>
            <ModalBody>
              <Input
                type="text"
                label="New Scope of Work"
                labelPlacement="outside"
                value={formData?.workScopeTitle}
                onChange={(e) =>
                  setFormData({ ...formData, workScopeTitle: e.target.value })
                }
                placeholder="Enter scope of work"
                endContent={
                  <span className="material-symbols-rounded">edit</span>
                }
              />
              <div className="">
                <p className="mb-2 text-sm">Upload MoU Template</p>
                {formData?.mouTemplateFile ? (
                  <Input
                    value={
                      typeof formData?.mouTemplateFile === "string"
                        ? "Uploaded File"
                        : formData?.mouTemplateFile?.name
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
                        {typeof formData?.mouTemplateFile === "string" && (
                          <Tooltip content="View">
                            <a
                              href={formData?.mouTemplateFile}
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
                          variant="flat"
                          size="sm"
                          color="danger"
                          onPress={() => {
                            setFormData({
                              ...formData,
                              mouTemplateFile: "",
                            });
                          }}
                          className="px-5 text-danger"
                        >
                          <span className="material-symbols-rounded">
                            close
                          </span>
                          Remove
                        </Button>
                      </div>
                    }
                  />
                ) : (
                  <Input
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    value={formData?.mouTemplateFile?.name}
                    onChange={(e: any) => {
                      setFormData({
                        ...formData,
                        mouTemplateFile: e.target.files[0],
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={(event) =>
                  handleSubmit(event, "submitForm", {
                    workScopeTitle: formData.workScopeTitle,
                  })
                }
                isLoading={loader === "submitForm"}
                className="w-full"
              >
                {formData?.isEdit ? "Update" : "Submit"}
              </Button>
            </ModalFooter>
          </>
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

export default WorkScope;
