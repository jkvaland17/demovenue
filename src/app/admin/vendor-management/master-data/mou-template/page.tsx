"use client";
import {
  CallAddMou,
  // CallDeleteMOU,
  CallGetAllMOU,
  CallUpdateMou,
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

type Props = {};

const MOUTemplate = (props: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenFile,
    onOpen: onOpenFile,
    onClose: onCloseFile,
    onOpenChange: onOpenChangeFile,
  } = useDisclosure();
  const [loader, setLoader] = useState<string>("");
  const [MOUList, setMOUList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState<any>({
    mouTitle: "",
    mouTemplateFile: "",
    mouVersion: "",
    isEdit: false,
  });

  const [mouTemplateFileLink, setMouTemplateFileLink] = useState("");

  const columns = [
    { title: "Sr. No.", key: "srNo" },
    { title: "Templates", key: "mouTitle" },
    { title: "Templates File", key: "mouTemplateFile" },
    { title: "Version", key: "mouVersion" },
    { title: "Templates created date", key: "createdAt" },
    { title: "Action", key: "action" },
  ];

  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "createdAt":
        return cellValue ? moment(cellValue).format("ll") : " -- ";
      case "mouTemplateFile":
        return (
          <Button
            variant="bordered"
            className="min-h-1 min-w-1 border-none p-0"
            onPress={() => {
              setMouTemplateFileLink(cellValue);
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
                    console.log("item::: ", item);
                    setSelectedId(item?._id);
                    setFormData({
                      mouTitle: item?.mouTitle,
                      mouTemplateFile: item?.mouTemplateFile,
                      mouVersion: item?.mouVersion,
                      isEdit: true,
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
                    setSelectedId(item?._id);
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
  }, []);

  useEffect(() => {
    getMOUListData("showSkeleton");
  }, [page]);

  const getMOUListData = async (loaderType: string) => {
    setLoader(loaderType);
    try {
      const { data, error } = (await CallGetAllMOU(
        `page=${page}&limit=10`,
      )) as any;
      console.log("CallGetAllMOU", data, error);

      if (data?.statusCode === 200) {
        setMOUList(data?.data?.records);
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
    loaderType: string,
    vendorData: any,
  ) => {
    try {
      setLoader(loaderType);
      const formDataSubmit = new FormData();
      formDataSubmit.append("mouTitle", vendorData?.mouTitle);
      if (formData?.isEdit && formData?.mouTemplateFile?.name) {
        formDataSubmit.append("mouTemplateFile", vendorData.mouTemplateFile);
      } else if (!formData?.isEdit) {
        formDataSubmit.append("mouTemplateFile", vendorData.mouTemplateFile);
      }
      formDataSubmit.append("mouVersion", vendorData.mouVersion);
      const { data, error } = formData?.isEdit
        ? ((await CallUpdateMou({
            id: selectedId,
            data: formDataSubmit,
          })) as any)
        : ((await CallAddMou(formDataSubmit)) as any);
      console.log("CallAddMou", data, error);

      if (data?.statusCode === 200) {
        toast.success(data.message);
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
      mouTemplateFile: "",
      mouVersion: "",
      isEdit: false,
    });
    onClose();
  };

  // const handleDeleteWorkOrder = async () => {
  //   if (!selectedId) return;
  //   try {
  //     setLoader("delete");
  //     const { data, error } = (await CallDeleteMOU(selectedId)) as any;
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
  //     setSelectedId(null);
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
        title="Delete MOU Template"
        message="Are you sure you want to delete this MOU Template? This action cannot be undone."
      /> */}

      <FlatCard
        heading="MOU Templates"
        ButtonLabel="Add New MOU Templates"
        onClick={onOpen}
        button
      >
        <Table
          className="mt-3"
          shadow="none"
          classNames={{
            wrapper: "p-0 overflow-auto scrollbar-hide",
          }}
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
                className="text-wrap"
              >
                {column.title}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={loader === "showSkeleton"}
            items={MOUList?.map((item: any, index: number) => ({
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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {formData?.isEdit ? "Update" : "Add New"} MOU Templates
              </ModalHeader>
              <ModalBody>
                {" "}
                <div className="">
                  <Input
                    type="text"
                    label="MOU title"
                    labelPlacement="outside"
                    value={formData?.mouTitle}
                    onChange={(e: any) => {
                      setFormData({
                        ...formData,
                        mouTitle: e.target.value,
                      });
                    }}
                    placeholder="Enter MOU title"
                    endContent={
                      <span className="material-symbols-rounded">edit</span>
                    }
                  />
                </div>
                <div className="">
                  <p className="mb-2 text-sm">
                    Upload MoU Template with Versioning
                  </p>
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
                      value={formData?.mouTemplateFile.name}
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
                <div className="">
                  <Input
                    type="text"
                    label="Version"
                    labelPlacement="outside"
                    value={formData?.mouVersion}
                    onChange={(e: any) => {
                      setFormData({
                        ...formData,
                        mouVersion: e.target.value,
                      });
                    }}
                    placeholder="Enter MOU Version"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() =>
                    handleSubmitAgreement("submitForm", formData)
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

      <Modal
        className="z-50"
        isOpen={isOpenFile}
        onOpenChange={onOpenChangeFile}
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
                  <iframe
                    src={mouTemplateFileLink}
                    width="100%"
                    height="450px"
                  ></iframe>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    setMouTemplateFileLink("");
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

export default MOUTemplate;
