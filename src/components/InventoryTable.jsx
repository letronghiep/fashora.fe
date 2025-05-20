import { Button, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";

function InventoryTable({ 
  products, 
  pageSize, 
  onPageChange, 
  onShowModal,
  total,
  currentPage,
  loading 
}) {
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      width: 600,
      ellipsis: true,
    },
    {
      title: "SKU",
      dataIndex: "sku_name",
      key: "sku_name",
    },
    {
      title: "Giá",
      dataIndex: "product_price",
      key: "product_price",
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Số lượng",
      dataIndex: "product_quantity",
      key: "product_quantity",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onShowModal(record)}
        >
          Thay đổi giá
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="_id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
        onChange: onPageChange,
      }}
    />
  );
}

export default InventoryTable; 