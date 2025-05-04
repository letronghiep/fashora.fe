import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";

const COLORS = [
  {
    value: "#000000",
    label: "Đen",
  },
  {
    value: "#FFFFFF",
    label: "Trắng",
  },
  {
    value: "#F26060",
    label: "Đỏ nhạt",
  },
  {
    value: "#556FF6",
    label: "Xanh dương",
  },
  {
    value: "#7C3FFF",
    label: "Tím",
  },
  {
    value: "#37BC7C",
    label: "Xanh lá",
  },
  {
    value: "#E09A32",
    label: "Cam",
  },
  {
    value: "#B2B2B2",
    label: "Xám",
  },
  {
    value: "#FF0000",
    label: "Đỏ",
  },
  {
    value: "#F0F364",
    label: "Vàng",
  },
];

function ColorFilter({ setSelectedColor }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const handleSelect = (variationName, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variationName]: option,
    }));
    setSelectedColor(option);
  };
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4">
      <div
        className="flex items-center justify-between px-2 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <p className="font-semibold">Màu sắc</p>
        {open ? <UpOutlined /> : <DownOutlined />}
      </div>
      {open && (
        <div className="grid grid-cols-12 items-center flex-wrap gap-3 w-full">
          {COLORS.length > 0 &&
            COLORS.map((variation, index) => (
              <div className="flex items-start col-span-3" key={index}>
                <Tooltip title={variation.label}>
                  <div
                    style={{ backgroundColor: variation.value }}
                    key={index}
                    className={`w-[40px] h-[40px] rounded-full justify-center border cursor-pointer flex items-center gap-x-2 ${
                      selectedOptions["Màu sắc"] === variation.label
                        ? `border-[${variation.value}] border-2`
                        : "border-gray-400/40"
                    }`}
                    onClick={() => handleSelect("Màu sắc", variation.label)}
                  ></div>
                </Tooltip>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ColorFilter;
