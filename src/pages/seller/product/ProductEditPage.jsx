import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductData } from "../../../services/product";
import ProductForm from "./ProductForm";

function ProductEditPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const { Title } = Typography;
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await getProductData(productId);
        setProduct(response.metadata);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);
  const onSubmit = async (data) => {
    // console.log("data");
    console.log({ data });
    // const { sku_list } = data;
    // const filteredValue = variations?.flatMap((variation) =>
    //   variation.tier_variation_list.flatMap((group) =>
    //     group.group_list.flatMap((value) => value.value_list)
    //   )
    // );
    // const skuResult = sku_list?.map((item) => ({
    //   sku_name: Object.values(item)
    //     .map((value, index) =>
    //       index <= 1
    //         ? filteredValue.find((v) => v.value_id === value)?.value_name
    //         : null
    //     )
    //     .filter(Boolean)
    //     .join(", "),
    //   sku_tier_idx: Object.values(item)
    //     .map((value, index) => index <= 1 && value)
    //     .filter(Boolean),
    //   sku_price: parseFloat(item.price),
    //   sku_stock: parseInt(item.stock),
    // }));
    // const product_variations = Array.isArray(data.product_variations)
    //   ? data.product_variations.flatMap((variation) =>
    //       Object.entries(variation).map(([key, value]) => ({
    //         name: key,
    //         options: value,
    //         images: value
    //           ?.map((m) => {
    //             // Tìm SKU phù hợp với giá trị
    //             const matchedSku = sku_list.find(
    //               (sku) => Object.values(sku).includes(m) && sku.image
    //             );
    //             return matchedSku ? matchedSku.image : null;
    //           })
    //           .filter(Boolean), // Loại bỏ giá trị null
    //       }))
    //     )
    //   : [];
    // const product_price = parseFloat(
    //   sku_list?.length ? sku_list[0].price : data.price
    // );
    // const product_stock = parseInt(
    //   sku_list?.length
    //     ? sku_list.reduce((total, sku) => (total += parseInt(sku.stockp)), 0)
    //     : data.stock
    // );
    // const submitData = {
    //   product_name: data.product_name,
    //   product_description: data.product_description,
    //   product_brand: data.brand,
    //   product_images: data.product_images,
    //   product_thumb: data.product_thumb,
    //   product_price: product_price,
    //   product_quantity: parseInt(product_stock),
    //   product_category: selectedCategory,
    //   product_attributes: data.attribute_list,
    //   product_variations: data.product_variations,
    //   product_models: skuResult,
    //   sku_list: skuResult,
    //   product_status: isDraft ? "draft" : "published",
    // };
    // console.log({data});
    // console.log(submitData);
    // const res = await updateProduct(submitData);
    // if (res.status === 201) {
    //   notification.success({
    //     message: "Cập nhật sản phẩm thành công",
    //     showProgress: true,
    //     placement: "top",
    //     onClose: () => {
    //       navigate("/login");
    //     },
    //   });
    // } else {
    //   notification.error({
    //     message: "Something went wrong",
    //     showProgress: true,
    //     placement: "top",
    //   });
    // }
  };
  if (loading && !product) return <Loading3QuartersOutlined />;
  return (
    <div className="w-[90%] relative">
      <ProductForm
        onSubmit={onSubmit}
        product={product}
        secondaryAction={() => {}}
        actionLabel="Cập nhật"
        secondaryActionLabel="Ẩn"
      />
    </div>
  );
}

export default ProductEditPage;
