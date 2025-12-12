import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  register: any;
  watch: any;
  errors: any;
  removepettyPunishment: any;
  appendpettyPunishment: any;
  pettyPunishmentFields: any;
};

const PettyPenaltiesData: React.FC<Props> = ({
  control,
  register,
  removepettyPunishment,
  appendpettyPunishment,
  pettyPunishmentFields,
}) => {
  return (
    <>
      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">छुद्र दण्ड Petty Penalties</h2>
        {pettyPunishmentFields?.map((field: any, index: any) => (
          <div className="mt-6 flex flex-wrap gap-4" key={field.id}>
            <div className="min-w-0 flex-1">
              <Input
                {...register(`petty.${index}.count`, {
                  required: "minorNumber is required",
                })}
                isRequired
                errorMessage={"Please Enter Minor Number"}
                type="text"
                label="छुद्र दण्ड की संख्या Number of Petty Penalties"
                labelPlacement="outside"
                placeholder="Number of Minor Penalties"
                radius="sm"
                variant="bordered"
                classNames={{ inputWrapper: "border-small" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Input
                {...register(`petty.${index}.date`, {
                  required: "minorDate is required",
                })}
                isRequired
                errorMessage={"Please Select Date"}
                type="date"
                label="छुद्र दण्ड का दिनांक Date of Petty Penalty"
                labelPlacement="outside"
                placeholder="dd-mm-yyyy"
                radius="sm"
                variant="bordered"
                classNames={{ inputWrapper: "border-small" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Input
                {...register(`petty.${index}.incidentDate`, {
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
              {pettyPunishmentFields?.length > 1 && (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => removepettyPunishment(index)}
                >
                  Remove
                </Button>
              )}
              {pettyPunishmentFields?.length === index + 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() =>
                    appendpettyPunishment({
                      countAndYear: "",
                      date: "",
                      incidentDate: "",
                    })
                  }
                >
                  Add Petty Penalties
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PettyPenaltiesData;
