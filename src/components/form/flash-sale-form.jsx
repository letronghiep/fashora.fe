import { UploadOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Collapse,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Typography,
  message,
} from "antd";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSearchProductQuery } from "../../apis/productsApi";
import UploadSingleImage from "../upload-single-img";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Title } = Typography;
const FlashSaleForm = ({ initialData, onSubmit, loading }) => {
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const [expandedProducts, setExpandedProducts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const { data: searchResults, isLoading } = useSearchProductQuery(
    {
      q: searchKey,
      product_status: "published",
    },
    {
      skip: !searchKey, // không gọi nếu không có từ khoá
    }
  );
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {

      name: "",
      thumb: "",
      start_time: null,
      end_time: null,
      status: "scheduled",
      isApproved: false,
      products: [],
    },
  });

  // const handleSearch = (value) => {
  //   setSearchKey(value);
  // };
  const handleSearch = useCallback((value) => {
    // Xoá timeout cũ nếu có
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Không tìm kiếm nếu ít hơn 2 ký tự
    if (value.trim().length < 2) {
      setSearchKey(""); // hoặc bỏ qua việc gọi API
      return;
    }

    // Gán timeout mới
    debounceRef.current = setTimeout(() => {
      setSearchKey(value.trim()); // Truyền key vào useQuery để fetch
    }, 500); // 500ms delay
  }, []);
  const handleSelectProduct = (value, field) => {
    const selectedProduct = searchResults?.metadata?.data
      ?.flatMap((p) => p.product_models)
      ?.find((p) => p.sku_id === value);
    if (selectedProduct) {
      const currentProducts = watch("products") || [];
      const updatedProducts = [...currentProducts];
      const productIndex = field.name;

      updatedProducts[productIndex] = {
        product_id: selectedProduct.product_id,
        sku_id: selectedProduct.sku_id,
        original_price: Number(selectedProduct.sku_price),
        sale_price: Number(selectedProduct.sku_sale_price),
        stock: Number(selectedProduct.sku_stock),
        limit_quantity: 1,
        sold: 0,
      };

      setValue("products", updatedProducts);
    }
  };

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xử lý dữ liệu!");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full bg-white">
      <div className="border-b border-gray-900/10 p-6">
        <Title level={3}>Thông tin cơ bản</Title>
        <table className="w-full">
          <tbody>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex flex-[1]">
                Tên Flash Sale
              </td>
              <td className="flex-[6]">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Vui lòng nhập tên flash sale!" }}
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors.name ? "error" : ""}
                      help={errors.name?.message}
                      style={{ marginBottom: 0 }}
                    >
                      <Input {...field} placeholder="Nhập tên flash sale" />
                    </Form.Item>
                  )}
                />
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex flex-[1]">
                Hình ảnh
              </td>
              <td className="flex-[6]">
                <Form.Item style={{ marginBottom: 0 }}>
                  <UploadSingleImage
                    setImage={setValue}
                    thumb_url="thumb"
                    dataImage={initialData?.thumb || ""}
                  />
                </Form.Item>
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex flex-[1]">
                Thời gian diễn ra
              </td>
              <td className="flex-[6]">
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: "Vui lòng chọn thời gian!" }}
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors.time ? "error" : ""}
                      help={errors.time?.message}
                      style={{ marginBottom: 0 }}
                    >
                      <RangePicker
                        {...field}
                        showTime
                        format="DD/MM/YYYY HH:mm:ss"
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          field.onChange(value);
                          if (value && value.length === 2) {
                            // Lưu giá trị gốc vào field time
                            setValue("time", value);

                            // Chuyển đổi và lưu start_time
                            const startTime = new Date(value[0]);
                            setValue("start_time", startTime);

                            // Chuyển đổi và lưu end_time
                            const endTime = new Date(value[1]);
                            setValue("end_time", endTime);
                          } else {
                            // Nếu không có giá trị, reset các trường
                            setValue("time", null);
                            setValue("start_time", null);
                            setValue("end_time", null);
                          }
                        }}
                      />
                    </Form.Item>
                  )}
                />
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex flex-[1]">
                Trạng thái
              </td>
              <td className="flex-[6]">
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Vui lòng chọn trạng thái!" }}
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors.status ? "error" : ""}
                      help={errors.status?.message}
                      style={{ marginBottom: 0 }}
                    >
                      <Select {...field}>
                        <Select.Option value="ongoing">
                          Đang diễn ra
                        </Select.Option>
                        <Select.Option value="scheduled">
                          Sắp diễn ra
                        </Select.Option>
                        <Select.Option value="ended">Đã kết thúc</Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                />
              </td>
            </tr>
            <tr className="my-6 flex gap-x-4">
              <td colSpan={2} className="flex flex-[1]">
                Trạng thái phê duyệt
              </td>
              <td className="flex-[6]">
                <Controller
                  name="isApproved"
                  control={control}
                  render={({ field }) => (
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Select {...field}>
                        <Select.Option value={true}>Đã phê duyệt</Select.Option>
                        <Select.Option value={false}>
                          Chưa phê duyệt
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-b border-gray-900/10 p-6">
        <Title level={3}>Sản phẩm</Title>
        <Controller
          name="products"
          control={control}
          render={({ field }) => (
            <Form.Item style={{ marginBottom: 0 }}>
              <Collapse
                activeKey={expandedProducts}
                onChange={setExpandedProducts}
              >
                {(field.value || []).map((product, index) => (
                  <Panel
                    header={
                      <Flex
                        justify="space-between"
                        align="center"
                        style={{ width: "100%" }}
                      >
                        <span>Sản phẩm {index + 1}</span>
                        <Button
                          type="text"
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            const newProducts = [...field.value];
                            newProducts.splice(index, 1);
                            field.onChange(newProducts);
                          }}
                        >
                          Xóa
                        </Button>
                      </Flex>
                    }
                    key={index}
                  >
                    <div className="p-6">
                      <table className="w-full">
                        <tbody>
                          <tr className="my-6 flex gap-x-4">
                            <td colSpan={2} className="flex flex-[1]">
                              Tìm sản phẩm
                            </td>
                            <td className="flex-[6]">
                              <Controller
                                name={`products.${index}.sku_id`}
                                control={control}
                                render={({ field }) => (
                                  <Form.Item
                                    validateStatus={
                                      errors.products?.[index]?.sku_id
                                        ? "error"
                                        : ""
                                    }
                                    help={
                                      errors.products?.[index]?.sku_id
                                        ?.message
                                    }
                                    style={{ marginBottom: 0 }}
                                  >
                                    <AutoComplete
                                      options={searchResults?.metadata?.data?.flatMap(
                                        (product) =>
                                          product.product_models?.map(
                                            (model) => ({
                                              value: model.sku_id,
                                              label: (
                                                <div>
                                                  <div>
                                                    {model.product_name}
                                                  </div>
                                                  <small>
                                                    {model.sku_name} - Giá:{" "}
                                                    {model.sku_price?.toLocaleString() ||
                                                      product.product_price.toLocaleString()}{" "}
                                                    - Kho: {model.sku_stock}
                                                  </small>
                                                </div>
                                              ),
                                            })
                                          ) || []
                                      )}
                                      onSearch={handleSearch}
                                      onSelect={(value) =>
                                        handleSelectProduct(value, {
                                          name: index,
                                        })
                                      }
                                      placeholder="Tìm kiếm sản phẩm"
                                      notFoundContent={
                                        isLoading ? <Spin size="small" /> : null
                                      }
                                      style={{ width: "100%" }}
                                      value={field.value || ""}
                                      onChange={(value) => {
                                        field.onChange(value);
                                        const updatedProducts = [
                                          ...watch("products"),
                                        ];
                                        updatedProducts[index] = {
                                          ...updatedProducts[index],
                                          product_id: value,
                                        };
                                        setValue("products", updatedProducts);
                                      }}
                                    />
                                  </Form.Item>
                                )}
                              />
                            </td>
                          </tr>
                          <tr className="my-6 flex gap-x-4">
                            <td colSpan={2} className="flex flex-[1]">
                              Giá gốc
                            </td>
                            <td className="flex-[6]">
                              <Controller
                                name={`products.${index}.original_price`}
                                control={control}
                                rules={{ required: "Vui lòng nhập giá gốc!" }}
                                render={({ field }) => (
                                  <Form.Item
                                    validateStatus={
                                      errors.products?.[index]?.original_price
                                        ? "error"
                                        : ""
                                    }
                                    help={
                                      errors.products?.[index]?.original_price
                                        ?.message
                                    }
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber
                                      {...field}
                                      style={{ width: "100%" }}
                                      formatter={(value) =>
                                        `${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ","
                                        )
                                      }
                                      value={parseFloat(product.original_price)}
                                      parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                      }
                                      placeholder="Nhập giá gốc"
                                    />
                                  </Form.Item>
                                )}
                              />
                            </td>
                          </tr>
                          <tr className="my-6 flex gap-x-4">
                            <td colSpan={2} className="flex flex-[1]">
                              Giá khuyến mãi
                            </td>
                            <td className="flex-[6]">
                              <Controller
                                name={`products.${index}.sale_price`}
                                control={control}
                                rules={{
                                  required: "Vui lòng nhập giá khuyến mãi!",
                                }}
                                render={({ field }) => (
                                  <Form.Item
                                    validateStatus={
                                      errors.products?.[index]?.sale_price
                                        ? "error"
                                        : ""
                                    }
                                    help={
                                      errors.products?.[index]?.sale_price
                                        ?.message
                                    }
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber
                                      {...field}
                                      style={{ width: "100%" }}
                                      formatter={(value) =>
                                        `${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ","
                                        )
                                      }
                                      parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                      }
                                      placeholder="Nhập giá khuyến mãi"
                                    />
                                  </Form.Item>
                                )}
                              />
                            </td>
                          </tr>
                          <tr className="my-6 flex gap-x-4">
                            <td colSpan={2} className="flex flex-[1]">
                              Số lượng
                            </td>
                            <td className="flex-[6]">
                              <Controller
                                name={`products.${index}.stock`}
                                control={control}
                                rules={{
                                  required: "Vui lòng nhập số lượng!",
                                }}
                                render={({ field }) => (
                                  <Form.Item
                                    validateStatus={
                                      errors.products?.[index]?.stock
                                        ? "error"
                                        : ""
                                    }
                                    help={
                                      errors.products?.[index]?.stock?.message
                                    }
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber
                                      {...field}
                                      style={{ width: "100%" }}
                                      min={1}
                                      value={product.stock || 0}
                                      placeholder="Nhập số lượng"
                                      onChange={(value) => {
                                        field.onChange(value);
                                        const updatedProducts = [
                                          ...watch("products"),
                                        ];
                                        updatedProducts[index] = {
                                          ...updatedProducts[index],
                                          stock: value,
                                        };
                                        setValue("products", updatedProducts);
                                      }}
                                    />
                                  </Form.Item>
                                )}
                              />
                            </td>
                          </tr>
                          <tr className="my-6 flex gap-x-4">
                            <td colSpan={2} className="flex flex-[1]">
                              Giới hạn mua
                            </td>
                            <td className="flex-[6]">
                              <Controller
                                name={`products.${index}.limit_quantity`}
                                control={control}
                                rules={{
                                  required: "Vui lòng nhập giới hạn mua!",
                                }}
                                render={({ field }) => (
                                  <Form.Item
                                    validateStatus={
                                      errors.products?.[index]?.limit_quantity
                                        ? "error"
                                        : ""
                                    }
                                    help={
                                      errors.products?.[index]?.limit_quantity
                                        ?.message
                                    }
                                    style={{ marginBottom: 0 }}
                                  >
                                    <InputNumber
                                      {...field}
                                      style={{ width: "100%" }}
                                      min={1}
                                      placeholder="Nhập giới hạn mua"
                                    />
                                  </Form.Item>
                                )}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Panel>
                ))}
              </Collapse>

              <Button
                type="dashed"
                onClick={() => {
                  const newProducts = [...(field.value || [])];
                  newProducts.push({
                    product_id: "",
                    original_price: 0,
                    sale_price: 0,
                    stock: 1,
                    limit_quantity: 1,
                    sold: 0,
                  });
                  field.onChange(newProducts);
                }}
                block
                icon={<UploadOutlined />}
                style={{ marginTop: "16px" }}
              >
                Thêm sản phẩm
              </Button>
            </Form.Item>
          )}
        />
      </div>

      <Form.Item>
        <Flex
          style={{ marginTop: 16 }}
          gap={16}
          align="center"
          justify="center"
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? "Cập nhật Flash Sale" : "Tạo Flash Sale"}
          </Button>

          <Button onClick={() => navigate("/seller/flashsale")}>Hủy</Button>
        </Flex>
      </Form.Item>
    </form>
  );
};

export default FlashSaleForm;
