"use client";
import {
  CallCreateGroup,
  CallFindAllAdvertisement,
  CallFindAllSubAdmin,
  CallFindGroup,
  CallGetAllMembers,
  CallGetAllSports,
  CallGetKuhsalTeamsByID,
  CallGetMemberRole,
  CallGetRoles,
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
import React, { useEffect, useState } from "react";
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
  // state for showing default selected sports
  const [defaultSports, setDefaultSports] = useState<Set<string>>(
    new Set<string>(),
  );
  // state for sending selected sports in required format to the API
  const [sportsSelected, setSportsSelected] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [type, setType] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [Loader, setLoader] = useState<boolean>(false);
  const [groupType, setGroupType] = useState<string>("");
  const [Data, setData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [allUser, setAllUser] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    email: "",
    phone: "",
    name: "",
  });
  const [tempData, setTempData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [advertisement_noId, setAdvertisement_noId] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<any>(0);
  // Pagination
  const rowsPerPage = 7;
  const pages = Math.ceil(totalCount / rowsPerPage);

  useEffect(() => {
    const selectedArray = Array?.from(defaultSports)?.map((key) => ({
      expertiseId: key,
      subExpertise: [],
    }));
    setSportsSelected(selectedArray);
  }, [defaultSports]);

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
      const { data, error } = (await CallGetKuhsalTeamsByID(id)) as any;
      if (data) {
        console.log("CallGetKuhsalTeamsByID", data);
        setData(data);
        const sportsSet: Set<string> = new Set(
          (data?.expertise ?? []).map((sport: any) =>
            String(sport.expertiseId._id),
          ),
        );
        setDefaultSports(sportsSet);
        setGroupType(data?.groupType);

        setAdvertisement_noId(data?.advertisementId);
        const output = data?.members?.map((item: any) => ({
          _id: item?.user?._id ?? "",
          userType: null,
          memberId: item?.memberId,
          name: item?.user?.name,
          roleId: item?.role?._id,
          phone: item?.user?.phone,
          email: item?.user?.email,
        }));
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
      console.log("error::: ", error);
      setLoader(false);
    }
  };

  const getAllData = async (isFilter: boolean): Promise<void> => {
    try {
      setLoader(true);
      const filterOn = `page=${page}&limit=${rowsPerPage}&name=${filterData?.name}&email=${filterData?.email}&phone=${filterData?.phone}`;
      const filterOff = `page=${page}&limit=${rowsPerPage}`;
      // isFilter ? filterOn : filterOff
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
      if (!Data?.groupName) {
        toast.error("Please enter group name");
        setLoader(false);
        return;
      }
      const data = {
        id,
        advertisementId: advertisement_noId,
        groupName: Data?.groupName,
        groupType,
        expertise: sportsSelected,
        members: selectedUser?.map((member: any) => ({
          user: member?._id,
          role: member?.roleId,
        })),
      };
      console.log("Update committee data:", data);

      // if (type === "edit") {
      //   data?.id = id;
      // }
      const response = await CallUpdateGroup(data);
      console.log(response);

      if (response?.data) {
        toast.success("Update Successfully");
        route.back();
      }
      if (response?.error) {
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
      const { data, error } = (await CallGetAllSports()) as any;
      if (data) {
        console.log("Sports", data);
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

  return (
    <>
      <Card className="max-w-full p-2">
        <CardHeader className="flex gap-3">
          <div className="flex w-full items-center justify-between gap-x-3 text-2xl">
            <p className="font-medium">
              {type === "edit" ? "Edit Committee" : "View Committee"}
            </p>
            <Button onPress={() => route.back()} radius="full">
              <span className="material-symbols-outlined">arrow_back</span> Go
              Back
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="col-span-3">
            <GlobalAdvertisementFields
              disabled={true}
              value={advertisement_noId}
              setValue={(id: any) => {
                setAdvertisement_noId(id);
              }}
            />
          </div>
          <div className="mt-4">
            <Input
              className="mb-5 mt-3"
              isRequired
              readOnly={type !== "edit"}
              label="Name of Committee"
              type="text"
              placeholder="Enter Committee name"
              labelPlacement="outside"
              radius="sm"
              value={Data?.groupName}
              onChange={(e: any) =>
                setData({ ...Data, groupName: e.target.value })
              }
              startContent={
                <div className="pr-2">
                  <i className="fa-solid fa-user" />
                </div>
              }
            />
          </div>

          <Select
            items={[
              {
                key: "dvVerification",
                name: "Document Verification Committee",
              },
              { key: "trialMarks", name: "Trial Marks Committee " },
              { key: "twentyMarks", name: "20 Marks Committee" },
            ]}
            label="Group Type"
            labelPlacement="outside"
            placeholder="Select"
            radius="sm"
            isRequired
            className="mb-5"
            isLoading={sportLoading}
            selectedKeys={[groupType]}
            onChange={(e) => setGroupType(e.target.value)}
            startContent={
              <span className="material-symbols-rounded">group</span>
            }
          >
            {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
          </Select>

          <Select
            items={sports}
            label="Sports"
            labelPlacement="outside"
            placeholder="Select"
            radius="sm"
            selectionMode="multiple"
            isRequired
            isLoading={sportLoading}
            selectedKeys={defaultSports}
            className="mb-6"
            onSelectionChange={(e: any) => {
              setDefaultSports(e);
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
