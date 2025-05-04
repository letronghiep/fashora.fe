import { Button, Modal, notification, Table, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteUserMutation } from "../../apis/usersApi";
import { useState } from "react";

const UserTable = ({ data }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableId, setTableId] = useState();
  const [pageSize, setPageSize] = useState(5);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleOpenModal = (id) => {
    setIsModalOpen(true);
    setTableId(id);
  };
  const handleDeleteUser = async (id) => {
    try {
      // await axiosInstance.delete(`/categories/${id}`);
      const response = await deleteUser(id).unwrap();
      if (response.status === 200) {
        notification.success({
          message: "Xóa người dùng thành công",
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
    await handleDeleteUser(tableId);
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "usr_name",
      key: "usr_name",
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Mã người dùng",
      key: "usr_id",
      dataIndex: "usr_id",
      render: (text, record) => (
        <Link to={`/seller/user/:${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "usr_email",
      key: "usr_email",
      // render: (order) => <a>{order.paymentMethod}</a>,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "usr_phone",
      key: "usr_phone",
      // render: (order) => <a>{order.paymentMethod}</a>,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Trạng thái",
      dataIndex: "usr_status",
      key: "usr_status",
      width: "200px",
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
          case "inactive":
            return (
              <Tag color="#FFF2F2" style={{ color: "#EC1F00" }}>
                Đã vô hiệu hóa
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
            onClick={() => navigate(`/seller/users/edit/${record._id}`)}
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
  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.data}
        pagination={{
          pageSize: pageSize,
          total: data?.totalRows,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
            console.log(pageSize);
          },
        }}
      />
      <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Xóa người dùng này?</p>
      </Modal>
    </>
  );
};
export default UserTable;
