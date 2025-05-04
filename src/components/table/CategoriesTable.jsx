import { Button, Flex, Modal, notification, Table, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation } from "../../apis/categoriesApi";
import { useState } from "react";

const Categories = ({ data, pageSize, setPageSize }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableId, setTableId] = useState();

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [deleteCategory, { isLoading }] =
    useDeleteCategoryMutation();

  const handleOpenModal = (id) => {
    setIsModalOpen(true);
    setTableId(id);
  };
  const handleDeleteCategory = async (id) => {
    try {
      // await axiosInstance.delete(`/categories/${id}`);
      const response = await deleteCategory(id).unwrap();
      if (response.status === 200) {
        notification.success({
          message: "Xóa danh mục thành công",
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
    await handleDeleteCategory(tableId);
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "category_name",
      key: "category_name",
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Mã danh mục",
      key: "category_id",
      dataIndex: "category_id",
      render: (text) => <Link to={`/seller/category/:${text}`}>{text}</Link>,
    },
    {
      title: "Danh mục cha",
      dataIndex: "category_parentId",
      key: "category_parentId",
      // render: (order) => <a>{order.paymentMethod}</a>,
      render: (categories) =>
      (categories?.length) > 0 && (
        <Flex>
            <Link to={`/seller/category/${categories[0]}`}>{categories.join(" - ")}</Link>
        
        </Flex>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "category_status",
      key: "category_status",
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
            onClick={() => navigate(`/seller/categories/edit/${record._id}`)}
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
        <p>Xóa danh mục này?</p>
      </Modal>
    </>
  );
};
export default Categories;
