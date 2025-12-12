"use client";
import { CallG2otionList, CallUpdatG2Promotion } from "@/_ServerActions";
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

const G2Form: React.FC<any> = () => {
  const [allData, setAllData] = useState() as any;
  const { id } = useParams() as any;
  const router = useRouter();
  const [flags, setFlags] = useState<any>(true);
  const [modalType, setModalType] = useState("view");

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
      const { data, error } = (await CallUpdatG2Promotion(obj)) as any;
      if (data?.message) {
        toast?.success(data?.message);
        onRemarkClose();
        getAllG2();
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
      srNo: "क्र.सं.",
      pno: "पी.एन.ओ.",
      designation: "पदनाम",
      name: "नाम (हाईस्कूल प्रमाण पत्र के अनुसार)",
      qulification:
        "शिक्षा/शैक्षिक अर्हता एवं सम्बन्धित परीक्षा उत्तीर्ण करने का वर्ष",
      fatherName: "पिता का नाम",
      dob: "जन्म तिथि",
      currentPosting: "वर्तमान नियुक्ति स्थान",
      dateOfAppointment: "कम्प्यूटर ऑपरेटर ग्रेड-ए के पद पर नियुक्ति की तिथि",
      ageTitle: "आयु (01.07.2008 को)",
      serviceTitle: "दिनांक 01.07.2023 को कुल सेवा",
      years: "वर्ष",
      months: "माह",
      days: "दिन",
      cash: "नकद",
      date: "दिनांक",
      goodEntry: "सुप्रविष्टि",
      president: "राष्ट्रपति",
      governor: "राज्यपाल/मुख्यमंत्री",
      dgp: "पुलिस महानिदेशक",
      confidential:
        "चयन वर्ष 2023  के विगत 10 वर्षों का वार्षिक गोपनीय मन्तव्य",
      majorPenalty: "दीर्घ दंड",
      minorPenalty: "लघु दंड",
      pettyPenalty: "क्षुद्र दंड",
      number: "संख्या",
      incidentDate: "घटना तिथि",
      allegations: "अभियुक्ति",
      tachnical: "तकनीकी कम्प्यूटर कोर्स का नाम एवं कोर्स करने का दिनांक",
      trainings:
        "03 दिवस या अधिक अवधि वाले प्रशिक्षणों का नाम एवं प्रशिक्षण पूर्ण करने का दिनांक",
      Integrity: "सत्यनिष्ठा रोकी गयी हो तो उसका विवरण",
      adverse: "प्रतिकूल प्रविष्टि",
      suspensionDetails:
        "वर्तमान निलम्बन (निलम्बन की वर्तमान स्थिति, डीपीसी के दिनांक तक)",
      orderNumber: "निलम्बन आदेश संख्या, दिनांक",
      reason: "निलम्बन का कारण (अधिकतम 20 शब्दों में)",
      suspensionDate: "बहाली आदेश संख्या, दिनांक",
      criminalCases:
        "लम्बित आपराधिक प्रकरण (जिसमें कर्मी के विरुद्ध आरोप पत्र प्रेषित किया गया है)",
      caseNumber: "अपराध संख्या/धारा/वर्ष/थाना/जनपद",
      chargeSheetNumber:
        "आरोप पत्र संख्या व न्यायालय में आरोप पत्र प्रेषित किये जाने का दिनांक",
      courtDecision: "अभियोग की अद्यतन स्थिति एवं न्यायालय का निर्णय व दिनांक",
      departmentActions: "विभागीय कार्यवाही -नियम (14(1) के अन्तर्गत",
      ruleName: "जांच संगठन का नाम",
      accusation: "आरोप का संक्षिप्त विवरण(अधिकतम 20 शब्दों में)",
      accusationDate: "कार्मिक के विरूद्व आरोप पत्र निर्गत करने का दिनांक",
      remark1: "मन्तव्य 1",
      remark2: "मन्तव्य 2",
      fitUnfit: "फिट/अनफिट",
    },
    english: {
      srNo: "S.No.",
      pno: "PNO",
      date: "Date",
      qulification:
        "Educational Qualification and Year of Passing the Relevant Examination",
      designation: "Designation",
      name: "Name (As per High School Certificate)",
      fatherName: "Father's Name",
      dob: "Date of Birth",
      currentPosting: "Current Posting",
      dateOfAppointment:
        "Date of Appointment to the Post of Computer Operator Grade-A",
      serviceTitle: "Total Service as on 01.07.2023",
      years: "Years",
      months: "Months",
      days: "Days",
      president: "President",
      governor: "Governor/CM",
      dgp: "DGP",
      confidential:
        "Annual Confidential Remarks for the Last 10 Years for Selection Year 2023",
      majorPenalty: "Major Penalty",
      minorPenalty: "Minor Penalty",
      pettyPenalty: "Petty Penalty",
      number: "Number",
      incidentDate: "Incident Date",
      allegations: "Allegations",
      tachnical: "Technical Computer Course Name and Date of Completion",
      trainings:
        "Name of Training Programs of 3 Days or More Duration and Date of Completion",
      Integrity: "Details if Integrity was Withheld",
      adverse: "Adverse Entry",
      suspensionDetails:
        "Current Suspension (Current Status of Suspension, Till the Date of DPC)",
      orderNumber: "Suspension Order Number, Date",
      reason: "Reason for Suspension (In Maximum 20 Words)",
      suspensionDate: "Reinstatement Order Number, Date",
      criminalCases:
        "Pending Criminal Cases (Where Charge Sheet Has Been Filed Against the Employee)",
      caseNumber: "Crime Number/Section/ Year/Police Station/District",
      chargeSheetNumber:
        "Charge Sheet Number and Date of Submission of Charge Sheet in Court",
      courtDecision: "Current Status of the Case and Court's Verdict and Date",
      departmentActions: "Departmental Proceedings - Under Rule 14(1)",
      ruleName: "Name of the Investigation Agency",
      accusation: "Brief Description of the Charge (In Maximum 20 Words)",
      accusationDate: "Date of Issuance of Charge Sheet Against the Employee",
      remark1: "Remarks 1",
      remark2: "Remarks 2",
      fitUnfit: "Fit/Unfit",
    },
  };

  const hi = translations?.hindi;
  const en = translations?.english;

  const getAllG2 = async () => {
    try {
      const { data, error } = (await CallG2otionList(id)) as any;
      console.log("data", data);

      if (data?.data) {
        setFlags(data?.isReceived);
        const transformedData = transformData(data?.data);
        setAllData(transformedData);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllG2();
  }, []);

  const transformData = (rawData: any) => {
    return [
      {
        id: rawData?._id || "",
        pno: rawData?.pnoNumber || "",
        recruitmentDate: rawData?.seniorityPromotionList?.recruitmentDate
          ? new Date(rawData.seniorityPromotionList?.recruitmentDate).toLocaleDateString()
          : "",
        employeeName: rawData?.seniorityPromotionList?.employeeName,
        designation: rawData?.designation || "",
        fatherName: rawData?.fatherName || "", // Added for UI
        dateOfBirth: rawData?.dateOfBirth
          ? new Date(rawData.dateOfBirth).toLocaleDateString()
          : "",
        currentPosting: rawData?.currentPosting || "",
        totalService: {
          years: rawData?.totalService?.years || "",
          months: rawData?.totalService?.months || "",
          days: rawData?.totalService?.days || "",
        },
        educationQualificationYear: rawData?.educationQualificationYear || "",
        technicalCourseDate: rawData?.technicalCourseDate
          ? new Date(rawData.technicalCourseDate).toLocaleDateString()
          : "",
        trainingDetailsDate: rawData?.trainingDetailsDate
          ? new Date(rawData.trainingDetailsDate).toLocaleDateString()
          : "",
        allegations: rawData?.allegations || "",
        remarks: rawData?.remarks || "",
        secondRemarks: rawData?.secondRemarks || "",
        confidentialRemarks:
          rawData?.selectionYearConfidentialRemarks?.map((remark: any) => ({
            year: remark?.year?.toString() || "",
            remark: remark?.Remarks || "",
          })) || [],
        penalties: [
          ...(rawData?.punishments?.major?.map((p: any) => ({
            type: "Major",
            count: p?.count || "",
            date: p?.date ? new Date(p.date).toLocaleDateString() : "",
            incidentDate: p?.incidentDate
              ? new Date(p.incidentDate).toLocaleDateString()
              : "",
          })) || []),
          ...(rawData?.punishments?.minor?.map((p: any) => ({
            type: "Minor",
            count: p?.count || "",
            date: p?.date ? new Date(p.date).toLocaleDateString() : "",
            incidentDate: p?.incidentDate
              ? new Date(p.incidentDate).toLocaleDateString()
              : "",
          })) || []),
          ...(rawData?.punishments?.petty?.map((p: any) => ({
            type: "Petty",
            count: p?.count || "",
            date: p?.date ? new Date(p.date).toLocaleDateString() : "",
            incidentDate: p?.incidentDate
              ? new Date(p.incidentDate).toLocaleDateString()
              : "",
          })) || []),
        ],
        integrityWithheld: {
          notificationDate: rawData?.integrityWithheld?.notificationDate
            ? new Date(
                rawData.integrityWithheld.notificationDate,
              ).toLocaleDateString()
            : "",
          appealReceivedDate: rawData?.integrityWithheld?.appealReceivedDate
            ? new Date(
                rawData.integrityWithheld.appealReceivedDate,
              ).toLocaleDateString()
            : "",
          appealResolutionDate: rawData?.integrityWithheld?.appealResolutionDate
            ? new Date(
                rawData.integrityWithheld.appealResolutionDate,
              ).toLocaleDateString()
            : "",
        },
        adverseEntry: {
          notificationDate: rawData?.adverseEntry?.notificationDate
            ? new Date(rawData.adverseEntry.notificationDate).toLocaleDateString()
            : "",
          appealReceivedDate: rawData?.adverseEntry?.appealReceivedDate
            ? new Date(
                rawData.adverseEntry.appealReceivedDate,
              ).toLocaleDateString()
            : "",
          appealResolutionDate: rawData?.adverseEntry?.appealResolutionDate
            ? new Date(
                rawData.adverseEntry.appealResolutionDate,
              ).toLocaleDateString()
            : "",
        },
        suspensionDetails: {
          orderNumber: rawData?.suspensionDetails?.orderNumber || "",
          date: rawData?.suspensionDetails?.date
            ? new Date(rawData.suspensionDetails.date).toLocaleDateString()
            : "",
          reason: rawData?.suspensionDetails?.reason || "",
        },
        criminalCases: {
          caseNumber: rawData?.criminalCases?.caseNumber || "",
          chargeSheetNumber: rawData?.criminalCases?.chargeSheetNumber || "",
          courtDecision: rawData?.criminalCases?.courtDecision || "",
        },
        departmentActions: {
          ruleName: rawData?.departmentActions?.ruleName || "",
          accusation: rawData?.departmentActions?.accusation || "",
          accusationDate: rawData?.departmentActions?.accusationDate
            ? new Date(
                rawData.departmentActions.accusationDate,
              ).toLocaleDateString()
            : "",
        },
        status: rawData?.status || "",
      },
    ];
  };

  const years = Array.from({ length: 10 }, (_, i) => 2013 + i);

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
        <h1 className="mb-5 px-3 text-2xl font-semibold">
          {flags === true ? "View & Verification G2 Form" : "View G2 Form"}{" "}
        </h1>
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
                    <div>{hi?.fatherName}</div>
                    <div>{en?.fatherName}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.currentPosting}</div>
                    <div>{en?.currentPosting}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.dob}</div>
                    <div>{en?.dob}</div>
                  </th>

                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.dateOfAppointment}</div>
                    <div>{en?.dateOfAppointment}</div>
                  </th>

                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.serviceTitle}</div>
                    <div>{en?.serviceTitle}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.qulification}</div>
                    <div>{en?.qulification}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.tachnical}</div>
                    <div>{en?.tachnical}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.trainings}</div>
                    <div>{en?.trainings}</div>
                  </th>
                  <th
                    colSpan={years.length}
                    className="border border-gray-300 p-5"
                  >
                    <div>{hi?.confidential}</div>
                    <div>{en?.confidential}</div>
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
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.Integrity}</div>
                    <div>{en?.Integrity}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.adverse}</div>
                    <div>{en?.adverse}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.suspensionDetails}</div>
                    <div>{en?.suspensionDetails}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.criminalCases}</div>
                    <div>{en?.criminalCases}</div>
                  </th>
                  <th colSpan={3} className="border border-gray-300 p-5">
                    <div>{hi?.departmentActions}</div>
                    <div>{en?.departmentActions}</div>
                  </th>
                  <th rowSpan={2} className="border border-gray-300 p-5">
                    <div>{hi?.allegations}</div>
                    <div>{en?.allegations}</div>
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

                  {/* Integrity sub-headers */}
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

                  {/* Adverse sub-headers */}
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

                  {/* suspensionDetails sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.orderNumber}</div>
                    <div>{en?.orderNumber}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.reason}</div>
                    <div>{en.reason}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.suspensionDate}</div>
                    <div>{en.suspensionDate}</div>
                  </th>

                  {/* criminalCases sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.caseNumber}</div>
                    <div>{en?.caseNumber}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.chargeSheetNumber}</div>
                    <div>{en.chargeSheetNumber}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.courtDecision}</div>
                    <div>{en.courtDecision}</div>
                  </th>

                  {/* departmentActions sub-headers */}
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.ruleName}</div>
                    <div>{en?.ruleName}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.accusation}</div>
                    <div>{en.accusation}</div>
                  </th>
                  <th className="border border-gray-300 p-5">
                    <div>{hi?.accusationDate}</div>
                    <div>{en.accusationDate}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allData?.map((item: any, index: any) => (
                  <tr
                    key={item?.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 p-5 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-5">{item?.pno}</td>
                    <td className="border border-gray-300 p-5">
                      {item?.designation || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.employeeName || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.fatherName || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.currentPosting || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.dateOfBirth || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.recruitmentDate || "-"}
                    </td>

                     {/* totalService */}
                     <td className="border border-gray-300 p-5 text-center">
                      {item?.totalService?.years || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.totalService?.months || "-"}
                    </td>
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.totalService?.days || "-"}
                    </td>
                    
                    <td className="border border-gray-300 p-5">
                      {item?.educationQualificationYear || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.technicalCourseDate || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.trainingDetailsDate || "-"}
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
                          {remarkObj ? remarkObj?.remark : "-"}
                        </td>
                      );
                    })}

                    {/* Major penalties */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Major")
                        .map((p: any) => p?.count)
                        .join(", ") || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Major")
                        .map((p: any) => p?.date)
                        .join("\n") || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Major")
                        .map((p: any) => p?.incidentDate)
                        .join("\n") || "-"}
                    </td>

                    {/* Minor penalties */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Minor")
                        .map((p: any) => p?.count)
                        .join(", ") || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Minor")
                        .map((p: any) => p?.date)
                        .join("\n") || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Minor")
                        .map((p: any) => p?.incidentDate)
                        .join("\n") || "-"}
                    </td>

                    {/* Petty penalties */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Petty")
                        .map((p: any) => p?.count)
                        .join(", ") || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Petty")
                        .map((p: any) => p?.date)
                        .join("\n") || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.penalties
                        .filter((p: any) => p?.type === "Petty")
                        .map((p: any) => p?.incidentDate)
                        .join("\n") || "-"}
                    </td>

                    {/* Integrity Withheld */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.integrityWithheld?.notificationDate || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.integrityWithheld?.appealReceivedDate || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.integrityWithheld?.appealResolutionDate || "-"}
                    </td>

                    {/* Adverse Entry */}
                    <td className="border border-gray-300 p-5 text-center">
                      {item?.adverseEntry?.notificationDate || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.adverseEntry?.appealReceivedDate || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.adverseEntry.appealResolutionDate || "-"}
                    </td>

                    {/* Suspension Details */}
                    <td className="border border-gray-300 p-5">
                      {item?.suspensionDetails?.orderNumber || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.suspensionDetails?.reason || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.suspensionDetails?.date || "-"}
                    </td>

                    {/* Criminal Cases */}
                    <td className="border border-gray-300 p-5">
                      {item?.criminalCases?.caseNumber || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.criminalCases?.chargeSheetNumber || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.criminalCases?.courtDecision || "-"}
                    </td>

                    {/* Department Actions */}
                    <td className="border border-gray-300 p-5">
                      {item?.departmentActions?.ruleName || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.departmentActions?.accusation || "-"}
                    </td>
                    <td className="border border-gray-300 p-5">
                      {item?.departmentActions?.accusationDate || "-"}
                    </td>

                    {/* Allegations */}
                    <td className="border border-gray-300 p-5">
                      {item?.allegations || "-"}
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

export default G2Form;
