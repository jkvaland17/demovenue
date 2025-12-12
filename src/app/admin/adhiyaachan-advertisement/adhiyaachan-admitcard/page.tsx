"use client";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleCommonErrors } from "@/Utils/HandleError";
import { CallGetAllAdhiyaachanAdmitCard } from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import moment from "moment";

const AdhiyaachanAdmitCardTable: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allList, setAllList] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const GetAllAdhiyaachanAdmitCard = async (): Promise<void> => {
    setLoader(true);
    try {
      const { data, error } = (await CallGetAllAdhiyaachanAdmitCard()) as any;
      console.log("Adhiyaachan Admit Card data", data);
      if (data) {
        setAllList(data?.data);
        setTotalPage(data?.pagination?.totalPages);
        setPage(data?.pagination?.page);
        setLoader(false);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    GetAllAdhiyaachanAdmitCard();
  }, []);

  const columns = [
    { title: "Advertisement", key: "titleInEnglish" },
    { title: "Exam Type", key: "exam_type" },
    // { title: "Exam Schedule", key: "exam_schedule" },
    { title: "Action", key: "action" },
  ];

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];

    const renderChipsInRows = (
      items: string[],
      color: "success" | "primary",
    ) => {
      const chunkSize = 3;
      const rows = [];

      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        rows.push(
          chunk.map((text, index) => (
            <Chip
              key={`${text}-${i + index}`}
              variant="flat"
              color={color}
              size="sm"
            >
              {text}
            </Chip>
          )),
        );
      }

      return <div className="mr-5 flex flex-wrap gap-1">{rows}</div>;
    };

    switch (columnKey) {
      case "titleInEnglish":
        return <p>{item?.advertisementId?.titleInEnglish || "-"}</p>;

      case "exam_type":
        const examTypes =
          item?.admitCardStages?.masterData?.map((data: any) => data.name) ??
          [];
        const uniqueExamTypes = Array.from(new Set(examTypes));
        return renderChipsInRows(uniqueExamTypes as string[], "success");

      case "action":
        return (
          <Dropdown
            classNames={{ content: "min-w-[150px]" }}
            placement="bottom-end"
          >
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem
                key="edit"
                onPress={() =>
                  router.push(
                    `/admin/adhiyaachan-advertisement/adhiyaachan-admitcard/edit/${item?._id}/${item?.admitCardStages?._id}`,
                  )
                }
                startContent={
                  <span className="material-symbols-outlined">box_edit</span>
                }
              >
                Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );

      default:
        return "";
    }
  }, []);

  const handleAddAdmitCard = () => {
    router.push("/admin/adhiyaachan-advertisement/adhiyaachan-admitcard/add");
  };

  return (
     <FlatCard heading="Venue Selection">
      <div className="relative">
        <Table
          shadow="none"
          color="default"
          classNames={{
            wrapper: "p-1 overflow-auto scrollbar-hide",
          }}
          topContent={
            <div className="flex justify-end">
              {/* <h1>Venue Selection</h1> */}
              <Button
                color="primary"
                onPress={handleAddAdmitCard}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Venue
              </Button>
            </div>
          }
          bottomContent={
            totalPage > 0 && (
              <div className="flex justify-end">
                <Pagination
                  showControls
                  total={totalPage}
                  page={page}
                  onChange={(page) => setPage(page)}
                />
              </div>
            )
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
          <TableBody
            items={allList}
            emptyContent={"No Data"}
            isLoading={loader}
            loadingContent={<Spinner />}
          >
            {(item: any) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </FlatCard>
  );
};

export default AdhiyaachanAdmitCardTable;
