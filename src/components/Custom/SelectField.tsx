"use client";
import React from "react";

interface Option {
  value: any;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: Option[];
}

const SelectField: React.FC<SelectFieldProps> = () => {
  return (
    <>
      {/* <FormControl fullWidth>
      <InputLabel size="small">{label}</InputLabel>
      <Select id="demo-simple-select" label={label} size="small">
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl> */}
    </>
  );
};

export default SelectField;
