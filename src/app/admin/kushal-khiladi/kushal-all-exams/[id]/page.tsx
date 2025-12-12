"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { CallGetCardModuleInformation } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import BackButton from "@/components/BackButton";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import FlatCard from "@/components/FlatCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSessionData } from "@/Utils/hook/useSessionData";
import { DownloadKushalExcel, DownloadKushalPdf } from "@/Utils/DownloadExcel";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import moment from "moment";
import { ColumnDecider } from "@/Utils/kushal-khiladi/advertisementTilesColumn";
import MaleFemaleButton from "@/components/kushal-components/common/MaleFemaleBtn";
import actionRouteDecider from "@/Utils/kushal-khiladi/actionRouteDecider";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const CardInfo = () => {
  const { id } = useParams() as any;
  const { advertisementId } = useSessionData();
  const [moduleDetailsData, setModuleDetailsData] = useState<any>([]);
  const [loader, setLoader] = useState<any>({
    table: true,
    excel: false,
    pdf: false,
  });
  const [selectedFilter, setSelectedFilter] = useState<any>({
    gender: "",
  });
  const statusColorMap: { [key: string]: ChipColor } = {
    Completed: "success",
    Started: "primary",
    "Yet not started": "warning",
  };

  const GetModuleDetails = async () => {
    setLoader((prev: any) => ({
      ...prev,
      table: true,
    }));
    try {
      const query = `advertisementId=${advertisementId}&tilesType=${id}&gender=${selectedFilter?.gender}`;
      const { data, error } = (await CallGetCardModuleInformation(
        query,
      )) as any;
      console.log("query",query);
      console.log("CallGetCardModuleInformation", { data, error });
      
      if (data?.data) {
        setModuleDetailsData(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    } catch (error) {
      console.log("error", error);
      setLoader((prev: any) => ({
        ...prev,
        table: false,
      }));
    }
  };

  const routeDecider = (key: string, params: Record<string, any>) => {
    const routes: any = {
      totalApplicants: `/admin/kushal-khiladi/kushal/card-details/total/${params?.tilesType}/${params.sportsId}`,
      totalScrutiny: `/admin/kushal-khiladi/kushal/card-details/scrutinized/${params?.tilesType}/${params.sportsId}`,
      foundFit: `/admin/kushal-khiladi/kushal/card-details/Accepted/${params?.tilesType}/${params.sportsId}`,
      foundUnfit: `/admin/kushal-khiladi/kushal/card-details/Rejected/${params?.tilesType}/${params.sportsId}`,
      pendingScrutinyCount: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}`,
      pendingDvCandidates: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}`,
      pendingCount: `/admin/kushal-khiladi/kushal/card-details/Pending/${params?.tilesType}/${params.sportsId}`,
      eligibleCandidates: `/admin/kushal-khiladi/kushal/card-details/Eligible/${params?.tilesType}/${params.sportsId}`,
      admitCardReleased: `/admin/kushal-khiladi/kushal/card-details/Released/${params?.tilesType}/${params.sportsId}`,
      sportsName: `/admin/kushal-khiladi/kushal-all-exams/sub-sports/${params.sportsId}`,
    };

    return routes[key] || "#";
  };

  const renderCell = React.useCallback(
    (item: any, columnKey: React.Key, index: number) => {
      const cellValue = item[columnKey as any];
      switch (columnKey) {
        case "srNo":
          return <p className="text-bold text-sm capitalize">{index + 1}</p>;
        case "sportsName":
          return (
            <div>
              {item?.isHaveSubsports ? (
                <Link
                  href={routeDecider(columnKey, {
                    sportsId: item?._id,
                    tilesType: id,
                  })}
                  className={`text-bold text-sm capitalize ${cellValue != 0 && `text-blue-600`}`}
                >
                  {cellValue}
                </Link>
              ) : (
                <p className="text-nowrap">{cellValue}</p>
              )}
            </div>
          );
        case "totalApplicants":
        case "totalScrutiny":
        case "foundUnfit":
        case "foundFit":
        case "pendingScrutinyCount":
        case "pendingCount":
        case "pendingDvCandidates":
        case "eligibleCandidates":
        case "admitCardReleased":
          return (
            <Link
              href={routeDecider(columnKey, {
                sportsId: item?._id,
                tilesType: id,
              })}
              className={`text-bold text-sm capitalize ${cellValue != 0 && `text-blue-600`}`}
            >
              {cellValue}
            </Link>
          );
        case "startDate":
        case "endDate":
          return (
            <p className="text-nowrap">
              {cellValue && moment(cellValue).isValid()
                ? moment(cellValue).format("DD-MM-YYYY")
                : "-"}
            </p>
          );
        case "admitCardReleasedStatus":
          return (
            <Chip
              color={statusColorMap[cellValue]}
              variant="flat"
              radius="full"
              size="md"
            >
              {cellValue || `-`}
            </Chip>
          );
        case "action":
          const actions = actionRouteDecider(id);
          return (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button className="more_btn rounded-full px-0" disableRipple>
                  <span className="material-symbols-rounded">more_vert</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {actions.map((action: any, index: number) => (
                  <DropdownItem key={index} href={action.route}>
                    {action.title}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return <p className="text-nowrap">{cellValue}</p>;
      }
    },
    [id],
  );

  useEffect(() => {
    if (advertisementId) {
      GetModuleDetails();
    }
  }, [advertisementId, selectedFilter]);

  return (
    <>
      {loader?.table ? (
        <FlatCard>
          <TableSkeleton columnsCount={7} filters filtersCount={6} />
        </FlatCard>
      ) : (
        <>
          <div className="flex items-center justify-between mob:items-start">
            <h1 className="col-span-4 mb-5 text-2xl font-semibold mob:text-xl">
              {moduleDetailsData?.tilesName}
            </h1>
            <BackButton />
          </div>
          <div className="mb-3 flex justify-end mob:justify-start">
            <ExcelPdfDownload
              excelFunction={() => {
                DownloadKushalExcel(
                  `v1/admin/downloadSportsDataTilesWiseExcel?advertisementId=${advertisementId}&tilesType=${id}&gender=${selectedFilter?.gender}`,
                  "SportsDetail",
                  setLoader,
                );
              }}
              pdfFunction={() => {
                DownloadKushalPdf(
                  `v1/admin/downloadSportsDataTilesWisePdf?advertisementId=${advertisementId}&tilesType=${id}&gender=${selectedFilter?.gender}`,
                  "SportsDetail",
                  setLoader,
                );
              }}
              excelLoader={loader?.excel}
              pdfLoader={loader?.pdf}
            />
          </div>
          <Table
            isStriped
            color="default"
            className="mb-6 overflow-x-auto"
            aria-label="Example static collection table"
            topContent={
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <p className="mb-2 font-medium">Filters</p>
                  <MaleFemaleButton
                    selectedBtn={moduleDetailsData?.gender}
                    filterFunction={setSelectedFilter}
                  />
                </div>
              </div>
            }
          >
            <TableHeader columns={ColumnDecider[id]}>
              {(column: any) => (
                <TableColumn
                  key={column.key}
                  align={column.key === "actions" ? "center" : "start"}
                  className="text-nowrap"
                >
                  {column.title}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent="No data">
              {moduleDetailsData?.sportsData?.map(
                (item: any, index: number) => (
                  <TableRow key={item._id}>
                    {(columnKey) => (
                      <TableCell>
                        {renderCell(item, columnKey, index)}
                      </TableCell>
                    )}
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

export default CardInfo;
