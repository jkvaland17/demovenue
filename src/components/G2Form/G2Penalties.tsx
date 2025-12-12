import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import MajorPenaltiesData from "@/components/G2Form/PenaltiesComponents/MajorPenaltiesData";
import MinorPenaltiesData from "@/components/G2Form/PenaltiesComponents/MinorPenaltiesData";
import PettyPenaltiesData from "@/components/G2Form/PenaltiesComponents/PettyPenaltiesData";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";

type Props = {
  control: any;
  register: any;
  watch: any;
  errors: any;
};

const G2Penalties: React.FC<Props> = ({ control, register, watch, errors }) => {
  const {
    fields: MajorPenaltiesFields,
    append: appendMajorPenalties,
    remove: removeMajorPenalties,
  } = useFieldArray({ control, name: "major" });
  const {
    fields: minorPenaltiesFields,
    append: appendminorPenalties,
    remove: removeminorPenalties,
  } = useFieldArray({ control, name: "minor" });
  const {
    fields: pettyPunishmentFields,
    append: appendpettyPunishment,
    remove: removepettyPunishment,
  } = useFieldArray({ control, name: "petty" });

  return (
    <div className="gap-4 rounded-lg p-4">
      <div className="mb-5">
        <MajorPenaltiesData
          MajorPenaltiesFields={MajorPenaltiesFields}
          appendMajorPenalties={appendMajorPenalties}
          removeMajorPenalties={removeMajorPenalties}
          control={control}
          register={register}
          watch={watch}
          errors={errors}
        />
      </div>

      <MinorPenaltiesData
        minorPenaltiesFields={minorPenaltiesFields}
        appendminorPenalties={appendminorPenalties}
        removeminorPenalties={removeminorPenalties}
        control={control}
        register={register}
        watch={watch}
        errors={errors}
      />

      <div className="mb-5">
        <PettyPenaltiesData
          pettyPunishmentFields={pettyPunishmentFields}
          appendpettyPunishment={appendpettyPunishment}
          removepettyPunishment={removepettyPunishment}
          control={control}
          register={register}
          watch={watch}
          errors={errors}
        />
      </div>

      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-10 text-lg font-bold">
          सत्यनिष्ठा रोकी गयी हो तो उसका विवरण Details if Integrity was Withheld
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-0 flex-1">
            <Input
              {...register(`integrityWithheld.notificationDate`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Select Date"}
              type="date"
              label="संसूचन की तिथि Date of Notification"
              labelPlacement="outside"
              placeholder="Enter Details of Departmental Proceedings"
              radius="sm"
              variant="bordered"
              classNames={{ inputWrapper: "border-small" }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <Input
              {...register(`integrityWithheld.appealReceivedDate`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Select Date"}
              type="date"
              label="प्रत्यावेदन प्राप्त होन की तिथि Date of Receipt of Representation"
              labelPlacement="outside"
              placeholder="Enter Details of Departmental Proceedings"
              radius="sm"
              variant="bordered"
              classNames={{ inputWrapper: "border-small" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              {...register(`integrityWithheld.appealResolutionDate`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Select Date"}
              type="date"
              label="प्रत्यावेदन निस्तारण की तिथि Date of Disposal of Representation"
              labelPlacement="outside"
              placeholder="Enter Details of Departmental Proceedings"
              radius="sm"
              variant="bordered"
              classNames={{ inputWrapper: "border-small" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-md border bg-white p-4 shadow-sm">
        <h2 className="mb-10 text-lg font-bold">
          प्रतिकूल प्रविष्टि Adverse Entry.
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-0 flex-1">
            <Input
              {...register(`adverseEntry.notificationDate`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Select Date"}
              type="Date"
              label="संसूचन की तिथि Date of Notification"
              labelPlacement="outside"
              placeholder="Enter Details of Departmental Proceedings"
              radius="sm"
              variant="bordered"
              classNames={{ inputWrapper: "border-small" }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <Input
              {...register(`adverseEntry.appealReceivedDate`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Select Date"}
              type="Date"
              label="प्रत्यावेदन प्राप्त होन की तिथि Date of Receipt of Representation"
              labelPlacement="outside"
              placeholder="Enter Details of Departmental Proceedings"
              radius="sm"
              variant="bordered"
              classNames={{ inputWrapper: "border-small" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              {...register(`adverseEntry.appealResolutionDate`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Select Date"}
              type="Date"
              label="प्रत्यावेदन निस्तारण की तिथि Date of Disposal of Representation"
              labelPlacement="outside"
              placeholder="Enter Details of Departmental Proceedings"
              radius="sm"
              variant="bordered"
              classNames={{ inputWrapper: "border-small" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default G2Penalties;
