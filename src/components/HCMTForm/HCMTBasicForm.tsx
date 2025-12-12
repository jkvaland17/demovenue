import React from "react";
import HCMTLabeledInput from "./HCMTLabeledInput";

interface BasicFormProps {
  watch: any;
  type?: string;
  label?: string;
  name?: string;
  icon?: string;
  placeholder?: string;
}

const HCMTBasicForm = ({ watch }: BasicFormProps) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-1/2">
          <HCMTLabeledInput
            type="text"
            label="पी0एन0ओ0 PNO"
            name="pnoNumber"
            icon="tag"
            placeholder="पी0एन0ओ0"
            watch={watch}
          />
          <HCMTLabeledInput
            type="text"
            label="नाम (हाईस्कूल प्रमाण पत्र के अनुसार) Name (As per High School Certificate)"
            name="employeeName"
            icon="school"
            placeholder="नाम (हाईस्कूल प्रमाण पत्र के अनुसार)"
            watch={watch}
          />
        </div>
        <div className="w-1/2 border-l-1">
          <HCMTLabeledInput
            type="date"
            label="जन्मतिथि Date of Birth"
            name="dateOfBirth"
            icon="cake_add"
            placeholder="जन्मतिथि"
            watch={watch}
          />
          <HCMTLabeledInput
            type="text"
            label="वर्तमान नियुक्ति स्थान Current Place of Posting"
            name="currentPosting"
            icon="location_on"
            placeholder="वर्तमान नियुक्ति स्थान"
            watch={watch}
          />
        </div>
      </div>
    </>
  );
};

export default HCMTBasicForm;
