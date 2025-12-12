"use client";
import { CallHTCMotionList, CallUpdateHtcpPromotion } from "@/_ServerActions";
import FlatCard from "@/components/FlatCard";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const HTCPForm: React.FC<any> = () => {
  const [data, setData] = useState() as any;
  const { id } = useParams() as any;
  const router = useRouter();
  const [modalType, setModalType] = useState("view");
  const [currentId, setCurrentId] = useState<string>("");
  const [flags, setFlags] = useState<any>(true);

  const {
    isOpen: isRemarkModal,
    onOpen: onRemarkModal,
    onOpenChange: onOpenRemarkModal,
    onClose: onRemarkClose,
  } = useDisclosure();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const updateRemarks = async (submitData: any) => {
    try {
      const obj = {
        id: id,
        status: submitData?.status,
        remarks: submitData?.remarks,
        secondRemarks: submitData?.secondRemarks,
      };
      console.log("obj", obj);
      const { data, error } = (await CallUpdateHtcpPromotion(obj)) as any;
      if (data?.message) {
        toast?.success(data?.message);
        onRemarkClose();
        getAllHTCP();
      }
      if (error) {
        toast.error(data?.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const translations = {
    hindi: {
      subtitle:
        "आरक्षी चालक/मुख्य आरक्षी चालक से मुख्य आरक्षी मोटर परवहन के पद परीक्षा के माध्यम से चयन",
      srNo: "क्र.सं.",
      pno: "पी.एन.ओ.",
      designation: "पदनाम",
      name: "नाम",
      homeDistrict: "गृह जनपद",
      dob: "जन्म तिथि",
      currentPosting: "वर्तमान नियुक्ति स्थान",
      dateOfAppointment: "भर्ती तिथि",
      ageTitle: "आयु (01.07.2008 को)",
      serviceTitle: "कुल सेवा (01.07.2008 को)",
      years: "वर्ष",
      months: "माह",
      days: "दिन",
      awards: "पुरस्कार और सुप्रविष्टि",
      cash: "नकद",
      date: "दिनांक",
      goodEntry: "सुप्रविष्टि",
      medals: "पदक",
      president: "राष्ट्रपति",
      governor: "राज्यपाल/मुख्यमंत्री",
      dgp: "पुलिस महानिदेशक",
      confidential: "गोपनीय मन्तव्य",
      majorPenalty: "दीर्घ दंड",
      minorPenalty: "लघु दंड",
      pettyPenalty: "क्षुद्र दंड",
      number: "संख्या",
      incidentDate: "घटना तिथि",
      health: "स्वास्थ्य परीक्षण",
      departmental: "विभागीय कार्यवाही",
      integrity: "सत्यनिष्ठा",
      adverseEntry: "प्रतिकूल प्रविष्टि",
      remark1: "मन्तव्य 1",
      remark2: "मन्तव्य 2",
      fitUnfit: "फिट/अनफिट",
    },
    english: {
      subtitle:
        "Selection from Constable Driver/Head Constable Driver to Head Constable Motor Transport through examination",
      srNo: "S.No.",
      pno: "PNO",
      designation: "Designation",
      name: "Name",
      homeDistrict: "Home District",
      dob: "Date of Birth",
      currentPosting: "Current Posting",
      dateOfAppointment: "Date of Appointment",
      ageTitle: "Age (as on 01.07.2008)",
      serviceTitle: "Total Service (as on 01.07.2008)",
      years: "Years",
      months: "Months",
      days: "Days",
      awards: "Awards and Commendations",
      cash: "Cash",
      date: "Date",
      goodEntry: "Good Entry",
      medals: "Medals",
      president: "President",
      governor: "Governor/CM",
      dgp: "DGP",
      confidential: "Confidential Remarks",
      majorPenalty: "Major Penalty",
      minorPenalty: "Minor Penalty",
      pettyPenalty: "Petty Penalty",
      number: "Number",
      incidentDate: "Incident Date",
      health: "Health Examination",
      departmental: "Departmental Proceedings",
      integrity: "Integrity",
      adverseEntry: "Adverse Entry",
      remark1: "Remarks 1",
      remark2: "Remarks 2",
      fitUnfit: "Fit/Unfit",
    },
  };

  const hi = translations?.hindi;
  const en = translations?.english;

  const transformData = (rawData: any) => {
    return [
      {
        id: rawData?._id,
        pno: rawData?.pnoNumber,
        designation: rawData?.designation,
        name: rawData?.employeeName,
        homeDistrict: rawData?.homeDistrict,
        dateOfBirth: new Date(rawData?.dateOfBirth).toLocaleDateString(),
        currentPosting: rawData?.currentPosting,
        dateOfAppointment: rawData?.dateOfAppointment,
        ageAsOn: {
          years: rawData?.ageOnDate?.years,
          months: rawData?.ageOnDate?.months,
          days: rawData?.ageOnDate?.days,
        },
        totalService: {
          years: rawData?.totalServiceOnDate?.years,
          months: rawData?.totalServiceOnDate?.months,
          days: rawData?.totalServiceOnDate?.days,
        },
        awards: [
          ...rawData?.awards?.awards?.map((award: any) => ({
            date: new Date(award?.awardDate)?.toLocaleDateString(),
            type: "Cash",
          })),
          ...rawData?.awards?.additionalAwards?.map((award: any) => ({
            date: new Date(award?.awardDate).toLocaleDateString(),
            type: "Good Entry",
          })),
        ],
        medals: [
          {
            date: new Date(
              rawData?.medals?.PresidentPoliceMedal?.date,
            ).toLocaleDateString(),
            count: rawData?.medals?.PresidentPoliceMedal?.count,
          },
          {
            date: new Date(
              rawData.medals.GovernorCMPoliceMedal.date,
            ).toLocaleDateString(),
            count: rawData.medals.GovernorCMPoliceMedal.count,
          },
          {
            date: new Date(
              rawData?.medals?.dGPExcellenceServiceAward?.date,
            ).toLocaleDateString(),
            count: rawData?.medals?.dGPExcellenceServiceAward?.count,
          },
        ],
        confidentialRemarks: rawData?.selectionYearConfidentialRemarks?.map(
          (remark: any) => ({
            year: remark?.year?.toString(),
            remark: remark?.Remarks,
          }),
        ),
        penalties: [
          ...rawData?.punishment?.longPunishment?.map((p: any) => ({
            type: "Major",
            date: new Date(p?.date).toLocaleDateString(),
            incidentDate: new Date(p?.incidentDate).toLocaleDateString(),
          })),
          ...rawData?.punishment?.minorPunishment.map((p: any) => ({
            type: "Minor",
            date: new Date(p?.date).toLocaleDateString(),
            incidentDate: new Date(p?.incidentDate).toLocaleDateString(),
          })),
          ...rawData?.punishment?.pettyPunishment.map((p: any) => ({
            type: "Petty",
            date: new Date(p?.date).toLocaleDateString(),
            incidentDate: new Date(p?.incidentDate).toLocaleDateString(),
          })),
        ],
        status: rawData?.status,
        departmentalProceedings: rawData?.departmentalInquiry,
        integrityWithheld:
          rawData?.punishment?.integrityRecords?.integrityHoldYear,
        adverseEntryYear:
          rawData?.punishment?.integrityRecords?.adverseEntryYear,
        remarks: rawData?.remarks,
        secondRemarks: rawData?.secondRemarks,
      },
    ];
  };

  const getAllHTCP = async () => {
    try {
      const { data: allData, error: allError } = (await CallHTCMotionList(
        id,
      )) as any;
      console.log("allData", allData);

      if (allData?.data) {
        setFlags(allData?.isReceived);
        const transformedData = transformData(allData?.data);
        setData(transformedData);
      }
      if (allError) {
        toast.error(allError);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllHTCP();
  }, []);

  const years = Array.from({ length: 20 }, (_, i) => 1998 + i);

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
      <FlatCard>
        <h1 className="px-3 mb-5 text-2xl font-semibold">{flags === true ? "View & Verification HTCP Form" : "View HTCP Form"} </h1>
        <div className="overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.srNo}</div>
                    <div>{en?.srNo}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.pno}</div>
                    <div>{en?.pno}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.designation}</div>
                    <div>{en?.designation}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.name}</div>
                    <div>{en?.name}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.homeDistrict}</div>
                    <div>{en?.homeDistrict}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.dob}</div>
                    <div>{en?.dob}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.currentPosting}</div>
                    <div>{en?.currentPosting}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.dateOfAppointment}</div>
                    <div>{en?.dateOfAppointment}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.ageTitle}</div>
                    <div>{en?.ageTitle}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.serviceTitle}</div>
                    <div>{en?.serviceTitle}</div>
                  </th>
                  <th colSpan={4} className="border border-gray-300 p-5">
                    <div>{hi?.awards}</div>
                    <div>{en?.awards}</div>
                  </th>
                  <th colSpan={6} className="border border-gray-300 p-5">
                    <div>{hi?.medals}</div>
                    <div>{en?.medals}</div>
                  </th>
                  <th
                    colSpan={years.length}
                    className="border border-gray-300 p-5"
                  >
                    <div>{hi?.confidential} (2008-2018)</div>
                    <div>{en?.confidential} (2008-2018)</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.majorPenalty}</div>
                    <div>{en?.majorPenalty}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.minorPenalty}</div>
                    <div>{en?.minorPenalty}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.pettyPenalty}</div>
                    <div>{en?.pettyPenalty}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.health}</div>
                    <div>{en?.health}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.departmental}</div>
                    <div>{en?.departmental}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.integrity}</div>
                    <div>{en?.integrity}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.adverseEntry}</div>
                    <div>{en?.adverseEntry}</div>
                  </th>
                  {flags === true && (
                    <>
                      <th rowSpan={2} className="border border-gray-300 p-5">
                        <div>{hi?.remark1}</div>
                        <div>{en?.remark1}</div>
                      </th>
                      <th rowSpan={2} className="border border-gray-300 p-5">
                        <div>{hi?.remark2}</div>
                        <div>{en?.remark2}</div>
                      </th>
                      <th rowSpan={2} className="border border-gray-300 p-5">
                        <div>{hi?.fitUnfit}</div>
                        <div>{en?.fitUnfit}</div>
                      </th>
                    </>
                  )}
                </tr>
                <tr className="bg-gray-100">
                  {/* Age sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.years}</div>
                    <div>{en?.years}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.months}</div>
                    <div>{en?.months}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.days}</div>
                    <div>{en?.days}</div>
                  </th>

                  {/* Service sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.years}</div>
                    <div>{en?.years}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.months}</div>
                    <div>{en?.months}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.days}</div>
                    <div>{en?.days}</div>
                  </th>

                  {/* Awards sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.cash}</div>
                    <div>{en?.cash}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en?.date}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.goodEntry}</div>
                    <div>{en?.goodEntry}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en?.date}</div>
                  </th>

                  {/* Medals sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.president}</div>
                    <div>{en?.president}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en?.date}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.governor}</div>
                    <div>{en?.governor}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en?.date}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.dgp}</div>
                    <div>{en?.dgp}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en?.date}</div>
                  </th>

                  {/* Confidential remarks years */}
                  {years?.map((year) => (
                    <th key={year} className="border border-gray-300 p-5">
                      {year}
                    </th>
                  ))}

                  {/* Major penalties sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.number}</div>
                    <div>{en?.number}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en.date}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.incidentDate}</div>
                    <div>{en.incidentDate}</div>
                  </th>

                  {/* Minor penalties sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.number}</div>
                    <div>{en.number}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en.date}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.incidentDate}</div>
                    <div>{en.incidentDate}</div>
                  </th>

                  {/* Petty penalties sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.number}</div>
                    <div>{en.number}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.date}</div>
                    <div>{en.date}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.incidentDate}</div>
                    <div>{en.incidentDate}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item: any, index: any) => (
                  <tr
                    key={item?.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 p-5 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-5">{item?.pno || "-"}</td>
                    <td className="border border-gray-300 p-5">
                      {item?.designation || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">{item?.name || "-"}</td>
                    <td className="border border-gray-300 p-5">
                      {item?.homeDistrict || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.dateOfBirth || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.currentPosting || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.dateOfAppointment || "-"}
                    </td>

                    {/* Age */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.ageAsOn?.years || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.ageAsOn?.months || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.ageAsOn?.days || "-"}
                    </td>

                    {/* Service */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.totalService?.years || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.totalService?.months || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.totalService?.days || "-"}
                    </td>

                    {/* Awards */}
                    <td className="border border-gray-300 p-5">
                      {item?.awards
                        .filter((award: any) => award?.type === "Cash")
                        .map((award: any, i: number) => (
                          <div key={i}>{award?.type}</div>
                        ))}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.awards
                        .filter((award: any) => award?.type === "Cash")
                        .map((award: any, i: number) => (
                          <div key={i}>{award?.date}</div>
                        ))}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.awards
                        .filter((award: any) => award?.type === "Good Entry")
                        .map((award: any, i: number) => (
                          <div key={i}>{award?.type}</div>
                        ))}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.awards
                        .filter((award: any) => award?.type === "Good Entry")
                        .map((award: any, i: number) => (
                          <div key={i}>{award?.date}</div>
                        ))}
                    </td>

                    {/* Medals */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.medals[0]?.count || 0}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.medals[0]?.date || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.medals[1]?.count || 0}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.medals[1]?.date || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.medals[2]?.count || 0}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.medals[2]?.date || "-"}
                    </td>

                    {/* Confidential remarks for each year */}
                    {years?.map((year) => {
                      const remarkObj = item?.confidentialRemarks?.find(
                        (r: any) => r?.year === year?.toString(),
                      );
                      return (
                        <td
                          key={year}
                          className="border border-gray-300 p-5 text-center"
                        >
                          {remarkObj ? remarkObj?.remark : ""}
                        </td>
                      );
                    })}

                    {/* Major penalties */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.penalties?.filter((p: any) => p?.type === "Major")
                        .length || 0}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Major")
                        .map((p: any) => p?.date)
                        .join("\n")}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Major")
                        .map((p: any) => p?.incidentDate)
                        .join("\n")}
                    </td>

                    {/* Minor penalties */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.penalties?.filter((p: any) => p?.type === "Minor")
                        .length || 0}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Minor")
                        .map((p: any) => p?.date)
                        .join("\n")}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Minor")
                        .map((p: any) => p?.incidentDate)
                        .join("\n")}
                    </td>

                    {/* Petty penalties */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.penalties?.filter((p: any) => p?.type === "Petty")
                        .length || 0}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Petty")
                        .map((p: any) => p?.date)
                        .join("\n")}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Petty")
                        .map((p: any) => p?.incidentDate)
                        .join("\n")}
                    </td>

                    <td className="border border-gray-300 p-5 text-center">
                      {item?.status || "-"}
                    </td>
                    <td className="whitespace-pre-line border border-gray-300 p-5 text-center">
                      {item?.departmentalProceedings || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.integrityWithheld || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.adverseEntryYear || "-"}
                    </td>
                    {flags === true && (
                      <>
                        <td className="border border-gray-300 p-5">
                          {item?.remarks || "-"}
                        </td>
                        <td className="border border-gray-300 p-5">
                          {item?.secondRemarks || "-"}
                        </td>
                        <td className="border border-gray-300 p-5">
                          <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                              <Button
                                className="more_btn rounded-full px-0"
                                disableRipple
                              >
                                <span className="material-symbols-rounded">
                                  more_vert
                                </span>
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                              <DropdownItem
                                key="statusRemark"
                                onPress={() => {
                                  setModalType("edit");
                                  setCurrentId(item?._id);
                                  onRemarkModal();
                                }}
                              >
                                Status/Remarks
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FlatCard>

      <Modal isOpen={isRemarkModal} onOpenChange={onOpenRemarkModal} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "view" ? "View Remark" : "Fit/Unfit & Remarks"}
              </ModalHeader>

              <ModalBody>
                <form
                  onSubmit={handleSubmit(updateRemarks)}
                  className="grid grid-cols-1 gap-4"
                >
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Fit/Unfit status is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Select
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Fit/Unfit"
                        labelPlacement="outside"
                        placeholder="Select"
                        items={[
                          { key: "FIT", name: "Fit" },
                          { key: "UNFIT", name: "Unfit" },
                          { key: "SEAL_COVER", name: "Seal Cover" },
                          { key: "PROVISIONAL", name: "Provisional" },
                          { key: "STAY", name: "Stay" },
                        ]}
                      >
                        {(item) => (
                          <SelectItem key={item.key}>{item.name}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    name="remarks"
                    control={control}
                    rules={{ required: "Remark is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Textarea
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Remark 1"
                        labelPlacement="outside"
                        placeholder="Enter remark..."
                      />
                    )}
                  />

                  <Controller
                    name="secondRemarks"
                    control={control}
                    rules={{ required: "Second remark is required" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <Textarea
                        {...field}
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        label="Remark 2"
                        labelPlacement="outside"
                        placeholder="Enter remark..."
                      />
                    )}
                  />

                  {modalType === "edit" && (
                    <Button
                      type="submit"
                      color="primary"
                      className="mb-2 w-full"
                      isLoading={isSubmitting}
                    >
                      Submit
                    </Button>
                  )}
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default HTCPForm;
