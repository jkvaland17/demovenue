import React, { useState, useRef, useEffect } from "react";

type MultiSelectProps = {
  options: any[];
  label: string;
  selectedKeys: string[];
  stateFunc: (selectedIds: string[]) => void;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  label,
  selectedKeys,
  stateFunc,
}) => {
  const [selected, setSelected] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOptions = options.filter((opt) =>
    selectedKeys.includes(opt._id),
  );

  const handleSelect = (item: any) => {
    if (!selectedKeys.includes(item._id)) {
      stateFunc([...selectedKeys, item._id]);
      setSearch("");
    }
  };

  const handleRemove = (_id: string) => {
    stateFunc(selectedKeys.filter((id) => id !== _id));
  };

  const clearAll = () => stateFunc([]);

  const filteredOptions = options.filter(
    (opt) =>
      !selectedKeys.includes(opt._id) &&
      opt.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <label htmlFor="" className="mb-2 text-sm">
        {label}
      </label>
      <div className="w-full max-w-md" ref={wrapperRef}>
        <div className="relative flex flex-wrap items-center gap-2 rounded-xl bg-gray-100 p-2">
          {selectedOptions.map((item) => (
            <div
              key={item._id}
              className="flex items-center rounded-full bg-default px-2 py-1 text-sm text-black"
            >
              {item.name}
              <button
                onClick={() => handleRemove(item._id)}
                className="ml-1 text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          ))}

          <input
            type="text"
            className="flex-1 bg-gray-100 p-1 text-sm placeholder-gray-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Search and select"
          />

          {selected.length > 0 && (
            <button
              onClick={clearAll}
              className="ml-2 text-gray-400 hover:text-gray-600"
              title="Clear all"
            >
              ✕
            </button>
          )}
        </div>

        {open && filteredOptions.length > 0 && (
          <ul className="absolute z-40 mt-1 max-h-60 w-full max-w-xs overflow-auto rounded-xl bg-white p-2 shadow-medium">
            {filteredOptions.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer rounded-lg px-2 py-1 text-sm hover:bg-gray-200"
              >
                {item.name}
                <br />
                <span className="text-tiny text-gray-400">
                  ({item?.userId})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
