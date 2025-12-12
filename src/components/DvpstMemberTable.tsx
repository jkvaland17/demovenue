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
import { CallRemoveCommitteeMemberDvpst } from "@/_ServerActions";

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
  getData?: any;
  groupId?: string;
};

const DvpstMemberTable: React.FC<MemberTableProps> = ({
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
  getData,
  groupId,
}) => {
  const { slug } = useParams();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [Loader, setLoader] = useState<any>(false);
  const [tempData, setTempData] = useState<any>(null);

  useEffect(() => {
    if (isDelete === false) {
      setTempData(null);
    }
  }, [isDelete]);

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

  const onCloseDelete = () => {
    setIsDelete(false);
    setDeleteId("");
  };

  const deleteMember = async (): Promise<void> => {
    console.log("kk", tempData);
    try {
      if (type === "interview" && tempData?._id) {
        setLoader(true);
        const dto = {
          groupId: groupId,
          memberId: tempData?.memberId,
        };
        const { data, error } = (await CallRemoveCommitteeMemberDvpst(
          dto,
        )) as any;
        console.log({ data, error });

        if (data) {
          toast.success(data?.message);
          getAllData();
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

  return (
    <>
      <Table
        topContent={
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">List of Members</h1>
              <div className="flex gap-x-3">
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

export default DvpstMemberTable;
