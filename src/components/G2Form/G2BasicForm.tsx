import React from "react";
import G2LableledInput from "@/components/G2Form/G2LableledInput";

interface BasicFormProps {
  watch: any;
  type?: string;
  label?: string;
  name?: string;
  icon?: string;
  placeholder?: string;
}

const G2BasicForm = ({ watch }: BasicFormProps) => {
  return (
    <>
      <div className="flex w-full">
        <div className="w-1/2">
          <G2LableledInput
            type="text"
            label="पी0एन0ओ0 PNO"
            name="pnoNumber"
            icon="tag"
            placeholder="पी0एन0ओ0"
            watch={watch}
          />
          <G2LableledInput
            type="text"
            label="नाम (हाईस्कूल प्रमाण पत्र के अनुसार) Name (As per High School Certificate)"
            name="employeeName"
            icon="school"
            placeholder="नाम (हाईस्कूल प्रमाण पत्र के अनुसार)"
            watch={watch}
          />
          <G2LableledInput
            type="text"
            label="पिता का नाम Father's Name"
            name="fatherName"
            icon="school"
            placeholder="नाम (हाईस्कूल प्रमाण पत्र के अनुसार)"
            watch={watch}
          />
        </div>
        <div className="w-1/2 border-l-1">
          <G2LableledInput
            type="date"
            label="जन्मतिथि Date of Birth"
            name="dateOfBirth"
            icon="cake_add"
            placeholder="जन्मतिथि"
            watch={watch}
          />
          <G2LableledInput
            type="text"
            label="वर्तमान नियुक्ति स्थान Current Place of Posting"
            name="currentPosting"
            icon="location_on"
            placeholder="वर्तमान नियुक्ति स्थान"
            watch={watch}
          />
          <G2LableledInput
            type="date"
            label="कम्प्यूटर ऑपरेटर ग्रेड-ए के पद पर नियुक्ति की तिथि Date of Appointment to the Post of Computer Operator Grade-A"
            name="dateOfJoining"
            icon="location_on"
            placeholder="वर्तमान नियुक्ति स्थान"
            watch={watch}
          />
        </div>
      </div>
    </>
  );
};

export default G2BasicForm;
