import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import {
  Accordion,
  AccordionItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import pdf from "@/assets/img/icons/common/pdf-icon.png";
import UserSportsDetailsTable from "./UserSportsDetailsTable";

type candidateModal = {
  currentApplicationData: any;
  selectedItem: any;
  viewModal: boolean;
  hideSportsDetails?: boolean;
  setViewModal: (open: any) => void;
};

function CandidateDetailsModal({
  currentApplicationData,
  viewModal,
  setViewModal,
  selectedItem,
  hideSportsDetails,
}: candidateModal) {
  const modalRenderCell = (item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "competitionCertificate":
        return (
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

  return (
    <Modal
      isOpen={viewModal}
      onOpenChange={(open) => setViewModal(open)}
      placement="top"
      className="max-w-[100rem]"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">
                Application number:{" "}
                <span>{selectedItem?.userDetails?.candidateId}</span>
              </h1>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-6">
              <Accordion className="rounded-lg" defaultExpandedKeys="all">
                {currentApplicationData?.map((item: any, index: number) => { 
                  const padding  = item?.title === 'Permanenet Address' ? 'mob:pl-4' : 'mob:pl-8';
                  return (
                  <AccordionItem
                    key={index}
                    title={
                      <h5 className="text-xl font-semibold">{item?.title}</h5>
                    }
                  >
                    {item?.renderElement === "table" ? (
                      <div>{modalRenderTable(item?.columns, item?.rows)}</div>
                    ) : (
                      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 mob:grid-cols-1">
                        {item?.data?.map((item: any, index: number) => {
                          return (
                          <div
                            className="grid grid-cols-2 gap-6 mob:grid-cols-1"
                            key={index}
                          >
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
                              <div className="font-semibold">{item?.title}</div>
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
                              <p className={`font-medium ${padding}`}>
                                {item?.value}
                              </p>
                            )}
                          </div>
                        )})}
                      </div>
                    )}
                  </AccordionItem>
                )})}
              </Accordion>

              {!hideSportsDetails && (
                <UserSportsDetailsTable
                  data={selectedItem?.sportsCertificate}
                />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CandidateDetailsModal;
