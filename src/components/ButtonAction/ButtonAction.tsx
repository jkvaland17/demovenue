import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React from "react";

type ButtonActionProps = {
  name?: string;
  onUpload?: () => void;
  downlaodExcel?: () => void;
  isExcelDownloading?: boolean;
  onAddNewCenter?: () => void;
};

const ButtonAction: React.FC<ButtonActionProps> = ({
  name,
  onUpload,
  downlaodExcel,
  isExcelDownloading,
  onAddNewCenter,
}) => {
  return (
    <Dropdown>
      <DropdownTrigger className="block md:hidden">
        <Button variant="bordered">Action</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="upload">
          <Button
            color="success"
            variant="shadow"
            className="text-white mob:w-full"
            onPress={onUpload}
            startContent={
              <span className="material-symbols-rounded">upload</span>
            }
          >
            Upload Excel
          </Button>
        </DropdownItem>

        {typeof downlaodExcel === "function" ? (
          <DropdownItem key="downlaodExcel">
            <Button
              onPress={downlaodExcel}
              isLoading={isExcelDownloading}
              color="secondary"
              variant="shadow"
              startContent={
                !isExcelDownloading && (
                  <span className="material-symbols-rounded">download</span>
                )
              }
            >
              Download Excel Template
            </Button>
          </DropdownItem>
        ) : null}

        <DropdownItem key="center">
          <Button
            className="mob:w-full"
            color="primary"
            variant="shadow"
            onPress={onAddNewCenter}
            startContent={<span className="material-symbols-rounded">add</span>}
          >
            {name}
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ButtonAction;
