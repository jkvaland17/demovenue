import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useCallback, useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";

const OldSchedules: React.FC<any> = ({ formMethods }) => {
  const { control, register, watch, setValue } = formMethods;
  const [selectedVenue, setSelectedVenue] = useState<any>(null);

  const columns = [
    { key: "select", title: "" },
    { title: "Venue Name", key: "school_name" },
    { title: "Venue Capacity", key: "total_seating_capacity" },
    { title: "Action", key: "action" },
  ];

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    const cellValue = item[columnKey as any];
    switch (columnKey) {
      case "school_name":
        return <p>{item?.school_name || "-"}</p>;
      case "total_seating_capacity":
        return <p>{item?.total_seating_capacity || "-"}</p>;
      case "action":
        return (
          <Dropdown
            classNames={{ content: "min-w-[150px]" }}
            placement="bottom-end"
          >
            <DropdownTrigger>
              <Button className="more_btn rounded-full px-0" disableRipple>
                <span className="material-symbols-rounded">more_vert</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem
                key={"edit"}
                startContent={
                  <span className="material-symbols-outlined">box_edit</span>
                }
              >
                Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return "";
    }
  }, []);

  const {
    fields: SchedulesFields,
    append: appendSchedules,
    remove: removeSchedules,
  } = useFieldArray({
    control,
    name: "schedules",
  });
  return (
    <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">Exam Schedule</h3>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={() =>
            appendSchedules({
              date: "",
              shifts: "",
            })
          }
        >
          Add Schedule
        </Button>
      </div>
      <div className="flex bg-gray-50 text-sm font-medium text-gray-600">
        <div className="flex-1 px-4 py-3 text-center">Select Venue</div>
        <div className="flex-1 px-4 py-3 text-center">Date</div>
        <div className="flex-1 px-4 py-3 text-center">Shifts</div>
        <div className="flex-1 px-4 py-3 text-center">Action</div>
      </div>
      {SchedulesFields?.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No Data</p>
      )}

      {SchedulesFields?.map((field, index) => (
        <div key={field.id} className="overflow-hidden rounded-lg">
          <div className="flex bg-white">
            <div className="">
              <Popover placement="right" color={"foreground"} size="sm">
                <PopoverTrigger>
                  <Button>Select Venue</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Table
                    selectionMode="multiple"
                    selectedKeys={selectedVenue}
                    onSelectionChange={setSelectedVenue}
                    color="default"
                    aria-label="Example static collection table"
                    // bottomContent={
                    //   <div className="flex justify-end">
                    //     <Pagination
                    //       showControls
                    //       page={page}
                    //       total={totalPages ?? 0}
                    //       onChange={(page) => setPage(page)}
                    //     />
                    //   </div>
                    // }
                  >
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn
                          key={column.key}
                          align={column.key === "actions" ? "center" : "start"}
                        >
                          {column.title}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody items={[]}>
                      {(item: any) => (
                        <TableRow key={item._id}>
                          {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`schedules.${index}.date`}
                control={control}
                rules={{
                  required: "Please select a date",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <Input
                    type="date"
                    placeholder="date"
                    size="sm"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    className="w-full max-w-[200px]"
                    classNames={{
                      input: "text-center",
                      inputWrapper:
                        "bg-gray-50 border-gray-200 hover:border-gray-300",
                    }}
                  />
                )}
              />
            </div>
            <div className="flex-1 px-4 py-3">
              <Controller
                name={`schedules.${index}.shifts`}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error, invalid },
                }) => (
                  <Select
                    size="sm"
                    selectedKeys={value ? [value] : []}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    aria-label="Select Shift"
                    className="mx-auto w-full max-w-[140px]"
                    classNames={{
                      trigger:
                        "bg-gray-50 border-gray-200 hover:border-gray-300 text-center",
                    }}
                  >
                    <SelectItem key="morning" value="morning">
                      Morning
                    </SelectItem>
                    <SelectItem key="evening" value="evening">
                      Evening
                    </SelectItem>
                    <SelectItem key="both" value="both">
                      Both
                    </SelectItem>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-1 items-center justify-center px-4 py-3">
              {SchedulesFields?.length > 0 && (
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => removeSchedules(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OldSchedules;
