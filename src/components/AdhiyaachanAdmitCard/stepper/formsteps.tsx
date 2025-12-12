import React from "react";
import BasicDetails from "@/components/AdhiyaachanAdmitCard/stepper/BasicDetails";
import GenerateAdmit from "@/components/AdhiyaachanAdmitCard/stepper/GenerateAdmit";

interface AdmitCardStep {
  title: string;
  component: JSX.Element;
  componentkey: string;
  step: number;
  apiPropsRelation: string;
}

interface AdmitCardListProps {
  formMethods: any;
  setProfileFile: (file: File | null) => void;
}

const AdmitCardList = (
  formMethods: AdmitCardListProps["formMethods"],
  setProfileFile: AdmitCardListProps["setProfileFile"],
): AdmitCardStep[] => [
  {
    title: "Basic Information",
    component: <BasicDetails formMethods={formMethods} />,
    componentkey: "PersonalDetails",
    step: 1,
    apiPropsRelation: "advertisementBasicDetails",
  },
  {
    title: "Generate Admit Card",
    component: (
      <GenerateAdmit
        formMethods={formMethods}
        setProfileFile={setProfileFile}
      />
    ),
    componentkey: "PersonalDetails",
    step: 2,
    apiPropsRelation: "postDetails",
  },
];

export { AdmitCardList };
