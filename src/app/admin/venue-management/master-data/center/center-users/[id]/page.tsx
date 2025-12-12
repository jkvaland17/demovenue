"use client";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CallGetUsersByCenter } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";

type Props = {};

const CenterUsers = (props: Props) => {
  const moduleId = "67d7e6b1787a93da30837574";
  const { id } = useParams();
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [centerName, setCenterName] = useState<string>("");

  const columns = [
    { title: "User ID", key: "userId" },
    { title: "Full Name", key: "name" },
    { title: "Role", key: "role" },
    // { title: "District", key: "district" },
    { title: "Email", key: "email" },
    { title: "Phone", key: "phone" },
  ];

  const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "name":
        return <p className="uppercase">{cellValue}</p>;
      case "role":
        return <p>{item?.role?.title}</p>;
      case "district":
        return <p>{item?.district?.name}</p>;
      default:
        return cellValue;
    }
  }, []);

  const getUsersByCenter = async () => {
    setIsLoading(true);
    try {
      const query = `centerId=${id}`;
      const { data, error } = (await CallGetUsersByCenter(query)) as any;
      console.log("getUsersByCenter", { data, error });

      if (data) {
        setCenterName(data?.data?.school_name);
        setAllData(data?.data?.user);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getUsersByCenter();
  }, []);

  return (
    <>
      <Button
        radius="full"
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

      <Table
        isStriped
        color="default"
        aria-label="Example static collection table"
        className="mb-6"
        topContent={
          <h2 className="text-xl font-medium">Center Name: {centerName}</h2>
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
          items={allData}
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No data"
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
    </>
  );
};

export default CenterUsers;
