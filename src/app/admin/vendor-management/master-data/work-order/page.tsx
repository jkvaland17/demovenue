"use client";
import { CallAddOrder, CallGetAllOrder } from "@/_ServerActions";
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
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import Image from "next/image";
import moment from "moment";

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
    title: "",
    templateFile: "",
    // mouVersion: "",
  });
  console.log("formData", formData);

  const [mouTemplateFileLink, setMouTemplateFileLink] = useState("");

  const columns = [
    { title: "Sr. No.", key: "srNo" },
    { title: "title", key: "title" },
    { title: "Templates File", key: "templateFile" },
    // { title: "Version", key: "mouVersion" },
    { title: "Templates created date", key: "createdAt" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "createdAt":
        return cellValue ? moment(cellValue).format("ll") : " -- ";
      case "templateFile":
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
      const { data, error } = (await CallGetAllOrder()) as any;
      console.log("CallGetAllMOU", data, error);

      if (data?.statusCode === 200) {
        setMOUList(data?.data?.records);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader("");
    }
  };

  const handleSubmitAgreement = async (
    event: any,
    loaderType: string,
    vendorData: any,
  ) => {
    event.preventDefault();
    try {
      setLoader(loaderType);
      const formData = new FormData();
      formData.append("title", vendorData?.title);
      formData.append("templateFile", vendorData.templateFile);
      formData.append("mouVersion", vendorData.mouVersion);
      const { data, error } = (await CallAddOrder(formData)) as any;
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
      title: "",
      templateFile: "",
    });
    onClose();
  };

  return (
    <>
      <FlatCard
        heading="Work Order"
        ButtonLabel="Add New Work Order"
        onClick={onOpen}
        button
      >
        <Table
          className="mt-3"
          removeWrapper
          color="default"
          bottomContent={
            totalPages > 1 ? (
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
                Add New MOU Templates
              </ModalHeader>
              <ModalBody>
                {" "}
                <div className="">
                  <Input
                    type="text"
                    label="Title"
                    labelPlacement="outside"
                    value={formData?.title}
                    onChange={(e: any) => {
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      });
                    }}
                    placeholder="Enter title"
                    endContent={
                      <span className="material-symbols-rounded">edit</span>
                    }
                  />
                </div>
                <div className="">
                  <p className="mb-2 text-sm">
                    Upload Signed Order (Both Parties)
                  </p>
                  {formData?.templateFile ? (
                    <Input
                      value={formData?.templateFile.name}
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
                              templateFile: "",
                            });
                          }}
                          className="px-5 text-danger"
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
                      value={formData?.templateFile.name}
                      onChange={(e: any) => {
                        setFormData({
                          ...formData,
                          templateFile: e.target.files[0],
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
                  onPress={(event) =>
                    handleSubmitAgreement(event, "submitForm", formData)
                  }
                  isLoading={loader === "submitForm"}
                  className="w-full"
                >
                  Submit
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
