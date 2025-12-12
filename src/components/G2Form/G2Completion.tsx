import { Input } from "@nextui-org/input";
import React from "react";

type Props = {
  register: any;
  errors: any;
};

const G2Completion: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg p-4">
      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">
          शिक्षा/शैक्षिक अर्हता एवं सम्बन्धित परीक्षा उत्तीर्ण करने का वर्ष.
          Educational Qualification and Year of Passing the Relevant Examination
        </h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            {...register("educationQualificationYear", {
              required: "Date is required",
            })}
            type="number"
            label=""
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">
          तकनीकी कम्प्यूटर कोर्स का नाम एवं कोर्स करने का दिनांक. Name of
          Technical Computer Course and Date of Completion
        </h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            {...register("technicalCourseDate", {
              required: "Date is required",
            })}
            type="date"
            label=""
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">
          03 दिवस या अधिक अवधि वाले प्रशिक्षणों का नाम एवं प्रशिक्षण पूर्ण करने
          का दिनांक. Name of Trainings of 3 Days or More and Date of Completion
        </h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            {...register("trainingDetailsDate", {
              required: "Date is required",
            })}
            type="date"
            label=""
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
        </div>
      </div>
    </div>
  );
};

export default G2Completion;
