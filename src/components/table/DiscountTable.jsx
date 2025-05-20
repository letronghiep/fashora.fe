import { Button, Modal, notification, Table, Tag } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteDiscountMutation } from "../../apis/vouchersApi";

const DiscountTable = ({ data, pageSize, setPageSize, handleChangePage }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "discount_code",
      key: "discount_code",
      width: "150px",
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên voucher",
      dataIndex: "discount_name",
      key: "discount_name",
      width: "120px",
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Loại mã",
      key: "discount_applies_to",
      dataIndex: "discount_applies_to",
      render: (discount_applies_to) => (
        <a>
          {discount_applies_to === "specific"
            ? "Cho sản phẩm"
            : "Cho toàn shop"}
        </a>
      ),
    },
    {
      title: "Đơn tối đa",
      dataIndex: "discount_max_value",
      key: "discount_max_value",
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "discount_max_value",
      key: "discount_max_value",
    },
    {
      title: "Số lượng",
      key: "discount_uses_count",
      dataIndex: "discount_uses_count",
    },
    {
      title: "Giá trị",
      key: "discount_value",
      dataIndex: "discount_value",
    },
    {
      title: "Trạng thái",
      dataIndex: "discount_status",
      key: "discount_status",
      render: (text) => {
        switch (text) {
          case "pending":
            return (
              <Tag
                color="#FFEFCA"
                style={{
                  color: "#FFB800",
                }}
              >
                Đang xử lý
              </Tag>
            );
          case "active":
            return (
              <Tag color="#DEF7E0" style={{ color: "#90D67F" }}>
                Đã kích hoạt
              </Tag>
            );
          case "block":
            return (
              <Tag color="#FFF2F2" style={{ color: "#EC1F00" }}>
                Đã vô hiệu hóa
              </Tag>
            );
          case "expired":
            return (
              <Tag color="#FFF2F2" style={{ color: "#EC1F00" }}>
                Đã hết hạn
              </Tag>
            );
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
            onClick={() => navigate(`/seller/vouchers/edit/${record._id}?redirect=${encodeURIComponent(window.location.href)}`)}
            className=""
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
          {/* <button className="btn btn-sm btn-success">Xem chi tiet</button> */}
        </div>
      ),
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableId, setTableId] = useState();

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [deleteDiscount, { isLoading }] = useDeleteDiscountMutation();

  const handleOpenModal = (id) => {
    setIsModalOpen(true);
    setTableId(id);
  };
  const handleDeleteUser = async (id) => {
    try {
      const response = await deleteDiscount(id).unwrap();
      if (response.status === 200) {
        notification.success({
          message: "Xóa voucher thành công",
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
    await handleDeleteUser(tableId);
    setIsModalOpen(false);
  };
  return (
    <>
      <Table 
        loading={isLoading} 
        columns={columns} 
        dataSource={data?.data} 
        pagination={{
          pageSize: pageSize,
          total: data?.totalRows,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} voucher`,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        onChange={handleChangePage}
      />
      <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Xóa voucher này?</p>
      </Modal>
    </>
  );
};
export default DiscountTable;
