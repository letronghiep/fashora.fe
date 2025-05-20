import { PlusOutlined } from "@ant-design/icons";
import { Button, Cascader, Image, Typography, Upload } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { apiOrigin } from "~/constants";
import { useGetCategoriesQuery } from "../../../apis/categoriesApi";
import InputCustom from "../../../components/inputs/Input";
import RichText from "../../../components/inputs/RichText";
import SkuTable from "../../../components/product/SkuTable";
import VariationForm from "../../../components/product/VariationForm";
import { getAttributes } from "../../../services/attributes";
import { getBrand } from "../../../services/brand";
import { getVariations } from "../../../services/variations";
import Attribute from "./Attribute";
import FooterView from "./FooterView";
function ProductForm({
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  onSubmit,
  product,
  isLoading,
}) {
  const { Title } = Typography;
  const { handleSubmit, reset, control, watch, setValue, getValues } = useForm({
    criteriaMode: "all",
  });

  // State management
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState();
  const [attributes, setAttributes] = useState();
  const [variations, setVariations] = useState();
  const [isDraft, setIsDraft] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [valueToAllSku, setValueToAllSku] = useState({
    product_price: "",
    product_quantity: "",
  });
  const getBase64 = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }),
    []
  );

  const handlePreview = useCallback(
    async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    },
    [getBase64]
  );

  const handleChange = useCallback(async ({ fileList: newFileList }) => {
    const newImages = newFileList
      .filter((file) => file.status === "done")
      .map((file) => file.response.metadata[0].thumb_url);
    setImages(newImages);
    setFileList(newFileList);
  }, []);
  const handleChangeCategory = (value) => {
    setSelectedCategoryId(value[value.length - 1]);
  };
  const handleCancel = useCallback(() => {
    setImages([]);
    setFileList([]);
    reset();
  }, [reset]);

  const uploadButton = useMemo(
    () => (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    ),
    []
  );

  const { data: categoriesData } = useGetCategoriesQuery();
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.metadata);
    }
  }, [categoriesData]);
  useEffect(() => {
    async function getData() {
      if (selectedCategoryId) {
        const [attributeData, variationData] = await Promise.all([
          getAttributes(selectedCategoryId),
          getVariations(selectedCategoryId),
        ]);

        setAttributes(attributeData.metadata);
        setVariations(variationData?.metadata[0].tier_variation_list);
      }
    }
    getData();
  }, [selectedCategoryId]);
  useEffect(() => {
    async function getBrandData() {
      const [brandData] = await Promise.all([getBrand(100047)]);
      setBrands(brandData.metadata);
    }
    getBrandData();
  }, [selectedCategoryId]);
  const setValueofFormData = useCallback(() => {
    if (!product) return;

    const variations = product.product_variations.map((variation) => ({
      name: variation.name,
      options: variation.options,
      images: variation.images,
    }));
    setValue("variations", variations);
    setValue("product_category", product?.product_category ?? []);
    if (product?.product_category && product.product_category.length > 0) {
      setSelectedCategoryId(
        product.product_category[product.product_category.length - 1]
      );
    }
    setValue("product_name", product?.product_name ?? "");
    setValue("product_description", product?.product_description ?? "");
    setValue("product_images", product?.product_images ?? []);
    setFileList(product?.product_images.map((image) => ({ url: image })));
    setValue("product_thumb", product?.product_thumb ?? "");
    setImages(product?.product_images);
    setValue("product_brand", product?.product_brand ?? "");
    setValue("product_attributes", product?.product_attributes ?? []);
    setValue("product_price", product?.price ?? "");
    setValue("product_quantity", product?.product_quantity ?? "");
    setValue("sku_list", product?.product_models ?? []);
  }, [product, setValue]);

  useEffect(() => {
    setValueofFormData();
  }, [setValueofFormData]);

  useEffect(() => {
    const product_images = images.map((image) => image);
    setValue("product_images", product_images);
    setValue("product_thumb", product_images[0]);
  }, [images, setValue]);

  const onSubmitHandler = useCallback(
    async (data) => {
      const formattedData = {
        ...data,
        product_variations: data.variations.map((variation) => ({
          name: variation.name,
          options: variation.options,
          images: variation.images,
        })),
        sku_list: data.sku_list,
      };
      await onSubmit(formattedData);
    },
    [onSubmit]
  );
  function transformCategories(categories) {
    const categoryMap = new Map();

    // Bước 1: Tạo ánh xạ danh mục theo category_id
    categories.forEach((category) => {
      categoryMap.set(category.category_id, {
        value: category.category_id,
        label: category.category_name,
        children: [],
      });
    });

    const rootCategories = [];

    // Bước 2: Xây dựng cây danh mục
    categories.forEach((category) => {
      if (category.category_parentId.length === 0) {
        rootCategories.push(categoryMap.get(category.category_id));
      } else {
        category.category_parentId.forEach((parentId) => {
          const parent = categoryMap.get(parentId);
          if (parent) {
            parent.children.push(categoryMap.get(category.category_id));
          }
        });
      }
    });

    return rootCategories;
  }
  const options = useMemo(() => {
    return transformCategories(categories);
  }, [categories]);
  const handleApplyToAll = () => {
    setValueToAllSku({
      product_price: watch("product_price"),
      product_quantity: watch("product_quantity"),
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full bg-white">
      <div className="border-b border-gray-900/10 p-6">
        <Title level={3}>Thông tin cơ bản</Title>
        <table className="w-full">
          <tbody>
            <tr className="mt-6 flex gap-x-4">
              <td colSpan={2} className="flex justify-end flex-[1]">
                Hình ảnh sản phẩm
              </td>
              <td className="flex-[6]">
                <Upload
                  action={`${apiOrigin}/upload/multiple`}
                  listType="picture-card"
                  maxCount={8}
                  multiple
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  name="files"
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Image
                  style={{
                    display: "none",
                  }}
                  src={previewImage}
                  preview={{
                    visible: previewOpen,
                    src: previewImage,
                    onVisibleChange: (value) => {
                      setPreviewOpen(value);
                    },
                  }}
                />
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex justify-end flex-1">
                <h4>Ảnh bìa</h4>
              </td>
              <td className="flex gap-x-4 flex-[6] w-full">
                <Image
                  src={images[0] || ""}
                  width={100}
                  fallback="data:image/png;base64,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"
                />
                <ul className="text-xs max-w-[500px]">
                  <li data-v-2c557348="">Tải lên hình ảnh 1:1.</li>
                  <li data-v-2c557348="">
                    Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi
                    ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt
                    truy cập vào sản phẩm của bạn
                  </li>
                </ul>
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex justify-end flex-1">
                <h4>Tên sản phẩm</h4>
              </td>
              <td className="flex gap-x-4 flex-[6]">
                <InputCustom
                  control={control}
                  name="product_name"
                  label="Tên sản phẩm"
                />
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex justify-end flex-1">
                <h4>Danh mục</h4>
              </td>
              <td className="gap-x-4 flex-[6]">
                <Controller
                  control={control}
                  name="product_category"
                  render={({ field }) => (
                    <Cascader
                      style={{ width: "100%" }}
                      options={options}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value); // update vào form
                        handleChangeCategory(value); // xử lý riêng thêm nếu cần
                      }}
                    />
                  )}
                />
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex justify-end flex-1">
                <h4>Mô tả</h4>
              </td>
              <td className="flex gap-x-4 flex-[6] h-[300px]">
                <RichText
                  style={{}}
                  control={control}
                  name="product_description"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-b border-gray-900/10 p-6">
        <Title level={3}>Thông tin chi tiết</Title>
        <div className="mt-10 space-y-10">
          {selectedCategoryId ? (
            <Attribute
              attributes={attributes && attributes[0]?.attribute_list}
              control={control}
              brandName="product_brand"
              brands={brands && brands.brand_list}
              setValue={setValue}
            />
          ) : (
            <p className="italic text-gray-500 text-sm">
              Cần chọn danh mục để hiển thị thông tin thuộc tính
            </p>
          )}
        </div>
      </div>
      <div className="border-b border-gray-900/10 p-6">
        <Title level={3}>Thông tin bán hàng</Title>
        <div className="mt-10 space-y-10">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="flex items-center gap-x-4 sm:col-span-3">
              <InputCustom
                control={control}
                name="product_quantity"
                label="Số lượng"
                type="number"
              />
              <InputCustom
                control={control}
                name="product_price"
                label="Giá"
                type="number"
              />
              {variations && variations.length > 0 && (
                <div className="flex items-center gap-x-4 sm:col-span-3">
                  <Button onClick={handleApplyToAll}>Áp dụng cho tất cả</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 p-6">
        {selectedCategoryId ? (
          <>
            <Title level={3}>Phân loại hàng</Title>
            <div className="mt-10 space-y-10">
              <VariationForm
                variations={variations}
                control={control}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
              />
              <SkuTable
                control={control}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                skuList={product?.product_models}
                valueToAllSku={valueToAllSku}
              />
            </div>
          </>
        ) : (
          <p className="italic text-gray-500 text-sm">
            Cần chọn danh mục để hiển thị thông tin phân loại hàng
          </p>
        )}
      </div>

      <FooterView
        onSubmit={handleSubmit(onSubmitHandler)}
        actionLabel={actionLabel}
        secondaryAction={secondaryAction}
        secondaryActionLabel={secondaryActionLabel}
        isDraft={isDraft}
        setIsDraft={setIsDraft}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </form>
  );
}

export default ProductForm;
