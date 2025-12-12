"use client";
import {
  CallGetAllSports,
  CallGetShortlistedCandidates,
  CallUpdateCertificateVerification,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FlatCard from "@/components/FlatCard";
import { Input } from "@nextui-org/input";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

const ShortlistedCandidates = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();
  const [currentCandidate, setCurrentCandidate] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allShortlistedCandidates, setAllShortlistedCandidates] = useState<
    any[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allFilters, setAllFilters] = useState<any>({
    sports: [],
    rank: [],
  });

  const getShortedCandidates = async () => {
    setIsLoading(true);
    try {
      const query = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetShortlistedCandidates(
        query,
      )) as any;
      console.log("getShortedCandidates", { data, error });
      if (data) {
        setAllShortlistedCandidates(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.currentPage ?? page);
        setIsLoading(false);
      }
      if (error) {
        toast.error(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getShortedCandidates();
    }
  }, [currentAdvertisementID, page]);

  const updateVerification = async (data: any) => {
    const structureData = {
      advertisementId: currentAdvertisementID,
      application: currentCandidate?.application,
      userId: currentCandidate?.userId,
      sentOnDate: data?.sentOnDate,
      sentVia: data?.sentVia,
      remark: data?.remark,
    };
    console.log("structureData", structureData);
    try {
      const { data, error } = (await CallUpdateCertificateVerification(
        structureData,
      )) as any;

      if (data?.success === true) {
        toast.success(data?.message);
        onClose();
        getShortedCandidates();
      }
      if (error) {
        toast.error(error);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Chest No.", key: "chestNo" },
    { title: "Sports", key: "sportName" },
    { title: "Full name", key: "fullName" },
    { title: "Total Marks Obtained ( OUT OF 80)", key: "totalTrialMarks" },
    { title: "Marks out of 20 on Sports Cerificate", key: "marks" },
    { title: "Total Marks", key: "totalMarks" },
    { title: "Rank", key: "rank" },
    { title: "Remarks", key: "remark" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "fullName":
        return <p className="capitalize">{cellValue}</p>;
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
                key="sentOn"
                onPress={() => {
                  onOpen();
                  setCurrentCandidate(item);
                }}
              >
                Enter Dispatch Details
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );

      default:
        return cellValue;
    }
  }, []);

  const getAllSports = async () => {
    try {
      const { data, error } = (await CallGetAllSports("")) as any;
      if (data) {
        setAllFilters({ ...allFilters, sports: data?.data });
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

  return (
    <>
      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        topContent={
          <>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Shortlisted Candidates</h2>
              <Button
                color="success"
                variant="shadow"
                className="px-8 text-white"
              >
                Export to Excel
              </Button>
            </div>
            <div className="grid grid-cols-4 items-end gap-4">
              <Select
                items={allFilters?.sports}
                label="Sports"
                labelPlacement="outside"
                placeholder="Select"
              >
                {(item: any) => (
                  <SelectItem key={item?._id}>{item?.name}</SelectItem>
                )}
              </Select>
              <Input
                type="number"
                label="Rank"
                labelPlacement="outside"
                placeholder="Enter rank"
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
          items={allShortlistedCandidates}
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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Certificates Verification Dispatch Details
              </ModalHeader>
              <ModalBody className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-2 font-semibold">
                  <div className="mb-4 aspect-square w-2/3 rounded-full bg-slate-300"></div>

                  <p>
                    Application no.:{" "}
                    <span>{currentCandidate?.applicationNo}</span>
                  </p>
                  <p>
                    Roll no.: <span>{currentCandidate?.rollNo}</span>
                  </p>
                  <p>
                    Aadhaar: <span>{currentCandidate?.aadhaarNumber}</span>
                  </p>
                </div>

                <form
                  className="col-span-2 grid grid-cols-1 gap-6"
                  onSubmit={handleSubmit(updateVerification)}
                >
                  <Controller
                    name="sentOnDate"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Input
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        type="date"
                        label="Sent on date"
                        labelPlacement="outside"
                      />
                    )}
                  />

                  <Controller
                    name="sentVia"
                    control={control}
                    rules={{ required: "Field is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Select
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        items={[
                          {
                            key: "Email",
                            name: "Email",
                          },
                          {
                            key: "Post",
                            name: "Post",
                          },
                        ]}
                        label="Sent via"
                        labelPlacement="outside"
                        placeholder="Select"
                      >
                        {(item) => (
                          <SelectItem key={item?.key}>{item?.name}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="remark"
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
                          <span className="material-symbols-rounded">edit</span>
                        }
                      />
                    )}
                  />

                  <Button
                    color="primary"
                    className="mb-4 w-full"
                    type="submit"
                    isLoading={isSubmitting}
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

export default ShortlistedCandidates;
