import { Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";

interface VenueRoleResourceProps {
  index: number;
  resourceOptions: { key: string; label: string }[];
  resource: { resource: string; actions: string[] };
  resources: { resource: string; actions: string[] }[];
  updateResource: (
    index: number,
    key: "resource" | "actions",
    value: string | string[],
  ) => void;
  removeResource: (index: number) => void;
}

const VenueRoleResource: React.FC<VenueRoleResourceProps> = ({
  index,
  resource,
  resources,
  resourceOptions,
  updateResource,
  removeResource,
}) => {
  // Get already selected resources (except the current one)
  const selectedResources = resources
    .filter((_, i) => i !== index) // Exclude current resource
    .map((res) => res.resource);

  // Filter options to remove already selected resources
  const availableOptions = resourceOptions.filter(
    (option) => !selectedResources.includes(option.key),
  );

  return (
    <div className="rounded-xl border p-4">
      {/* Resource Selection */}
      <Select
        items={availableOptions}
        label="Resources"
        labelPlacement="outside"
        placeholder="Select"
        selectedKeys={[resource.resource]}
        onChange={(e) => {
          updateResource(index, "resource", e.target.value);
        }}
      >
        {(item: any) => <SelectItem key={item?.key}>{item?.label}</SelectItem>}
      </Select>

      {/* Enable checkboxes only if resource is selected */}
      <CheckboxGroup
        className="mt-4"
        value={resource.actions}
        onChange={(values) => updateResource(index, "actions", values)}
        isDisabled={!resource.resource} // Disable if no resource is selected
      >
        <Checkbox value="create">Create</Checkbox>
        <Checkbox value="read">Read</Checkbox>
        <Checkbox value="update">Update</Checkbox>
        <Checkbox value="delete">Delete</Checkbox>
      </CheckboxGroup>

      {/* Remove Resource Button */}
      <div className="flex justify-end">
        <Button
          color="danger"
          size="sm"
          variant="flat"
          onPress={() => removeResource(index)}
          startContent={
            <span className="material-symbols-rounded">delete</span>
          }
        >
          Remove Resource
        </Button>
      </div>
    </div>
  );
};

export default VenueRoleResource;
