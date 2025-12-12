"use client";
import FlatCard from "@/components/FlatCard";
import CardGrid from "@/components/kushal-components/CardGrid";
import {
  Accordion,
  AccordionItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import dynamicData from "@/assets/data/viewModalData.json";

type Props = {};

const EligibleCandidates = (props: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isView,
    onOpen: onView,
    onOpenChange: onOpenView,
  } = useDisclosure();
  const [currentApplicationData, setCurrentApplicationData] =
    useState<any>(dynamicData);
  const [advertisementId, setAdvertisementId] = useState<any>("");

  const [cardData] = useState([
    {
      title: "Total Applications for DV/PST",
      value: "-",
    },
    {
      title: "Total Eligible Candidate in DV/PST",
      value: "-",
    },
    {
      title: "Total Ineligible Candidate in DV/PST",
      value: "-",
    },
  ]);

  const [data] = useState<any[]>([
    {
      _id: 0,
      regNo: "-",
      rollNo: "-",
      fullName: "-",
      gender: "-",
      rank: "-",
      dob: "-",
    },
  ]);

  const columns = [
    { title: "Registration No.", key: "regNo" },
    { title: "Roll No.", key: "rollNo" },
    { title: "Full name", key: "fullName" },
    { title: "Gender", key: "gender" },
    { title: "Rank", key: "rank" },
    { title: "Date of Birth", key: "dob" },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="view"
                onPress={() => {
                  const updatedJson = updateCurrentUserData(item);
                  setCurrentApplicationData(updatedJson);
                  onView();
                  setAdvertisementId(item?.userId?.candidateId);
                }}
              >
                View
              </DropdownItem>
              <DropdownItem key="remark" onPress={onOpen}>
                Remark
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const modalRenderCell = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "competitionCertificate":
        return (
          <Button
            size="md"
            variant="light"
            className="bg-transparent hover:!bg-transparent"
            isIconOnly
          >
            <Image
              src={pdf.src}
              width={30}
              height={30}
              className="object-contain"
              alt="pdfIcon"
            />
          </Button>
        );
      default:
        return cellValue;
    }
  };

  const modalRenderTable = (columns: any[], rows: any[]) => (
    <div className="overflow-x-scroll">
      <Table removeWrapper className="mb-6">
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{modalRenderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const updateCurrentUserData = (currentItem: any) => {
    const jsonUI = currentApplicationData.accordionItems;

    const getNestedValue = (path: any, obj: any) =>
      path
        .split(".")
        .reduce((acc: any, key: any) => (acc ? acc[key] : "NA"), obj);

    return jsonUI.map((section: any) => {
      if (section.title) {
        const updatedData = section?.data?.map((detail: any) => {
          const value = getNestedValue(detail.key, currentItem);
          return { ...detail, value: value || "NA" };
        });
        return { ...section, data: updatedData };
      }
      return section;
    });
  };

  return (
    <>
      <FlatCard heading="DV/PST Eligible Candidates">
        <CardGrid data={cardData} columns={3} />
      </FlatCard>

      <Table
        color="default"
        topContent={
          <div className="grid grid-cols-4 items-end gap-4">
            <Input
              type="text"
              placeholder="Search by registration no."
              endContent={
                <span className="material-symbols-rounded">search</span>
              }
            />
            <Input
              type="text"
              placeholder="Search by roll no."
              endContent={
                <span className="material-symbols-rounded">search</span>
              }
            />
            <Select
              items={[
                {
                  key: "noData",
                  name: "--",
                },
              ]}
              label="Gender"
              labelPlacement="outside"
              placeholder="Select"
            >
              {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
            </Select>
            <Select
              items={[
                {
                  key: "noData",
                  name: "--",
                },
              ]}
              label="Rank"
              labelPlacement="outside"
              placeholder="Select"
            >
              {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
            </Select>
          </div>
        }
        bottomContent={
          <div className="flex justify-end">
            <Pagination showControls total={1} initialPage={1} />
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
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Remark</ModalHeader>
              <ModalBody>
                <Textarea
                  variant="bordered"
                  label="Enter remark"
                  labelPlacement="outside"
                  placeholder=" "
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isView}
        onOpenChange={onOpenView}
        placement="top"
        className="max-w-[100rem]"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">
                  Application number: <span>{advertisementId}</span>
                </h1>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-6">
                <Accordion className="rounded-lg" defaultExpandedKeys="all">
                  {currentApplicationData?.map((item: any, index: number) => (
                    <AccordionItem
                      key={index}
                      title={
                        <h5 className="text-xl font-semibold">{item?.title}</h5>
                      }
                    >
                      {item?.renderElement === "table" ? (
                        <div>{modalRenderTable(item?.columns, item?.rows)}</div>
                      ) : (
                        <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
                          {item?.data?.map((item: any, index: number) => (
                            <div className="grid grid-cols-2 gap-6" key={index}>
                              {/* Heading */}
                              <div className="flex">
                                <div>
                                  <span
                                    className="material-symbols-rounded me-2 align-bottom"
                                    style={{ color: "rgb(100 116 139)" }}
                                  >
                                    {item?.icon}
                                  </span>
                                </div>
                                <div className="font-semibold">
                                  {item?.title}
                                </div>
                              </div>
                              {item?.dataType === "document" &&
                              item?.value !== "NA" ? (
                                <Link href={item?.value} target="_blank">
                                  <Button
                                    variant="bordered"
                                    className="border py-6 font-medium"
                                  >
                                    <Image
                                      src={pdf}
                                      className="h-[30px] w-[30px] object-contain"
                                      alt="pdf"
                                    />
                                    Document
                                  </Button>
                                </Link>
                              ) : item?.dataType === "date" ? (
                                moment(item?.value).format("YYYY-MM-DD")
                              ) : (
                                <p className="font-medium">{item?.value}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EligibleCandidates;
