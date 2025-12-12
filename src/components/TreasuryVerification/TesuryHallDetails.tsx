"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import imageIcon from "@/assets/img/icons/image.png";
import moment from "moment";
import React from "react";

type HallField = {
  key: string | number;
  title: string;
  input: string | string[];
};
type Location = { latitude?: number; longitude?: number; address?: string };
type HallData = {
  location?: Location;
  centerVerificationData?: string;
  fields?: HallField[];
  roomNumber?: number;
};
type Props = { hallData: HallData[]; centerName: string };

const TreasuryHallDetails: React.FC<Props> = ({ hallData }) => {
  const columns = [
    { title: "Title", key: "title" },
    { title: "Input value", key: "input" },
  ];
  const {
    isOpen: isMap,
    onOpen: onMap,
    onOpenChange: onOpenMap,
  } = useDisclosure();

  const renderCell = React.useCallback(
    (item: HallField, columnKey: React.Key) => {
      if (columnKey === "input") {
        if (Array.isArray(item.input) && item.input.length > 0) {
          return (
            <div className="flex flex-wrap gap-2">
              {item.input.map((url, i) => (
                <Link href={url} key={i} target="_blank">
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
        return <span>{item.input || "-"}</span>;
      }
      return <span>{item.title}</span>;
    },
    [],
  );

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">Room Details</h3>

      {hallData?.map((roomItem: HallData, index: number) => {
        const { latitude, longitude, address } = roomItem?.location || {};

        return (
          <div key={index} className="mb-6 rounded-lg border p-4">
            <h4 className="text-md mb-2 font-medium text-gray-600">
              Room {roomItem.roomNumber || index + 1}
            </h4>

            <Table
              shadow="none"
              color="default"
              classNames={{ wrapper: "p-1 overflow-auto" }}
              topContent={
                <div className="flex items-center justify-between gap-3">
                  <Button
                    onPress={onMap}
                    variant="bordered"
                    className="max-w-[70%] whitespace-normal rounded-lg border-gray-300 text-left text-sm font-medium text-black"
                    startContent={<MapPin size={18} />}
                  >
                    {address || "No Location Found"}
                  </Button>

                  <div className="whitespace-nowrap text-sm text-gray-700">
                    Submitted on:{" "}
                    <span className="font-bold">
                      {moment(roomItem?.centerVerificationData).format(
                        "YYYY-MM-DD hh:mm A",
                      )}
                    </span>
                  </div>
                </div>
              }
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.title}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={roomItem?.fields || []} emptyContent="No data">
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Modal isOpen={isMap} onOpenChange={onOpenMap} size="3xl">
              <ModalContent>
                <ModalBody>
                  {latitude && longitude ? (
                    <iframe
                      src={`https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No map data available
                    </div>
                  )}
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        );
      }) || <p className="text-gray-500">No room data available.</p>}
    </div>
  );
};

export default TreasuryHallDetails;
