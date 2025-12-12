import { Button } from "@nextui-org/react";
import React from "react";

type Props = {
  searchFunc: () => void;
  clearFunc: () => void;
  col?: string; // default is 4 for full width column in grid layout. Adjust as needed. 12 for full width row. 4 for half width column. 6 for third width column. 3 for quarter width column. 2 for two-thirds width column. 1 for one-third width column. 0 for full width row. 0.5 for half width row. 0.25 for quarter width row. 0.1
};

const FilterSearchBtn: React.FC<Props> = ({
  searchFunc,
  clearFunc,
  col = "col-start-4",
}) => {
  return (
    <div
      className={`${col} grid grid-cols-2 items-end gap-2 mob:items-start tab:grid-cols-2`}
    >
      <Button
        color="primary"
        onPress={searchFunc}
        className="flex w-full items-center gap-2"
        startContent={
          <span className="material-symbols-rounded">filter_list</span>
        }
      >
        <span>Filter</span>
      </Button>
      <Button
        color="danger"
        variant="bordered"
        onPress={clearFunc}
        startContent={
          <span
            className="material-symbols-rounded text-danger"
            style={{ color: "#f42f73" }}
          >
            close
          </span>
        }
      >
        <span>Close</span>
      </Button>
    </div>
  );
};

export default FilterSearchBtn;
