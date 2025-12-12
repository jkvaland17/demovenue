"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import imageIcon from "@/assets/img/icons/image.png";
import React, { useEffect, useState } from "react";
import { Check, CircleAlert, House, MapPin, X } from "lucide-react";
import { CallUpdateCenterVerificationOfficers } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import moment from "moment";

type Props = {
  centerVerificationData: any;
  centerverificationId: string;
  centerVerification: any;
  centerVerificationParsedFields: any;
  centerName: string;
};

const CenterVerification: React.FC<Props> = ({
  centerVerificationData,
  centerverificationId,
  centerVerification,
  centerVerificationParsedFields,
  centerName,
}) => {
  const { id } = useParams();
  const {
    isOpen: isMap,
    onOpen: onMap,
    onOpenChange: onOpenMap,
  } = useDisclosure();
  const {
    isOpen: isRoom,
    onOpen: onRoom,
    onOpenChange: onOpenRoom,
  } = useDisclosure();
  const { latitude, longitude, address } =
    centerVerificationData?.location || {};
  const [roomData, setRoomData] = useState<[]>([]);

  const columns = [
    { title: "", key: "isVerified" },
    { title: "Title", key: "title" },
    { title: "Center Value", key: "center" },
    { title: "Remark/Correct value", key: "remark" },
    { title: "Input value", key: "input" },
    { title: "Actions", key: "actions" },
  ];

  const updateCenterVerificationOfficers = async (
    keyName: string,
    isVerified: Boolean,
  ) => {
    try {
      const submitData = {
        keyName,
        id: centerverificationId || "688c5f0d0e8527ebaec40960",
        phaseKey: "center_verification",
        center: id,
        isVerified: isVerified,
      };
      console.log("submitData", submitData);
      const { data, error } = (await CallUpdateCenterVerificationOfficers(
        submitData,
      )) as any;
      console.log("updateCenterVerificationOfficers", { data, error });
      if (data) {
        toast?.success(data?.message);
        centerVerification();
        centerVerificationParsedFields();
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const roomField = centerVerificationData?.fields?.find(
      (field: any) => field?.key === "room_wise_seating_capacity",
    );
    if (roomField?.input && Array.isArray(roomField?.input)) {
      setRoomData(roomField?.input);
    }
  }, [centerVerificationData]);

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "input":
        const isRoomWiseSeating = item?.key === "room_wise_seating_capacity";
        const isImageArray =
          item?.type === "image" &&
          Array.isArray(cellValue) &&
          cellValue.every((url: any) => typeof url === "string");
        if (isRoomWiseSeating) {
          return (
            <Button
              size="sm"
              variant="bordered"
              onPress={onRoom}
              className="text-xs"
            >
              <House color="#0062ff" /> View Room
            </Button>
          );
        }
        if (isImageArray) {
          return (
            <div className="flex gap-1">
              {cellValue.map((url: string, index: number) => (
                <Link href={url} key={index} target="_blank">
                  <Image
                    src={imageIcon}
                    alt="Uploaded"
                    className="h-[30px] w-[30px] object-contain"
                  />
                </Link>
              ))}
            </div>
          );
        }

        return (
          <span className="text-default-600">
            {cellValue ? String(cellValue) : "-"}
          </span>
        );

      case "center":
        return <span>{item?.center || "-"}</span>;
      case "remark":
        return <span>{item?.remark || "-"}</span>;
      case "actions":
        return item?.isVerified === false ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="approve"
                color="success"
                className="text-success"
                onPress={() =>
                  updateCenterVerificationOfficers(item?.key, true)
                }
              >
                Approve
              </DropdownItem>
              <DropdownItem
                key="reject"
                color="danger"
                className="text-danger"
                onPress={() =>
                  updateCenterVerificationOfficers(item?.key, false)
                }
              >
                Reject
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          "-"
        );
      case "isVerified":
        return (
          <div>
            {item?.isVerified === true ? (
              <Check color={"#16A34A"} strokeWidth={3} />
            ) : item?.isVerified === false ? (
              <X color={"#F97316"} strokeWidth={3} />
            ) : (
              ""
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  // console.log("centerVerificationData from centre verification: -", centerVerificationData);
  

  return (
    <div>
      <Table
        shadow="none"
        color="default"
        classNames={{
          wrapper: "p-1 overflow-auto",
        }}
        topContent={
          <div className="flex items-center justify-between">
            <Button
              onPress={onMap}
              variant="bordered"
              className="rounded-lg border-gray-300 text-sm font-medium text-black"
              startContent={<MapPin size={18} />}
            >
              {address || "No Location Found"}
            </Button>
            <div className="text-sm text-gray-700">
              Submitted on:{" "}
              <span className="font-bold">
                {moment(centerVerificationData?.submitDateTime).format(
                  "YYYY-MM-DD HH:mm A",
                )}
              </span>
            </div>
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
              className="text-wrap mob:text-nowrap"
            >
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={centerVerificationData?.fields || []}
          emptyContent="No data"
          isLoading={false}
          loadingContent={<Spinner />}
        >
          {(item: any) => (
            <TableRow
              key={item?.key}
              className={item?.isVerified === false ? "bg-red-100" : ""}
            >
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isMap} onOpenChange={onOpenMap} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">
                {`Latitude : ${latitude} And Longitude : ${longitude}`}
              </ModalHeader> */}
              <ModalBody>
                <iframe
                  src={`https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="mb-4"
                ></iframe>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isRoom} onOpenChange={onOpenRoom} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Room-wise Seating Capacity</ModalHeader>
              <ModalBody>
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Room No</th>
                      <th className="border px-2 py-1">Raw Capacity</th>
                      <th className="border px-2 py-1">Allocated</th>
                      <th className="border px-2 py-1">Required CCTV</th>
                      <th className="border px-2 py-1">Functional CCTV</th>
                      <th className="border px-2 py-1">Photos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomData?.map((room: any, idx: number) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{room?.roomNumber}</td>
                        <td className="border px-2 py-1">
                          {room?.rawCapacity}
                        </td>
                        <td className="border px-2 py-1">
                          {room?.allocatedCapacity}
                        </td>
                        <td className="border px-2 py-1">
                          {room?.requiredCctvCount}
                        </td>
                        <td className="border px-2 py-1">
                          {room?.functionalCctvCount}
                        </td>
                        <td className="border px-2 py-1">
                          <div className="flex gap-1">
                            {room?.photos?.map((url: string, i: number) => (
                              <Link href={url} key={i} target="_blank">
                                <Image
                                  src={imageIcon}
                                  alt="Uploaded"
                                  className="h-[30px] w-[30px] object-contain"
                                />
                              </Link>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CenterVerification;
