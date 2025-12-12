import { Checkbox, cn } from "@nextui-org/react";

type prop = {
  data: string;
  value: string;
};

export const CustomCheckbox = ({ data, value }: prop) => {
  return (
    <Checkbox
      classNames={{
        base: cn(
          "inline-flex max-w-xl w-full bg-content1 m-0 shadow-md border-l-4 border-l-blue-600",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="text-small">{data}</div>
    </Checkbox>
  );
};
