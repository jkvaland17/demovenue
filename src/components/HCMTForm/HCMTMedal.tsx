import { Input } from "@nextui-org/input";
import React from "react";

type Props = {
  register: any;
  errors: any;
};

const HCMTMedal: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg p-4">
      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">
          महामहिम राष्ट्रपति का पुलिस पदक/ वीरता पदक Hon’ble President’s Police
          Medal / Gallantry Medal
        </h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            {...register("medals.PresidentPoliceMedal.count", {
              required: "Date is required",
            })}
            isRequired
            type="number"
            label="महामहिम राष्ट्रपति का पुलिस पदक/ वीरता पदक Hon’ble President’s Police Medal / Gallantry Medal"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
          <Input
            {...register("medals.PresidentPoliceMedal.date", {
              required: "Date is required",
            })}
            isRequired
            type="date"
            label="दिनांक Date"
            fullWidth
            labelPlacement="outside"
            placeholder="dd-mm-yyyy"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">
          महामहिम राष्ज्यपाल/मा0 मुख्यमंत्री द्वारा पुलिस पदक/ वीरता पदक Hon’ble
          Governor / Hon’ble Chief Minister’s Police Medal / Gallantry Medal
        </h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            {...register("medals.GovernorCMPoliceMedal.count", {
              required: "Date is required",
            })}
            isRequired
            type="number"
            label="महामहिम राष्ज्यपाल/मा0 मुख्यमंत्री द्वारा पुलिस पदक/ वीरता पदक Hon’ble
          Governor / Hon’ble Chief Minister’s Police Medal / Gallantry Medal"
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
          <Input
            {...register("medals.GovernorCMPoliceMedal.date", {
              required: "Date is required",
            })}
            isRequired
            type="date"
            label="दिनांक Date"
            fullWidth
            labelPlacement="outside"
            placeholder="dd-mm-yyyy"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">
          पुलिस महानिदेशक का उ0प्र0 द्वारा प्रदत्त उत्कृष्ट/ सराहनीय सेवाओ के
          लिए सम्मान चिन्ह Commendation Badge for Excellent / Meritorious
          Services awarded by the Director General of Police, U.P.
        </h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            {...register("medals.dGPExcellenceServiceAward.count", {
              required: "Date is required",
            })}
            isRequired
            type="number"
            label="पुलिस महानिदेशक का उ0प्र0 द्वारा प्रदत्त उत्कृष्ट/ सराहनीय सेवाओ के
          लिए सम्मान चिन्ह Commendation Badge for Excellent / Meritorious
          Services awarded by the Director General of Police, U.P."
            fullWidth
            labelPlacement="outside"
            placeholder="Enter Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
            errorMessage={"Date is required"}
          />
          <Input
            {...register("medals.dGPExcellenceServiceAward.date", {
              required: "Date is required",
            })}
            isRequired
            type="date"
            label="दिनांक Date"
            fullWidth
            labelPlacement="outside"
            placeholder="dd-mm-yyyy"
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

export default HCMTMedal;
