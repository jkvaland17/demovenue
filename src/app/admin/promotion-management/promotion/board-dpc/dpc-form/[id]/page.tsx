"use client";
import { CallDCPotionList, CallUpdateDcpPromotion } from "@/_ServerActions";
import DpcModalTable from "@/components/DpcModalTable";
import FlatCard from "@/components/FlatCard";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {};

const DPCForm = (props: Props) => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isFit, setIsFit] = useState(false);
  const [modalHeading, setModalHeading] = useState<string>("");
  const [currentColumns, setCurrentColumns] = useState<
    { title: string; key: string }[]
  >([]);
  const [currentRows, setCurrentRows] = useState<any[]>([]);
  const [allDPC, setAllDPC] = useState([]) as any;

  const {
    isOpen: isMoreDetails,
    onOpen: onMoreDetals,
    onOpenChange: onOpenMoreDetails,
  } = useDisclosure();
  const {
    isOpen: isRemarkModal,
    onOpen: onRemarkModal,
    onOpenChange: onOpenRemarkModal,
    onClose: onRemarkClose,
  } = useDisclosure();
  const [modalType, setModalType] = useState("view");
  const [remark, setRemark] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");
  const [flags, setFlags] = useState<any>(false);
  const { id } = useParams() as any;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const annualConfidentialResolution = [
    { title: "Year", key: "annualConfidentialResolution" },
    { title: "From", key: "fromYear" },
    { title: "To", key: "toYear" },
    {
      title: "Category of Annual Confidential Intent",
      key: "categoryOfConfidentialIntent",
    },
    {
      title: "Date of Intimation of Adverse Remark",
      key: "dateOfIntimation",
    },
    {
      title: "Date of Receipt of Representation/Appeal",
      key: "dateOfReceipt",
    },
    {
      title: "Date of Disposal of Representation with Result",
      key: "dateOfDisposal",
    },
  ];
  const integrityRecords = [
    {
      title: "Integrity Certificate",
      key: "certificate",
    },
    {
      title: "Date of Intimation of Uncertified Integrity",
      key: "dateOfIntimationIntegrity",
    },
    {
      title:
        "Date of Receipt of Representation/Appeal against Uncertified Integrity",
      key: "dateOfReceiptOfRepresentationIntegrity",
    },
    {
      title: "Date of Disposal of Representation with Result",
      key: "dateOfDisposalOfRepresentationIntegrity",
    },
  ];
  const majorPenalties = [
    {
      title: "Order Number of Punishment",
      key: "orderNumberMajor",
    },
    {
      title: "Date of Punishment Order",
      key: "dateOfPunishmentMajor",
    },
    {
      title: "Date of Intimation of Punishment Order",
      key: "dateOfIntimationMajor",
    },
    {
      title:
        "Nature of Punishment(Dismissal from Service, Removal from Service, Reduction in Rank and Demotion to Lower Pay Scale or Pay Level",
      key: "natureOfPunishmentMajor",
    },
  ];
  const minorPenalties = [
    {
      title: "Order Number of Punishment",
      key: "orderNumberMinor",
    },
    {
      title: "Date of Punishment Order",
      key: "dateOfPunishmentMinor",
    },
    {
      title: "Date of Intimation of Punishment Order",
      key: "dateOfIntimationMinor",
    },
    {
      title:
        "Nature of Punishment(Dismissal from Service, Removal from Service, Reduction in Rank and Demotion to Lower Pay Scale or Pay Level",
      key: "natureOfPunishmentMinor",
    },
  ];
  const postPunishmentRelief = [
    {
      title:
        "Details of the Selection Years During Which the Concerned Personnel Was Declared Unsuitable",
      key: "yearOfRelief",
    },
    {
      title: "Details",
      key: "details",
    },
  ];
  const suspensionStatus = [
    {
      title: "Suspension Order Number, Date",
      key: "orderNumber",
    },
    {
      title: "Reason for Suspension - Maximum 20 Words",
      key: "reasonOfSuspense",
    },
    {
      title: "Reinstatement Order Number, Date",
      key: "orderNumberDate",
    },
  ];
  const pendingCriminalCases = [
    {
      title: "Case Number/Section/Year/Police Station/District",
      key: "caseNumber",
    },
    {
      title: "Charge Sheet Number and Date of Filing in Court",
      key: "chargeSheetWithDate",
    },
    {
      title: "Current Status of the Case, Court Decision, and Date",
      key: "currentCaseStatus",
    },
  ];
  const departmentalProceedings = [
    {
      title: "Name of Investigating Agency",
      key: "investigatingAgency",
    },
    {
      title: "Brief Description of Allegation - Maximum 20 Words",
      key: "briefAllegations",
    },
    {
      title: "Date of Issuance of Charge Sheet Against the Employee",
      key: "dateOfChargeSheet",
    },
  ];
  const punishmentOrDisciplinaryActions = [
    {
      title: "Brief Description of Order - Maximum 20 Words",
      key: "description",
    },
    {
      title:
        "Complaint Number and Year, and Date of Issuance of Summons to Accused by the Court",
      key: "caseNumber",
    },
  ];

  const getAllDPC = async () => {
    try {
      const { data, error } = (await CallDCPotionList(id)) as any;
      console.log("getAllDPC", { data, error });

      if (data) {
        setFlags(data?.isReceived);
        setAllDPC([data?.data]);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDPC();
  }, []);

  const handleModalTable = (
    columns: { title: string; key: string }[],
    rows: any[],
    heading: string,
  ) => {
    setModalHeading(heading);
    setCurrentColumns(columns);
    setCurrentRows(rows);
    onMoreDetals();
  };

  const updateRemarks = async (submitData: any) => {
    try {
      const obj = {
        id: id,
        status: submitData?.status,
        remarks: submitData?.remarks,
        secondRemarks: submitData?.secondRemarks,
      };
      console.log("obj", obj);
      const { data, error } = (await CallUpdateDcpPromotion(obj)) as any;
      // console.log("updateRemarks", { data, error });

      if (data?.message) {
        toast?.success(data?.message);
        onRemarkClose();
        getAllDPC();
      }
      if (error) {
        toast.error(data?.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <Button
        radius="full"
        className="mb-4 font-medium mob:hidden"
        onPress={() => {
          router.back();
        }}
        startContent={
          <span className="material-symbols-rounded">arrow_back</span>
        }
      >
        Go Back
      </Button> */}

      <FlatCard>
        <h1 className="mb-3 px-3 text-2xl font-semibold mob:text-xl">
          {flags === true
            ? "View & Verification DPC Form"
            : "View DPC Form"}{" "}
        </h1>
        <div className="relative h-[700px] overflow-hidden">
          <div
            className="relative h-full overflow-auto"
            id="scrollable-container"
          >
            <table
              className="promotion-table absolute left-0 top-0 z-10 w-full bg-white"
              style={{ position: "sticky", top: 0 }}
              id="fixed-table"
            >
              <thead>
                <tr>
                  <td rowSpan={3}>क0स०</td>
                  <td rowSpan={3}>ज्येष्ठता सूची क्रमांक</td>
                  <td rowSpan={3}>पात्रता सूची क्रमांक</td>
                  <td rowSpan={3}>पीएनओ न0</td>
                  <td rowSpan={3}>कर्मी का नाम</td>
                  <td rowSpan={3}>पिता का नाम</td>
                  <td rowSpan={3}>कैंडर</td>
                  <td colSpan={2}>वर्तमान तैनाती</td>
                  <td rowSpan={3}>जन्मतिथि</td>
                  <td rowSpan={3}>पोषक पद पर भर्ती की तिथि</td>
                  <td colSpan={3}>सेवा अवधि चयन वर्ष 2023 से वर्ष 2024</td>
                  <td colSpan={7}>
                    वार्षिक गोपनीय मंतव्य (चयन वर्ष, के पूर्ववर्ती 05 वर्षों के
                    लिए) इसमें चयन वर्ष 2017 से वर्ष 2022 तक की प्रविष्टियों
                    अंकित की जाये
                  </td>
                  <td colSpan={4}>
                    सत्यनिष्ठा (चयन वर्ष के पूर्ववर्ती 05 वर्षों के लिए)
                  </td>
                  <td colSpan={4}>
                    दीर्घ दण्ड-नियम-14(1) पोपक पद पर नियुक्ति की तिथि से
                    अद्यावधिक तिथि तक प्रदत्त दण्डों का विवरण
                  </td>
                  <td colSpan={4}>
                    लघु दण्ड-नियम-14(2) पोषक पद पर नियुक्ति की तिथि से अद्यावधिक
                    तिथि तक प्रदत्त दण्डों का विवरण
                  </td>
                  <td>
                    सम्बन्धित कार्मिक के विषय में दण्डोपरान्त निवारण सम्बन्धी
                    सूचना
                  </td>
                  <td colSpan={3}>
                    वर्तमान निलम्बन (निलम्बन की वर्तमान स्थिति डीपीसी के दिनांक
                    तक)
                  </td>
                  <td colSpan={3}>
                    लम्बित अपराधिक प्रकरण (जिसमें कर्मी के विरूद्व आरोप पत्र
                    प्रेषित किया गया है)
                  </td>
                  <td colSpan={3}>विभागीय कार्यवाही नियम 14(1) के अन्तर्गत</td>
                  <td colSpan={2}>
                    अभ्यर्थी के विरुद्व दण्ड/अनुशासनिक कार्यवाही/अभियोग के
                    विवेचनाधीन होने /अन्तिम रिपोर्ट /आरोप पत्र / परिवाद आदि के
                    सम्बन्ध में मा0 न्यायालय / अधिकरण के आदेश (स्थगन/विलोपित
                    आदेश की पठनीय प्रति सहित)
                  </td>
                  <td rowSpan={3}>
                    स्थानापन्न एवं तदर्थ रूप से प्रोन्नति कार्मिक के नाम का
                    पात्रता सूची में सम्मिलित किया जाना।
                  </td>
                  <td rowSpan={3}>कमांक</td>
                  <td rowSpan={3}>संस्तृति</td>
                  {flags === true && (
                    <>
                      <td rowSpan={3}>रिमार्क 1</td>
                      <td rowSpan={3}>रिमार्क 2</td>
                      <td rowSpan={3}>फिट/अफिट</td>
                    </>
                  )}
                </tr>

                <tr>
                  <td rowSpan={2}>जनपद/इकाई</td>
                  <td rowSpan={2}>परिक्षेत्र/अनुभाग</td>
                  <td rowSpan={2}>वर्ष</td>
                  <td rowSpan={2}>माह</td>
                  <td rowSpan={2}>दिन</td>
                  <td rowSpan={2}>वर्ष</td>
                  <td rowSpan={2}>कब से</td>
                  <td rowSpan={2}>कब तक</td>
                  <td rowSpan={2}>वार्षिक गोपनीय मंतव्य की श्रेणी</td>
                  <td colSpan={3}>
                    खराब असंरतोषजनक, प्रतिकूल पार्षिक मन्तव्य परिणाम सहित
                  </td>
                  <td rowSpan={2}>सत्यनिष्ठा प्रमाण-पत्र</td>
                  <td rowSpan={2}>अप्रमाणित सत्यानिष्ठा संसूचित करने का दि0</td>
                  <td rowSpan={2}>
                    अप्रमाणित सत्यनिष्ठा के विरूद्ध प्रत्यावेदन/अपील प्राप्त
                    होने की तिथि
                  </td>
                  <td rowSpan={2}>
                    प्रत्यावेदन के निस्तारण की तिथि परिणाम सहित
                  </td>
                  <td rowSpan={2}>दण्डादेश की सं०</td>
                  <td rowSpan={2}>दण्डादेश का दि0</td>
                  <td rowSpan={2}>दण्डादेश संसूचित करने का दिनांक</td>
                  <td rowSpan={2}>
                    दण्ड की प्रकृति (सेवा से पदच्युत, सेवा से हटाना तथा
                    पंक्तिच्युत करना, जिसके अन्तर्गत निम्नतर वेतनमान या समयवेतन
                    मान में निम्न प्रकम पर अवनति
                  </td>
                  <td rowSpan={2}>दण्डादेश की सं0</td>
                  <td rowSpan={2}>दण्डादेश का दि0</td>
                  <td rowSpan={2}>दण्डादेश संसूचित करने का दिनांक</td>
                  <td rowSpan={2}>
                    दण्ड की प्रकृति (परिनिन्दा प्रविष्टि/ अर्थदण्ड/अस्थाई रूप से
                    कितनी अवधि के लिए वेतन वृद्धि रोकी गयी है।
                  </td>
                  <td rowSpan={2}>
                    पूर्व में किस-किस चयन वर्ष के सापेक्ष सम्बन्धित कार्मिक को
                    अनुपयुक्त किया गया है।
                  </td>
                  <td rowSpan={2}>निलम्बन आदेश संख्या, दिनांक</td>
                  <td rowSpan={2}>निलम्बन का कारण (अधिकतम 20 शब्दों में)</td>
                  <td rowSpan={2}>बहाली आदेश संख्या, दिनांक</td>
                  <td rowSpan={2}>अपराध सं0/धारा/वर्ष/थाना/जनपद</td>
                  <td rowSpan={2}>
                    आरोप पत्र संख्या व न्यायालय में आरोप पत्र प्रेषित किये जाने
                    का दि0
                  </td>
                  <td rowSpan={2}>
                    अभियोग की अद्वतन स्थिति एवं न्यायालय का निर्णय व दिनांक
                  </td>
                  <td rowSpan={2}>जॉच संगठन का नाम</td>
                  <td rowSpan={2}>
                    आरोप का संक्षिप्त विवरण (अधिकतम 20 शब्दों में)
                  </td>
                  <td rowSpan={2}>
                    कार्मिक के विरुद्व आरोप पत्र निर्गत करने का दि0
                  </td>
                  <td rowSpan={2}>
                    आदेश का संक्षिप्त विवरण (अधिकतम 20 शब्दों में)
                  </td>
                  <td rowSpan={2}>
                    परिवाद संख्या एव वर्ष तथा न्यायालय द्वारा परिवाद में
                    अभियुक्त को सम्मन जारी करने का दिनांक
                  </td>
                </tr>

                <tr>
                  <td>प्रतिकूल मंतव्य को संसूचित करने की तिथि</td>
                  <td>प्रत्यावेदन-अपील प्राप्त होने की तिथि</td>
                  <td>प्रत्यावेदन के निस्तारण की तिथि परिणाम सहित</td>
                </tr>
              </thead>
            </table>

            <table className="promotion-table w-full border-collapse">
              <thead>
                <tr>
                  {Array.from({ length: 51 }, (_, i) => (
                    <td key={i}>{i + 1}</td>
                  ))}
                </tr>
                <tr>
                  <td rowSpan={3}>Sr. No.</td>
                  <td rowSpan={3}>Seniority List No</td>
                  <td rowSpan={3}>Eligibility List No.</td>
                  <td rowSpan={3}>PNO No.</td>
                  <td rowSpan={3}>Employee Name</td>
                  <td rowSpan={3}>Father’s Name</td>
                  <td rowSpan={3}>Cadre</td>
                  <td colSpan={2}>Current Posting</td>
                  <td rowSpan={3}>Date of Birth</td>
                  <td rowSpan={3}>Date of Appointment to Substantive Post</td>
                  <td colSpan={3}>
                    Service Period from Selection Year 2023 to Year 2024
                  </td>
                  <td colSpan={7}>
                    Annual confidential resolution (for the 05 years preceding
                    the selection year) should contain entries from the
                    selection year 2017 to the year 2022.
                  </td>
                  <td colSpan={4}>
                    Integrity (For 5 years preceding the selection year)
                  </td>
                  <td colSpan={4}>
                    Major Penalty - Rule 14(1) (Details of penalties awarded
                    from the date of appointment to the substantive post till
                    the present date)
                  </td>
                  <td colSpan={4}>
                    Minor Penalty - Rule 14(2) (Details of penalties awarded
                    from the date of appointment to the substantive post till
                    the present date)
                  </td>
                  <td>
                    Post-Punishment Relief Information Regarding the Concerned
                    Personnel
                  </td>
                  <td colSpan={3}>
                    Current Suspension Status as on the Date of DPC
                  </td>
                  <td colSpan={3}>
                    Pending Criminal Case (Where Charge Sheet Has Been Filed
                    Against the Employe
                  </td>
                  <td colSpan={3}>Departmental Proceedings Under Rule 14(1)</td>
                  <td colSpan={2}>
                    Details of Punishment/Disciplinary Action/Charge Under
                    Investigation/Final Report/Charge Sheet/Complaint, etc., as
                    per Hon’ble Court/Tribunal Orders
                  </td>
                  <td rowSpan={3}>
                    Inclusion of the Name of Substitute and Ad-Hoc Promoted
                    Employee in the Eligibility List
                  </td>
                  <td rowSpan={3}>Serial Number</td>
                  <td rowSpan={3}>Recommendation</td>
                  {flags === true && (
                    <>
                      <td rowSpan={3}>Remark 1</td>
                      <td rowSpan={3}>Remark 2</td>
                      <td rowSpan={3}>Fit/Unfit</td>
                    </>
                  )}
                </tr>

                <tr>
                  <td rowSpan={2}>District/Unit</td>
                  <td rowSpan={2}>Range/Division</td>
                  <td rowSpan={2}>Year</td>
                  <td rowSpan={2}>Month</td>
                  <td rowSpan={2}>Day</td>
                  <td rowSpan={2}>Year</td>
                  <td rowSpan={2}>From</td>
                  <td rowSpan={2}>To</td>
                  <td rowSpan={2}>Category of Annual Confidential Intent</td>
                  <td colSpan={3}>
                    Unsatisfactory/Adverse Remarks (with outcomes)
                  </td>
                  <td rowSpan={2}>Integrity Certificate</td>
                  <td rowSpan={2}>
                    Date of Intimation of Uncertified Integrity
                  </td>
                  <td rowSpan={2}>
                    Date of Receipt of Representation/Appeal against Uncertified
                    Integrity
                  </td>
                  <td rowSpan={2}>
                    Date of Disposal of Representation with Result
                  </td>
                  <td rowSpan={2}>Order Number of Punishment</td>
                  <td rowSpan={2}>Date of Punishment Order</td>
                  <td rowSpan={2}>Date of Intimation of Punishment Order</td>
                  <td rowSpan={2}>
                    Nature of Punishment(Dismissal from Service, Removal from
                    Service, Reduction in Rank and Demotion to Lower Pay Scale
                    or Pay Level
                  </td>
                  <td rowSpan={2}>Order Number of Punishment</td>
                  <td rowSpan={2}>Date of Punishment Order</td>
                  <td rowSpan={2}>Date of Intimation of Punishment Order</td>
                  <td rowSpan={2}>
                    Nature of Punishment(Censure Entry, Financial Penalty,
                    Withholding of Increment for a Specified Period)
                  </td>
                  <td rowSpan={2}>
                    Details of the Selection Years During Which the Concerned
                    Personnel Was Declared Unsuitable
                  </td>
                  <td rowSpan={2}>Suspension Order Number, Date</td>
                  <td rowSpan={2}>Reason for Suspension - Maximum 20 Words</td>
                  <td rowSpan={2}>Reinstatement Order Number, Date</td>
                  <td rowSpan={2}>
                    Case Number/Section/Year/Police Station/District
                  </td>
                  <td rowSpan={2}>
                    Charge Sheet Number and Date of Filing in Court
                  </td>
                  <td rowSpan={2}>
                    Current Status of the Case, Court Decision, and Date
                  </td>
                  <td rowSpan={2}>Name of Investigating Agency</td>
                  <td rowSpan={2}>
                    Brief Description of Allegation - Maximum 20 Words
                  </td>
                  <td rowSpan={2}>
                    Date of Issuance of Charge Sheet Against the Employee
                  </td>
                  <td rowSpan={2}>
                    Brief Description of Order - Maximum 20 Words
                  </td>
                  <td rowSpan={2}>
                    Complaint Number and Year, and Date of Issuance of Summons
                    to Accused by the Court
                  </td>
                </tr>

                <tr>
                  <td>Date of Intimation of Adverse Remark</td>
                  <td>Date of Receipt of Representation/Appeal</td>
                  <td>Date of Disposal of Representation with Result</td>
                </tr>
              </thead>
              <tbody>
                {allDPC?.map((item: any, index: any) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {item?.seniorityPromotionList?.seniorityListSerialNo ||
                        "-"}
                    </td>
                    <td>
                      {item?.seniorityPromotionList?.eligibilityListSerialNo ||
                        "-"}
                    </td>
                    <td>{item?.seniorityPromotionList?.pnoNumber || "-"}</td>
                    <td>{item?.seniorityPromotionList?.employeeName || "-"}</td>
                    <td>{item?.seniorityPromotionList?.fatherName || "-"}</td>
                    <td>{item?.seniorityPromotionList?.cadre || "-"}</td>
                    <td>{item?.districtUnit || "-"}</td>
                    <td>{item?.rangeDivision || "-"}</td>
                    <td>
                      {item?.seniorityPromotionList?.dateOfBirth
                        ? moment(
                            item?.seniorityPromotionList?.dateOfBirth,
                          ).format("DD-MM-YYYY")
                        : "-"}
                    </td>
                    <td>
                      {item?.dateOfAppointmentToSubstantivePost
                        ? moment(
                            item?.dateOfAppointmentToSubstantivePost,
                          ).format("DD-MM-YYYY")
                        : "-"}
                    </td>
                    <td>{item?.servicePeriod?.year || "-"}</td>
                    <td>{item?.servicePeriod?.month || "-"}</td>
                    <td>{item?.servicePeriod?.day || "-"}</td>
                    <td colSpan={7}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              annualConfidentialResolution,
                              item?.annualConfidentialResolution || [],
                              "Annual confidential resolution (for the 05 years preceding the selection year) should contain entries from the selection year 2017 to the year 2022.",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td colSpan={4}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              integrityRecords,
                              item?.integrityRecords || [],
                              "Integrity (For 5 years preceding the selection year)",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td colSpan={4}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              majorPenalties,
                              item?.majorPenalties || [],
                              "Major Penalty - Rule 14(1) (Details of penalties awarded from the date of appointment to the substantive post till the present date)",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td colSpan={4}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              minorPenalties,
                              item?.minorPenalties || [],
                              "Minor Penalty - Rule 14(2) (Details of penalties awarded from the date of appointment to the substantive post till the present date)",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              postPunishmentRelief,
                              item?.postPunishmentRelief || [],
                              "Details of the Selection Years During Which the Concerned Personnel Was Declared Unsuitable",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td colSpan={3}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              suspensionStatus,
                              item?.suspensionStatus || [],
                              "Current Suspension Status as on the Date of DPC",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td colSpan={3}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              pendingCriminalCases,
                              item?.pendingCriminalCases || [],
                              "Pending Criminal Case (Where Charge Sheet Has Been Filed Against the Employee",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td colSpan={3}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              departmentalProceedings,
                              item?.departmentalProceedings || [],
                              "Departmental Proceedings Under Rule 14(1)",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td colSpan={2}>
                      <div className="flex justify-center">
                        <Button
                          radius="full"
                          color="primary"
                          variant="light"
                          onPress={() => {
                            handleModalTable(
                              punishmentOrDisciplinaryActions,
                              item?.punishmentOrDisciplinaryActions || [],
                              "Details of Punishment/Disciplinary Action/Charge Under Investigation/Final Report/Charge Sheet/Complaint, etc., as per Hon'ble Court/Tribunal Orders",
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                    <td>{item?.eligibilityListInclusion}</td>
                    <td>{item?.serialNumber}</td>
                    <td>{item?.recommendation}</td>
                    {flags === true && (
                      <>
                        <td>
                          <div className="flex justify-center">
                            <Button
                              onPress={() => {
                                setModalType("view");
                                setRemark(item?.remarks || "");
                                onRemarkModal();
                              }}
                              color="primary"
                              variant="flat"
                              radius="full"
                              startContent={
                                <span
                                  className="material-symbols-rounded"
                                  style={{ color: "rgb(29 78 216)" }}
                                >
                                  visibility
                                </span>
                              }
                            >
                              View
                            </Button>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center">
                            <Button
                              onPress={() => {
                                setModalType("view");
                                setRemark(item?.secondRemarks || "");
                                onRemarkModal();
                              }}
                              color="primary"
                              variant="flat"
                              radius="full"
                              startContent={
                                <span
                                  className="material-symbols-rounded"
                                  style={{ color: "rgb(29 78 216)" }}
                                >
                                  visibility
                                </span>
                              }
                            >
                              View
                            </Button>
                          </div>
                        </td>
                        <td>
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
                                  // Pre-fill the form fields for editing
                                  setValue("status", item?.status || "");
                                  setValue("remarks", item?.remarks || "");
                                  setValue(
                                    "secondRemarks",
                                    item?.secondRemarks || "",
                                  );
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
                {modalType === "view" ? (
                  <p className="mb-6">{remark}</p>
                ) : (
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
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isMoreDetails} onOpenChange={onOpenMoreDetails} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalHeading}
              </ModalHeader>
              <ModalBody>
                <DpcModalTable
                  columnsArray={currentColumns}
                  rowsArray={currentRows}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DPCForm;
