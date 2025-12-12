"use client";
import React, { useEffect, useState } from "react";
import UserIcon from "@/assets/img/icons/common/noImage.png";
import {
  Button,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Chip,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  CallAllInterview,
  CallRemoveCommitteeMember,
  CallRemoveGroupMember,
  CallSendInterviewCredentialMail,
  CallUpdateMemberAttendance,
} from "@/_ServerActions";

type MemberTableProps = {
  members: any[];
  onDelete: (item: any) => void;
  isLoading: boolean;
  onOpenUser: any;
  showRole?: boolean;
  roleList?: any[];
  validateDisabled?: any;
  validateRole?: any;
  validateRoleId?: any;
  selectedUser?: any;
  setSelectedUser?: any;
  showDepartment?: any;
  mailButtonShow?: any;
  advID?: string;
  type?: string;
  pageType?: string;
  getAllData?: any;
  getData?:any
};

const MemberTable: React.FC<MemberTableProps> = ({
  members,
  onDelete,
  isLoading,
  onOpenUser,
  roleList,
  showRole,
  validateDisabled,
  validateRole,
  validateRoleId,
  selectedUser,
  setSelectedUser,
  showDepartment,
  mailButtonShow,
  advID,
  type,
  getAllData,
  pageType,
  getData
}) => {
  const { slug } = useParams();
  // State to manage delete confirmation modal
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [Loader, setLoader] = useState<any>(false);
  const [LoaderAttendance, setLoaderAttendance] = useState<any>(null);
  const [allInterview, setAllInterview] = useState<any>([]);
  const [interview, setInterview] = useState<any>(null);
  const [tempData, setTempData] = useState<any>(null);
  // useEffect(() => {
  //   if (mailButtonShow && advID) {
  //     getAllList();
  //   }
  // }, [mailButtonShow, advID]);

  useEffect(() => {
    if (isDelete === false) {
      setTempData(null);
    }
  }, [isDelete]);

  // Open delete confirmation modal
  const onOpenDelete = (data: any) => {
    if (type === "interview") {
      setTempData(data);
      setDeleteId(data.memberId);
      setIsDelete(true);
      return;
    }
    setDeleteId(data._id);
    setIsDelete(true);
  };

  // Close delete confirmation modal
  const onCloseDelete = () => {
    setIsDelete(false);
    setDeleteId("");
  };

  const sendMail = async (userIds: any[]) => {
    try {
      if (!interview) {
        toast.error("Interview not selected");
        return;
      }
      setLoader(true);
      const data = {
        interviewId: interview,
        userIds: userIds,
      };
      const response = (await CallSendInterviewCredentialMail(data)) as any;
      if (response?.data) {
        toast.success(response?.data?.message);
      }
      if (response?.error) {
        handleCommonErrors(response?.error);
      }
      setLoader(false);
    } catch (error) {
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setLoader(false);
    }
  };

  // const getAllList = async (): Promise<void> => {
  //   try {
  //     setLoader(true);
  //     const { data, error } = (await CallAllInterview(
  //       `advertisement=${advID}`,
  //     )) as any;
  //     if (data) {
  //       const dataResponse = data as any;
  //       setAllInterview(dataResponse?.data);
  //       if (dataResponse?.data?.length > 0) {
  //         setInterview(dataResponse?.data[0]?._id);
  //       }
  //     }
  //     if (error) {
  //       console.log(error);
  //       toast.error(error?.message);
  //     }
  //     setLoader(false);
  //   } catch (error) {
  //     console.log("error::: ", error);
  //     const dataResponse = error as any;
  //     toast.error(dataResponse?.message);
  //     setLoader(false);
  //   }
  // };

  // console.log("tempdta", tempData);

  const deleteMember = async (): Promise<void> => {
    console.log("kk", tempData);
    try {
      if (type === "interview" && tempData?._id) {
        setLoader(true);
        const dto = {
          groupId: tempData?.promotionBasisId,
          memberId: tempData?._id,
        };
        const { data, error } = (await CallRemoveCommitteeMember(dto)) as any;
        console.log({ data, error });

        if (data) {
          toast.success(data?.message);
          getData()
        }
        if (error) {
          handleCommonErrors(error);
          setLoader(false);
          return;
        }
        const memberToRemove = members.find(
          (member) => member.memberId === deleteId,
        );
        if (memberToRemove) {
          onDelete(memberToRemove);
        }
        setSelectedUser(
          selectedUser?.filter((user: any) => user?.memberId !== deleteId),
        );
        setLoader(false);
      } else {
        const memberToRemove = members.find(
          (member) => member._id === deleteId,
        );
        if (memberToRemove) {
          onDelete(memberToRemove);
        }
        setSelectedUser(
          selectedUser?.filter((user: any) => user?._id !== deleteId),
        );
      }
      onCloseDelete();
    } catch (error) {
      console.log("error::: ", error);
      setLoader(false);
    }
  };

  const changeAttendance = async (status: string, _id: string) => {
    try {
      const dto = {
        groupId: slug[1],
        _id,
        status,
      };
      const { data, error } = (await CallUpdateMemberAttendance(dto)) as any;
      if (data) {
        console.log("data::: ", data);
        toast.success(data?.message);
        getAllData(false);
      }
      if (error) {
        console.log(error);
        toast.error(error?.message);
      }
      setLoaderAttendance(null);
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setLoaderAttendance(null);
    }
  };

  return (
    <>
      {/* {mailButtonShow && (
        <Select
          isLoading={Loader}
          items={allInterview}
          selectedKeys={[interview]}
          name="orgAdmin"
          label="Interview"
          placeholder="Select Interview"
          labelPlacement="outside"
          className="mb-4"
          classNames={{
            label: "mt-1",
            mainWrapper: "mt-[-100px]",
          }}
          startContent={
            <div className="pr-2">
              <i className="fa-solid fa-users" />
            </div>
          }
        >
          {(option: any) => (
            <SelectItem key={option?._id}>{option?.name}</SelectItem>
          )}
        </Select>
      )} */}
      <Table
        topContent={
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">List of Members</h1>
              <div className="flex gap-x-3">
                {/* {mailButtonShow && (
                  <>
                    <Button
                      onPress={() => {
                        sendMail(members?.map((ele: any) => ele?._id));
                      }}
                      isLoading={Loader}
                      color="primary"
                      variant="solid"
                    >
                      Send Mail
                    </Button>
                  </>
                )} */}
                <Button
                  onPress={onOpenUser}
                  color="primary"
                  variant="ghost"
                  className={`${pageType === "view" && "hidden"}`}
                  startContent={<i className="fa-solid fa-plus"></i>}
                >
                  Choose Member
                </Button>
              </div>
            </div>
          </>
        }
      >
        <TableHeader>
          <TableColumn>Full name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Mobile number</TableColumn>
          <TableColumn>{showRole ? "Role" : ""}</TableColumn>
          <TableColumn className="text-center">
            {pageType !== "view" ? "Action" : ""}
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No data found."}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {members?.map((item: any, i: number) => (
            <TableRow key={item?._id}>
              <TableCell className="text-nowrap capitalize">
                <User
                  name={item?.name}
                  avatarProps={{
                    src: item?.profileImage?.presignedUrl ?? UserIcon.src,
                  }}
                  classNames={{
                    name: "!text-nowrap",
                  }}
                />
              </TableCell>
              <TableCell>{item?.email}</TableCell>
              <TableCell>{item?.phone}</TableCell>
              {/* <TableCell>
                {mailButtonShow &&
                  (item?.status === "Absent" ? (
                    <Chip variant="flat" color="danger" radius="sm">
                      Absent
                    </Chip>
                  ) : (
                    <Chip variant="flat" color="success" radius="sm">
                      Present
                    </Chip>
                  ))}
              </TableCell> */}
              <TableCell width={200}>
                {showRole ? (
                  <Select
                    isDisabled={
                      validateDisabled(item?._id) || pageType === "view"
                        ? true
                        : false
                    }
                    items={roleList}
                    placeholder="Role"
                    labelPlacement="outside"
                    errorMessage={"Select role"}
                    isInvalid={validateRole(item?._id)}
                    selectedKeys={[validateRoleId(item?._id)]}
                    onChange={(e: any) => {
                      const findUser = selectedUser?.find(
                        (user: any) => user?._id === item?._id,
                      );
                      if (e.target.value && findUser) {
                        findUser.roleId = e.target.value;
                        setSelectedUser((prevUsers: any) => {
                          return prevUsers.map((user: any) =>
                            user?._id === findUser._id
                              ? { ...user, ...findUser }
                              : user,
                          );
                        });
                      } else if (findUser) {
                        delete findUser.roleId;
                        setSelectedUser((prevUsers: any) => {
                          return prevUsers.map((user: any) =>
                            user._id === findUser._id
                              ? { ...user, ...findUser }
                              : user,
                          );
                        });
                      }
                    }}
                  >
                    {(option: any) => (
                      <SelectItem key={option?._id}>{option?.name}</SelectItem>
                    )}
                  </Select>
                ) : (
                  ""
                )}
              </TableCell>
              {/* <TableCell>
                {showDepartment
                  ? item?.department || <span className="text-center">-</span>
                  : ""}
              </TableCell> */}
              <TableCell>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {pageType !== "view" && (
                    <Tooltip content="Remove">
                      <i
                        onClick={() => onOpenDelete(item)}
                        className="fa-solid fa-trash cursor-pointer p-3 text-lg text-red-500"
                      ></i>
                    </Tooltip>
                  )}
                  {/* {mailButtonShow && (
                    <>
                      <Button
                        onClick={() => sendMail([item?._id])}
                        color="primary"
                        variant="solid"
                        className="mx-2"
                      >
                        Send Mail
                      </Button>
                      {item?.status === "Absent" ? (
                        <Button
                          isLoading={LoaderAttendance === i}
                          onClick={() => {
                            changeAttendance("Present", item?._id);
                            setLoaderAttendance(i);
                          }}
                          color="success"
                          variant="solid"
                        >
                          Present
                        </Button>
                      ) : (
                        <Button
                          isLoading={LoaderAttendance === i}
                          onClick={() => {
                            changeAttendance("Absent", item?._id);
                            setLoaderAttendance(i);
                          }}
                          color="danger"
                          variant="solid"
                        >
                          Absent
                        </Button>
                      )}
                    </>
                  )} */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDelete}
        onOpenChange={onCloseDelete}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to remove this member?
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseDelete}>
                  Close
                </Button>
                <Button
                  isLoading={Loader}
                  color="primary"
                  onPress={() => {
                    deleteMember();
                  }}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MemberTable;
