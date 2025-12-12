"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
  Button,
  Divider,
} from "@nextui-org/react";
import { useReactToPrint } from "react-to-print";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import { CallFetchDVPSTPrintDetails } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import { useParams } from "next/navigation";
import moment from "moment";
import Image from "next/image";

type ChipColor =
  | "success"
  | "danger"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | undefined;

const columns = [
  { title: "Field Name", key: "fieldName" },
  { title: "Registration Value", key: "value" },
  { title: "Verification Value", key: "correctValue" },
  { title: "Status", key: "status" },
  { title: "Verification Officer", key: "verificationOfficer" },
];

export default function PrintPage() {
  const printRef = useRef(null);
  const { id } = useParams();
  const [loader, setLoader] = useState<boolean>(false);
  const [applicationDatadata, setApplicationDataData] = useState<any>([]);
  const screeningDetails = applicationDatadata?.userDetail?.userScreeningData;

  const UserDetails = [
    {
      label: "Application Number",
      value: screeningDetails?.applicationNo,
    },
    {
      label: "Roll No.",
      value: screeningDetails?.admitCardDetails?.rollNo,
    },
    {
      label: "Post Applied For",
      value: screeningDetails?.advertisementDetails?.titleInEnglish,
    },
    {
      label: "DV/PST Date",
      value: moment(screeningDetails?.admitCardDetails?.exam_date).format(
        "DD-MM-YYYY",
      ),
    },
    {
      label: "Venue of DV/PST",
      value: screeningDetails?.admitCardDetails?.center?.school_name,
    },
    { label: "Panel Details", value: "-" },
  ];

  const GetApplicationData = async () => {
    setLoader(true);
    try {
      const Params = `applicationId=${id}`;
      const { data, error } = (await CallFetchDVPSTPrintDetails(Params)) as any;
      if (data?.response) {
        setApplicationDataData(data?.response);
      }
      if (error) {
        handleCommonErrors(error);
      }
      setLoader(false);
    } catch (error) {
      console.log("error", error);
      setLoader(false);
    }
  };

  const renderCell = useCallback((item: any, columnKey: Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "fieldName":
        return <p className="uppercase">{cellValue}</p>;

      case "value":
      case "correctValue":
      case "status":
      case "verificationOfficer":
        return <p>{cellValue || "-"}</p>;

      default:
        return cellValue;
    }
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Choices",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });

  useEffect(() => {
    if (id) {
      GetApplicationData();
    }
  }, [id]);

  return (
    <div>
      <div className="text-center">
        <Button
          variant="shadow"
          color="success"
          className="text-white"
          onPress={handlePrint}
        >
          Print
        </Button>
      </div>
      <div className="m-5 rounded-md bg-white p-5" ref={printRef}>
        <div className="heading text-center">
          <div className="mx-auto h-[80px] w-[80px]">
            <Image
              src={`https://upprbadminpanel.demoup.in/_next/static/media/UPPRB_log.30036d9a.svg`}
              alt="logo"
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="mb-4 mt-2 text-xl font-bold">
            उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड
            <br />
            Uttar Pradesh Police Recruitment & Promotion Board
          </h1>
        </div>
        <Divider />
        <div className="my-5 grid grid-cols-5">
          <div className="mx-auto h-[80px] w-[80px]">
            <Image
              src={
                applicationDatadata?.userDetail?.userScreeningData?.photoGraph
              }
              alt="Applicant photo"
              width={100}
              height={100}
              className="h-full w-full rounded-full border object-contain"
            />
          </div>

          <div className="col-span-4 grid grid-cols-3">
            {UserDetails.map((item, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm text-default-500">{item.label}</p>
                <p className="truncate font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* <Table
          removeWrapper
          isStriped
          color="default"
          aria-label="Example static collection table"
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
          <TableBody emptyContent="No data">
            {applicationDatadata?.responseData?.map(
              (item: any, index: number) => (
                <TableRow key={index}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              ),
            )}
          </TableBody>
        </Table> */}
        <Divider className="my-2" />
        <div>
          <h3 className="font-semibold">
            Physical Measurement Details Verification
          </h3>
          <div className="mt-3 flex flex-col gap-y-3">
            <div className="flex">
              <p className="w-[300px]">Height (CMS) :</p>
              <p>169</p>
            </div>
            <div className="flex">
              <p className="w-[300px]">Chest (CMS) :</p>
              <div>
                <ul>
                  <li className="flex">
                    <p className="w-[150px]">Un-Expanded :</p>
                    <p>82</p>
                  </li>
                  <li className="flex">
                    <p className="w-[150px]">Expanded :</p>
                    <p>82</p>
                  </li>
                  <li className="flex">
                    <p className="w-[150px]">Expansion :</p>
                    <p>82</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex">
              <p className="w-[300px]">
                Verification Status in PST (FIT/UNFIT) :
              </p>
              <Chip color="success" variant="flat">
                FIT
              </Chip>
            </div>
            <div className="flex">
              <p className="w-[300px]">Verification Status :</p>
              <Chip>Accepted</Chip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
