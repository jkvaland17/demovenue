"use client";
import {
  CallGetAllAdhiyaachanList,
  CallUpdateAdhiyaachan,
} from "@/_ServerActions";
import SearchInput from "@/components/Custom/SearchInput";
import FlatCard from "@/components/FlatCard";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Input, Textarea } from "@nextui-org/input";
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
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const columns = [
  { title: "Title", key: "title" },
  { title: "Reference number", key: "referenceNumber" },
  { title: "Description", key: "description" },
  // { title: "Department", key: "departments_To_Sent" },
  // { title: "Status", key: "status" },
  { title: "Actions", key: "actions" },
];

type ChipColor =
  | "bg-blue-600"
  | "bg-rose-600"
  | "bg-amber-400"
  | "bg-fuchsia-600"
  | "bg-green-500"
  | "bg-teal-500"
  | undefined;

const AdhiyaachanTable = () => {
  const [allList, setAllList] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    table: false,
    Update: false,
  });
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<any>("");
  const { control, setValue, handleSubmit } = useForm();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [totalPages, setTotalPages] = useState<any>("");
  const [modalType, setModalType] = useState<string>("");
  const departments = [
    { _id: "dept1", value: "Department 1" },
    { _id: "dept2", value: "Department 2" },
    { _id: "dept3", value: "Department 3" },
  ];
  const router = useRouter();

  const statusColorMap: { [key: string]: ChipColor } = {
    Pending: "bg-blue-600",
    Returned: "bg-rose-600",
    Ongoing: "bg-amber-400",
    ForthComing: "bg-fuchsia-600",
    Completed: "bg-green-500",
    Release: "bg-teal-500",
  };

  const getAdhiyaachanList = async (filter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    const filterON = `page=${page}&limit=10&title=${searchValue}`;
    const filterOFF = `page=&limit=10&title=`;
    try {
      const { data, error } = (await CallGetAllAdhiyaachanList(
        filter ? filterON : filterOFF,
      )) as any;
      console.log("CallGetAllAdhiyaachanList", data);
      if (data.data) {
        setAllList(data.data);
        setTotalPages(data?.data?.totalPages);
      }
      if (error) {
        handleCommonErrors(Error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const handleEdit = (id: any) => {
    router.push(`/admin/adhiyaachan-advertisement/adhiyaachan-submission?id=${id}`);
  };

  // const UpdateAdhiaachanList = async (dto: any) => {
  //   setLoader((prev: any) => ({
  //     ...prev,
  //     Update: true,
  //   }));
  //   try {
  //     const { data, error } = (await CallUpdateAdhiyaachan(dto)) as any;
  //     if (data?.data) {
  //       toast.success(data?.message);
  //       onClose();
  //       getAdhiyaachanList(false);
  //     }
  //     if (error) {
  //       handleCommonErrors(error);
  //     }
  //     setLoader((prev: any) => ({
  //       ...prev,
  //       Update: false,
  //     }));
  //   } catch (error) {
  //     console.log("error", error);
  //     setLoader((prev: any) => ({
  //       ...prev,
  //       Update: false,
  //     }));
  //   }
  // };

  // const handleCloseModel = () => {
  //   const newArray = [
  //     "title",
  //     "referenceNumber",
  //     "departments_To_Sent",
  //     "description",
  //     "totalNumberOfVacancies",
  //   ];
  //   newArray.forEach((item: string) => {
  //     setValue(item, "");
  //   });
  // };

  useEffect(() => {
    getAdhiyaachanList(false);
  }, [page]);

  const renderCell = useCallback(
    (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "title":
        case "referenceNumber":
        case "description":
        case "departments_To_Sent":
          return <p>{cellValue}</p>;
        case "status":
          return (
            <Chip
              classNames={{
                content: ["text-center", "text-white"],
                base: ["border-none", `${statusColorMap[item?.status]}`],
              }}
              color="secondary"
              variant="bordered"
              radius="full"
              size="md"
            >
              {item?.status}
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
                <DropdownItem key="edit" onPress={() => handleEdit(item?._id)}>
                  Edit
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return "";
      }
    },
    [page, allList],
  );

  return (
    <FlatCard heading="Adhiyaachan Table">
      {loader?.table ? (
        <TableSkeleton columnsCount={5} rowsCount={5} />
      ) : (
        <Table
          shadow="none"
          className="mt-6"
          classNames={{
            wrapper: "p-0 overflow-auto scrollbar-hide",
          }}
          color="default"
          aria-label="Example static collection table"
          topContent={
            <SearchInput
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              functionCall={getAdhiyaachanList}
            />
          }
          bottomContent={
            <div className="flex justify-end">
              <Pagination
                showControls
                page={page}
                total={totalPages ?? 0}
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
              >
                {column.title}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={allList}>
            {(item: any) => (
              <TableRow key={item?._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* <Modal
        isOpen={isOpen}
        onClose={handleCloseModel}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Adhiyaachan Table
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(UpdateAdhiaachanList)}
                  className="flex flex-col gap-6"
                >
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        type="text"
                        label="Title"
                        labelPlacement="outside"
                        placeholder="Enter Title"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        isDisabled={modalType === "view"}
                      />
                    )}
                  />

                  <Controller
                    name="referenceNumber"
                    control={control}
                    rules={{ required: "Reference is required" }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        isRequired
                        label="Reference Number"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Reference Number"
                        isDisabled={true}
                      />
                    )}
                  />

                  <Controller
                    name="departments_To_Sent"
                    control={control}
                    rules={{ required: "Department is required" }}
                    render={({
                      fieldState: { invalid, error },
                      field: { onChange, value },
                    }) => (
                      <Select
                        placeholder="Select Department"
                        label="Department"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        selectedKeys={[value]}
                        errorMessage={error?.message}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        items={departments}
                        isDisabled={modalType === "view"}
                      >
                        {(option: any) => (
                          <SelectItem key={option?._id} value={option?._id}>
                            {option?.value}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="totalNumberOfVacancies"
                    control={control}
                    rules={{ required: "Reference is required" }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Input
                        {...field}
                        isRequired
                        label="Total number of vacancies"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Total number of vacancies"
                        isDisabled={modalType === "view"}
                      />
                    )}
                  />
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Reference is required" }}
                    render={({ fieldState: { invalid, error }, field }) => (
                      <Textarea
                        {...field}
                        isRequired
                        label="Description"
                        labelPlacement="outside"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        placeholder="Enter Description"
                        isDisabled={modalType === "view"}
                        className={`${modalType === "view" && `mb-3`}`}
                      />
                    )}
                  />

                  {modalType !== "view" && (
                    <div className="mb-3 flex gap-6">
                      <Button
                        type="button"
                        variant="bordered"
                        color="default"
                        className="w-full"
                        onPress={() => {
                          handleCloseModel();
                          onClose();
                        }}
                      >
                        Close
                      </Button>
                      <Button
                        type="submit"
                        variant="shadow"
                        className="w-full bg-black text-white"
                        isLoading={loader.Update}
                      >
                        Update
                      </Button>
                    </div>
                  )}
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </FlatCard>
  );
};

export default AdhiyaachanTable;
