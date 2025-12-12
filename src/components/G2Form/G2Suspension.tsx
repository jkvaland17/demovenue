import { Input } from "@nextui-org/input";
import React from "react";
type Props = {
  register: any;
};

const G2Suspension: React.FC<Props> = ({ register }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Input
            {...register(`suspensionDetails.orderNumber`, {
              required: "Please Enter Order Number",
            })}
            isRequired
            errorMessage={"Please Enter Order Number"}
            type="number"
            label="निलम्बन आदेश संख्या Suspension Order Number"
            labelPlacement="outside"
            placeholder="Enter Order Number"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Input
            {...register(`suspensionDetails.date`, {
              required: "Please Select Date",
            })}
            isRequired
            errorMessage={"Please Select Date"}
            type="date"
            label="बहाली आदेश संख्या, दिनांक Reinstatement Order Number, Date"
            labelPlacement="outside"
            placeholder="Enter Details of Departmental Proceedings"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            {...register(`suspensionDetails.reason`, {
              required: "Please Enter Reason for Suspension",
            })}
            isRequired
            errorMessage={"Please Enter Reason for Suspension"}
            type="text"
            maxLength={20}
            label="निलम्बन का कारण (अधिकतम 20 शब्दों में) Reason for Suspension (in 20 words)"
            labelPlacement="outside"
            placeholder="Enter Reason for Suspension"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>
      </div>
    </div>
  );
};

export default G2Suspension;
