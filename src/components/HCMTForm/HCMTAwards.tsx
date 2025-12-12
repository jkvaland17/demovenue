import React from "react";
import { Input, Button } from "@nextui-org/react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: any;
};

const HCMTAwards: React.FC<Props> = ({ control, register, errors }) => {
  const {
    fields: deptProceedingFields,
    append: appendDeptProceeding,
    remove: removeDeptProceeding,
  } = useFieldArray({
    control,
    name: "awards",
  });

  const {
    fields: additionalAwardsFields,
    append: appendadditionalAwards,
    remove: removeadditionalAwards,
  } = useFieldArray({
    control,
    name: "additionalAwards",
  });

  return (
    <>
      <div className="col-span-2">
        {deptProceedingFields?.map((field, index) => (
          <div
            key={field.id}
            className="mb-4 grid grid-cols-2 gap-4 rounded-lg"
          >
            <Input
              {...register(`awards.${index}.awardNumber`, {
                required: "Cash is required",
              })}
              isRequired
              type="number"
              label="Cash. नकद"
              labelPlacement="outside"
              fullWidth
              placeholder="Enter Cash"
              variant="bordered"
              errorMessage={"Cash is required"}
              classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
            />

            <Input
              {...register(`awards.${index}.awardDate`, {
                required: "Date is required",
              })}
              isRequired
              label="Date. दिनांक"
              type="date"
              labelPlacement="outside"
              fullWidth
              placeholder="Enter Date"
              variant="bordered"
              errorMessage={"Date is required"}
              classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
            />
            <div className="col-span-2 flex justify-end gap-3">
              {deptProceedingFields.length > 1 && (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => removeDeptProceeding(index)}
                >
                  Remove
                </Button>
              )}
              {deptProceedingFields.length === index + 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() =>
                    appendDeptProceeding({
                      awardNumber: "",
                      awardDate: "",
                    })
                  }
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="col-span-2">
        {additionalAwardsFields?.map((field, index) => (
          <div
            key={field.id}
            className="mb-4 grid grid-cols-2 gap-4 rounded-lg"
          >
            <Input
              {...register(`additionalAwards.${index}.awardNumber`, {
                required: "Cash is required",
              })}
              isRequired
              type="number"
              label="Good Entry. सुप्रविष्टि"
              labelPlacement="outside"
              fullWidth
              placeholder="Enter Cash"
              variant="bordered"
              errorMessage={"Cash is required"}
              classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
            />

            <Input
              {...register(`additionalAwards.${index}.awardDate`, {
                required: "Date is required",
              })}
              isRequired
              label="Date. दिनांक"
              type="date"
              labelPlacement="outside"
              fullWidth
              placeholder="Enter Date"
              variant="bordered"
              errorMessage={"Date is required"}
              classNames={{ mainWrapper: "mt-6", inputWrapper: "border-small" }}
            />
            <div className="col-span-2 flex justify-end gap-3">
              {additionalAwardsFields.length > 1 && (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => removeadditionalAwards(index)}
                >
                  Remove
                </Button>
              )}
              {additionalAwardsFields.length === index + 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() =>
                    appendadditionalAwards({
                      awardNumber: "",
                      awardDate: "",
                    })
                  }
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HCMTAwards;
