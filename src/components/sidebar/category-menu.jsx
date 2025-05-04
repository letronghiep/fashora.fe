import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Layout, theme } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryByParentId } from "../../services/category";

const CategoryMenu = () => {
  const { Sider } = Layout;
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const [categories, setCategories] = useState([]);
  const { category_id } = useParams();
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchingData() {
      try {
        const [categoriesData] = await Promise.all([getCategoryByParentId("")]);
        setCategories(categoriesData.metadata);
      } catch (error) {
        console.log(error);
      }
    }
    fetchingData();
  }, []);
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);
  useEffect(() => {
    if (category_id && categories.length) {
      const filtered = categories?.find(
        (item) => item.category_id.toString() === category_id
      );
      if (!filtered) return;
      if (filtered.children.length) {
        setFilteredCategories(filtered.children);
      }
    }
  }, [category_id, categories]);
  const handleClickCategory = (id) => {
    navigate(`/category/${id}`, { relative: "path" });
  };

  if (!categories.length) return <Loading3QuartersOutlined />;
  return (
    <Sider
      style={{
        background: colorBgContainer,
        color: colorText,
      }}
      className="site-layout-background"
      width={240}
    >
      <div className="p-4 border-b border-gray-300 font-semibold">Danh mục</div>
      <div>
        {filteredCategories.map((category) => (
          <div
            key={category.category_id}
            className="cursor-pointer px-4 py-3  hover:bg-zinc-100 transition-colors duration-300 ease-in-out"
            onClick={() => {
              handleClickCategory(category.category_id);
            }}
          >
            <h2
              className={`${
                category_id === category.category_id.toString() &&
                "text-blue-500"
              }`}
            >
              {category.category_name}
            </h2>
          </div>
        ))}
      </div>
    </Sider>
  );
};

export default CategoryMenu;
