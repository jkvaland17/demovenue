import {
  Accordion,
  AccordionItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
  useDisclosure,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import VenueDetails from "./VenueDetails";
import { CallGetAllVenue } from "@/_ServerActions";

const Schedules: React.FC<any> = ({ formMethods }) => {
  const { control, register, watch, setValue } = formMethods;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState<number>(0);
  const [selectedVenues, setSelectedVenues] = useState<any[]>([]);

  const {
    fields: SchedulesFields,
    append: appendSchedules,
    remove: removeSchedules,
  } = useFieldArray({
    control,
    name: "schedules",
  });

  const handleVenueSelect = useCallback(
    (venueIds: string[]) => {
      setSelectedVenues(venueIds);
      setValue(`schedules.${currentScheduleIndex}.venues`, venueIds);
    },
    [currentScheduleIndex, setValue],
  );

  const handleVenueSelectClick = useCallback(
    (index: number) => {
      setCurrentScheduleIndex(index);
      onOpen();
    },
    [onOpen],
  );

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
        <div className="flex-1 px-4 py-3 text-center">Venue</div>
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
            <div className="flex flex-1 items-center justify-center px-4 py-3">
              <Button
                size="sm"
                color="primary"
                onPress={() => handleVenueSelectClick(index)}
              >
                Venue Select
              </Button>
              {watch(`schedules.${index}.venues`)?.length > 0 && (
                <div className="ml-2 text-xs text-green-600">
                  ({watch(`schedules.${index}.venues`).length} selected)
                </div>
              )}
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
                        "bg-gray-50 border-gray-200 hover:border-gray-300 text-center w-[250px]",
                    }}
                  >
                    <SelectItem key="1">Morning (9:00 AM to 12:00 PM)</SelectItem>
                    <SelectItem key="2">Evening (12:00 PM to 5:00 PM)</SelectItem>
                    <SelectItem key="3">Both</SelectItem>
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
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent className="max-h-[90vh] max-w-2xl">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-shrink-0 flex-col gap-1">
                    Venue Details - Schedule {currentScheduleIndex + 1}
                  </ModalHeader>
                  <ModalBody className="flex-1 overflow-y-auto p-4">
                    <VenueDetails
                      index={currentScheduleIndex}
                      onVenueSelect={handleVenueSelect}
                      selectedVenues={
                        watch(`schedules.${currentScheduleIndex}.venues`) || []
                      }
                      formMethods={formMethods}
                    />
                  </ModalBody>
                  <ModalFooter className="flex-shrink-0">
                    <Button
                      size="sm"
                      color="danger"
                      // variant="light"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default Schedules;
