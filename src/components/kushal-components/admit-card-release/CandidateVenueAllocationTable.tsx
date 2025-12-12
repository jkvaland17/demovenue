import { CallReleaseAdmitCard } from "@/_ServerActions";
import { EyeFilledIcon } from "@/assets/img/svg/EyeFilledIcon";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const columns = [
  { title: "No.", key: "No" },
  { title: "Venue", key: "venueName" },
  { title: "Sports", key: "sportsName" },
  { title: "Male Candidates", key: "maleApplicants" },
  { title: "Female Candidates", key: "femaleApplicants" },
  { title: "Fit Candidates", key: "totalApplicants" },
  // { title: "Remaining Capacity", key: "remaining" },
  { title: "Trial Start Date", key: "trialStartDate" },
  { title: "Trial End Date", key: "trialEndDate" },
  { title: "DV Start Date", key: "dvStartDate" },
  { title: "DV End Date", key: "dvEndDate" },
];

const releaseAdmitCardColumns = [
  ...columns,
  { title: "Release Date", key: "created_at" },
  // { title: "Release Candidates", key: "released" },
  { title: "Pending Candidates", key: "pendingCandidates" },
  { title: "Status", key: "admitCardReleaseStatus" },
  { title: "Action", key: "action" },
];
const AllocatedColumns = [
  ...columns,
  { title: "Allocated Candidate", key: "allocated" },
  { title: "Allocation Date", key: "created_at" },
  { title: "Status", key: "admitCardReleaseStatus" },
  { title: "Action", key: "action" },
];

type CandidateVenueAllocationProps = {
  loader: any;
  tableData: any[];
  title?: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  button?: {
    title: string;
    onClick: () => void;
  };
  type?: string;
  setFilterData: any;
  filterData?: any;
  functionCall: any;
  clearFilter: any;
};

export default function CandidateVenueAllocation({
  loader,
  tableData,
  title,
  page,
  setPage,
  setTotalPages,
  totalPages,
  button,
  setFilterData,
  filterData,
  functionCall,
  clearFilter,
  type = "candidateVenueAllocation",
}: CandidateVenueAllocationProps) {
  const [loading, setLoading] = useState<any>({
    releaseAdmitCard: false,
  });

  const statusColorMap: { [key: string]: ChipColor } = {
    pending: "warning",
    released: "success",
  };

  const ReleaseAdmitCard = async (allocationId: string) => {
    setLoading((prev: any) => ({
      ...prev,
      releaseAdmitCard: true,
    }));
    try {
      const query = `candidateAllocatedId=${allocationId}`;
      const { data, error } = (await CallReleaseAdmitCard(query)) as any;

      if (data) {
        toast.success(data?.message);
        window.location.reload();
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoading((prev: any) => ({
        ...prev,
        releaseAdmitCard: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoading((prev: any) => ({
        ...prev,
        releaseAdmitCard: false,
      }));
    }
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, index: number) => {
      const cellValue = item[columnKey as any];
      const actualIndex = Math.abs(page - 1) * 10 + (index + 1);
      switch (columnKey) {
        case "No":
          return <p className="text-bold text-sm capitalize">{actualIndex}</p>;
        case "created_at":
        case "trialStartDate":
        case "trialEndDate":
        case "dvStartDate":
        case "dvEndDate":
          return <p>{moment(cellValue).format("DD/MM/YYYY")}</p>;
        case "admitCardReleaseStatus":
          return (
            <Chip
              color={statusColorMap[cellValue]}
              variant="flat"
              radius="full"
              size="md"
              className="capitalize"
            >
              {cellValue || `N/A`}
            </Chip>
          );

        case "action":
          return type === "candidateVenueAllocation" ? (
            <Tooltip content="Release Admit Card">
              <Button
                onPress={() => ReleaseAdmitCard(item?._id)}
                variant="solid"
                color="primary"
                isIconOnly
                startContent={
                  loading?.releaseAdmitCard ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <span className="material-symbols-rounded">send</span>
                  )
                }
              />
            </Tooltip>
          ) : (
            <Tooltip content={"View"}>
              <Link
                href={`/admin/kushal-khiladi/kushal/admit-card-release/admit-card/${item?._id}`}
                className="flex justify-center text-xl text-blue-500"
              >
                <EyeFilledIcon />
              </Link>
            </Tooltip>
          );

        default:
          return <p>{cellValue}</p>;
      }
    },
    [page],
  );

  return (
    <Table
      isStriped
      className="mb-6"
      color="default"
      aria-label="Example static collection table"
      topContent={
        <>
          <div className="flex items-center justify-between mob:flex-col gap-2 mob:items-start">
            <h2 className="text-xl font-semibold mob:text-lg">{title}</h2>
            {button && (
              <div>
                <Button
                  variant="solid"
                  color="primary"
                  onPress={button.onClick}

                >
                  {button.title}
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-end gap-3 mob:flex flex-col mob:items-stretch">
            <Input
              type="date"
              label="Start Date"
              labelPlacement="outside"
              value={filterData?.startDate}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  startDate: e.target.value,
                })
              }
            />
            <Input
              type="date"
              label="End Date"
              labelPlacement="outside"
              value={filterData?.endDate}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  endDate: e.target.value,
                })
              }
            />
            <div>
              <FilterSearchBtn
                clearFunc={() => clearFilter()}
                searchFunc={() => functionCall()}
              />
            </div>
          </div>
        </>
      }
      bottomContent={
        <div className="flex justify-end">
          <Pagination
            showControls
            total={totalPages}
            initialPage={1}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader
        columns={
          type === "candidateVenueAllocation"
            ? AllocatedColumns
            : releaseAdmitCardColumns
        }
      >
        {(column: any) => (
          <TableColumn
            key={column.key}
            align={column.key === "action" ? "center" : "start"}
          >
            {column.title}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent="No data"
        isLoading={loader}
        loadingContent={<Spinner />}
      >
        {tableData?.map((item: any, index: number) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey, index)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
