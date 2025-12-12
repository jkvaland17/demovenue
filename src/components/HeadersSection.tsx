import React from "react";
import { Accordion, AccordionItem, Checkbox, Divider } from "@nextui-org/react";

type HeadersSectionProps = {
  title: string;
  headersArray: { value: string; label: string }[];
  selectedHeaders: string[];
  onSelect: (updatedHeaders: string[]) => void;
};

const HeadersSection: React.FC<HeadersSectionProps> = ({
  title,
  headersArray,
  selectedHeaders,
  onSelect,
}) => {
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      onSelect(headersArray.map((ele) => ele.value));
    } else {
      onSelect([]);
    }
  };

  const handleSelectItem = (value: string, selected: boolean) => {
    if (selected) {
      onSelect([...selectedHeaders, value]);
    } else {
      onSelect(selectedHeaders.filter((item) => item !== value));
    }
  };
  return (
    <Accordion variant="shadow">
      <AccordionItem
        key={title}
        aria-label={title}
        subtitle="Press to expand"
        title={title}
      >
        <Checkbox
          classNames={{ label: "text-xl" }}
          onValueChange={(e) => handleSelectAll(e)}
          isSelected={headersArray.length === selectedHeaders.length}
        >
          Select All {title} Fields
        </Checkbox>
        <div className="grid grid-cols-3 gap-6 my-6">
          {headersArray.map((ele) => (
            <Checkbox
              key={ele.value}
              classNames={{
                base: "bg-content1 hover:bg-content2 cursor-pointer rounded-lg gap-1 p-2 border-2 border-transparent data-[selected=true]:border-primary data-[selected=true]:bg-gray-200",
                label: "max-w-full",
              }}
              className="bg-gray-100 max-w-full"
              isSelected={selectedHeaders.includes(ele.value)}
              onValueChange={(e) => handleSelectItem(ele.value, e)}
            >
              {ele.label}
            </Checkbox>
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default HeadersSection;
