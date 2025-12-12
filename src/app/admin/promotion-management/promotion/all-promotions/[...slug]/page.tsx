"use client";

import { CallGetAllPromotionCardList } from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import { getColumns } from "@/components/promotion/tableColumns";
import { Button, Chip, Pagination, Spinner } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PromotionTable = () => {
  const { slug } = useParams() as any;
  // console.log("PromotionTable slug:", slug);
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const columns = getColumns(slug[0]);

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "currentPosting":
        return <p>{item?.currentPosting}</p>;
      case "currentPosting1":
        return <p>{item?.seniorityPromotionList?.currentPosting}</p>;
      case "seniorityListSerialNo":
        return (
          <p>
            {item?.seniorityPromotionList?.seniorityListSerialNo ||
              item?.seniorityListSerialNo}
          </p>
        );
      case "eligibilityListSerialNo":
        return (
          <p>
            {item?.seniorityPromotionList?.eligibilityListSerialNo ||
              item?.eligibilityListSerialNo}
          </p>
        );
      case "employeeName1":
        return <p>{item?.seniorityPromotionList?.employeeName}</p>;
      case "fatherName1":
        return <p>{item?.seniorityPromotionList?.fatherName}</p>;
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
      case "currentPosting":
        return <p>{item?.seniorityPromotionList?.currentPosting}</p>;
      case "dateOfBirth":
        return <p>{moment(cellValue).format("DD-MM-YYYY")}</p>;
      case "physicalQualification":
        return (
          <Chip
            variant="flat"
            color={
              item?.isQulifiedForFinalResult === "qualified"
                ? "success"
                : item?.isQulifiedForFinalResult === "notQualified"
                  ? "danger"
                  : "warning"
            }
            classNames={{ content: "capitalize" }}
          >
            {item?.isQulifiedForFinalResult === "qualified"
              ? "Qualified"
              : item?.isQulifiedForFinalResult === "notQualified"
                ? "Not Qualified"
                : "Pending"}
          </Chip>
        );
      case "dateOfBirth":
        return cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-";
      case "promotionDate":
        return cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-";
      case "recruitmentDate":
        return cellValue ? moment(cellValue).format("DD-MM-YYYY") : "-";
      default:
        return cellValue;
    }
  }, []);

  const GetAllPromotionCardList = async () => {
    if (!slug || tableLoading) return;
    try {
      setTableLoading(true);
      const query = `search=${slug[0]}&advertisementId=${slug[1]}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllPromotionCardList(query)) as any;
      console.log("GetAllPromotionCardList data:", data);
      if (data?.status_code === 200) {
        setData(data?.data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (slug && slug.length > 0) {
      GetAllPromotionCardList();
    }
  }, [page, slug]);

  return (
    <FlatCard heading="">
      <div className="mb-4 flex items-center justify-end">
        <Button
          radius="md"
          className="mb-4 font-medium"
          onPress={() => {
            router.back();
          }}
          startContent={
            <span className="material-symbols-rounded">arrow_back</span>
          }
        >
          Go Back
        </Button>
      </div>
      <Table
        removeWrapper
        color="default"
        bottomContent={
          totalPage > 0 ? (
            <div className="flex justify-end">
              <Pagination
                showControls
                total={totalPage}
                page={page}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : (
            ""
          )
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column?.key}
              align={column?.key === "actions" ? "center" : "start"}
              className="text-wrap"
            >
              {column?.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data}
          emptyContent="No data"
          isLoading={tableLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item?._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </FlatCard>
  );
};

export default PromotionTable;
