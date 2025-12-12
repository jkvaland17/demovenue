import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import React from "react";

type Props = {
  control: any;
  register: any;
  watch: any;
  errors: any;
  removeminorPenalties: any;
  appendminorPenalties: any;
  minorPenaltiesFields: any;
};

const MinorPenaltiesData: React.FC<Props> = ({
  control,
  register,
  minorPenaltiesFields,
  appendminorPenalties,
  removeminorPenalties,
}) => {
  return (
    <>
      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">लघु दण्ड Minor Penalties</h2>
        {minorPenaltiesFields?.map((field: any, index: any) => (
          <div className="mt-6 flex flex-wrap gap-4" key={field.id}>
            <div className="min-w-0 flex-1">
              <Input
                {...register(`minorPunishment.${index}.countAndYear`, {
                  required: "minorNumber is required",
                })}
                isRequired
                errorMessage={"Please Enter Minor Number"}
                type="text"
                label="लघु दण्ड की संख्या Number of Minor Penalties"
                labelPlacement="outside"
                placeholder="Number of Minor Penalties"
                radius="sm"
                variant="bordered"
                classNames={{ inputWrapper: "border-small" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Input
                {...register(`minorPunishment.${index}.date`, {
                  required: "minorDate is required",
                })}
                isRequired
                errorMessage={"Please Select Date"}
                type="date"
                label="लघु दण्ड का दिनांक Date of Minor Penalty"
                labelPlacement="outside"
                placeholder="dd-mm-yyyy"
                radius="sm"
                variant="bordered"
                classNames={{ inputWrapper: "border-small" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Input
                {...register(`minorPunishment.${index}.incidentDate`, {
                  required: "minorDateOfIncident is required",
                })}
                isRequired
                errorMessage={"Please Select Date"}
                type="date"
                label="घटना की तिथि Date of Incident"
                labelPlacement="outside"
                placeholder="dd-mm-yyyy"
                radius="sm"
                variant="bordered"
                classNames={{ inputWrapper: "border-small" }}
              />
            </div>

            <div className="col-span-2 flex w-full justify-end gap-3">
              {minorPenaltiesFields.length > 1 && (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => removeminorPenalties(index)}
                >
                  Remove
                </Button>
              )}
              {minorPenaltiesFields.length === index + 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() =>
                    appendminorPenalties({
                      countAndYear: "",
                      date: "",
                      incidentDate: "",
                    })
                  }
                >
                  Add Minor Penalties
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MinorPenaltiesData;
