"use client";
import {
  CallGetAllSports,
  CallGetAllTrialMarks,
  CallGetKuhsalTeams,
  CallUpdateTrialMarks,
  CallUploadRefreeMarks,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import { DownloadKushalExcel } from "@/Utils/DownloadExcel";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
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
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const columns = [
  { title: "Chest No.", key: "chestNo" },
  { title: "Head of Committee (SSP/SP) (OUT OF 16)", key: "committeeHead" },
  { title: "Member (Addl SP/DySP) (OUT OF 16)", key: "memberAddl" },
  {
    title: "Member (Pradeshik Kridadhikari- Police) (OUT OF 16)",
    key: "memberPredesh",
  },
  {
    title: "Member (International Player-Khel Visheshagya) (OUT OF 16)",
    key: "memberInt",
  },
  {
    title: "Member (Trainer - National Player/NIS) (OUT OF 16)",
    key: "memberTrainer",
  },
  { title: "Total Marks Obtained (Out of 80)", key: "totalMarks" },
  { title: "Rank", key: "rank" },
  { title: "Actions", key: "actions" },
];

const TrialMarks = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isUpload,
    onOpen: onUpload,
    onOpenChange: onOpenUplaod,
    onClose: onUploadClose,
  } = useDisclosure();

  const [modalType, setModalType] = useState("refree");
  const [allFilters, setAllFilters] = useState<any>({
    committee: [],
    sports: [],
    subSports: [],
  });
  const [modal2Type, setModal2Type] = useState("refree");
  const [allTrials, setAllTrials] = useState<any[]>([]);
  const [currentTrial, setCurrentTrial] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [loader, setLoader] = useState<any>({
    page: false,
    excel: false,
  });
  const [upload, setUpload] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [filterData, setFilterData] = useState<any>({
    chestNumber: "",
  });
  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const marks = watch([
    "headOfCommittee",
    "addlSPDySP",
    "pradeshikKridadhikari",
    "internationalPlayer",
    "trainerNationalPlayer",
  ]);

  // Calculate the total marks dynamically
  const totalMarks = marks.reduce((acc, mark) => acc + (Number(mark) || 0), 0);

  useEffect(() => {
    setValue("totalMarks", totalMarks);
  }, [totalMarks, setValue]);

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };
  const uploadRefreeMarks = async () => {
    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("file", item);
      });
    }
    formData.append("advertisementId", currentAdvertisementID);
    try {
      const { data, error } = (await CallUploadRefreeMarks(formData)) as any;

      if (data?.success === true) {
        toast.success(data?.message);
        onUploadClose();
        setUpload([]);
      }
      if (error) {
        toast.error(error);
        onUploadClose();
        setUpload([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const uploadCommitteeMarks = async () => {
    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("file", item);
      });
    }
    formData.append("advertisementId", currentAdvertisementID);
    try {
      const { data, error } = (await CallUploadRefreeMarks(formData)) as any;

      if (data?.success === true) {
        toast.success(data?.message);
        onUploadClose();
        setUpload([]);
      }
      if (error) {
        toast.error(error);
        onUploadClose();
        setUpload([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "committeeHead":
        return <p>{item?.marks?.headOfCommittee}</p>;
      case "memberAddl":
        return <p>{item?.marks?.addlSPDySP}</p>;
      case "memberPredesh":
        return <p>{item?.marks?.pradeshikKridadhikari}</p>;
      case "memberInt":
        return <p>{item?.marks?.internationalPlayer}</p>;
      case "memberTrainer":
        return <p>{item?.marks?.trainerNationalPlayer}</p>;
      case "totalMarks":
        return <p>{item?.marks?.total}</p>;
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
                  setCurrentTrial(item);
                  setFormValues(item, "view");
                }}
              >
                View
              </DropdownItem>
              <DropdownItem
                key="trailMarks"
                onPress={() => {
                  setCurrentTrial(item);
                  setFormValues(item, "edit");
                }}
              >
                Trial Marks
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const getAllTrails = async (filter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      page: true,
    }));
    try {
      const filterOn = `advertisementId=${currentAdvertisementID}&chestNumber=${filterData?.chestNumber}&page=${page}&limit=10`;
      const filterOff = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllTrialMarks(
        filter ? filterOn : filterOff,
      )) as any;

      console.log("getAllTrails", data);

      if (data) {
        setAllTrials(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    } catch (error) {
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
      console.log(error);
    }
  };
  const getAllCommittee = async () => {
    try {
      const query = `page=${page}&limit=10&groupType=committee&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetKuhsalTeams(query)) as any;

      if (data) {
        setAllFilters((prevFilters: any) => ({
          ...prevFilters,
          committee: data?.data,
        }));
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllSports = async () => {
    try {
      const { data, error } = (await CallGetAllSports("")) as any;
      if (data) {
        setAllFilters((prevFilters: any) => ({
          ...prevFilters,
          sports: data?.data,
        }));
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllSports();
  }, []);
  useEffect(() => {
    if (currentAdvertisementID) {
      getAllTrails(false);
      getAllCommittee();
    }
  }, [page, currentAdvertisementID]);

  const onSubmit = async (data: any) => {
    const structuredData = {
      id: currentTrial?._id,
      marks: {
        headOfCommittee: +data.headOfCommittee,
        addlSPDySP: +data.addlSPDySP,
        pradeshikKridadhikari: +data.pradeshikKridadhikari,
        internationalPlayer: +data.internationalPlayer,
        trainerNationalPlayer: +data.trainerNationalPlayer,
        total:
          +data.headOfCommittee +
          +data.addlSPDySP +
          +data.pradeshikKridadhikari +
          +data.internationalPlayer +
          +data.trainerNationalPlayer,
      },
      rank: +data.rank,
      remark: data.remark,
    };
    console.log(structuredData);

    try {
      const response = (await CallUpdateTrialMarks(structuredData)) as any;
      if (response?.data) {
        toast.success(response?.data?.message);
        onClose();
        handleCloseModel();
        getAllTrails(false);
      }
      if (response?.error) {
        toast?.error(response?.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModel = () => {
    const fieldsToReset = [
      "category",
      "marks",
      "remark",
      "headOfCommittee",
      "addlSPDySP",
      "pradeshikKridadhikari",
      "internationalPlayer",
      "trainerNationalPlayer",
      "rank",
    ];

    fieldsToReset.forEach((field) => {
      setValue(field, "");
    });
  };

  const setFormValues = (item: any, modalType = "") => {
    setValue("headOfCommittee", item?.marks?.headOfCommittee || "");
    setValue("addlSPDySP", item?.marks?.addlSPDySP || "");
    setValue("pradeshikKridadhikari", item?.marks?.pradeshikKridadhikari || "");
    setValue("internationalPlayer", item?.marks?.internationalPlayer || "");
    setValue("trainerNationalPlayer", item?.marks?.trainerNationalPlayer || "");
    setValue("rank", item?.rank || "");
    setValue("remark", item?.remark || "");
    setModal2Type(modalType);
    onOpen();
  };

  const clearFilter = () => {
    setFilterData({
      committee: "",
      sport: "",
      subSports: "",
    });
    getAllTrails(false);
  };

  return (
    <>
      {loader?.page ? (
        <FlatCard>
          <TableSkeleton columnsCount={5} isTitle />
        </FlatCard>
      ) : (
        <>
          <Table
            isStriped
            className="mb-6"
            classNames={{ th: "text-slate-500 text-wrap" }}
            color="default"
            aria-label="Example static collection table"
            defaultValue={currentTrial?.marks}
            topContent={
              <>
                <h2 className="text-xl font-semibold">Trial Marks</h2>

                <div className="grid grid-cols-4 flex-col items-end gap-2 mob:flex mob:items-stretch">
                  <Input
                    labelPlacement="outside"
                    placeholder="Enter Chest Number"
                    value={filterData?.chestNumber}
                    onChange={(e) => {
                      setFilterData((prev: any) => ({
                        ...prev,
                        chestNumber: e.target.value,
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
                        `v1/admin/downloadgetAllTrialMarksExcel?advertisementId=${currentAdvertisementID}&sports=${filterData?.sports}&page=${page}&limit=10`,
                        "trial-marks",
                        setLoader,
                      );
                    }}
                    excelLoader={loader?.excel}
                  />

                  <FilterSearchBtn
                    searchFunc={() => getAllTrails(true)}
                    clearFunc={clearFilter}
                  />
                </div>
              </>
            }
            bottomContent={
              <div className="grid grid-cols-2 flex-col gap-6 mob:flex">
                <Pagination
                  className="col-span-2 ms-auto"
                  showControls
                  total={totalPage}
                  page={page}
                  onChange={(page) => setPage(page)}
                />
                <Button
                  onPress={() => {
                    setModalType("refree");
                    onUpload();
                  }}
                  className="mob:min-w-fit"
                  color="primary"
                  variant="solid"
                >
                  Upload The Refree Marks Document With Signature
                </Button>
                <Button
                  onPress={() => {
                    setModalType("committee");
                    onUpload();
                  }}
                  color="primary"
                  variant="solid"
                  className="text-nowrap"
                >
                  <p className="text-wrap text-white">
                    Upload the Committee marks With Signature (Candidate/
                    Committee Head)
                  </p>
                </Button>
              </div>
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
            <TableBody items={allTrials} emptyContent="No data">
              {(item) => (
                <TableRow key={item._id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Modal isOpen={isUpload} onOpenChange={onOpenUplaod} size="xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {modalType === "refree"
                      ? "Upload The Refree Marks Document With Signature"
                      : modalType === "committee"
                        ? "Upload the Committee marks With Signature (Candidate/ Committee Head)"
                        : ""}
                  </ModalHeader>
                  <ModalBody>
                    <CustomMultipleUpload
                      {...register("file")}
                      preview={upload}
                      setPreview={setUpload}
                      handleChange={handleChangeST}
                      setValue={setValue}
                      accept={".pdf"}
                      name="Attachments"
                      placeholder="Upload PDF"
                      type="single"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="solid"
                      color="primary"
                      className="w-full"
                      onPress={
                        modalType === "refree"
                          ? uploadRefreeMarks
                          : uploadCommitteeMarks
                      }
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

          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={handleCloseModel}
            size="3xl"
            placement="top"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {modal2Type === "view"
                      ? "View Trial Marks"
                      : modal2Type === "edit"
                        ? "Trial Marks"
                        : ""}
                  </ModalHeader>
                  <ModalBody className="grid grid-cols-3 gap-6 mob:grid-cols-1">
                    <div className="flex flex-col gap-2 font-semibold">
                      <Image
                        radius="full"
                        height={90}
                        width={90}
                        src={currentTrial?.photograph}
                        alt="candidate_img"
                        className="mb-4 h-full w-full object-cover"
                      />
                      <p>
                        Chest no.: <span>{currentTrial?.chestNo}</span>
                      </p>
                      <p>
                        Sport: <span>{currentTrial?.sportsData?.name}</span>
                      </p>
                      <p>
                        Sub-Sports:{" "}
                        <span>
                          {currentTrial?.subSportsData?.name} (
                          {currentTrial?.subSportsData?.code})
                        </span>
                      </p>
                    </div>

                    <form
                      className="col-span-2"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="grid grid-cols-1 gap-6">
                        <Controller
                          name="addlSPDySP"
                          control={control}
                          rules={{
                            required:
                              "Member (Addl SP/DySP) (Out of 16) is required",
                            max: {
                              value: 16,
                              message: "Marks should be less than 16 ",
                            },
                          }}
                          render={({
                            field,
                            fieldState: { error, invalid },
                          }) => (
                            <Input
                              {...field}
                              isInvalid={invalid}
                              errorMessage={error?.message}
                              type="number"
                              label="Member (Addl SP/DySP) (Out of 16)"
                              labelPlacement="outside"
                              isReadOnly={modal2Type === "view"}
                              placeholder="Enter marks"
                              endContent={
                                <span className="material-symbols-rounded">
                                  edit
                                </span>
                              }
                            />
                          )}
                        />

                        <Controller
                          name="pradeshikKridadhikari"
                          control={control}
                          rules={{
                            required:
                              "Member (Pradeshik Kridadhikari - Police) (Out of 16) is required",
                            max: {
                              value: 16,
                              message: "Marks should be less than 16",
                            },
                          }}
                          render={({
                            field,
                            fieldState: { error, invalid },
                          }) => (
                            <Input
                              {...field}
                              isInvalid={invalid}
                              errorMessage={error?.message}
                              type="number"
                              label="Member (Pradeshik Kridadhikari - Police) (Out of 16)"
                              labelPlacement="outside"
                              isReadOnly={modal2Type === "view"}
                              placeholder="Enter marks"
                              endContent={
                                <span className="material-symbols-rounded">
                                  edit
                                </span>
                              }
                            />
                          )}
                        />

                        <Controller
                          name="internationalPlayer"
                          control={control}
                          rules={{
                            required:
                              "Member (International Player-Khel Visheshgya) (Out of 16) is required",
                            max: {
                              value: 16,
                              message: "Marks should be less than 16",
                            },
                          }}
                          render={({
                            field,
                            fieldState: { error, invalid },
                          }) => (
                            <Input
                              {...field}
                              isInvalid={invalid}
                              errorMessage={error?.message}
                              type="number"
                              label="Member (International Player-Khel Visheshgya) (Out of 16)"
                              labelPlacement="outside"
                              isReadOnly={modal2Type === "view"}
                              placeholder="Enter marks"
                              endContent={
                                <span className="material-symbols-rounded">
                                  edit
                                </span>
                              }
                            />
                          )}
                        />

                        <Controller
                          name="trainerNationalPlayer"
                          control={control}
                          rules={{
                            required:
                              "Member (Trainer - National Player) (Out of 16) is required",
                            max: {
                              value: 16,
                              message: "Marks should be less than 16",
                            },
                          }}
                          render={({
                            field,
                            fieldState: { error, invalid },
                          }) => (
                            <Input
                              {...field}
                              isInvalid={invalid}
                              errorMessage={error?.message}
                              type="number"
                              label="Member (Trainer - National Player) (Out of 16)"
                              labelPlacement="outside"
                              isReadOnly={modal2Type === "view"}
                              placeholder="Enter marks"
                              endContent={
                                <span className="material-symbols-rounded">
                                  edit
                                </span>
                              }
                            />
                          )}
                        />

                        <Input
                          type="number"
                          label="Total"
                          labelPlacement="outside"
                          isDisabled
                          value={`${totalMarks}`}
                          placeholder="Enter marks"
                          endContent={
                            <span className="material-symbols-rounded">
                              tag
                            </span>
                          }
                        />

                        <Controller
                          name="rank"
                          control={control}
                          rules={{
                            required: "Rank is required",
                          }}
                          render={({
                            field,
                            fieldState: { error, invalid },
                          }) => (
                            <Input
                              {...field}
                              isInvalid={invalid}
                              errorMessage={error?.message}
                              type="number"
                              label="Rank"
                              labelPlacement="outside"
                              isReadOnly={modal2Type === "view"}
                              placeholder="Enter rank"
                              endContent={
                                <span className="material-symbols-rounded">
                                  tag
                                </span>
                              }
                            />
                          )}
                        />

                        <Controller
                          name="remark"
                          control={control}
                          rules={{
                            required: "Remark is required",
                          }}
                          render={({
                            field,
                            fieldState: { error, invalid },
                          }) => (
                            <Input
                              {...field}
                              isInvalid={invalid}
                              errorMessage={error?.message}
                              type="text"
                              label="Remark"
                              labelPlacement="outside"
                              isReadOnly={modal2Type === "view"}
                              placeholder="Enter remark"
                              className="mb-6"
                              endContent={
                                <span className="material-symbols-rounded">
                                  edit
                                </span>
                              }
                            />
                          )}
                        />
                      </div>

                      {modal2Type === "edit" && (
                        <Button
                          type="submit"
                          color="primary"
                          variant="solid"
                          className="mb-4 w-full"
                          isLoading={isSubmitting}
                        >
                          Submit
                        </Button>
                      )}
                    </form>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default TrialMarks;
