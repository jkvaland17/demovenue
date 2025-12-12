"use client";

import SearchIcon from "@/assets/img/svg/Search";
import { Button, Input, Pagination, Spinner, Switch } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CallGetAllCategories } from "@/_ServerActions";
import moment from "moment";
import { useSession } from "next-auth/react";
type Item = {
  name: string;
};

const Categories: React.FC = () => {
  const Auth: any = useSession();

  const [allList, setAllList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllList();
  }, [Auth]);

  const getAllList = async () => {
    setIsLoading(true);
    const { data } = await CallGetAllCategories();
    if (data) {
      const dataResponse = data as any;
      setAllList(dataResponse?.data as any);
      console.log("dataResponse?.data::: ", dataResponse?.data);
    }
    setIsLoading(false);
  };

  const filteredList: Item[] | undefined = allList?.filter((item: Item) =>
    item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full mb-5">
        <p className="text-xl font-medium text-nowrap mb-5 lg:mb-0">
          Master Categories List
        </p>
        <div className="flex flex-col md:flex-row gap-x-4">
          <Input
            variant="bordered"
            type="text"
            placeholder="Master name"
            labelPlacement="outside"
            startContent={<SearchIcon />}
            className="w-full md:w-96 mb-3 md:mb-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            href="/admin/master/master-categories/add"
            as={Link}
            type="button"
            className="rounded-lg"
            color="primary"
          >
            <i className="fa-solid fa-plus" />
            Create Master Category
          </Button>
        </div>
      </div>
      <Table
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={1}
              total={1}
              // onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>S.NO</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No data found."}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {filteredList?.map((item: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell>
                {moment(item?.created_at).format("DD MMM, YYYY")}
              </TableCell>
              <TableCell>
                <Switch isSelected={item?.status} />
              </TableCell>
              <TableCell>
                <Button
                  as={Link}
                  href={`/admin/master/master-categories/${item?._id}`}
                  size="sm"
                  className="mr-3 text-center rounded-md text-sm p-0 border px-6 text-[#718EBF] border-[#718EBF] bg-white hover:bg-[#97b0dd] hover:text-white"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Categories;
