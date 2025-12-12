"use client";
import { DPCAccordianItems } from "@/assets/data/dpcVerification";
import FlatCard from "@/components/FlatCard";
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};

const DPCVerification = (props: Props) => {
  const {
    isOpen: isRemarkModal,
    onOpen: onRemarkModal,
    onOpenChange: onOpenRemarkModal,
  } = useDisclosure();
  const {
    isOpen: isConsentModal,
    onOpen: onConsentModal,
    onOpenChange: onOpenConsentModal,
  } = useDisclosure();
  const [modalType, setModalType] = useState("view");
  const [candidateData, setCandidateData] = useState<{
    accordianItem: {
      title: string;
      data: {
        id: number;
        fieldName: string;
        value: React.JSX.Element | string | string[];
        status: string;
        remark: string;
      }[];
    }[];
  }>({
    accordianItem: DPCAccordianItems,
  });

  const columns = [
    { name: "Field Name", uid: "fieldName" },
    { name: "Registration Value", uid: "value" },
    { name: "Status", uid: "status" },
    { name: "Remarks for valid and invaild", uid: "remark" },
  ];

  const updateStatus = (
    sectionIndex: number,
    itemId: number,
    newStatus: string,
  ) => {
    setCandidateData((prevData) => {
      const updatedData = { ...prevData };
      updatedData.accordianItem[sectionIndex].data = updatedData.accordianItem[
        sectionIndex
      ].data.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item,
      );
      return updatedData;
    });
  };

  const renderTable = (data: any, sectionIndex: number) => (
    <Table
      removeWrapper
      aria-label="Kushal Khiladi Scrunity application"
      className="mb-6"
    >
      <TableHeader columns={columns}>
        {(column: { name: string; uid: string }) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "remark" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item: any) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(sectionIndex, item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderCell = (sectionIndex: number, item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "value":
        return cellValue === "photograph" ? (
          <div className="flex gap-6">
            <div>
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <Image
                  src=""
                  alt="Photograph"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs mt-1">Registered Photograph</p>
            </div>

            <div>
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <Image
                  src=""
                  alt="Photograph"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs mt-1">Exam Day Photograph</p>
            </div>

            <div>
              <Button className="h-28 w-28 rounded-full bg-gray-200">
                <span
                  className="material-symbols-rounded"
                  style={{ color: "black" }}
                >
                  add
                </span>
              </Button>
              <p className="text-xs mt-1">Current Photograph</p>
            </div>
          </div>
        ) : cellValue === "signature" ? (
          <div className="flex gap-6 mt-8">
            <div>
              <div className="flex h-28 w-32 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                <img
                  src=""
                  alt="Signature"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs mt-1">Registered Signature</p>
            </div>

            <div>
              <div className="flex h-28 w-32 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                {/* <img
                      src=""
                      alt="Signature"
                      className="h-full w-full object-cover"
                    /> */}
              </div>
              <p className="text-xs mt-1">Exam Day Signature</p>
            </div>

            <div>
              <Button className="h-28 w-32 rounded-md bg-gray-200">
                <span
                  className="material-symbols-rounded"
                  style={{ color: "black" }}
                >
                  add
                </span>
              </Button>
              <p className="text-xs mt-1">Current Signature</p>
            </div>
          </div>
        ) : cellValue === "document" ? (
          <Button
            size="sm"
            variant="light"
            className="text-sm font-medium text-green-700"
          >
            <span
              className="material-symbols-rounded"
              style={{ color: "rgb(100 116 139)" }}
            >
              draft
            </span>
            View
          </Button>
        ) : Array.isArray(cellValue) ? (
          cellValue.join(", ")
        ) : (
          cellValue
        );
      case "status":
        return (
          <div className="flex gap-2">
            <Button
              variant={cellValue === "Valid" ? "solid" : "ghost"}
              color={cellValue === "Valid" ? "success" : "default"}
              radius="full"
              className={`text-white ${cellValue === "Valid" ? "" : "border border-slate-400 text-black"}`}
              onPress={() => updateStatus(sectionIndex, item.id, "Valid")}
            >
              Matched
            </Button>
            <Button
              variant={cellValue === "Invalid" ? "solid" : "ghost"}
              color={cellValue === "Invalid" ? "danger" : "default"}
              radius="full"
              className={`${cellValue === "Invalid" ? "" : "border border-slate-400"}`}
              onPress={() => updateStatus(sectionIndex, item.id, "Invalid")}
            >
              Unmatched
            </Button>
          </div>
        );
      case "remark":
        return (
          <div className="flex justify-center gap-4">
            <Tooltip content="View Remark">
              <Button
                onPress={() => {
                  setModalType("view");
                  onRemarkModal();
                }}
                color="primary"
                variant="flat"
                radius="full"
                className="p-0 min-w-fit w-[40px] h-[40px]"
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "rgb(29 78 216)" }}
                >
                  visibility
                </span>
              </Button>
            </Tooltip>

            <Tooltip content="Add/Edit Remark">
              <Button
                onPress={() => {
                  setModalType("edit");
                  onRemarkModal();
                }}
                color="secondary"
                variant="flat"
                radius="full"
                className="p-0 min-w-fit w-[40px] h-[40px]"
              >
                <span
                  className="material-symbols-rounded"
                  style={{ color: "rgb(109 40 217)" }}
                >
                  edit
                </span>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };
  return (
    <>
      <FlatCard heading="DPC Form Verification">
        <Accordion className="rounded-lg p-0" defaultExpandedKeys="all">
          {candidateData?.accordianItem?.map((item, index) => (
            <AccordionItem
              key={index}
              title={<h5 className="font-semibold text-xl">{item?.title}</h5>}
            >
              {renderTable(item?.data, index)}
            </AccordionItem>
          ))}
        </Accordion>

        <div className="grid grid-cols-2 gap-28 mt-6">
          <Button color="danger" className="bg-red-600">
            Unfit
          </Button>
          <Button
            color="success"
            className="text-white"
            onPress={() => {
              setModalType("final_remark");
              onRemarkModal();
            }}
          >
            Fit
          </Button>
        </div>
      </FlatCard>

      <Modal isOpen={isRemarkModal} onOpenChange={onOpenRemarkModal} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "view"
                  ? "View Remark"
                  : modalType === "edit"
                    ? "Add/Edit Remark"
                    : modalType === "final_remark"
                      ? "Final Remark"
                      : ""}
              </ModalHeader>
              <ModalBody>
                {modalType === "view" ? (
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Nostrum deleniti nulla iusto. Libero at, iste, incidunt
                    molestiae quia eius, modi odit repellendus non totam
                    repudiandae doloremque ipsa et cum necessitatibus!
                  </p>
                ) : modalType === "edit" ? (
                  <Textarea
                    variant="bordered"
                    label="Enter remark"
                    labelPlacement="outside"
                    placeholder=" "
                  />
                ) : modalType === "final_remark" ? (
                  <Textarea
                    variant="bordered"
                    label="Enter remark"
                    labelPlacement="outside"
                    placeholder=" "
                    isRequired
                  />
                ) : (
                  ""
                )}
              </ModalBody>
              <ModalFooter>
                {modalType === "view" ? (
                  ""
                ) : modalType === "edit" ? (
                  <Button color="primary" className="w-full">
                    Submit
                  </Button>
                ) : modalType === "final_remark" ? (
                  <Button
                    color="primary"
                    className="w-full"
                    onPress={() => {
                      onClose();
                      onConsentModal();
                    }}
                  >
                    Submit
                  </Button>
                ) : (
                  ""
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isConsentModal}
        placement="top-center"
        onOpenChange={onOpenConsentModal}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Before submitting the application, please review the following
                details carefully:
              </ModalHeader>
              <ModalBody id="consent-modal-body">
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    <span className="font-semibold">
                      Scrutiny Process Completion:
                    </span>{" "}
                    Ensure that all assigned sections have been thoroughly
                    reviewed and verified.
                  </li>
                  <li>
                    <span className="font-semibold">Final Review:</span> Valid
                    that all corrections and updates, if any, have been
                    incorporated.
                  </li>
                  <li>
                    <span className="font-semibold">Acknowledgment:</span> By
                    proceeding, you acknowledge that the scrutiny process has
                    been completed to the best of your ability.
                  </li>
                </ol>

                <div className="my-4 text-center">
                  <h2 className="text-lg font-semibold">
                    Are you sure you want to submit this application for final
                    approval?
                  </h2>
                  <p className="text-sm text-gray-600">
                    Once submitted, no further changes can be made.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2 gap-6">
                <Button variant="bordered" className="border" onPress={onClose}>
                  Cancel
                </Button>
                <Button className="bg-black text-white" onPress={onClose}>
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

export default DPCVerification;
