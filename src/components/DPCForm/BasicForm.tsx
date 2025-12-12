import React from "react";
import LabeledInput from "./LabeledInput";
import { Divider } from "@nextui-org/react";

interface BasicFormProps {
  watch: any;
}

const BasicForm = ({ watch }: BasicFormProps) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-1/2">
          <LabeledInput
            type="text"
            label="Seniority List No. ज्येष्ठता सूची कमाक"
            name="seniorityListSerialNo"
            icon="tag"
            placeholder="Enter Seniority List No. ज्येष्ठता सूची कमाक"
            watch={watch}
          />
          <LabeledInput
            type="text"
            label="Employee Name. कर्मी का नाम"
            name="employeeName"
            placeholder="Enter Employee Name. कर्मी का नाम"
            watch={watch}
            icon="person"
          />
          <LabeledInput
            type="text"
            label="Phone No. पीएनओ न0"
            name="pnoNumber"
            placeholder="Enter Phone No. पीएनओ न0"
            watch={watch}
            icon="call"
          />
          <LabeledInput
            label="Date of Birth. जन्मतिथि"
            name="dateOfBirth"
            type="date"
            watch={watch}
            icon="calendar_today"
          />
        </div>
        <div className="w-1/2 border-l-1">
          <LabeledInput
            type="text"
            label="Eligibility List No. पात्रता सूची कमाक"
            name="eligibilityListSerialNo"
            icon="tag"
            placeholder="Enter Eligibility List No. पात्रता सूची कमाक"
            watch={watch}
          />
          <LabeledInput
            type="text"
            label="Father Name. पिता का नाम"
            name="fatherName"
            placeholder="Enter Father Name. पिता का नाम"
            watch={watch}
            icon="person"
          />
          <LabeledInput
            type="text"
            label="Cadre. कैंडर"
            name="cadre"
            placeholder="Enter Cadre. कैंडर"
            watch={watch}
            icon="apartment"
          />
          <LabeledInput
            label="Date of Appointment to Substantive Post. पोषक पद पर भर्ती की तिथि"
            name="dateOfAppointmentToSubstantivePost"
            type="date"
            watch={watch}
            icon="calendar_today"
          />
        </div>
      </div>
      <div className="my-2">
        <Divider />
      </div>
      <h1 className="px-3 text-gray-500">Current Posting. वर्तमान तैनाती</h1>
      <div className="flex w-full">
        <div className="w-1/2">
          <LabeledInput
            type="text"
            label="District/Unit. जनपद/इकाई"
            name="districtUnit"
            icon="home"
            placeholder="Enter District/Unit. जनपद/इकाई"
            watch={watch}
          />
        </div>
        <div className="w-1/2 border-l-1">
          <LabeledInput
            type="text"
            label="Range/Division. परिक्षेत्र/अनुभाग"
            name="rangeDivision"
            icon="apartment"
            placeholder="Enter Range/Division. परिक्षेत्र/अनुभाग"
            watch={watch}
          />
        </div>
      </div>
    </>
  );
};

export default BasicForm;
