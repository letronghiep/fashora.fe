import { Loading3QuartersOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
} from "../../../apis/productsApi";
import { getProductData } from "../../../services/product";
import ProductForm from "./ProductForm";

function ProductEditPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [updateProduct, { isLoading: isUpdateLoading }] =
    useUpdateProductMutation();
  const [updateProductStatus, { isLoading: isUpdateProductStatusLoading }] =
    useUpdateProductStatusMutation();
  const navigate = useNavigate();
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
  const handleUpdateProductStatus = async () => {
    const res = await updateProductStatus({
      id: productId,
      data: {
        product_status: product.product_status === "published" ? "draft" : "published",
      },
    });
    if (res.data?.status === 200) {
      notification.success({
        message: "Cập nhật trạng thái sản phẩm thành công",
        placement: "topRight",
        showProgress: true,
        onClose: () => {
          navigate("/seller/products");
        },
      });
    }
  };
  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      product_price: parseFloat(
        data.sku_list?.length ? data.sku_list[0].sku_price : data.product_price
      ),
      product_quantity: parseInt(
        data.sku_list?.length
          ? data.sku_list.reduce(
              (total, sku) => (total += parseInt(sku.sku_stock)),
              0
            )
          : data.product_quantity
      ),
    };
    const res = await updateProduct({
      id: productId,
      data: submitData,
    });
    if (res.data?.status === 200) {
      notification.success({
        message: "Cập nhật sản phẩm thành công",
        showProgress: true,
        placement: "topRight",
        onClose: () => {
          navigate("/seller/products");
        },
      });
    }
  };
  if (loading && !product) return <Loading3QuartersOutlined />;
  return (
    <div className="w-[90%] relative">
      <ProductForm
        onSubmit={onSubmit}
        product={product}
        secondaryAction={handleUpdateProductStatus}
        actionLabel="Cập nhật"
        secondaryActionLabel={product.product_status === "published" ? "Ẩn" : "Hiện"}
        isLoading={isUpdateLoading}
      />
    </div>
  );
}

export default ProductEditPage;
