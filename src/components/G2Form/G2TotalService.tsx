import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { Control, Controller } from "react-hook-form";

type Props = {
  control: Control<any>;
  errors: any;
};

const G2TotalService: React.FC<Props> = ({ control, errors }) => {
  return (
    <div className="col-span-2 rounded-md border-1 px-2 pt-3">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Controller
          name="totalService.years"
          control={control}
          rules={{ required: "Please Select Year" }}
          render={({
            fieldState: { invalid, error },
            field: { onChange, value },
          }) => (
            <Select
              isRequired
              label="वर्ष Year"
              placeholder="Select Year"
              radius="sm"
              variant="bordered"
              labelPlacement="outside"
              classNames={{ trigger: "border-small" }}
              selectedKeys={value ? [value] : []}
              errorMessage={"Please Select Year"}
              onChange={(e) => onChange(e.target.value)}
              items={Array.from({ length: 100 }, (_, i) => ({
                year: String(2025 - i),
              }))}
            >
              {(item) => (
                <SelectItem key={item.year} value={item.year}>
                  {item.year}
                </SelectItem>
              )}
            </Select>
          )}
        />

        <Controller
          name="totalService.months"
          control={control}
          rules={{ required: "Please Select Month" }}
          render={({
            fieldState: { invalid, error },
            field: { onChange, value },
          }) => (
            <Select
              isRequired
              label="माह Month"
              placeholder="Select Month"
              radius="sm"
              variant="bordered"
              labelPlacement="outside"
              classNames={{ trigger: "border-small" }}
              selectedKeys={value ? [value] : []}
              errorMessage={"Please Select Month"}
              onChange={(e) => onChange(e.target.value)}
              items={Array.from({ length: 12 }, (_, i) => ({
                month: String(i + 1),
              }))}
            >
              {(item) => (
                <SelectItem key={item.month} value={item.month}>
                  {item.month}
                </SelectItem>
              )}
            </Select>
          )}
        />

        <Controller
          name="totalService.days"
          control={control}
          rules={{ required: "Please Select Day" }}
          render={({
            fieldState: { invalid, error },
            field: { onChange, value },
          }) => (
            <Select
              isRequired
              label="दिन Day"
              placeholder="Select Day"
              radius="sm"
              variant="bordered"
              labelPlacement="outside"
              classNames={{ trigger: "border-small" }}
              selectedKeys={value ? [value] : []}
              errorMessage={"Please Select Day"}
              onChange={(e) => onChange(e.target.value)}
              items={Array.from({ length: 31 }, (_, i) => ({
                day: String(i + 1),
              }))}
            >
              {(item) => (
                <SelectItem key={item.day} value={item.day}>
                  {item.day}
                </SelectItem>
              )}
            </Select>
          )}
        />
      </div>
    </div>
  );
};

export default G2TotalService;
