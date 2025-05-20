import { formatDate } from "@fullcalendar/core/index.js";
import { Button, Modal, notification, Table, Tag } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation } from "../../apis/productsApi";
import { getProductData } from "../../services/product";
import SkuTable from "../product/SkuTable";
import { createInventoryTransaction } from "../../services/inventory_transations";

const ProductTable = ({ data }) => {
  const navigate = useNavigate();
  const { control, watch, setValue, getValues, handleSubmit } = useForm({
    criteriaMode: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState(false);
  const [tableId, setTableId] = useState();
  const [deleteProduct] = useDeleteProductMutation();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = (id) => {
    setIsModalOpen(true);
    setTableId(id);
  };
  const handleOpenModalImport = async (id) => {
    setIsModalImportOpen(true);
    setTableId(id);
    try {
      setLoading(true);
      const response = await getProductData(id);
      setProduct(response.metadata);
      setValue("variations", response.metadata?.product_variations);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleCancelImport = () => {
    setIsModalImportOpen(false);
  };
  const handleOkImport = async (data) => {
    const submitData = [];
    if (data.sku_list.length) {
      data.sku_list.forEach((sku) => {
        submitData.push({
          transaction_productId: product._id,
          transaction_type: "import",
          transaction_quantity: parseInt(sku.sku_stock) || 0,
          transaction_note: "Nhập hàng",
          transaction_skuId: product?.product_models?.find(
            (model) => model.sku_name === sku.sku_name
          )?.sku_id,
        });
      });
    }
    const response = await createInventoryTransaction(submitData);
    if (response.status === 200) {
      notification.success({
        message: "Nhập hàng thành công",
        showProgress: true,
        placement: "topRight",
        onClose: () => {
          window.location.reload();
        },
      });
    }
  };
  const handleDeleteProduct = async () => {
    try {
      const response = await deleteProduct(tableId).unwrap();
      if (response.status === 200) {
        notification.success({
          message: "Xóa sản phẩm thành công",
          showProgress: true,
          placement: "topRight",
          onClose: () => {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOk = async () => {
    await handleDeleteProduct(tableId);
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      width: "400px",
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Số lượng",
      key: "product_quantity",
      dataIndex: "product_quantity",
    },
    {
      title: "Giá",
      dataIndex: "product_price",
      key: "product_price",
      // render: (order) => <a>{order.paymentMethod}</a>,
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (text) => <a>{formatDate(text)}</a>,
    },
    {
      title: "Trạng thái",
      dataIndex: "product_status",
      key: "product_status",
      render: (text) => {
        switch (text) {
          case "published":
            return <Tag color="green">Đang hoạt động</Tag>;
          case "draft":
            return <a style={{ color: "blue" }}>Chưa được đăng</a>;
          case "blocked":
            return <a style={{ color: "red" }}>Vi phạm</a>;
          default:
            return <a>{text}</a>;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <div className="flex flex-col">
          <Button
            variant="link"
            color="primary"
            onClick={() => navigate(`/seller/products/edit/${record._id}`)}
            className="btn btn-sm btn-primary"
          >
            Cập nhật
          </Button>
          <Button
            variant="link"
            color="primary"
            onClick={() => handleOpenModalImport(record._id)}
            className="btn btn-sm btn-primary"
          >
            Nhập hàng
          </Button>
          <Button
            variant="link"
            color="danger"
            onClick={() => {
              handleOpenModal(record._id);
            }}
          >
            Xóa
          </Button>
          {/* <button className="btn btn-sm btn-success">Xem chi tiet</button> */}
        </div>
      ),
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data?.data} pagination={true} />
      <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Xóa sản phẩm này?</p>
      </Modal>
      <Modal
        title="Nhập hàng"
        open={isModalImportOpen}
        onCancel={handleCancelImport}
        onOk={handleSubmit(handleOkImport)}
        okText="Nhập"
        cancelText="Hủy"
        loading={loading}
      >
        <SkuTable
          control={control}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          skuList={product?.product_models}
          type="import"
        />
      </Modal>
    </>
  );
};
export default ProductTable;
