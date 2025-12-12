import { Button, Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import FieldOption from "./FieldOption";

type Props = {
  data: any;
  index: number;
  isEditMode: boolean;
  onChange: (index: number, updated: any) => void;
  onRemove: (index: number) => void;
  hasError?: boolean;
};

const FieldCard = ({
  data,
  index,
  isEditMode,
  onChange,
  onRemove,
  hasError,
}: Props) => {
  const typeOptions = [
    { key: "date", title: "Date" },
    { key: "time", title: "Time" },
    { key: "text", title: "Text" },
    { key: "number", title: "Number" },
    { key: "image", title: "Image" },
    { key: "longtext", title: "Longtext" },
    { key: "option", title: "Option" },
    { key: "radio", title: "Radio" },
    { key: "multiple_option", title: "Multiple Option" },
    { key: "declaration", title: "Declaration" },
    { key: "custom", title: "Custom" },
  ];

  console.log(index, hasError);

  return (
    <div
      className={`grid h-fit grid-cols-1 gap-4 rounded-xl border p-4 shadow-small ${
        hasError ? "border-red-400 bg-red-50" : "border-none"
      }`}
    >
      {isEditMode && (
        <Button
          size="sm"
          radius="full"
          className="-me-8 -mt-8 ms-auto"
          color="danger"
          isIconOnly
          startContent={<span className="material-symbols-rounded">close</span>}
          onPress={() => onRemove(index)}
        ></Button>
      )}

      <Select
        items={typeOptions}
        selectedKeys={[data?.type]}
        label="Type"
        labelPlacement="outside"
        placeholder="Select"
        isDisabled={!isEditMode}
        classNames={{ trigger: `${hasError && "bg-white"}` }}
        onSelectionChange={(keys) => {
          const selectedType = Array.from(keys)[0];
          onChange(index, { type: selectedType });
        }}
      >
        {(item: any) => <SelectItem key={item?.key}>{item?.title}</SelectItem>}
      </Select>

      <Input
        label="Key"
        labelPlacement="outside"
        placeholder="Enter key"
        value={data?.key}
        isDisabled={!isEditMode}
        classNames={{ inputWrapper: `${hasError && "bg-white"}` }}
        onValueChange={(val) => onChange(index, { key: val })}
      />

      <Input
        label="Title"
        labelPlacement="outside"
        placeholder="Enter title"
        value={data?.title}
        isDisabled={!isEditMode}
        classNames={{ inputWrapper: `${hasError && "bg-white"}` }}
        onValueChange={(val) => onChange(index, { title: val })}
      />

      <Checkbox
        isSelected={data?.mandatory}
        isDisabled={!isEditMode}
        onValueChange={(val) => onChange(index, { mandatory: val })}
      >
        Mandatory
      </Checkbox>

      {isEditMode && data?.type === "image" && (
        <Input
          type="number"
          label="Total images"
          labelPlacement="outside"
          placeholder="Enter total images"
          value={data?.qty}
          classNames={{ inputWrapper: `${hasError && "bg-white"}` }}
          onValueChange={(val) =>
            onChange(index, { qty: val && parseInt(val) })
          }
          isRequired
          startContent={
            <span className="material-symbols-rounded">imagesmode</span>
          }
        />
      )}

      {["option", "radio", "multiple_option"].includes(data?.type) &&
        data?.options?.map((option: any, optionIndex: number) => (
          <FieldOption
            key={optionIndex}
            data={option}
            isEditMode={isEditMode}
            hasError={hasError}
            onChange={(updatedOption) => {
              const updatedOptions = [...(data.options || [])];
              updatedOptions[optionIndex] = updatedOption;
              onChange(index, { options: updatedOptions });
            }}
            onRemove={() => {
              const updatedOptions = [...(data.options || [])];
              updatedOptions.splice(optionIndex, 1);
              onChange(index, { options: updatedOptions });
            }}
          />
        ))}

      {isEditMode &&
        ["option", "radio", "multiple_option"].includes(data?.type) && (
          <Button
            color="secondary"
            size="sm"
            onPress={() => {
              const newOptions = [...(data.options || [])];
              newOptions.push({ key: "", title: "" });
              onChange(index, { options: newOptions });
            }}
            startContent={<span className="material-symbols-rounded">add</span>}
          >
            Add Option
          </Button>
        )}
    </div>
  );
};

export default FieldCard;
