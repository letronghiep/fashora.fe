import "react-quill/dist/quill.snow.css"; // Import styles
import ProductForm from "./ProductForm";
import { createProduct } from "~/services/product";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

function ProductCreatePage() {
  const navigate = useNavigate();
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
    const res = await createProduct(submitData);
    if (res.status === 201) {
      notification.success({
        message: "Tạo sản phẩm thành công",
        showProgress: true,
        placement: "topRight",
        onClose: () => {
          navigate("/seller/products");
        },
      });
    } else {
      notification.error({
        message: "Something went wrong",
        showProgress: true,
        placement: "topRight",
      });
    }
  };

  return (
    <div className="w-[90%] relative">
      <ProductForm
        onSubmit={onSubmit}
        isCreate={true}
        actionLabel="Tạo sản phẩm"
        // secondaryAction=""
        secondaryActionLabel="Hủy"
      />
      {/* <FooterView
        actionLabel="Lưu và hiển thị"
        secondaryActionLabel="Lưu và ẩn"
        onSubmit={handleSubmit((data) => {
          setIsDraft(false);
          onSubmit(data);
        })}
        secondaryAction={handleSubmit((data) => {
          setIsDraft(true);
          onSubmit(data);
        })}
        cancelLabel="Hủy"
        onCancel={handleCancel}
      /> */}
    </div>
  );
}

export default ProductCreatePage;
