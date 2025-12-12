"use client";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import imageIcon from "@/assets/img/icons/image.png";
import React, { useState } from "react";
import { MapPin } from "lucide-react";
import moment from "moment";

type Props = {
  additionalData: any;
  centerName: string;
  examDate: string;
};

const AttendanceSheet: React.FC<Props> = ({
  additionalData,
  centerName,
  examDate,
}) => {
  const {
    isOpen: isMap,
    onOpen: onMap,
    onOpenChange: onOpenMap,
  } = useDisclosure();
  const { latitude, longitude, address } = additionalData?.location || {};
  const columns = [
    { title: "Title", key: "title" },
    { title: "Input value", key: "input" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "input":
        if (Array.isArray(item?.input)) {
          const isAllImages = item?.input.every((val: string) =>
            val?.match(/\.(jpeg|jpg|png|gif|webp)$/),
          );

          if (isAllImages) {
            return (
              <div className="flex flex-wrap gap-2">
                {item?.input?.map((url: string, index: number) => (
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
          } else {
            return (
              <div className="flex flex-col gap-1 text-sm text-default-600">
                {item?.input?.map((val: string, index: number) => (
                  <span key={index}>{val}</span>
                ))}
              </div>
            );
          }
        } else {
          return (
            <span className="text-default-600">
              {item?.input ? String(item?.input) : "-"}
            </span>
          );
        }
      default:
        return cellValue;
    }
  }, []);

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
                {examDate ? moment(examDate).isValid() ? moment(examDate).format("DD-MM-YYYY") : "-" : "-"}
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
          items={additionalData?.fields || []}
          emptyContent="No data"
          isLoading={false}
          loadingContent={<Spinner />}
        >
          {(item: any) => (
            <TableRow key={item?.key}>
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
    </div>
  );
};

export default AttendanceSheet;
