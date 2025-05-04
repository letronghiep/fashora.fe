import { DownOutlined, UpOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const SIZES = [
  {
    value: "S",
    label: "S",
  },
  {
    value: "M",
    label: "M",
  },
  {
    value: "L",
    label: "L",
  },
  {
    value: "XL",
    label: "XL",
  },
  {
    value: "2XL",
    label: "2XL",
  },
  {
    value: "3XL",
    label: "3XL",
  },
  {
    value: "4XL",
    label: "4XL",
  },
];
function SizeFilter({ setSelectedSize }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const handleSelect = (variationName, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variationName]: option,
    }));
    setSelectedSize(option);
  };
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4">
      <div
        className="flex items-center justify-between px-2 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <p className="font-semibold">Size</p>
        {open ? <UpOutlined /> : <DownOutlined />}
      </div>
      {open && (
        <div className="grid grid-cols-12 items-center flex-wrap gap-3 w-full">
          {SIZES.length > 0 &&
            SIZES.map((variation, index) => (
              <div className="flex items-start col-span-3" key={index}>
                <div
                  key={index}
                  className={`max-w-[100px] w-[100px] px-2 py-2 justify-center border cursor-pointer flex items-center gap-x-2 ${
                    selectedOptions["size"] === variation.label
                      ? "border-orange-500"
                      : "border-gray-400/40"
                  }`}
                  onClick={() => handleSelect("size", variation.label)}
                >
                  <p className="text-center flex items-center justify-center">
                    {variation.label}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default SizeFilter;
