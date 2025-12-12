"use client";

import {
  Button,
  Input,
  Pagination,
  Spinner,
  Switch,
  Tooltip,
} from "@nextui-org/react";
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
import moment from "moment";
import { useSession } from "next-auth/react";
import {
  CallCategoryByCode,
  CallGetAllSpecialtiesId,
  CallUpdateMasterData,
} from "@/_ServerActions";
import SearchIcon from "@/assets/img/svg/Search";
import toast from "react-hot-toast";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useRouter } from "next/navigation";

type Item = {
  value: string;
};

const Categories: React.FC = () => {
  const Auth: any = useSession();
  const routes = useRouter();

  const [allList, setAllList] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(1);

  useEffect(() => {
    getAllList();
  }, [Auth]);

  const getAllList = async () => {
    try {
      setIsLoading(true);
      const { data: CategoryId, error } = (await CallCategoryByCode(
        "notification",
      )) as any;
      if (error) {
        handleCommonErrors(error);
      }
      if (CategoryId?.data) {
        const { data, error: errorSP } = (await CallGetAllSpecialtiesId(
          CategoryId?.data?._id,
        )) as any;
        console.log("data::: ", data);
        setAllList(data?.data);
        setTotalCount(1);
        if (errorSP) {
          handleCommonErrors(errorSP);
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const filteredList: Item[] | undefined = allList?.filter((item: Item) =>
    item?.value?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );

  // Pagination
  const rowsPerPage = 10;
  const pages = Math.ceil(totalCount / rowsPerPage);

  const statusChange = async (e: boolean, id: string) => {
    try {
      const data = {
        status: e,
        id,
      };
      setIsLoading(true);
      const response = await CallUpdateMasterData(data);

      if (response?.data) {
        const dataResponse = response as any;
        toast.success(dataResponse?.data?.message);
        getAllList();
      }

      if (response?.error) {
        handleCommonErrors(response?.error);
      }
    } catch (error) {
      console.log("error::: ", error);
      const dataResponse = error as any;
      toast.error(dataResponse?.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Table
        topContent={
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 mb-5">
            <p className="text-xl">Notice List</p>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                type="text"
                placeholder="Search Notice"
                labelPlacement="outside"
                startContent={<SearchIcon />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex flex-col md:flex-row md:items-center justify-center  mb-5 gap-4">
                <Button
                  href="/admin/master/master-data/notice/add"
                  as={Link}
                  type="button"
                  color="primary"
                >
                  <i className="fa-solid fa-plus" />
                  Add Notice
                </Button>
                <Button
                  onClick={() => routes.push("/admin/master/master-data")}
                >
                  <span className="material-symbols-outlined">arrow_back</span>{" "}
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        }
        bottomContent={
          <div className="flex w-full justify-end">
            <Pagination
              isCompact
              showControls
              showShadow
              page={page}
              total={pages}
              onChange={(page: any) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>S.NO</TableColumn>
          <TableColumn>Advertisement</TableColumn>
          <TableColumn>Notice</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>File</TableColumn>
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
              <TableCell>{item?.parentMasterId?.value || "N/A"}</TableCell>
              <TableCell>{item?.value}</TableCell>
              <TableCell>
                {moment(item?.created_at).format("DD MMM, YYYY")}
              </TableCell>
              <TableCell>
                {item?.prospectusLink ? (
                  <Link href={item?.prospectusLink} target="_blank">
                    <span className="material-symbols-outlined">
                      description
                    </span>
                  </Link>
                ) : (
                  " "
                )}
              </TableCell>
              <TableCell>
                <Switch
                  color="primary"
                  isSelected={item?.status}
                  onValueChange={(e) => statusChange(e, item._id)}
                />
              </TableCell>
              <TableCell width={80}>
                <Tooltip content="Edit">
                  <Button
                    as={Link}
                    href={`/admin/master/master-data/notice/${item?._id}`}
                    size="sm"
                    className="text-center rounded-md text-sm p-0 border px-6 text-[#718EBF] border-[#718EBF] bg-white hover:bg-[#97b0dd] hover:text-white"
                  >
                    <i className="fa-solid fa-file-pen text-lg"></i>
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Categories;
