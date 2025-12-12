import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import React from "react";

type inputProps = {
  searchValue: string;
  setSearchValue: any;
  functionCall: any;
  inputVariant?: any;
  buttonVariant?: any;
  buttonColor?: any;
  inputColor?: any;
  onlySearch?: boolean;
  gridClasses?: string;
};

function SearchInput({
  searchValue,
  setSearchValue,
  functionCall,
  inputVariant = "bordered",
  buttonVariant = "solid",
  buttonColor = "default",
  inputColor = "gray-800",
  onlySearch = false,
  gridClasses = "grid grid-cols-4 gap-4",
}: inputProps) {
  return (
    <div className={`${gridClasses} mob:flex flex-col gap-2`}>
      <Input
        type="text"
        placeholder="Search"
        variant={inputVariant}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        classNames={{
          inputWrapper: `${inputColor}`,
        }}
        endContent={
          <span
            className={`material-symbols-rounded ${searchValue && "rounded-full bg-gray-200 px-1 text-base hover:cursor-pointer hover:bg-gray-400"} `}
            onClick={() => {
              if (searchValue) {
                setSearchValue("");
                functionCall(false);
              }
            }}
          >
            {searchValue ? "close" : "search"}
          </span>
        }
      />
      {onlySearch && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            color={buttonColor}
            variant={buttonVariant}
            onPress={() => {
              functionCall(true);
            }}
          >
            Search
          </Button>
          <Button
            color="danger"
            onPress={() => {
              functionCall(false);
            }}
          >
            Clear Filter
          </Button>
        </div>
      )}
    </div>
  );
}

export default SearchInput;
