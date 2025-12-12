"use client";
import FlatCard from "@/components/FlatCard";
import {
  Accordion,
  AccordionItem,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React from "react";

type Props = {};

const DPCForm = (props: Props) => {
  return (
    <FlatCard heading="DPC Form">
      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                tag
              </span>
              Seniority List Serial No.
            </p>
            <p>Data</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                person
              </span>
              Employee Name
            </p>
            <p>Data</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                call
              </span>
              Mobile number
            </p>
            <p>Data</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                calendar_today
              </span>
              Date of Birth
            </p>
            <p>Data</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                calendar_today
              </span>
              Date of Recruitment
            </p>
            <p>Data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                tag
              </span>
              Eligibility List Serial No.
            </p>
            <p>Data</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                person
              </span>
              Father’s name
            </p>
            <p>Data</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                circle
              </span>
              Current Posting
            </p>
            <p>Data</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <p className="font-medium">
              <span className="material-symbols-rounded me-2 align-bottom">
                calendar_today
              </span>
              Date of Promotion to the Post of Head Constable
            </p>
            <p>Data</p>
          </div>
        </div>
      </div>

      <div className="mb-2 mt-8">
        <Input
          type="text"
          label="Cadre. कैंडर"
          labelPlacement="outside"
          placeholder="Enter cadre"
          variant="bordered"
          isRequired
          endContent={<span className="material-symbols-rounded">edit</span>}
        />
      </div>

      <Accordion defaultExpandedKeys="all">
        <AccordionItem
          key="1"
          title={
            <p className="font-semibold">
              Annual confidential resolution (for the 05 years preceding the
              selection year) should contain entries from the selection year
              2017 to the year 2022. वार्षिक गोपनीय मंतव्य (चयन वर्ष, के
              पूर्ववर्ती 05 वर्षों के लिए) इसमें चयन वर्ष 2017 से वर्ष 2022 तक
              की प्रविष्टियों अंकित की जाये
            </p>
          }
        >
          <Select
            items={[{ key: "noData", name: "--" }]}
            label="From"
            labelPlacement="outside"
            placeholder="Select"
          >
            {(item) => <SelectItem key={item?.key}>{item?.name}</SelectItem>}
          </Select>
        </AccordionItem>
        <AccordionItem
          key="2"
          title={
            <p className="font-semibold">
              Integrity (For 5 years preceding the selection year). सत्यनिष्ठा
              (चयन वर्ष के पूर्ववर्ती 05 वर्षों के लिए)
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="3"
          title={
            <p className="font-semibold">
              Major Penalty - Rule 14(1) (Details of penalties awarded from the
              date of appointment to the substantive post till the present date)
              दीर्घ दण्ड-नियम-14(1) पोपक पद पर नियुक्ति की तिथि से अद्यावधिक
              तिथि तक प्रदत्त दण्डों का विवरण
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="4"
          title={
            <p className="font-semibold">
              Post-Punishment Relief Information Regarding the Concerned
              Personnel
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="5"
          title={
            <p className="font-semibold">
              Current Suspension Status as on the Date of DPC
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="6"
          title={
            <p className="font-semibold">
              Pending Criminal Case (Where Charge Sheet Has Been Filed Against
              the Employe
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="7"
          title={
            <p className="font-semibold">
              Departmental Proceedings Under Rule 14(1)
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="8"
          title={
            <p className="font-semibold">
              Details of Punishment/Disciplinary Action/Charge Under
              Investigation/Final Report/Charge Sheet/Complaint, etc., as per
              Hon’ble Court/Tribunal Orders
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="9"
          title={
            <p className="font-semibold">
              Inclusion of the Name of Substitute and Ad-Hoc Promoted Employee
              in the Eligibility List
            </p>
          }
        >
          content
        </AccordionItem>
        <AccordionItem
          key="10"
          title={<p className="font-semibold">Serial Number</p>}
        >
          content
        </AccordionItem>
        <AccordionItem
          key="11"
          title={<p className="font-semibold">Recommendation</p>}
        >
          content
        </AccordionItem>
      </Accordion>
    </FlatCard>
  );
};

export default DPCForm;
