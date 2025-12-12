import { Input } from "@nextui-org/input";
import React from "react";
type Props = {
  register: any;
};

const G2Allegations: React.FC<Props> = ({ register }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <div className="min-w-0 flex-1">
          <Input
            {...register(`allegations`, {
              required: "Enter Allegations",
            })}
            isRequired
            errorMessage={"Enter Allegations"}
            type="text"
            maxLength={20}
            label=""
            labelPlacement="outside"
            placeholder="Enter Allegations"
            radius="sm"
            variant="bordered"
            classNames={{ inputWrapper: "border-small" }}
          />
        </div>
      </div>
    </div>
  );
};

export default G2Allegations;
