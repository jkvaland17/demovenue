import { Input, Button } from "@nextui-org/react";
import React from "react";

type Props = {
  data: any;
  isEditMode: boolean;
  onChange: (updated: any) => void;
  onRemove: () => void;
  hasError?: boolean;
};

const FieldOption = ({
  data,
  isEditMode,
  onChange,
  onRemove,
  hasError,
}: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border p-3">
      <Input
        size="sm"
        label="Key"
        labelPlacement="outside"
        placeholder="Enter key"
        value={data?.key}
        isDisabled={!isEditMode}
        classNames={{ inputWrapper: `${hasError && "bg-white"}` }}
        onValueChange={(val) => onChange({ ...data, key: val })}
        isRequired
      />
      <Input
        size="sm"
        label="Title"
        labelPlacement="outside"
        placeholder="Enter Title"
        value={data?.title}
        isDisabled={!isEditMode}
        classNames={{ inputWrapper: `${hasError && "bg-white"}` }}
        onValueChange={(val) => onChange({ ...data, title: val })}
        isRequired
      />
      {isEditMode && (
        <div className="col-span-2 flex justify-end">
          <Button size="sm" color="danger" variant="flat" onPress={onRemove}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default FieldOption;
