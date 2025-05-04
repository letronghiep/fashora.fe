import { formatDate } from "@fullcalendar/core/index.js";
import { Button, Modal, notification, Table, Tag } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation } from "../../apis/productsApi";

const ProductTable = ({ data }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableId, setTableId] = useState();
  const [deleteProduct] = useDeleteProductMutation();
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = (id) => {
    setIsModalOpen(true);
    setTableId(id);
  };
  const handleDeleteProduct = async () => {
    try {
      const response = await deleteProduct(tableId).unwrap();
      if (response.status === 200) {
        notification.success({
          message: "Xóa sản phẩm thành công",
          showProgress: true,
          placement: "top",
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
    </>
  );
};
export default ProductTable;
