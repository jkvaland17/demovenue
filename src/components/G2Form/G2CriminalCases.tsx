import { Input } from "@nextui-org/input";
import React from "react";
type Props = {
  register: any;
};

const G2CriminalCases: React.FC<Props> = ({ register }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-4 mt-5">
        <div className="min-w-0 flex-1">
          <Input
            {...register(`criminalCases.caseNumber`, {
              required: "Please Enter Order Number",
            })}
            isRequired
            errorMessage={"Please Enter Case Number"}
            type="number"
            label="अपराध संख्या/धारा/वर्ष/थाना/जनपद Crime Number/Section/ Year/Police Station/District"
            labelPlacement="outside"
            placeholder="Enter Case Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Input
            {...register(`criminalCases.chargeSheetNumber`, {
              required: "Please Enter Charge Sheet Number",
            })}
            isRequired
            errorMessage={"Please Enter Charge Sheet Number"}
            type="text"
            label="आरोप पत्र संख्या व न्यायालय में आरोप पत्र प्रेषित किये जाने का दिनांक Charge Sheet Number and Date of Submission of Charge Sheet in Court"
            labelPlacement="outside"
            placeholder="Enter Charge Sheet Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            {...register(`criminalCases.courtDecision`, {
              required: "Please Enter Court Decision",
            })}
            isRequired
            errorMessage={"Please Enter Court Decision"}
            type="text"
            maxLength={20}
            label="अभियोग की अद्यतन स्थिति एवं न्यायालय का निर्णय व दिनांक Current Status of the Case and Court's Verdict and Date"
            labelPlacement="outside"
            placeholder="Enter Court Decision"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>
      </div>
    </div>
  );
};

export default G2CriminalCases;
