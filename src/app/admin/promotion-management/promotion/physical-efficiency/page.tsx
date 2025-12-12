"use client";
import {
  CallPromotionQualifiedCandidates,
  CallUpdatePhysicalQualification,
} from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  Chip,
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
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const PhysicalEfficiency = (props: Props) => {
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentCandidate, setCurrentCandidate] = useState<string>("");
  const [physicalQualification, setPhysicalQualification] =
    useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isQualified,
    onOpen: onQualified,
    onOpenChange: onOpenQualified,
    onClose: onUpdateClose,
  } = useDisclosure();

  const columns = [
    { title: "Seniority List Serial No.", key: "srNo" },
    { title: "Eligibility List Serial No.", key: "eligibleNo" },
    { title: "Employee Name", key: "employeeName" },
    { title: "Father's Name", key: "fatherName" },
    { title: "PNO No.", key: "PNO" },
    { title: "Current Posting", key: "posting" },
    { title: "Date of Birth", key: "dob" },
    {
      title: "Date of Promotion to the Post of Head Constable",
      key: "promotionDate",
    },
    { title: "Date of Recruitment", key: "recruitmentDate" },
    {
      title: "Physical Efficiency Test Qualified/No Qualified",
      key: "phsicalQualification",
    },
    { title: "Actions", key: "actions" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "srNo":
        return <p>{item?.seniorityPromotionList?.seniorityListSerialNo}</p>;
      case "promotionDate":
        return (
          <p>
            {moment(item?.seniorityPromotionList?.promotionDate).format(
              "DD-MM-YYYY",
            )}
          </p>
        );
      case "recruitmentDate":
        return (
          <p>
            {moment(item?.seniorityPromotionList?.recruitmentDate).format(
              "DD-MM-YYYY",
            )}
          </p>
        );
      case "eligibleNo":
        return <p>{item?.seniorityPromotionList?.eligibilityListSerialNo}</p>;
      case "employeeName":
        return <p>{item?.seniorityPromotionList?.employeeName}</p>;
      case "fatherName":
        return <p>{item?.seniorityPromotionList?.fatherName}</p>;
      case "PNO":
        return <p>{item?.seniorityPromotionList?.pnoNumber}</p>;
      case "posting":
        return <p>{item?.seniorityPromotionList?.currentPosting}</p>;
      case "dob":
        return (
          <p>
            {moment(item?.seniorityPromotionList?.dateOfBirth).format(
              "DD-MM-YYYY",
            )}
          </p>
        );
      case "phsicalQualification":
        return (
          <Chip
            variant="flat"
            color={
              item?.seniorityPromotionList?.physicalQualification ===
              "qualified"
                ? "success"
                : item?.seniorityPromotionList?.physicalQualification ===
                    "notQualified"
                  ? "danger"
                  : "warning"
            }
            classNames={{ content: "capitalize" }}
          >
            {item?.seniorityPromotionList?.physicalQualification === "qualified"
              ? "Qualified"
              : item?.seniorityPromotionList?.physicalQualification ===
                  "notQualified"
                ? "Not Qualified"
                : "Pending"}
          </Chip>
        );
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
                key="test"
                onPress={() => {
                  onQualified();
                  setCurrentCandidate(item?.pnoNumber);
                }}
              >
                Submit Physical Efficiency Test Qualified/Not Qualified
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const getAllQualifiedCandidates = async () => {
    try {
      setIsLoading(true);
      const query = `page=${page}&limit=10`;
      const { data, error } = (await CallPromotionQualifiedCandidates(
        query,
      )) as any;
      console.log("getAllQualifiedCandidates", { data, error });

      if (data) {
        setAllCandidates(data?.data?.DcpPromotionData);
        setPage(data?.data.currentPage);
        setTotalPage(data?.data?.totalPages);
      }
      if (error) {
        toast?.error(error);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllQualifiedCandidates();
  }, []);

  const updatePhysicalStatus = async () => {
    try {
      setIsUpdating(true);
      const obj = {
        physicalQualification,
        pnoNumber: currentCandidate,
      };
      console.log("obj", obj);
      const { data, error } = (await CallUpdatePhysicalQualification(
        obj,
      )) as any;
      console.log("updatePhysicalStatus", { data, error });

      if (data?.status_code === 200) {
        toast?.success(data?.message);
        getAllQualifiedCandidates();
        onUpdateClose();
      }
      if (error) {
        toast?.error(error);
      }
      setIsUpdating(false);
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  return (
    <>
      <FlatCard heading="Physical Efficiency Test">
        <Table
          removeWrapper
          color="default"
          topContent={
            <div className="grid grid-cols-4 items-end gap-4">
              <Select
                items={[{ key: "noData", name: "--" }]}
                label="Post"
                labelPlacement="outside"
                placeholder="Select"
              >
                {(item) => (
                  <SelectItem key={item?.key}>{item?.name}</SelectItem>
                )}
              </Select>
              <Input
                placeholder="Search"
                endContent={
                  <span className="material-symbols-rounded">search</span>
                }
              />
              <Button
                color="primary"
                onPress={onOpen}
                startContent={
                  <span className="material-symbols-rounded">upload</span>
                }
              >
                Upload PET File
              </Button>
            </div>
          }
          bottomContent={
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                align={column.key === "actions" ? "center" : "start"}
                className="text-wrap"
              >
                {column.title}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={allCandidates}
            isLoading={isLoading}
            loadingContent={<Spinner />}
            emptyContent="No data"
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </FlatCard>

      <Modal isOpen={isQualified} onOpenChange={onOpenQualified}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Submit Physical Efficiency Test Qualified/Not Qualified
              </ModalHeader>
              <ModalBody className="gap-6">
                <Select
                  items={[
                    { key: "qualified", name: "Qualified" },
                    { key: "notQualified", name: "Not Qualified" },
                  ]}
                  label="Qualified/Not Qualified"
                  labelPlacement="outside"
                  placeholder="Select"
                  onChange={(e) => {
                    setPhysicalQualification(e.target.value);
                  }}
                >
                  {(item) => (
                    <SelectItem key={item?.key}>{item?.name}</SelectItem>
                  )}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  className="w-full"
                  isLoading={isUpdating}
                  onPress={updatePhysicalStatus}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload PET File
              </ModalHeader>
              <ModalBody>
                <Button variant="bordered" className="justify-between">
                  Upload Data File
                  <span className="material-symbols-rounded">upload_file</span>
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PhysicalEfficiency;
