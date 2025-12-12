import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import MajorPenaltiesData from "./PenaltiesComponents/MajorPenaltiesData";
import MinorPenaltiesData from "./PenaltiesComponents/MinorPenaltiesData";
import PettyPenaltiesData from "./PenaltiesComponents/PettyPenaltiesData";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";

type Props = {
  control: any;
  register: any;
  watch: any;
  errors: any;
};

const HCMTPenalties: React.FC<Props> = ({
  control,
  register,
  watch,
  errors,
}) => {
  const {
    fields: MajorPenaltiesFields,
    append: appendMajorPenalties,
    remove: removeMajorPenalties,
  } = useFieldArray({ control, name: "longPunishment" });
  const {
    fields: minorPenaltiesFields,
    append: appendminorPenalties,
    remove: removeminorPenalties,
  } = useFieldArray({ control, name: "minorPunishment" });
  const {
    fields: pettyPunishmentFields,
    append: appendpettyPunishment,
    remove: removepettyPunishment,
  } = useFieldArray({ control, name: "pettyPunishment" });

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
        <div className="flex flex-wrap gap-4">
          <div className="min-w-0 flex-1">
            <Controller
              name="integritySchema.integrityHoldYear"
              control={control}
              rules={{ required: "Please Select Year" }}
              render={({ field }) => (
                <Select
                  isRequired
                  errorMessage={"Please Select Year"}
                  label="सत्यनिष्ठा रोकी गयी हो तो उसका वर्ष If Integrity was Withheld, Mention the Year"
                  radius="sm"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="If Integrity was Withheld, Mention the Year"
                  classNames={{ trigger: "border-small" }}
                  selectedKeys={
                    field.value ? new Set([field.value]) : undefined
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Array.from({ length: 100 }, (_, i) => {
                    const y = String(2025 - i);
                    return (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    );
                  })}
                </Select>
              )}
            />
          </div>

          <div className="min-w-0 flex-1">
            <Controller
              name="integritySchema.adverseEntryYear"
              control={control}
              rules={{ required: "Please Select Year" }}
              render={({ field }) => (
                <Select
                  isRequired
                  errorMessage={"Please Select Year"}
                  label="प्रतिकूल प्रविष्टि का वर्ष Year of Adverse Entry"
                  placeholder="Year of Adverse Entry"
                  radius="sm"
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{ trigger: "border-small" }}
                  selectedKeys={
                    field.value ? new Set([field.value]) : undefined
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Array.from({ length: 100 }, (_, i) => {
                    const y = String(2025 - i);
                    return (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    );
                  })}
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-md border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-0 flex-1">
            <Input
              {...register(`remarks`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Enter Minor Number"}
              type="text"
              label="विभागीय कार्यवाही/पंजीकृत अभियोग का विवरण यदि कोई हो Details of Departmental Proceedings / Registered Allegations, if any"
              labelPlacement="outside"
              placeholder="Enter Details of Departmental Proceedings"
              radius="sm"
              variant="bordered"
              classNames={{ inputWrapper: "border-small" }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <Input
              {...register(`departmentalInquiry`, {
                required: "minorNumber is required",
              })}
              isRequired
              errorMessage={"Please Enter Minor Number"}
              type="text"
              label="अभियुक्ति Allegations"
              labelPlacement="outside"
              placeholder="Enter Allegations"
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

export default HCMTPenalties;
