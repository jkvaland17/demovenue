import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Table } from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { CallGetAllVenueTable } from "@/_ServerActions";

interface VenueDetailsProps {
  index?: number;
  onVenueSelect?: (selectedVenueIds: string[]) => void;
  selectedVenues?: string[];
  formMethods?: any;
}

const VenueDetails: React.FC<VenueDetailsProps> = ({
  index,
  onVenueSelect,
  selectedVenues = [],
  formMethods,
}) => {
  const [selectedVenue, setSelectedVenue] = useState<any>(
    new Set(selectedVenues),
  );
  const { control, register, watch, setValue } = formMethods;
  const [allList, setAllList] = useState<any[]>([]);

  const getVenueTableList = async () => {
    try {
      const query = `advertisementId=${watch("advertisementId")}&admitCardExamId=${watch("masterDataIds")}`;
      const { data, error } = (await CallGetAllVenueTable(query)) as any;
      console.log("data", data);
      if (data?.data) {
        setAllList(data?.data?.venueId);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getVenueTableList();
  }, [watch("advertisementId"), watch("masterDataIds")]);

  React.useEffect(() => {
    setSelectedVenue(new Set(selectedVenues.map(String)));
  }, [selectedVenues]);

  const columns = [
    // { key: "select", title: "" },
    { title: "Venue Name", key: "school_name" },
    { title: "Venue Capacity", key: "total_seating_capacity" },
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

  const handleSelectionChange = useCallback(
    (keys: any) => {
      let keySet = new Set(Array.from(keys, String));
      if (keys === "all" && allList?.length > 0) {
        const allIds = allList.map((item) => item?._id).filter(Boolean);
        keySet = new Set(allIds);
      }
      setSelectedVenue(keySet);
      const selectedIds = Array.from(keySet);
      if (onVenueSelect) {
        onVenueSelect(selectedIds);
      }
    },
    [onVenueSelect, allList],
  );

  return (
    <div>
      <Table
        selectionMode="multiple"
        selectedKeys={selectedVenue}
        onSelectionChange={handleSelectionChange}
        color="default"
        aria-label="Venue selection table"
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
        <TableBody items={allList}>
          {(item: any) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedVenue.size > 0 && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3">
          <p className="text-sm font-medium text-blue-800">
            Selected Venues: {selectedVenue.size}
          </p>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
