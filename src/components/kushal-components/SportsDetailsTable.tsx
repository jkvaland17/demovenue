import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
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
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import {
  CallGetCertificateMarking,
  CallUploadCertificateMarks,
  CallUploadCertificateStatus,
  CallUploadSportsCertificate,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { handleCommonErrors } from "@/Utils/HandleError";
import moment from "moment";
import CustomMultipleUpload from "./CustomMultipleUpload";

type Props = {
  sportsData: any;
  docPreviewModal: () => void;
  getKushalApplications: (params: any) => void;
  setDocument: React.Dispatch<React.SetStateAction<string>>;
  applicationId: string;
  advertisementId: string;
  currentUser?: any;
};

const sportsColumns = [
  { name: "Sport", uid: "sport" },
  { name: "Sub sport", uid: "subSport" },
  { name: "Sport certificate", uid: "sportCertificate" },
  { name: "Status", uid: "status" },
  { name: "Upload Certificate", uid: "upload" },
];

const SportsDetailsTable: React.FC<Props> = ({
  sportsData,
  docPreviewModal,
  getKushalApplications,
  setDocument,
  applicationId,
  advertisementId,
  currentUser,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isMarking,
    onOpen: onMarking,
    onOpenChange: onOpenMarking,
    onClose: onCloseMarking,
  } = useDisclosure();
  const [category, setCategory] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [categoryChampionship, setCategoryChampionship] = useState<any>();
  const [sportCertificate, setSportCertificate] = useState<any>(null);
  const [rank, setRank] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [selectedSports, setSelectedSport] = useState<string>("");
  const [upload, setUpload] = useState<any>([]);
  useEffect(() => {
    setAllData(sportsData);
    if (currentUser?.markscommitteesDetails) {
      setValue(
        "durationDate",
        moment(currentUser?.markscommitteesDetails?.durationDate).format(
          "YYYY-MM-DD",
        ) ?? "",
      );
      setValue("category", currentUser?.markscommitteesDetails?.category ?? "");
      setValue(
        "sport_championship",
        currentUser?.markscommitteesDetails?.sport_championship ?? "",
      );
      setValue("medal", currentUser?.markscommitteesDetails?.medal ?? "");
    }
  }, [sportsData]);
  useEffect(() => {
    if (
      currentUser?.markscommitteesDetails?.category &&
      categoryChampionship &&
      categoryChampionship[currentUser?.markscommitteesDetails?.category].length
    ) {
      handleCategorySelect(currentUser?.markscommitteesDetails?.category);
    }
  }, [categoryChampionship]);
  const [markingData, setMarkingData] = useState<any>({
    category: "",
    championship: "",
    rank: "",
  });
  const [selectedCategoryCampionship, setSelectedCategoryCampionship] =
    useState<any[]>([]);

  // 6779171f01d754ec41746fe3 SI
  // 6779167301d754ec41746fd6 Constable

  const SubmitCertificateMarks = async (formData: any) => {
    console.log("formData", formData);
    const marksData = {
      ...formData,
      application: applicationId,
      advertisementId: advertisementId,
    };
    try {
      const { data, error } = (await CallUploadCertificateMarks(
        marksData,
      )) as any;
      if (data) {
        toast.success(data?.message);
        SubmitCertificateStatus("Matched");
        onCloseMarking();
        setMarkingData({
          category: "",
          championship: "",
          rank: "",
        });
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const SubmitCertificateStatus = async (status: string, sportId?: string) => {
    const marksData = {
      status,
      certificateId: sportId || selectedSports,
      application: applicationId,
      advertisementId,
    };
    try {
      const { data, error } = (await CallUploadCertificateStatus(
        marksData,
      )) as any;

      if (data) {
        toast.success(data?.message);
        getKushalApplications("showSkeleton");
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getCertificateMarking = async () => {
    try {
      const { data, error } = (await CallGetCertificateMarking()) as any;
      if (data) {
        setCategory(data?.response?.category);
        setCategoryChampionship(data?.response?.categoryChampionship);
        setRank(data?.response?.rank);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCertificateMarking();
  }, []);

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "sport":
        return <p>{item?.name}</p>;
      case "subSport":
        return <p>{item?.subSports}</p>;
      case "sportCertificate":
        return item?.certificateDocs?.length ? (
          item?.certificateDocs?.map((certificate: any, index: number) => (
            <Button
              size="md"
              variant="light"
              key={index}
              className="bg-transparent hover:!bg-transparent"
              onPress={() => {
                setDocument(certificate);
                docPreviewModal();
              }}
              isIconOnly
            >
              <Image
                src={pdf.src}
                width={30}
                height={30}
                className="object-contain"
                alt="pdfIcon"
              />
            </Button>
          ))
        ) : (
          <div>-</div>
        );
      case "status":
        return (
          <div className="flex gap-2">
            <Button
              variant={cellValue === "Matched" ? "solid" : "ghost"}
              color={cellValue === "Matched" ? "success" : "default"}
              radius="full"
              className={`text-white ${cellValue === "Matched" ? "" : "border border-slate-400 text-black"}`}
              onPress={() => {
                setSelectedSport(item?._id);
                onMarking();
              }}
            >
              Matched
            </Button>
            <Button
              variant={cellValue === "Unmatched" ? "solid" : "ghost"}
              color={cellValue === "Unmatched" ? "danger" : "default"}
              radius="full"
              className={`${cellValue === "Unmatched" ? "" : "border border-slate-400"}`}
              onPress={() => {
                SubmitCertificateStatus("Unmatched", item?._id);
              }}
            >
              Unmatched
            </Button>
          </div>
        );
      case "upload":
        return (
          <div className="flex gap-2">
            <Button
              variant="solid"
              color="primary"
              radius="full"
              className="px-5"
              onPress={() => {
                setSelectedSport(item?._id);
                onOpen();
              }}
            >
              Upload File
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  const handleCategorySelect = (e: string) => {
    setMarkingData((prev: any) => ({
      ...prev,
      category: e,
    }));
    const categoryMap: Record<string, any> = {
      A: categoryChampionship?.A,
      B: categoryChampionship?.B,
      C: categoryChampionship?.C,
      D1: categoryChampionship?.D1,
      D2: categoryChampionship?.D2,
    };
    setSelectedCategoryCampionship(categoryMap[e] || []);
  };

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    console.log(newFiles);
    setUpload(newFiles);
    setSportCertificate(newFiles[0]);
  };

  const uploadSportCertificate = async () => {
    // formData.append("advertisementId", currentAdvertisementID);
    try {
      setLoader(true);
      const formData = new FormData();
      if (!sportCertificate) {
        toast.error("Please upload the sports certificate before proceeding.");
        return;
      }
      formData.append("applicationId", applicationId);
      formData.append("advertisementId", advertisementId);
      formData.append("selectedSports", selectedSports);
      formData.append("userId", currentUser?.userDetails?._id);
      formData.append("file", sportCertificate);
      const { data, error } = (await CallUploadSportsCertificate(
        formData,
      )) as any;
      if (data?.success) {
        toast.success(data?.message);
        onClose();
        setUpload([]);
        setSelectedSport("");
        setSportCertificate(null);
        getKushalApplications("");
      }
      if (error) {
        toast.error(error);
        onClose();
        setUpload([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  // console.log("sportsData", sportsData);
  // console.log("advertisementId", advertisementId);
  return (
    <>
      <Table
        isStriped
        className="mb-6"
        classNames={{ wrapper: "shadow-none p-0" }}
        color="default"
        aria-label="Example static collection table"
        topContent={
          <h1 className="text-2xl font-semibold">Sports Details खेल विवरण</h1>
        }
      >
        <TableHeader columns={sportsColumns}>
          {(column) => (
            <TableColumn
              key={column?.uid}
              align={column?.uid === "actions" ? "center" : "start"}
              className="text-wrap"
            >
              {column?.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={allData} emptyContent="No data">
          {(item: any) => (
            <TableRow key={item?._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isMarking} onOpenChange={onOpenMarking}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Document Marking
              </ModalHeader>
              <ModalBody>
                <form
                  className="grid grid-cols-1 gap-5"
                  onSubmit={handleSubmit(SubmitCertificateMarks)}
                >
                  <Controller
                    name="durationDate"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="date"
                        label="Date"
                        labelPlacement="outside"
                        min="2021-07-01"
                        max={
                          advertisementId === "6779171f01d754ec41746fe3"
                            ? "2024-01-15"
                            : "2024-01-24"
                        }
                      />
                    )}
                  />

                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        items={category}
                        label="Category"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectedKeys={[value]}
                        onChange={(e) => {
                          onChange(e.target.value);
                          handleCategorySelect(e.target.value);
                        }}
                      >
                        {(item: any) => (
                          <SelectItem key={item?.key}>{item?.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="sport_championship"
                    control={control}
                    rules={{ required: "Sport Championship is required" }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        items={selectedCategoryCampionship || []}
                        label="Sport Championship"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectedKeys={[value]}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                      >
                        {(item: any) => (
                          <SelectItem key={item?.key}>{item?.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="medal"
                    control={control}
                    rules={{ required: "medal is required" }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error, invalid },
                    }) => (
                      <Select
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        items={rank}
                        label="medal"
                        labelPlacement="outside"
                        placeholder="Select"
                        selectedKeys={[value]}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                      >
                        {(item: any) => (
                          <SelectItem key={item?.key}>{item?.label}</SelectItem>
                        )}
                      </Select>
                    )}
                  />
                  <div className="mb-3 grid grid-cols-2 gap-5">
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setUpload([]);
          setSelectedSport("");
          setSportCertificate(null);
        }}
        isDismissable={false}
        hideCloseButton={loader}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload sport certificate
              </ModalHeader>
              <ModalBody>
                <CustomMultipleUpload
                  preview={upload}
                  setPreview={(file: any) => {
                    setUpload(file);
                    setSportCertificate(file.length ? file : null);
                  }}
                  handleChange={handleChangeST}
                  setValue={setValue}
                  accept={".pdf"}
                  name="sportCertificate"
                  placeholder="Upload PDF"
                  type="single"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full"
                  isDisabled={!sportCertificate}
                  isLoading={loader}
                  onPress={uploadSportCertificate}
                  startContent={
                    <span
                      className="material-symbols-rounded"
                      style={{ color: "white" }}
                    >
                      upload
                    </span>
                  }
                >
                  Upload File
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SportsDetailsTable;
