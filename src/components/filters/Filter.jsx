import { Button, Layout, Skeleton, Slider, theme, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  setColor,
  setPriceRange,
  setSize,
  toggleCategory,
  resetFilters, 
} from "../../stores/slices/productFilterSlice";
import ColorFilter from "./color";
import FilterSection from "./filter-section";
import SizeFilter from "./size";

function Filter({ categories }) {
  const { Sider } = Layout;
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const { category_id } = useParams();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceRange, setPriceRange] = useState([50000, 200000]);

  useEffect(() => {
    if (category_id && categories.length) {
      const filtered = categories
        .filter((category) => category.category_parentId.length === 0)
        .map((category) => ({
          id: category.category_id,
          label: category.category_name,
        }));
      if (!filtered) return;
      setFilteredCategories(filtered);
    }
  }, [category_id, categories]);

  const queryCategories = categories
    .filter((category) => category.category_parentId.length)
    .map((category) => ({
      id: category.category_id,
      label: category.category_name,
    }));

  const handleDeleteFilter = () => {
    dispatch(resetFilters());
    setSelectedCategories([]);
    setSelectedSize(null);
    setSelectedColor(null);
    setPriceRange([50000, 200000]);
  };

  if (!categories.length) return <Skeleton />;
  return (
    <Sider
      style={{
        background: colorBgContainer,
        color: colorText,
        padding: "16px",
      }}
      className="site-layout-background"
      width={280}
    >
      <div className="mt-2">
        <Typography.Title level={5}>Bộ lọc tìm kiếm</Typography.Title>
        <FilterSection
          title="Nhóm danh mục"
          filterQueries={filteredCategories}
          setFilterValue={(value) => {
            dispatch(toggleCategory(value));
            setSelectedCategories(prev => {
              if (prev.includes(value)) {
                return prev.filter(item => item !== value);
              }
              return [...prev, value];
            });
          }}
          selectedValues={selectedCategories}
        />
        <FilterSection
          setFilterValue={(value) => {
            dispatch(toggleCategory(value));
            setSelectedCategories(prev => {
              if (prev.includes(value)) {
                return prev.filter(item => item !== value);
              }
              return [...prev, value];
            });
          }}
          title="Theo danh mục"
          filterQueries={queryCategories}
          selectedValues={selectedCategories}
        />
        <SizeFilter 
          setSelectedSize={(value) => {
            dispatch(setSize(value));
            setSelectedSize(value);
          }}
          selectedSize={selectedSize}
        />
        <ColorFilter 
          setSelectedColor={(value) => {
            dispatch(setColor(value));
            setSelectedColor(value);
          }}
          selectedColor={selectedColor}
        />
        <div className="px-2 py-2 cursor-pointer">
          <p className="font-semibold">Giá</p>
          <Slider
            range
            value={priceRange}
            min={50000}
            max={2000000}
            step={10000}
            onChange={(val) => {
              dispatch(setPriceRange(val));
              setPriceRange(val);
            }}
          />
        </div>
        <Button onClick={handleDeleteFilter}>Xóa bộ lọc</Button>
      </div>
    </Sider>
  );
}

export default Filter;
