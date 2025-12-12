"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
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
import React, { useEffect, useState } from "react";
import {
  CallCreateTeam,
  CallGetAllMembers,
  CallGetAllSports,
  CallGetMemberRole,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleCommonErrors } from "@/Utils/HandleError";
import UserSelectionFilter from "@/components/UserSelectionFilter";
import GlobalAdvertisementFields from "@/components/Fields";
import MemberTable from "@/components/MemberTable";

type FilterData = {
  name: string;
  email: string;
  phone: string;
};

const TeamAdd = () => {
  const route = useRouter();

  const {
    isOpen: isOpenUser,
    onOpen: onOpenUser,
    onClose: onCloseUser,
  } = useDisclosure();

  const [Loading, setLoading] = useState<boolean>(false);
  const [sportLoading, setSportLoading] = useState(false);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [allUser, setAllUser] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [advertisement_noId, setAdvertisement_noId] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<any>(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sports, setSports] = useState<any[]>([]);
  const [sportsSelected, setSportsSelected] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    email: "",
    phone: "",
    name: "",
  });
  const [tempData, setTempData] = useState<any>([]);

  useEffect(() => {
    getAllData(true);
  }, [page]);

  const getAllData = async (isFilter: boolean): Promise<void> => {
    try {
      setLoading(true);
      const filterOn = `page=${page}&limit=10&name=${filterData?.name}&email=${filterData?.email}&phone=${filterData?.phone}`;
      const filterOff = `page=1&limit=10`;
      const { data, error } = (await CallGetAllMembers(
        isFilter ? filterOn : filterOff,
      )) as any;
      console.log("getallMembers", data, error);
      if (data?.message) {
        setTotalPages(data?.pagination?.totalPages);
        setAllUser(data?.data);
        setTotalCount(data?.totalCounts);
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

  const getAllRole = async (): Promise<any> => {
    try {
      const { data, error } = (await CallGetMemberRole()) as any;
      if (data?.message) {
        console.log("Roles: ", data);
        setRoleList(data?.data?.data);
      }
      if (error) {
        console.log(error);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    onOpenUser();
    getAllRole();
  }, []);

  const getAllSports = async (): Promise<void> => {
    setSportLoading(true);
    try {
      const { data, error } = (await CallGetAllSports()) as any;

      if (data) {
        setSports(data?.data);
        setSportLoading(false);
      }
      if (error) {
        console.log(error);
        setSportLoading(false);
      }
    } catch (error) {
      console.log(error);
      setSportLoading(false);
    }
  };
  useEffect(() => {
    getAllSports();
  }, []);

  const validateRole = (id: string) => {
    const findUser = selectedUser?.find((user: any) => user._id === id);
    if (!findUser) {
      return false;
    }
    return !findUser.roleId;
  };

  const validateDisabled = (id: string) => {
    const findUser = selectedUser?.find((user: any) => user._id === id);
    return findUser ? false : true;
  };

  const validateRoleId = (id: string) => {
    const findUser = selectedUser?.find((user: any) => user._id === id);
    return findUser?.roleId;
  };

  const userSubmit = () => {
    if (selectedUser?.length > 0) {
      const roleIdSet = selectedUser
        ?.map((user: any) => {
          if (user?.roleId) {
            return true;
          }
        })
        .filter((item: any) => item !== undefined);
      if (roleIdSet?.length !== selectedUser?.length) {
        toast.error("Please select role");
        return;
      }
      onCloseUser();
      setTempData(selectedUser);
    } else {
      toast.error("Please select member");
    }
  };

  const submitData = async () => {
    try {
      setLoading(true);
      if (!groupName) {
        toast.error("Please enter panel name");
        setLoading(false);
        return;
      }
      const data = {
        advertisementId: advertisement_noId,
        groupName,
        groupType: "team",
        expertise: sportsSelected,
        members: selectedUser?.map((member: any) => ({
          user: member?._id,
          role: member?.roleId,
        })),
      };
      const response = await CallCreateTeam(data);
      if (response?.data) {
        toast.success("Team created successfully!");
        route.back();
      }
      if (response?.error) {
        handleCommonErrors(response?.error);
      }
      setLoading(false);
    } catch (error) {
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
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
    setTempData(tempData?.filter?.((ele: any) => ele?._id !== item?._id));
  };

  return (
    <>
      <Card className="max-w-full p-3">
        <CardHeader className="flex gap-3">
          <div className="flex w-full items-center justify-between gap-x-3 text-2xl">
            <p className="font-semibold">Add Team</p>
            <Button
              radius="full"
              onPress={() => route.back()}
              className="font-medium"
            >
              <span className="material-symbols-outlined">arrow_back</span> Go
              Back
            </Button>
          </div>
        </CardHeader>
        <CardBody className="gap-6">
          <GlobalAdvertisementFields
            value={advertisement_noId}
            setValue={setAdvertisement_noId}
          />

          <Input
            isRequired
            label="Name of team"
            type="text"
            placeholder="Enter team name"
            labelPlacement="outside"
            radius="sm"
            value={groupName}
            onChange={(e: any) => setGroupName(e.target.value)}
            startContent={
              <div className="pr-2">
                <i className="fa-solid fa-user" />
              </div>
            }
          />

          <Select
            items={sports}
            label="Sports"
            labelPlacement="outside"
            placeholder="Select"
            radius="sm"
            selectionMode="multiple"
            isRequired
            isLoading={sportLoading}
            onSelectionChange={(e: any) => {
              const selectedArray = Array?.from(e)?.map((key) => ({
                expertiseId: key,
                subExpertise: [],
              }));
              setSportsSelected(selectedArray);
            }}
            startContent={
              <span className="material-symbols-rounded">
                sports_basketball
              </span>
            }
          >
            {(item) => <SelectItem key={item?._id}>{item?.name}</SelectItem>}
          </Select>

          <MemberTable
            members={tempData}
            onDelete={deleteFilter}
            isLoading={Loading}
            onOpenUser={onOpenUser}
            showRole={true}
            roleList={roleList}
            validateDisabled={validateDisabled}
            validateRole={validateRole}
            validateRoleId={validateRoleId}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              color="primary"
              className="px-12"
              onPress={submitData}
            >
              Submit
            </Button>
          </div>
        </CardBody>
      </Card>

      <Modal
        classNames={{
          base: "z-[9999]",
        }}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="5xl"
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
                    href="/admin/kushal-khiladi/master/user-management"
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
                <UserSelectionFilter
                  filterData={filterData}
                  setFilterData={setFilterData}
                  allUser={allUser}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  isLoading={Loading}
                  getAllData={getAllData}
                  clearFilter={clearFilter}
                  deleteFilter={deleteFilter}
                  // validate={3}
                  showRole={true}
                  roleList={roleList}
                  validateDisabled={validateDisabled}
                  validateRole={validateRole}
                  validateRoleId={validateRoleId}
                />
              </ModalBody>
              <ModalFooter>
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

export default TeamAdd;
