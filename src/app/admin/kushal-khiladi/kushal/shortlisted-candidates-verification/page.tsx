"use client";
import {
  CallAuthoritiesCertificateVerification,
  CallBoardCertificateVerification,
  CallGetAllCandidateVerification,
  CallGetAllSports,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

const ShortlistedCandidateVerification = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [currentCandidate, setCurrentCandidate] = useState<any>();
  const [allData, setAllData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<any>({
    rank: "",
    result: false,
  });

  const { control, handleSubmit } = useForm();

  const columns = [
    { title: "Chest No.", key: "chestNo" },
    { title: "Sports", key: "sportName" },
    { title: "Full name", key: "fullName" },
    { title: "Total Marks Obtained ( OUT OF 80)", key: "totalTrialMarks" },
    {
      title: "Marks out of 20 on Sports Cerificate",
      key: "sportsCertificateMarks",
    },
    { title: "Total Marks", key: "totalMarks" },
    { title: "Rank", key: "rank" },
    { title: "Result", key: "result" },
    { title: "Remarks", key: "remarks" },
    { title: "Remarks by Board", key: "remarksByBoard" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "fullName":
        return <p className="capitalize">{cellValue}</p>;
      case "result":
        if (item?.isVerified === true) {
          return (
            <Chip
              classNames={{ content: "text-green-600" }}
              color="success"
              variant="flat"
              radius="full"
              size="md"
            >
              Eligible
            </Chip>
          );
        } else {
          return (
            <Chip color="warning" variant="flat" radius="full" size="md">
              Pending
            </Chip>
          );
        }
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
                key="verify"
            onPress={() => {
                  setCurrentCandidate(item);
                  setModalType("authority");
                  onOpen();
                }}
              >
                Enter Verified/ Not Verified
              </DropdownItem>
              <DropdownItem
                key="boardReview"
                onPress={() => {
                  setCurrentCandidate(item);
                  setModalType("board");
                  onOpen();
                }}
              >
                Enter Board Review
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );

      default:
        return cellValue;
    }
  }, []);

  const getAllData = async (isFilter: boolean) => {
    setIsLoading(true);
    try {
      const filterOn = `advertisementId=${currentAdvertisementID}&rank=${filterData?.rank}&isVerified=${filterData?.result}`;
      const filterOff = `advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetAllCandidateVerification(
        isFilter ? filterOn : filterOff,
      )) as any;
      console.log("getAllData", { data, error });
      if (data) {
        setAllData(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        // setPage(data?.pagination?.currentPage);
      }
      if (error) {
        toast.error(error);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getAllData(false);
    }
  }, [currentAdvertisementID, page]);

  const authoritiesVerification = async (data: any) => {
    const structureData = {
      advertisementId: currentCandidate?.advertisementId,
      application: currentCandidate?.application,
      userId: currentCandidate?.userId,
      isVerified: data?.isVerified === "verified" ? true : false,
      verificationRemark: data?.verificationRemark,
    };
    console.log("structureData", structureData);
    try {
      const { data, error } = (await CallAuthoritiesCertificateVerification(
        structureData,
      )) as any;

      if (data?.success === true) {
        toast.success(data?.message);
        onClose();
        getAllData(false);
      }
      if (error) {
        toast.error(error);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const boardVerification = async (data: any) => {
    const structureData = {
      advertisementId: currentCandidate?.advertisementId,
      application: currentCandidate?.application,
      userId: currentCandidate?.userId,
      isVerified: data?.isVerified === "verified" ? true : false,
      verificationRemark: data?.verificationRemark,
    };
    try {
      const { data, error } = (await CallBoardCertificateVerification(
        structureData,
      )) as any;

      if (data?.success === true) {
        toast.success(data?.message);
        onClose();
        getAllData(false);
      }
      if (error) {
        toast.error(error);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearFilter = () => {
    setFilterData({
      rank: "",
      result: "",
    });
    getAllData(false);
  };

  // const getAllSports = async () => {
  //   try {
  //     const { data, error } = (await CallGetAllSports("")) as any;
  //     if (data) {
  //       setAllFilters({ ...allFilters, sports: data?.data });
  //     }
  //     if (error) {
  //       toast.error(error);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };
  // useEffect(() => {
  //   getAllSports();
  // }, []);

  return (
    <>
      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        topContent={
          <>
            <h2 className="text-xl font-semibold mob:text-lg">
              List of Candidates for which Certificates sent to Certificates
              Issuing Authorities for Verification
            </h2>

            <div className="grid grid-cols-4 flex-col items-end gap-4 mob:flex mob:items-stretch">
              {/* <Select
                items={allFilters?.sports}
                label="Sports"
                labelPlacement="outside"
                placeholder="Select"
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                )}
              </Select> */}

              <Input
                type="number"
                label="Rank"
                labelPlacement="outside"
                placeholder="Enter rank"
                value={filterData?.rank}
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    rank: e.target.value,
                  });
                }}
              />

              <Select
                items={[
                  {
                    name: "Pending",
                    key: "pending",
                  },
                  {
                    name: "Eligible",
                    key: "eligible",
                  },
                ]}
                label="Result"
                labelPlacement="outside"
                placeholder="Select"
                onChange={(e) => {
                  setFilterData({
                    ...filterData,
                    result: e.target.value,
                  });
                }}
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                )}
              </Select>

              <FilterSearchBtn
                searchFunc={() => {
                  getAllData(true);
                }}
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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "authority"
                  ? "Decision of Certificates Issuing Authorities for Verification"
                  : modalType === "board"
                    ? "Decision of Board for Verification"
                    : ""}
              </ModalHeader>
              <ModalBody className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-2 font-semibold">
                  <Image
                    radius="full"
                    height={90}
                    width={90}
                    src={currentCandidate?.photograph}
                    alt="candidate_img"
                    className="mb-4 h-full w-full object-cover"
                  />

                  <p>
                    Application no.:{" "}
                    <span>{currentCandidate?.applicationNo}</span>
                  </p>
                  {/* <p>
                    Roll no.: <span>{currentCandidate?.rollNumber}</span>
                  </p> */}
                  <p>
                    Aadhaar: <span>{currentCandidate?.aadhaarNumber}</span>
                  </p>
                </div>

                <form
                  className="col-span-2"
                  onSubmit={handleSubmit(
                    modalType === "authority"
                      ? authoritiesVerification
                      : boardVerification,
                  )}
                >
                  <div className="grid grid-cols-1 gap-6">
                    <Controller
                      name="isVerified"
                      control={control}
                      rules={{ required: "field is required" }}
                      render={({ field, fieldState: { error, invalid } }) => (
                        <Select
                          {...field}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                          items={[
                            {
                              key: "verified",
                              name: "Verified",
                            },
                            {
                              key: "notVerified",
                              name: "Not Verified",
                            },
                          ]}
                          label="Verified/ Not Verified"
                          labelPlacement="outside"
                          placeholder="Select"
                        >
                          {(item) => (
                            <SelectItem key={item?.key}>
                              {item?.name}
                            </SelectItem>
                          )}
                        </Select>
                      )}
                    />

                    <Controller
                      name="verificationRemark"
                      control={control}
                      rules={{ required: "Remark is required" }}
                      render={({ field, fieldState: { error, invalid } }) => (
                        <Input
                          {...field}
                          isInvalid={invalid}
                          errorMessage={error?.message}
                          type="text"
                          label="Remark"
                          labelPlacement="outside"
                          placeholder="Enter remark"
                          endContent={
                            <span className="material-symbols-rounded">
                              edit
                            </span>
                          }
                        />
                      )}
                    />
                  </div>

                  <Button
                    color="primary"
                    className="mb-4 mt-3 w-full"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShortlistedCandidateVerification;
