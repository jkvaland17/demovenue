"use client";

import { Button, Input, Spinner, Switch, Tooltip } from "@nextui-org/react";
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
import {
  CallCategoryByCode,
  CallGetAllSpecialtiesId,
  CallUpdateMasterData,
} from "@/_ServerActions";
import moment from "moment";
import toast from "react-hot-toast";
import SearchIcon from "@/assets/img/svg/Search";
import { handleCommonErrors } from "@/Utils/HandleError";
import ScreenLoader from "../ScreenLoader";
import { useRouter } from "next/navigation";

type ListProps = {
  title: string;
  apiCode: string;
  route: string;
  isHod: boolean;
};

const List: React.FC<ListProps> = ({ title, apiCode, route, isHod }) => {
  const routes = useRouter();
  const [allList, setAllList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = (await CallCategoryByCode(apiCode)) as any;
      if (data) {
        const dataResponse = data as any;
        getAllList(dataResponse?.data?._id);
        setCategory(dataResponse?.data?._id);
      }
      if (error) {
        handleCommonErrors(error);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const getAllList = async (id: string) => {
    try {
      const { data, error } = await CallGetAllSpecialtiesId(id);
      if (data) {
        const dataResponse = data as any;
        setAllList(dataResponse?.data as any);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const statusChange = async (e: boolean, id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await CallUpdateMasterData({
        status: e,
        id,
      });
      if (data) {
        const dataResponse = data as any;
        toast.success(dataResponse?.message);
        getAllList(category);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setIsLoading(false);
    }
  };
  const filteredList: any = allList?.filter((item: any) =>
    item?.value?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );
  return (
    <div className="relative">
      {isLoading && <ScreenLoader />}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full mb-5">
        <p className="text-xl font-medium text-nowrap mb-5 lg:mb-0">
          {title} List
        </p>
        <div className="flex flex-col md:flex-row gap-x-4">
          <Input
            variant="bordered"
            type="search"
            placeholder={`Search ${route} name`}
            labelPlacement="outside"
            startContent={<SearchIcon />}
            className="w-full md:w-96 mb-3 md:mb-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-col md:flex-row md:items-center justify-center  mb-5 gap-4">
            <Button
              href={`/admin/master/master-data/${route}/add`}
              as={Link}
              type="button"
              className="rounded-lg"
              color="primary"
            >
              <i className="fa-solid fa-plus" />
              Create {title}
            </Button>
            <Button onClick={() => routes.push(`/admin/master/master-data`)}>
              <span className="material-symbols-outlined">arrow_back</span> Go
              Back
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>S.NO</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>{isHod ? "Admin" : ""}</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No data found."}
          loadingContent={<Spinner label="Loading..." />}
        >
          {filteredList?.map((item: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{item?.value}</TableCell>
              <TableCell>
                {moment(item?.created_at).format("DD MMM, YYYY")}
              </TableCell>
              <TableCell>
                <Switch
                  onValueChange={(e) => statusChange(e, item._id)}
                  isSelected={item?.status}
                />
              </TableCell>
              <TableCell>
                <Tooltip content="Add HOD" size="lg">
                  {isHod ? (
                    <Button
                      as={Link}
                      href={`/admin/all-hod/add/${category}?id=${item?._id}`}
                      variant="flat"
                      size="sm"
                      color="primary"
                    >
                      <i className="fa-solid fa-hospital-user text-xl"></i>
                    </Button>
                  ) : (
                    ""
                  )}
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-start gap-x-3">
                  {/* <Tooltip content="View">
                    <Link
                      href={`/admin/master/master-data/${route}/view/${item?._id}`}
                    >
                      <i className="fa-solid fa-eye text-xl text-blue-600"></i>
                    </Link>
                  </Tooltip> */}
                  <Tooltip content="Edit">
                    <Link
                      href={`/admin/master/master-data/${route}/edit/${item?._id}`}
                    >
                      <i className="fa-solid fa-pen-to-square text-lg text-gray-500"></i>
                    </Link>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default List;
