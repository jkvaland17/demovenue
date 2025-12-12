import React from "react";
import moment from "moment";

type LabeledInputProps = {
  label: string;
  name: string;
  icon: string;
  type: string;
  placeholder?: string;
  watch: any;
};

const G2LableledInput: React.FC<LabeledInputProps> = ({
  label,
  name,
  icon,
  type,
  placeholder,
  watch,
}) => {
  return (
    <div className="flex w-full items-center gap-4 px-3 py-1">
      <label
        htmlFor={name}
        className="flex w-[800px] items-center gap-1 text-sm text-gray-500"
      >
        <span className="material-symbols-outlined">{icon}</span>
        {label}
      </label>
      <label className="flex w-full items-center gap-1 text-sm text-gray-500">
        {type === "date"
          ? moment(watch(name)).format("DD-MM-YYYY")
          : watch(name)}
      </label>
      {/* <Input
        {...register(name)}
        type={type}
        id={name}
        size="sm"
        variant="bordered"
        placeholder={placeholder}
        className="w-full"
      /> */}
    </div>
  );
};

export default G2LableledInput;
