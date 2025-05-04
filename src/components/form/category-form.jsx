import { useEffect, useState } from "react";
import InputCustom from "../inputs/Input";
import SelectCustom from "../inputs/Select";
import UploadSingleImage from "../upload-single-img";
import { Button } from "antd";

function CategoryForm({
  categoryData,
  onSubmit,
  control,
  setValue,
  category,
  loadingSubmit,
}) {
  const [categories, setCategories] = useState(categoryData);
  const statues = [
    {
      value: "active",
      label: "Kích hoạt",
    },
    {
      value: "inactive",
      label: "Vô hiệu hóa",
    },
    {
      value: "pending",
      label: "Đang xử lý",
    },
  ];
  useEffect(() => {
    setCategories([
      {
        category_id: 0,
        category_name: "Không có danh mục",
        category_thumb: "",
        category_parentId: [],
      },
      ...categoryData,
    ]);
  }, [categoryData]);
  useEffect(() => {
    if (category) {
      setValue("category_name", category.category_name);
      setValue("category_parentId", category.category_parentId);
      setValue("category_id", category.category_id);
      setValue("category_thumb", category.category_thumb);
      setValue("category_status", category.category_status);
    }
  }, [category, setValue]);
  return (
    <form className="" onSubmit={onSubmit}>
      <div className="">
        <div className="">
          <h4>Tên danh mục</h4>
          <InputCustom
            control={control}
            name="category_name"
            label="Tên danh mục"
          />
        </div>
        <div className="my-4">
          <h4>Danh mục cha</h4>
          <SelectCustom
            control={control}
            data={categories}
            name="category_parentId"
            keyField="category_id"
            valueField="category_name"
            placeholder="Chọn danh mục"
            value={category?.category_parentId}
            onChange={(e) => setValue("category_parentId", e)}
            multiple={true}
          />
        </div>
        {category && (
          <div className="my-4">
            <h4>Trạng thái</h4>
            <SelectCustom
              control={control}
              data={statues}
              name="category_status"
              keyField="value"
              valueField="label"
              placeholder="Trạng thái"
              value={category?.category_status}
              onChange={(e) => setValue("category_status", e)}
            />
          </div>
        )}
      </div>
      <div className="my-4">
        <UploadSingleImage
          setImage={setValue}
          thumb_url="category_thumb"
          dataImage={category?.category_thumb || ""}
        />
      </div>
      <div className="my-4">
        <Button
          type="default"
          variant="outlined"
          color="primary"
          onClick={onSubmit}
          loading={loadingSubmit}
          disabled={loadingSubmit}
        >
          Lưu
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
