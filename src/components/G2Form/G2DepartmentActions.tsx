import { Input } from "@nextui-org/input";
import React from "react";
type Props = {
  register: any;
};

const G2DepartmentActions: React.FC<Props> = ({ register }) => {
  return (
    <div>
      <div className="mt-5 flex flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Input
            {...register(`departmentActions.ruleName`, {
              required: "Please Enter Agency Name",
            })}
            isRequired
            errorMessage={"Please Enter Agency Name"}
            type="text"
            label="जांच संगठन का नाम Name of the Investigating Agency"
            labelPlacement="outside"
            placeholder="Enter Agency Name"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Input
            {...register(`departmentActions.accusation`, {
              required: "Please Enter Accusation",
            })}
            isRequired
            errorMessage={"Please Enter Accusation"}
            type="text"
            label="आरोप का संक्षिप्त विवरण(अधिकतम 20 शब्दों में) Brief Description of the Accusation (in 20 words)"
            labelPlacement="outside"
            maxLength={20}
            placeholder="Enter Accusation"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            {...register(`departmentActions.accusationDate`, {
              required: "Please Select Date",
            })}
            isRequired
            errorMessage={"Please Select Date"}
            type="date"
            maxLength={20}
            label="कार्मिक के विरूद्व आरोप पत्र निर्गत करने का दिनांक Date of Issuance of Charge Sheet Against the Employee"
            labelPlacement="outside"
            placeholder="Select Date"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>
      </div>
    </div>
  );
};

export default G2DepartmentActions;
