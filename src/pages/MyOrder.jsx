import { Card, Typography, Space, Button, Tag, Empty, Pagination } from "antd";
import { ShoppingOutlined, EyeOutlined, ClockCircleOutlined, DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "../apis/ordersApi";
import { useEffect, useState } from "react";
import SpinLoading from "../components/loading/SpinLoading";

const { Title, Text } = Typography;

const statusColors = {
  pending: "gold", // Chờ xác nhận
  confirmed: "lime", // Đã xác nhận
  processing: "blue", // Đang xử lý
  packed: "geekblue", // Đã đóng gói
  delivering: "cyan", // Đang giao hàng
  shipped: "green", // Đã giao hàng
  completed: "success", // Hoàn tất
  cancelled: "red", // Đã hủy
  returned: "volcano", // Trả hàng
  exchanged: "purple", // Đổi hàng
  refunded: "magenta", // Đã hoàn tiền
  failed_delivery: "error", // Giao hàng thất bại
  on_hold: "warning", // Đơn bị treo
};
const statusName = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  packed: "Đã đóng gói",
  delivering: "Đang giao hàng",
  shipped: "Đã giao hàng",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  returned: "Trả hàng",
  exchanged: "Đổi hàng",
  refunded: "Đã hoàn tiền",
  failed_delivery: "Giao hàng thất bại",
  on_hold: "Đơn bị treo",
};
const MyOrder = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: ordersResponse, loading, refetch } = useGetOrdersQuery({
    page: currentPage,
    limit: pageSize
  });
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });

  useEffect(() => {
    if (ordersResponse) {
      const { data, totalRows, limit } = ordersResponse.metadata;
      setOrders(data);
      setPagination({
        current: currentPage,
        pageSize: limit,
        total: totalRows
      });
    }
  }, [ordersResponse, currentPage]);

  const handlePageChange = async (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await refetch({
      page: page,
      limit: size
    });
  };

  const OrderCard = ({ order }) => (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space direction="vertical" size={12}>
          <Space>
            <Text strong style={{ fontSize: 16 }}>Đơn hàng #{order.order_trackingNumber}</Text>
            <Tag color={statusColors[order.order_status]} style={{ padding: '4px 12px', borderRadius: '16px' }}>
              {statusName[order.order_status]}
            </Tag>
          </Space>
          
          <Space>
            <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
            <Text type="secondary">{dayjs(order.date).format("DD/MM/YYYY HH:mm")}</Text>
          </Space>

          <Space align="center">
            <ShoppingCartOutlined style={{ color: '#8c8c8c' }} />
            <Text>{order.order_items?.length || 0} sản phẩm</Text>
          </Space>

          <Space align="center">
            <DollarOutlined style={{ color: '#52c41a' }} />
            <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
              {order.order_checkout.totalPrice.toLocaleString("vi-VN")} đ
            </Text>
          </Space>
        </Space>

        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/my-orders/${order._id}`)}
          style={{ borderRadius: '6px' }}
        >
          Chi tiết
        </Button>
      </div>
    </Card>
  );

  if (loading) {
    return <SpinLoading />;
  }

  return (
    <div style={{ padding: '24px', width: '1440px', margin: '0 auto' }}>
      <Card
        title={
          <Space align="center" style={{ marginBottom: 16 }}>
            <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>Đơn hàng của tôi</Title>
          </Space>
        }
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {orders.length > 0 ? (
          <>
            <div style={{ padding: '8px 0' }}>
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginTop: 24,
              borderTop: '1px solid #f0f0f0',
              paddingTop: 24
            }}>
              <Pagination
                {...pagination}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showTotal={(total) => `Tổng số ${total} đơn hàng`}
                showSizeChanger
                pageSizeOptions={['5', '10', '20', '50']}
              />
            </div>
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Bạn chưa có đơn hàng nào"
            style={{ margin: '40px 0' }}
          />
        )}
      </Card>
    </div>
  );
};

export default MyOrder;
