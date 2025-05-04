import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useState } from "react";

function FilterSection({ title, filterQueries, setFilterValue, selectedValues }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between px-2 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <p className="font-semibold">{title}</p>
        {open ? <UpOutlined /> : <DownOutlined />}
      </div>
      {open && (
        <div className="mt-2 ml-3 flex flex-col gap-y-1">
          {filterQueries.map((filter, index) => (
            <label key={index}>
              <input
                type="checkbox"
                value={filter.id}
                onChange={(value) => setFilterValue(value.target.value)}
                // checked={selectedValues.includes(filter.id)}
                checked={selectedValues.includes(filter.id.toString())}
              />{" "}
              {filter.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterSection;
