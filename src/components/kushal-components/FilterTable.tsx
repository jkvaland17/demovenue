import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useState } from "react";

type Props = {};

const FilterTable = (props: Props) => {
  const [filterData, setFilterData] = useState<any>({
    status: "",
    SortAsc: "",
  });
  const [filterOptions, setFilterOptions] = useState([
    {
      name: "Status",
      Checkbox: false,
      select: [
        {
          name: "Completed",
          key: "Completed",
        },
        {
          name: "Pending",
          key: "Pending",
        },
        {
          name: "Ongoing",
          key: "Ongoing",
        },
      ],
    },
  ]);
  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button variant="bordered" className="border px-12">
          Edit Table <span className="material-symbols-rounded">edit</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-5">
        <div className="w-full">
          <div>
            <Select
              label="Sort By"
              labelPlacement="outside"
              placeholder="Select"
              classNames={{
                label: "font-semibold text-[16px]",
              }}
              items={[
                {
                  name: "Latest",
                  key: true,
                },
                {
                  name: "Oldest",
                  key: false,
                },
              ]}
              onChange={(e) => {
                setFilterData((prev: any) => ({
                  ...prev,
                  SortAsc: e.target.value,
                }));
              }}
            >
              {(option: any) => (
                <SelectItem key={option?.key} value={option?.key}>
                  {option?.name}
                </SelectItem>
              )}
            </Select>
          </div>
          <div className="mt-10">
            <p className="font-medium text-[16px]">Filter</p>
            {filterOptions?.map((item: any, index: number) => (
              <div key={index} className="my-2 flex gap-5 items-center">
                <Checkbox
                  className="min-w-[150px]"
                  classNames={{ label: "text-nowrap" }}
                  isSelected={item?.Checkbox}
                  onValueChange={(e: any) => {
                    setFilterOptions(
                      filterOptions.map((data) => {
                        if (item?.name === data?.name) {
                          return { ...data, Checkbox: e };
                        }
                        return data;
                      }),
                    );
                  }}
                  name={item.name}
                >
                  {item?.name}
                </Checkbox>
                <Select
                  isDisabled={!item?.Checkbox}
                  size="sm"
                  placeholder="Select"
                  classNames={{
                    label: "font-semibold text-[16px]",
                  }}
                  onChange={(e) => {
                    setFilterData((prev: any) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                  }}
                >
                  {item?.select?.map((select: any) => (
                    <SelectItem key={select?.key}>{select?.name}</SelectItem>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterTable;
