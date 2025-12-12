"use client";

import SearchIcon from "@/assets/img/svg/Search";
import {
  Avatar,
  AvatarGroup,
  Button,
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
  Tooltip,
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
import Link from "next/link";
import React, { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import {
  CallAddSubjectExpert,
  CallGetDvpstAllMembers,
  CallGetKuhsalTeams,
} from "@/_ServerActions";
import UserIcon from "@/assets/img/icons/common/noImage.png";
import { handleCommonErrors } from "@/Utils/HandleError";
import UserSelectionFilter from "@/components/UserSelectionFilter";
import { useAdvertisement } from "@/components/AdvertisementContext";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";

type Item = {
  groupName: string;
};

type FilterData = {
  name: string;
  email: string;
  phone: string;
  advertisementNo?: string;
};

const CommitteeKushal: React.FC = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const [allList, setAllList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState<any>(0);
  const [totalCountAdmin, setTotalCountAdmin] = useState<any>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allUser, setAllUser] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [pageAdmin, setPageAdmin] = useState(1);
  const [specialtyList, setSpecialtyList] = useState<any>([]);
  const [specialtyId, setSpecialtyId] = useState<any>(null);
  const [loader, setLoader] = useState<any>({ excel: false, pdf: false });
  const [filterData, setFilterData] = useState<FilterData>({
    email: "",
    phone: "",
    name: "",
  });
  const [selectUser, setSelectUser] = useState<any>(null);
  const {
    isOpen: isOpenUser,
    onOpen: onOpenUser,
    onClose: onCloseUser,
  } = useDisclosure();

  useEffect(() => {
    if (currentAdvertisementID) {
      getAllList(true);
    }
  }, [page, currentAdvertisementID]);

  useEffect(() => {
    getAllList(false);
  }, []);

  useEffect(() => {
    getAllData(true);
  }, [pageAdmin]);

  useEffect(() => {
    if (isOpenUser === false) {
      setFilterData({
        email: "",
        phone: "",
        name: "",
        advertisementNo: "",
      });
      getAllData(false);
      setSpecialtyId(null);
      setSelectedUser([]);
    }
  }, [isOpenUser]);

  // Pagination
  const rowsPerPage = 10;
  const pages = Math.ceil(totalCount / rowsPerPage);
  const pagesAdmin = Math.ceil(totalCountAdmin / rowsPerPage);

  const getAllList = async (filter: boolean) => {
    try {
      setIsLoading(true);
      const filterOn = `page=${page}&limit=${rowsPerPage}&groupName=${searchQuery}&groupType=team&advertisementId=${currentAdvertisementID}`;
      console.log(filterOn);

      const filterOff = `page=${page}&limit=${rowsPerPage}&groupType=team&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetKuhsalTeams(
        filter ? filterOn : filterOff,
      )) as any;
      if (data) {
        const dataResponse = data as any;
        console.log("All teams: ", dataResponse);

        setAllList(dataResponse?.data as any);
        setTotalCount(dataResponse?.totalCounts);
      }
      if (error) {
        console.log("error::: ", error);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setIsLoading(false);
    }
  };

  const getAllData = async (isFilter: boolean): Promise<void> => {
    try {
      setLoading(true);
      const filterOn = `page=${pageAdmin}&limit=${rowsPerPage}&name=${filterData?.name}&email=${filterData?.email}&phone=${filterData?.phone}`;
      const filterOff = `page=${pageAdmin}&limit=${rowsPerPage}`;
      // isFilter ? filterOn : filterOff
      const { data, error } = (await CallGetDvpstAllMembers()) as any;
      console.log("All members: ", data);
      if (data?.message) {
        setAllUser(data?.data);
        setTotalCountAdmin(data?.totalCounts);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilterData({
      ...filterData,
      email: "",
      phone: "",
      name: "",
    });
    getAllData(false);
  };

  const deleteFilter = (item: any) => {
    setSelectedUser(
      selectedUser?.filter?.((ele: any) => ele?._id !== item?._id),
    );
  };

  const userSubmit = async () => {
    try {
      if (selectedUser?.length > 0) {
        setLoading(true);
        const data: any = {
          id: selectUser?._id,
          department: specialtyId,
          advertisementId: selectUser?.advertisementId,
          members: selectedUser?.map((member: any) => ({
            user: member?._id,
          })),
        };
        const response = await CallAddSubjectExpert(data);
        if (response?.data) {
          toast.success("Subject Expert Add Successfully");
          onCloseUser();
        }
        if (response?.error) {
          handleCommonErrors(response?.error);
        }
        setLoading(false);
      } else {
        toast.error("Please select member");
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") return;
    getAllList(true);
  };

  return (
    <>
      <Table
        isStriped={true}
        topContent={
          <div className="flex flex-col gap-6 mob:flex-col">
            <div className="flex items-center justify-between mob:flex-col mob:items-start mob:gap-4">
              <p className="text-nowrap text-xl font-medium">All Teams List</p>
              <div className="flex items-center gap-4 mob:w-full mob:flex-col mob:items-stretch">
                <div className="flex mob:w-full">
                  <Input
                    type="text"
                    className="w-full mob:w-auto tab:w-[inherit]"
                    placeholder="Team name"
                    labelPlacement="outside"
                    classNames={{
                      inputWrapper:
                        "w-[250px] border bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white rounded-e-none pe-1 mob:w-full",
                    }}
                    startContent={<SearchIcon />}
                    endContent={
                      searchQuery && (
                        <Button
                          size="sm"
                          radius="full"
                          variant="light"
                          startContent={
                            <span className="material-symbols-rounded">
                              close
                            </span>
                          }
                          isIconOnly
                          onPress={() => {
                            setSearchQuery("");
                            getAllList(false);
                          }}
                        />
                      )
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    color="primary"
                    className="rounded-s-none"
                    isLoading={false}
                    onPress={handleSearch}
                  >
                    Search
                  </Button>
                </div>

                <div className="flex items-center gap-2 mob:w-full mob:justify-between">
                  <ExcelPdfDownload
                    excelFunction={() => {
                      DownloadKushalExcel(
                        ``,
                        "Document verification",
                        setLoader,
                      );
                    }}
                    pdfFunction={() => {
                      DownloadKushalPdf(``, "Document verification", setLoader);
                    }}
                    excelLoader={loader?.excel}
                    pdfLoader={loader?.pdf}
                  />

                  <Button
                    href="/admin/dvpst-management/dvpst/team-management/add"
                    as={Link}
                    type="button"
                    className="px-12 mob:flex-1"
                    color="primary"
                  >
                    <i className="fa-solid fa-plus" />
                    Create Team
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
        bottomContent={
          totalPage > 0 && (
            <div className="flex w-full justify-end">
              <Pagination
                showControls
                showShadow
                color="primary"
                total={totalPage}
                page={page}
                onChange={(page: any) => setPage(page)}
              />
            </div>
          )
        }
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Group Type</TableColumn>
          <TableColumn>Members</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn className="text-center">Action</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No data found."}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {allList?.map((item: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{item?.groupName}</TableCell>
              <TableCell>{item?.groupType}</TableCell>
              <TableCell>
                {item?.members?.length > 0 ? (
                  <AvatarGroup
                    isBordered
                    max={3}
                    total={item?.members?.length - 3}
                  >
                    {item?.members?.map((ele: any, i: number) => (
                      <Avatar
                        size="sm"
                        key={i}
                        src={
                          ele?.user?.profileImage?.presignedUrl ?? UserIcon.src
                        }
                      />
                    ))}
                  </AvatarGroup>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <span className="text-nowrap">
                  {" "}
                  {moment(item?.created_at).format("DD MMM, YYYY")}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-x-3">
                  <Tooltip content="View">
                    <Link
                      href={`/admin/dvpst-management/dvpst/team-management/view/${item?._id}`}
                    >
                      <i className="fa-solid fa-eye text-xl text-blue-600"></i>
                    </Link>
                  </Tooltip>
                  <Tooltip content="Edit">
                    <Link
                      href={`/admin/dvpst-management/dvpst/team-management/edit/${item?._id}`}
                    >
                      <i className="fa-solid fa-pen-to-square text-lg text-gray-500"></i>
                    </Link>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        classNames={{
          base: "z-[9999]",
        }}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size={"5xl"}
        isOpen={isOpenUser}
        onClose={() => onCloseUser()}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex flex-col items-center justify-between md:flex-row">
                  <h1 className="text-nowrap">Select Member List</h1>
                  <Button
                    as={Link}
                    href="/admin/kushal-khiladi/master/team-management/add"
                    type="button"
                    className="float-end mr-3 w-fit px-8"
                    variant="ghost"
                    color="primary"
                    startContent={<i className="fa-solid fa-plus"></i>}
                  >
                    Add Member
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody>
                {specialtyList?.length > 0 && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <Select
                      labelPlacement="outside"
                      classNames={{ label: "text-md mt-1" }}
                      label="Department"
                      selectedKeys={[specialtyId]}
                      items={specialtyList}
                      onSelectionChange={(e: any) => {
                        setSpecialtyId(Array.from(e)[0]);
                      }}
                      placeholder="Select Department"
                      startContent={
                        <span className="material-symbols-outlined">
                          respiratory_rate
                        </span>
                      }
                    >
                      {(option: any) => (
                        <SelectItem key={option?._id}>
                          {option?.value}
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                )}
                <UserSelectionFilter
                  filterData={filterData}
                  setFilterData={setFilterData}
                  allUser={allUser}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  page={page}
                  setPage={setPageAdmin}
                  totalPages={pagesAdmin}
                  isLoading={Loading}
                  getAllData={getAllData}
                  clearFilter={clearFilter}
                  deleteFilter={deleteFilter}
                  showRole={false}
                />
              </ModalBody>
              <ModalFooter className="pt-1">
                <Button
                  className="px-6"
                  color="danger"
                  variant="flat"
                  onPress={() => onCloseUser()}
                >
                  Close
                </Button>
                <Button
                  className="px-6"
                  color="primary"
                  variant="solid"
                  onPress={userSubmit}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommitteeKushal;
