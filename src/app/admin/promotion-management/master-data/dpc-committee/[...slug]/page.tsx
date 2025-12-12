"use client";
import {
  CallCreateGroup,
  CallFindAllAdvertisement,
  CallFindAllSubAdmin,
  CallFindGroup,
  CallGetAllGroup,
  CallGetAllMembers,
  CallGetAllPromotionList,
  CallGetAllSports,
  CallGetKuhsalTeamsByID,
  CallGetMemberRole,
  CallGetpromotioncommitteebyID,
  CallGetRoles,
  CallUpdateCommittee,
  CallUpdateGroup,
} from "@/_ServerActions";
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
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useSession } from "next-auth/react";
import MemberTable from "@/components/MemberTable";
import UserSelectionFilter from "@/components/UserSelectionFilter";
import GlobalAdvertisementFields from "@/components/Fields";

type FilterData = {
  name: string;
  email: string;
  phone: string;
};

const ViewEditDepartment = () => {
  const { slug } = useParams();
  const route = useRouter();
  const {
    isOpen: isOpenUser,
    onOpen: onOpenUser,
    onClose: onCloseUser,
  } = useDisclosure();

  const [sportLoading, setSportLoading] = useState(false);
  // const [defaultSports, setDefaultSports] = useState<Set<string>>(
  //   new Set<string>(),
  // );
  const [expertise, setExpertise] = useState<any[]>([]);
  const [sportsSelected, setSportsSelected] = useState("");
  const [expertiseSelected, setExpertiseSelected] = useState("");
  const [sports, setSports] = useState<any[]>([]);
  const [type, setType] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [Loader, setLoader] = useState<boolean>(false);
  const [Data, setData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [allUser, setAllUser] = useState<any[]>([]);
  const [expertiseLoading, setExpertiseLoading] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    email: "",
    phone: "",
    name: "",
  });
  const [tempData, setTempData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<any>(0);
  // Pagination
  const rowsPerPage = 7;
  const pages = Math.ceil(totalCount / rowsPerPage);

  useEffect(() => {
    if (slug.length === 2) {
      setType(slug[0]);
      setId(slug[1]);
    } else {
      route.back();
    }
  }, [slug]);

  useEffect(() => {
    if (id) {
      getAllData(true);
    }
  }, [id, page]);

  const getData = async (useData?: any) => {
    try {
      setLoader(true);
      const { data, error } = (await CallGetpromotioncommitteebyID(id)) as any;

      if (data) {
        setData(data?.data);
        const sportsSet: Set<string> = new Set(
          (data?.data?.expertise ?? []).map((sport: any) => String(sport._id)),
        );
        console.log("data", data?.data);
        setSportsSelected(data?.data?.groupName);
        setExpertise(data?.data?.expertise);
        const output = data?.data?.members?.map((item: any) => {
          return {
            _id: item?._id,
            userType: null,
            userId: item?.userId,
            memberId: item?.memberId,
            name: item?.name,
            roleId: item?.role?._id,
            phone: item?.phone,
            email: item?.email,
            promotionBasisId: data?.data?.promotionBasisId,
          };
        });
        setSelectedUser(output);
        setTempData(output);
        const updatedMembers = useData.map((member: any) => {
          const user = output.find((user: any) => user?._id === member?._id);
          if (user) {
            member.roleId = user?.roleId;
          }
          return member;
        });
        setAllUser(updatedMembers);
        setLoader(false);
      }
      if (error) {
        handleCommonErrors(error);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const getAllData = async (isFilter: boolean): Promise<void> => {
    try {
      setLoader(true);
      const { data, error } = (await CallGetAllMembers()) as any;
      if (data?.message) {
        const { data: role } = (await CallGetMemberRole()) as any;
        setRoleList(role?.data?.data);
        setLoader(false);
        getData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
        setLoader(false);
      }
    } catch (error: any) {
      console.log(error);
      setLoader(false);
    }
  };

  const validateRole = (id: string) => {
    const findUser = selectedUser?.find((user: any) => user._id === id);
    if (!findUser) {
      return false;
    }
    return !findUser.roleId;
  };

  const validateRoleId = (id: string) => {
    const findUser = selectedUser?.find((user: any) => user._id === id);
    return findUser?.roleId;
  };

  const validateDisabled = (id: string) => {
    const findUser = selectedUser?.find((user: any) => user._id === id);
    return findUser ? false : true;
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
      setLoader(true);
      if (!Data?.committeeName) {
        toast.error("Please enter group name");
        setLoader(false);
        return;
      }
      const data = {
        id: Data?.promotionBasisId,
        groupType: id,
        committeeName: Data?.committeeName,
        members: selectedUser?.map((member: any) => ({
          user: member?.userId ?  member?.userId : member?._id,
          role: member?.roleId,
        })),
      };
      console.log("Update team data:", data);
      const response = await CallUpdateCommittee(data);
      if (response?.data) {
        toast.success("Updated Successfully");
        route.back();
      }
      if (response?.error) {
        console.log(response?.error);
        handleCommonErrors(response?.error);
        setLoader(false);
      }
    } catch (error) {
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setLoader(false);
    }
  };

  const getAllSports = async (): Promise<void> => {
    setSportLoading(true);
    try {
      const { data, error } = (await CallGetAllGroup()) as any;
      if (data) {
        setSports(data?.data);
        getAllPromotion();
        setSportLoading(false);
      }
      if (error) {
        setSportLoading(false);
      }
    } catch (error) {
      setSportLoading(false);
    }
  };

  const getAllPromotion = async (): Promise<void> => {
    setExpertiseLoading(true);
    try {
      const { data, error } = (await CallGetAllPromotionList(
        `id=${sportsSelected}`,
      )) as any;
      if (data) {
        setExpertise(data?.data?.expertise);
        setExpertiseLoading(false);
      }
      if (error) {
        setExpertiseLoading(false);
      }
    } catch (error) {
      setExpertiseLoading(false);
    }
  };

  useEffect(() => {
    getAllPromotion();
  }, [sportsSelected]);

  useEffect(() => {
    getAllSports();
  }, []);

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
      selectedUser?.filter?.((ele: any) => ele?.memberId !== item?.memberId),
    );
    setTempData(
      tempData?.filter?.((ele: any) => ele?.memberId !== item?.memberId),
    );
  };

  const defaultSports = useMemo(() => {
    const match = sports?.find((item) => item.groupName === Data?.groupName);
    return match ? new Set([match._id]) : new Set([]);
  }, [sports, Data]);

  const defaultExpertise = useMemo(() => {
    return Data?.groupData?._id ? new Set([Data.groupData._id]) : new Set([]);
  }, [Data]);

  useEffect(() => {
    if (Data?.groupName) {
      const matchingSport = sports.find(
        (item) => item.groupName === Data.groupName,
      );
      if (matchingSport) {
        setSportsSelected(matchingSport._id);
      }
    }
    if (Data?.groupData?._id) {
      setExpertiseSelected(Data.groupData._id);
    }
  }, [Data, sports]);

  return (
    <>
      <Card className="max-w-full p-2">
        <CardHeader className="flex gap-3">
          <div className="flex w-full items-center justify-between gap-x-3 text-2xl">
            <p className="font-medium">
              {type === "edit" ? "Edit Team" : "View Team"}
            </p>
            <Button onPress={() => route.back()} radius="full">
              <span className="material-symbols-outlined">arrow_back</span> Go
              Back
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mt-4">
            <Input
              className="mb-5 mt-3"
              isRequired
              isDisabled={type !== "edit"}
              label="Name of team"
              type="text"
              placeholder="Enter team name"
              labelPlacement="outside"
              radius="sm"
              value={Data?.committeeName}
              onChange={(e: any) =>
                setData({ ...Data, committeeName: e.target.value })
              }
            />
          </div>

          <Select
            items={sports}
            // isDisabled={type !== "edit"}
            isDisabled={true}
            label="Group name"
            labelPlacement="outside"
            placeholder="Select"
            radius="sm"
            isRequired
            isLoading={sportLoading}
            selectedKeys={
              sportsSelected ? new Set([sportsSelected]) : new Set([])
            }
            className="mb-6"
            onSelectionChange={(e: any) => {
              const selectedId = Array.from(e)[0]?.toString() || "";
              setSportsSelected(selectedId);
            }}
          >
            {(item) => (
              <SelectItem key={item?._id}>{item?.groupName}</SelectItem>
            )}
          </Select>

          <Select
            // isDisabled={type !== "edit"}
            isDisabled={true}
            className="mb-5"
            items={expertise}
            label="Group Type"
            labelPlacement="outside"
            placeholder="Select"
            radius="sm"
            isRequired
            selectedKeys={
              expertiseSelected ? new Set([expertiseSelected]) : new Set([])
            }
            isLoading={expertiseLoading}
            onSelectionChange={(e: any) => {
              const selectedId = Array.from(e)[0]?.toString() || "";
              setExpertiseSelected(selectedId);
            }}
          >
            {(item) => {
              return (
                <SelectItem key={item?._id}>
                  {item?.basisofPromotion}
                </SelectItem>
              );
            }}
          </Select>

          <MemberTable
            members={tempData}
            onDelete={deleteFilter}
            isLoading={Loader}
            onOpenUser={onOpenUser}
            showRole={true}
            roleList={roleList}
            validateDisabled={validateDisabled}
            validateRole={validateRole}
            validateRoleId={validateRoleId}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            showDepartment={true}
            mailButtonShow={true}
            advID={Data?.advertisementId}
            getAllData={getAllData}
            getData={getData}
            type="interview"
            pageType={type}
          />
          {type === "edit" && (
            <div className="flex items-center justify-end">
              <Button
                isDisabled={Loader}
                isLoading={Loader}
                type="button"
                className="float-end mt-3 w-fit px-8"
                variant="solid"
                color="primary"
                size="lg"
                onPress={submitData}
              >
                Update
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        classNames={{
          base: "z-[9999]",
        }}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size={"5xl"}
        isOpen={isOpenUser}
        onClose={() => userSubmit()}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h1>Select Member List</h1>
                  <Button
                    as={Link}
                    href="/admin/kushal-khiladi/master/committee/add"
                    type="button"
                    className="float-end mt-3 w-fit px-8"
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
                  totalPages={pages}
                  isLoading={Loader}
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

export default ViewEditDepartment;
