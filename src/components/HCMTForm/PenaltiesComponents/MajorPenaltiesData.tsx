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
  removeMajorPenalties: any;
  appendMajorPenalties: any;
  MajorPenaltiesFields: any;
};

const MajorPenaltiesData: React.FC<Props> = ({
  control,
  register,
  removeMajorPenalties,
  appendMajorPenalties,
  MajorPenaltiesFields,
}) => {
  return (
    <>
      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">दीर्घ दण्ड Major Penalties</h2>
        {MajorPenaltiesFields?.map((field: any, index: any) => (
          <div className="mt-6 flex flex-wrap gap-4" key={field.id}>
            <div className="min-w-0 flex-1">
              <Input
                {...register(`longPunishment.${index}.countAndYear`, {
                  required: "minorNumber is required",
                })}
                isRequired
                errorMessage={"Please Enter Minor Number"}
                type="text"
                label="दीर्घ दण्ड की संख्या/वर्ष Number of Major Penalties / Year"
                labelPlacement="outside"
                placeholder="Number of Minor Penalties"
                radius="sm"
                variant="bordered"
                classNames={{ inputWrapper: "border-small" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Input
                {...register(`longPunishment.${index}.date`, {
                  required: "minorDate is required",
                })}
                isRequired
                errorMessage={"Please Select Date"}
                type="date"
                label="दीर्घ दण्ड का दिनांक Date of Major Penalty"
                labelPlacement="outside"
                placeholder="dd-mm-yyyy"
                radius="sm"
                variant="bordered"
                classNames={{ inputWrapper: "border-small" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <Input
                {...register(`longPunishment.${index}.incidentDate`, {
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
              {MajorPenaltiesFields?.length > 1 && (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => removeMajorPenalties(index)}
                >
                  Remove
                </Button>
              )}
              {MajorPenaltiesFields?.length === index + 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() =>
                    appendMajorPenalties({
                      countAndYear: "",
                      date: "",
                      incidentDate: "",
                    })
                  }
                >
                  Add Major Penalties
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MajorPenaltiesData;
