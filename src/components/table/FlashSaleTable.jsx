import { Button, Modal, notification, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const FlashSaleTable = ({
  data,
  pageSize,
  setPageSize,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableId, setTableId] = useState();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = (id) => {
    setIsModalOpen(true);
    setTableId(id);
  };

  const handleDeleteFlashSale = async (id) => {
    try {
      // API call to delete flashsale will be added here
      notification.success({
        message: "Xóa Flash Sale thành công",
        showProgress: true,
        placement: "topRight",
        onClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = async () => {
    await handleDeleteFlashSale(tableId);
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên Flash Sale",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumb",
      key: "thumb",
      render: (thumb) => (
        <img src={thumb} alt="Flash Sale" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      render: (date) =>
        format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi }),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      render: (date) =>
        format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          ongoing: {
            text: "Đang diễn ra",
            style: { backgroundColor: "#d1e7dd", color: "#0f5132" },
          },
          scheduled: {
            text: "Sắp diễn ra",
            style: { backgroundColor: "#cff4fc", color: "#055160" },
          },
          ended: {
            text: "Đã kết thúc",
            style: { backgroundColor: "#f8d7da", color: "#842029" },
          },
        };
        const statusInfo = statusMap[status] || { text: status, style: {} };
        return (
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              display: "inline-block",
              ...statusInfo.style,
            }}
          >
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) => (
        <span
          style={{
            backgroundColor: isApproved ? "#d4edda" : "#f8d7da",
            color: isApproved ? "#155724" : "#721c24",
            padding: "2px 8px",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          {isApproved ? "Đã duyệt" : "Chờ duyệt"}
        </span>
      ),
    },
    {
      title: "Số sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        products?.reduce((acc, product) => acc + product.limit_quantity, 0),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex flex-col">
          <Button
            variant="link"
            color="primary"
            onClick={() => navigate(`/seller/flashsale/edit/${record._id}`)}
          >
            Cập nhật
          </Button>
          <Button
            variant="link"
            color="danger"
            onClick={() => handleOpenModal(record._id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.data}
        pagination={{
          pageSize: pageSize,
          total: data?.totalRows,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} danh mục`,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
            console.log(pageSize);
          },
        }}
        scroll={{ y: 500 }}
      />
      <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn xóa Flash Sale này?</p>
      </Modal>
    </>
  );
};

export default FlashSaleTable;
