"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Divider,
  CardHeader,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import BasicForm from "@/components/DPCForm/BasicForm";
import AnnualConfidentialResolution from "@/components/DPCForm/AnnualConfidentialResolution";
import SectionTitle from "@/components/DPCForm/SectionTitle";
import IntegrityRecords from "@/components/DPCForm/IntegrityRecords";
import MajorPenalties from "@/components/DPCForm/MajorPenalties";
import MinorPenalties from "@/components/DPCForm/MinorPenalties";
import PostPunishmentRelief from "@/components/DPCForm/PostPunishmentRelief";
import SuspensionStatus from "@/components/DPCForm/SuspensionStatus";
import PendingCriminalCases from "@/components/DPCForm/PendingCriminalCases";
import DepartmentalProceedings from "@/components/DPCForm/DepartmentalProceedings";
import PunishmentOrDisciplinaryActions from "@/components/DPCForm/PunishmentOrDisciplinaryActions";
import { useParams, useRouter } from "next/navigation";
import { CallDCPotionList, CallSeniorityForPromotionById, CallSubmitDCP, CallUpdateDcpPromotion } from "@/_ServerActions";
import { handleCommonErrors } from "@/Utils/HandleError";
import toast from "react-hot-toast";
import Link from "next/link";

const AddEligibilityList = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { slug } = useParams();
  // console.log("slug", slug);

   useEffect(() => {
      if (slug && slug.length > 0) {
        if (slug.length === 1) {
          getEligibilityData(slug[0]);
        } else if (slug.length === 2 && slug[0] === "edit") {
          setIsEditMode(true);
          getEditAllDCP(slug[1]);
        }
      }
    }, [slug]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      seniorityListSerialNo: "",
      eligibilityListSerialNo: "",
      pnoNumber: "",
      employeeName: "",
      fatherName: "",
      cadre: "",
      districtUnit: "",
      rangeDivision: "",
      dateOfBirth: "",
      dateOfAppointmentToSubstantivePost: "",
      recruitmentDate: "",
      currentPosting: "",
      promotionDate: "",
      annualConfidentialResolution: [
        {
          year: "",
          fromYear: "",
          toYear: "",
          categoryOfConfidentialIntent: "",
          remarks: "",
          unsatisfactoryAdverseRemarks: [
            {
              hasRemarks: "",
              dateOfIntimation: "",
              dateOfReceiptOfAppeal: "",
              dateOfDisposalWithResult: "",
            },
          ],
        },
      ],
      integrityRecords: [
        {
          certificate: "",
          dateOfIntimation: "",
          dateOfReceiptOfRepresentation: "",
          dateOfDisposalOfRepresentation: "",
        },
      ],
      majorPenalties: [
        {
          orderNumber: "",
          dateOfPunishment: null,
          dateOfIntimation: null,
          natureOfPunishment: "",
        },
      ],
      minorPenalties: [
        {
          orderNumber: "",
          dateOfPunishment: null,
          dateOfIntimation: null,
          natureOfPunishment: "",
        },
      ],
      postPunishmentRelief: [
        {
          details: "",
          yearOfRelief: "",
        },
      ],
      suspensionStatus: [
        {
          orderNumber: "",
          reasonOfSuspense: "",
          orderNumberDate: "",
        },
      ],
      pendingCriminalCases: [
        {
          caseNumber: "",
          chargeSheetWithDate: "",
          currentCaseStatus: "",
        },
      ],
      departmentalProceedings: [
        {
          investigatingAgency: "",
          briefAllegations: "",
          dateOfChargeSheet: "",
        },
      ],
      punishmentOrDisciplinaryActions: [
        {
          caseNumber: "",
          complaintYear: "",
          disciplinaryActionDetails: "",
          description: "",
        },
      ],
      eligibilityListInclusion: "",
      serialNumber: "1",
      recommendation: "",

      status: "",
      integrityCertificates: [
        {
          year: "",
          status: "",
        },
      ],
      remarks: "",
      secondRemarks: "",

      unsatisfactoryAdverseRemarks: {
        hasRemarks: "",
        dateOfIntimation: "",
        dateOfReceiptOfAppeal: "",
        dateOfDisposalWithResult: "",
      },
    },
  });

  const getEligibilityData = async (id: string) => {
    try {
      const { data, error } = (await CallSeniorityForPromotionById(
        `id=${id}`,
      )) as any;
      console.log("error::: ", error);
      console.log("data::: ", data);

      if (data?.data) {
        setValue("seniorityListSerialNo", data?.data?.seniorityListSerialNo);
        setValue(
          "eligibilityListSerialNo",
          data?.data?.eligibilityListSerialNo,
        );
        setValue("pnoNumber", data?.data?.pnoNumber);
        setValue("employeeName", data?.data?.employeeName);
        setValue("fatherName", data?.data?.fatherName);
        setValue("cadre", data?.data?.cadre);
        setValue("districtUnit", data?.data?.districtUnit);
        setValue("rangeDivision", data?.data?.rangeDivision);
        setValue("dateOfBirth", data?.data?.dateOfBirth);
        setValue(
          "dateOfAppointmentToSubstantivePost",
          data?.data?.dateOfAppointmentToSubstantivePost,
        );
        setValue("recruitmentDate", data?.data?.recruitmentDate);
        setValue("currentPosting", data?.data?.currentPosting);
        setValue("promotionDate", data?.data?.promotionDate);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEditAllDCP = async (id: string) => {
    try {
      const { data, error } = (await CallDCPotionList(id)) as any;
      console.log("getEditAllDCP",data);
      // Date formatting function
      const formatDateToYYYYMMDD = (isoDate: any) => {
        if (!isoDate) return "";
        return isoDate.split("T")[0];
      };
      if (data?.data) {
        // General information
        setValue("seniorityListSerialNo", data?.data?.seniorityListSerialNo || "-");
        setValue("eligibilityListSerialNo", data?.data?.eligibilityListSerialNo || "-");
        setValue("pnoNumber", data?.data?.pnoNumber || "-");
        setValue("employeeName", data?.data?.seniorityPromotionList?.employeeName || "-");
        setValue("fatherName", data?.data?.seniorityPromotionList?.fatherName || "-");
        setValue("cadre", data?.data?.cadre || "-");
        setValue("districtUnit", data?.data?.districtUnit || "-");
        setValue("rangeDivision", data?.data?.rangeDivision || "-");
        setValue("dateOfBirth", data?.data?.seniorityPromotionList?.dateOfBirth || "-");
        setValue(
          "dateOfAppointmentToSubstantivePost",
          data?.data?.dateOfAppointmentToSubstantivePost || "-",
        );
        setValue("recruitmentDate", data?.data?.recruitmentDate || "-");
        setValue("currentPosting", data?.data?.currentPosting || "-");
        setValue("promotionDate", data?.data?.promotionDate || "-");

        // Annual Confidential Resolution
      setValue(
        "annualConfidentialResolution",
        data?.data?.annualConfidentialResolution?.length
          ? data.data.annualConfidentialResolution.map((item: any) => ({
              year: item.year || "",
              fromYear: formatDateToYYYYMMDD(item.fromYear) || "",
              toYear: formatDateToYYYYMMDD(item.toYear) || "",
              categoryOfConfidentialIntent: item.categoryOfConfidentialIntent || "",
              remarks: item.remarks || "",
              unsatisfactoryAdverseRemarks: item.unsatisfactoryAdverseRemarks?.length
                ? item.unsatisfactoryAdverseRemarks.map((remark: any) => ({
                    hasRemarks: remark.hasRemarks || "",
                    dateOfIntimation: formatDateToYYYYMMDD(remark.dateOfIntimation) || "",
                    dateOfReceiptOfAppeal: formatDateToYYYYMMDD(remark.dateOfReceiptOfAppeal) || "",
                    dateOfDisposalWithResult: formatDateToYYYYMMDD(remark.dateOfDisposalWithResult) || "",
                  }))
                : [{ hasRemarks: "", dateOfIntimation: "", dateOfReceiptOfAppeal: "", dateOfDisposalWithResult: "" }],
            }))
          : [{ year: "", fromYear: "", toYear: "", categoryOfConfidentialIntent: "", remarks: "", unsatisfactoryAdverseRemarks: [{ hasRemarks: "", dateOfIntimation: "", dateOfReceiptOfAppeal: "", dateOfDisposalWithResult: "" }] }]
      );

      // Integrity Records
      setValue(
        "integrityRecords",
        data?.data?.integrityRecords?.length
          ? data.data.integrityRecords.map((item: any) => ({
              certificate: item.certificate || "",
              dateOfIntimation: formatDateToYYYYMMDD(item.dateOfIntimation) || "",
              dateOfReceiptOfRepresentation: formatDateToYYYYMMDD(item.dateOfReceiptOfRepresentation) || "",
              dateOfDisposalOfRepresentation: formatDateToYYYYMMDD(item.dateOfDisposalOfRepresentation) || "",
            }))
          : [{ certificate: "", dateOfIntimation: "", dateOfReceiptOfRepresentation: "", dateOfDisposalOfRepresentation: "" }]
      );

      // Major Penalties
      setValue(
        "majorPenalties",
        data?.data?.majorPenalties?.length
          ? data.data.majorPenalties.map((item: any) => ({
              orderNumber: item.orderNumber || "",
              dateOfPunishment: formatDateToYYYYMMDD(item.dateOfPunishment) || "",
              dateOfIntimation: formatDateToYYYYMMDD(item.dateOfIntimation) || "",
              natureOfPunishment: item.natureOfPunishment || "",
            }))
          : [{ orderNumber: "", dateOfPunishment: "", dateOfIntimation: "", natureOfPunishment: "" }]
      );

      // Minor Penalties
      setValue(
        "minorPenalties",
        data?.data?.minorPenalties?.length
          ? data.data.minorPenalties.map((item: any) => ({
              orderNumber: item.orderNumber || "",
              dateOfPunishment: formatDateToYYYYMMDD(item.dateOfPunishment) || "",
              dateOfIntimation: formatDateToYYYYMMDD(item.dateOfIntimation) || "",
              natureOfPunishment: item.natureOfPunishment || "",
            }))
          : [{ orderNumber: "", dateOfPunishment: "", dateOfIntimation: "", natureOfPunishment: "" }]
      );

      // Post Punishment Relief
      setValue(
        "postPunishmentRelief",
        data?.data?.postPunishmentRelief?.length
          ? data.data.postPunishmentRelief.map((item: any) => ({
              details: item.details || "",
              yearOfRelief: item.yearOfRelief || "",
            }))
          : [{ details: "", yearOfRelief: "" }]
      );

      // Suspension Status
      setValue(
        "suspensionStatus",
        data?.data?.suspensionStatus?.length
          ? data.data.suspensionStatus.map((item: any) => ({
              orderNumber: item.orderNumber || "",
              reasonOfSuspense: item.reasonOfSuspense || "",
              orderNumberDate: formatDateToYYYYMMDD(item.orderNumberDate) || "",
            }))
          : [{ orderNumber: "", reasonOfSuspense: "", orderNumberDate: "" }]
      );

      // Pending Criminal Cases
      setValue(
        "pendingCriminalCases",
        data?.data?.pendingCriminalCases?.length
          ? data.data.pendingCriminalCases.map((item: any) => ({
              caseNumber: item.caseNumber || "",
              chargeSheetWithDate: item.chargeSheetWithDate || "",
              currentCaseStatus: item.currentCaseStatus || "",
            }))
          : [{ caseNumber: "", chargeSheetWithDate: "", currentCaseStatus: "" }]
      );

      // Departmental Proceedings
      setValue(
        "departmentalProceedings",
        data?.data?.departmentalProceedings?.length
          ? data.data.departmentalProceedings.map((item: any) => ({
              investigatingAgency: item.investigatingAgency || "",
              briefAllegations: item.briefAllegations || "",
              dateOfChargeSheet: formatDateToYYYYMMDD(item.dateOfChargeSheet) || "",
            }))
          : [{ investigatingAgency: "", briefAllegations: "", dateOfChargeSheet: "" }]
      );

      // Punishment or Disciplinary Actions
      setValue(
        "punishmentOrDisciplinaryActions",
        data?.data?.punishmentOrDisciplinaryActions?.length
          ? data.data.punishmentOrDisciplinaryActions.map((item: any) => ({
              caseNumber: item.caseNumber || "",
              complaintYear: item.complaintYear || "",
              disciplinaryActionDetails: item.disciplinaryActionDetails || "",
              description: item.description || "",
            }))
          : [{ caseNumber: "", complaintYear: "", disciplinaryActionDetails: "", description: "" }]
      );

      // Other fields
      setValue("eligibilityListInclusion", data?.data?.eligibilityListInclusion || "");
      setValue("serialNumber", data?.data?.serialNumber?.toString() || "1");
      setValue("recommendation", data?.data?.recommendation || "");
      setValue("status", data?.data?.status || "");

      // Integrity Certificates
      setValue(
        "integrityCertificates",
        data?.data?.integrityCertificates?.length
          ? data.data.integrityCertificates.map((item: any) => ({
              year: item.year || "",
              status: item.status || "",
            }))
          : [{ year: "", status: "" }]
      );

      // Remarks
      setValue("remarks", data?.data?.remarks || "");
      setValue("secondRemarks", data?.data?.secondRemarks || "");

      // Unsatisfactory Adverse Remarks (top-level)
      setValue("unsatisfactoryAdverseRemarks", {
        hasRemarks: data?.data?.unsatisfactoryAdverseRemarks?.hasRemarks || "",
        dateOfIntimation: formatDateToYYYYMMDD(data?.data?.unsatisfactoryAdverseRemarks?.dateOfIntimation) || "",
        dateOfReceiptOfAppeal: formatDateToYYYYMMDD(data?.data?.unsatisfactoryAdverseRemarks?.dateOfReceiptOfAppeal) || "",
        dateOfDisposalWithResult: formatDateToYYYYMMDD(data?.data?.unsatisfactoryAdverseRemarks?.dateOfDisposalWithResult) || "",
      });
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData: any) => {
    console.log("Form Data:", formData);
    try {
      setLoader(true);
      if (isEditMode && slug && slug.length > 1) {
        const payload = {
          id: slug[1],
          ...formData
        };
        const { data, error } = (await CallUpdateDcpPromotion(payload)) as any;
        if (data?.status_code === 200) {
          setLoader(false);
          toast.success(data?.message);
          router.push("/admin/promotion-management/promotion/board-dpc");
        }
        if (error) {
          handleCommonErrors(error);
          setLoader(false);
        }
      } else {
        const { data, error } = (await CallSubmitDCP(formData)) as any;
        if (data?.status_code === 200) {
          setLoader(false);
          toast.success(data?.message);
          router.push("/admin/promotion-management/promotion/board-dpc");
        }
         if (error) {
            handleCommonErrors(error);
            setLoader(false);
        }
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setLoader(false);
    }
  };
console.log("formData", watch());

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="px-3 text-2xl font-semibold">DPC Form</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <BasicForm watch={watch} />
            </div>
            <div className="mb-4">
              <Divider />
            </div>
            <Accordion variant="splitted">
              <AccordionItem
                key="annualConfidentialResolution"
                aria-label="Accordion 1"
                title={
                  <SectionTitle
                    english="Service Period from Selection Year 2023 to Year 2024."
                    hindi="अवधि चयन वर्ष 2023 से वर्ष 2024 सेवा"
                  />
                }
              >
                <AnnualConfidentialResolution
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="integrityRecords"
                title={
                  <SectionTitle
                    english="Integrity (For 5 years preceding the selection year)."
                    hindi=" सत्यनिष्ठा (चयन वर्ष के पूर्ववर्ती 05 वर्षों के लिए)"
                  />
                }
              >
                <IntegrityRecords
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="majorPenalties"
                title={
                  <SectionTitle
                    english="Major Penalty - Rule 14(1) (Details of penalties awarded from the date of appointment to the substantive post till the present date)."
                    hindi=" दीर्घ दण्ड-नियम-14(1) पोपक पद पर नियुक्ति की तिथि से अद्यावधिक तिथि तक प्रदत्त दण्डों का विवरण"
                  />
                }
              >
                <MajorPenalties
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="minorPenalties"
                title={
                  <SectionTitle
                    english=" Minor Penalty - Rule 14(2) (Details of penalties awarded from the date of appointment to the substantive post till the present date)."
                    hindi=" लघु दण्ड-नियम-14(2) पोषक पद पर नियुक्ति की तिथि से अद्यावधिक तिथि तक प्रदत्त दण्डों का विवरण"
                  />
                }
              >
                <MinorPenalties
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="postPunishmentRelief"
                title={
                  <SectionTitle
                    english="Post-Punishment Relief Information Regarding the Concerned Personnel."
                    hindi=" सम्बन्धित कार्मिक के विषय में दण्डोपरान्त निवारण सम्बन्धी सूचना"
                  />
                }
              >
                <PostPunishmentRelief
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="suspensionStatus"
                title={
                  <SectionTitle
                    english="Current Suspension Status as on the Date of DPC."
                    hindi=" वर्तमान निलम्बन (निलम्बन की वर्तमान स्थिति डीपीसी के दिनांक तक)"
                  />
                }
              >
                <SuspensionStatus
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="pendingCriminalCases"
                title={
                  <SectionTitle
                    english="Pending Criminal Case (Where Charge Sheet Has Been Filed Against the Employe."
                    hindi=" लम्बित अपराधिक प्रकरण (जिसमें कर्मी के विरूद्व आरोप पत्र प्रेषित किया गया है)"
                  />
                }
              >
                <PendingCriminalCases
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="departmentalProceedings"
                title={
                  <SectionTitle
                    english="Departmental Proceedings Under Rule 14(1)."
                    hindi=" विभागीय कार्यवाही नियम 14(1) के अन्तर्गत"
                  />
                }
              >
                <DepartmentalProceedings
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="punishmentOrDisciplinaryActions"
                title={
                  <SectionTitle
                    english="Details of Punishment/Disciplinary Action/Charge Under Investigation/Final Report/Charge Sheet/Complaint, etc., as per Hon’ble Court/Tribunal Orders"
                    hindi=" अभ्यर्थी के विरुद्व दण्ड/अनुशासनिक कार्यवाही/अभियोग के विवेचनाधीन होने /अन्तिम रिपोर्ट /आरोप पत्र / परिवाद आदि के सम्बन्ध में मा0 न्यायालय / अधिकरण के आदेश (स्थगन/विलोपित आदेश की पठनीय प्रति सहित)"
                  />
                }
              >
                <PunishmentOrDisciplinaryActions
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                />
              </AccordionItem>
              <AccordionItem
                key="eligibilityListInclusion"
                title={
                  <SectionTitle
                    english="Inclusion of the Name of Substitute and Ad-Hoc Promoted Employee in the Eligibility List"
                    hindi=" स्थानापन्न एवं तदर्थ रूप से प्रोन्नति कार्मिक के नाम का पात्रता सूची में सम्मिलित किया जाना।"
                  />
                }
              >
                <Input
                  {...register(`eligibilityListInclusion`, {
                    required: "Eligibility List inclusion is required",
                  })}
                  value={watch(`eligibilityListInclusion`)}
                  fullWidth
                  placeholder="Enter Eligibility List Inclusion"
                  variant="bordered"
                  isInvalid={!!errors?.eligibilityListInclusion}
                  errorMessage={errors?.eligibilityListInclusion?.message}
                  classNames={{
                    inputWrapper: "border-small",
                  }}
                />
              </AccordionItem>
              <AccordionItem
                key="serialNumber"
                title={<SectionTitle english="Serial Number." hindi=" कमांक" />}
              >
                <Input
                  {...register("serialNumber", {
                    required: "Serial Number is required",
                  })}
                  value={watch("serialNumber")}
                  fullWidth
                  placeholder="Enter Serial Number"
                  variant="bordered"
                  isInvalid={!!errors?.serialNumber}
                  errorMessage={errors?.serialNumber?.message}
                  classNames={{
                    inputWrapper: "border-small",
                  }}
                />
              </AccordionItem>
              <AccordionItem
                key="recommendation"
                title={
                  <SectionTitle english="Recommendation." hindi=" संस्तृति" />
                }
              >
                <Textarea
                  {...register("recommendation", {
                    required: "Recommendation is required",
                  })}
                  value={watch("recommendation")}
                  fullWidth
                  placeholder="Enter recommendation"
                  variant="bordered"
                  isInvalid={!!errors?.recommendation}
                  errorMessage={errors?.recommendation?.message}
                  classNames={{
                    inputWrapper: "border-small",
                  }}
                />
              </AccordionItem>
            </Accordion>
            <div className="mt-6 flex justify-end gap-5">
              <Button
                color="danger"
                variant="flat"
                as={Link}
                href={"/admin/promotion-management/promotion/board-dpc"}
              >
                Cancel
              </Button>
              <Button
                isLoading={loader}
                type="submit"
                color="primary"
                variant="shadow"
                className="w-40"
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default AddEligibilityList;
