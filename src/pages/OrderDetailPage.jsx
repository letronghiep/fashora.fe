import {
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Input,
  Modal,
  Rate,
  Result,
  Row,
  Steps,
  Table,
  Tag,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  useCancelOrderMutation,
  useGetOrderDetailQuery,
} from "../apis/ordersApi";
import SpinLoading from "../components/loading/SpinLoading";
import UploadImage from "../components/upload";
import { modifyImageDimensions } from "../helpers";
import { createComment } from "../services/comment";
import { useSelector } from "react-redux";
const { TextArea } = Input;
const { Text, Title } = Typography;

const statusColors = {
  pending: "gold",
  confirmed: "lime",
  processing: "blue",
  packed: "geekblue",
  delivering: "cyan",
  shipped: "green",
  completed: "success",
  cancelled: "red",
  returned: "volcano",
  exchanged: "purple",
  refunded: "magenta",
  failed_delivery: "error",
  on_hold: "warning",
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

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { data: orderResponse, isLoading } = useGetOrderDetailQuery(orderId);
  const [orderDetail, setOrderDetail] = useState();
  const [images, setImages] = useState();
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [reviews, setReviews] = useState({});
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (orderResponse) {
      setOrderDetail(orderResponse.metadata);
    }
  }, [orderResponse]);

  const handleReviewChange = (key, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async (key) => {
    const review = reviews[key];
    const sanitizeHTML = (str) =>
      str.replace(
        /[&<>"']/g,
        (match) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          }[match])
      );

    const safeCommentText = sanitizeHTML(review.reviewText);

    const content = `<div class="">
          <p>${safeCommentText}</p>
          ${
            images && images.length > 0
              ? `<div class="mt-2 flex gap-x-2 flex-wrap">
                  ${images
                    .filter((image) => image)
                    .map(
                      (image) =>
                        `<img src="${modifyImageDimensions(image, 80, 80)}" 
                              alt="image preview" 
                              width="80" 
                              height="80">`
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>`;

    const dataComment = {
      comment_content: content,
      comment_rating: review.rating,
      productId: key,
    };

    const response = await createComment(dataComment);
    if (response.status === 201) {
      notification.success({
        message: "Gửi đánh giá thành công",
        showProgress: true,
        placement: "topRight",
        onClose: () => {
          setIsModalOpen(null);
        },
      });
    }
  };

  const getOrderProgress = () => {
    const orderSteps = [
      { status: "pending", title: "Chờ xác nhận" },
      { status: "confirmed", title: "Đã xác nhận" },
      { status: "processing", title: "Đang xử lý" },
      { status: "packed", title: "Đã đóng gói" },
      { status: "delivering", title: "Đang giao hàng" },
      { status: "shipped", title: "Đã giao hàng" },
      { status: "completed", title: "Hoàn tất" },
      { status: "canceled", title: "Đã hủy" },
    ];

    // Tìm vị trí của trạng thái hiện tại
    const currentIndex = orderSteps.findIndex(
      (step) => step.status === orderDetail.order_status
    );

    // Nếu đơn hàng bị hủy hoặc trạng thái khác
    if (!orderSteps.find((step) => step.status === orderDetail.order_status)) {
      return (
        <Card style={{ marginBottom: 24 }}>
          <Steps
            current={-1}
            status="error"
            items={[
              {
                title: "Đơn hàng",
                description: statusName[orderDetail.order_status],
              },
            ]}
            progressDot
            style={{ padding: "24px 0" }}
          />
        </Card>
      );
    }

    // Map các bước để hiển thị
    const items = orderSteps.map((step, index) => ({
      title: step.title,
      status:
        index <= currentIndex
          ? index === currentIndex
            ? "process"
            : "finish"
          : "wait",
    }));

    return (
      <Card style={{ marginBottom: 24 }}>
        <Steps
          current={currentIndex}
          items={items}
          progressDot
          style={{ padding: "24px 0" }}
        />
      </Card>
    );
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Image
            src={modifyImageDimensions(record.product_thumb, 80, 80)}
            alt="product"
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
          <div>
            <Text strong>{record.product_name}</Text>
            <div style={{ color: "#666", marginTop: 4 }}>
              {record.price.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Thành tiền",
      key: "total",
      align: "right",
      render: (_, record) => (
        <Text strong>
          {(record.price * record.quantity)?.toLocaleString("vi-VN")} đ
        </Text>
      ),
    },
    ...(orderDetail?.order_status === "completed"
      ? [
          {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
              <Button
                type="primary"
                onClick={() => setIsModalOpen(record.productId)}
              >
                Đánh giá
              </Button>
            ),
          },
        ]
      : []),
  ];
  // cancel order
  const [cancelOrder, { isLoading: isCancelLoading }] =
    useCancelOrderMutation();
  const handleCancelOrder = async () => {
    const response = await cancelOrder(orderId);
    if (response.data && response.data.status === 200) {
      notification.success({
        message: "Hủy đơn hàng thành công",
        showProgress: true,
        placement: "topRight",
        onClose: () => {
          setIsModalOpen(null);
          window.location.reload();
        },
      });
    } else {
      Modal.error({
        title: "Lỗi",
        content: "Hủy đơn hàng thất bại",
      });
    }
  };
  const handleOpenCancelOrderModal = () => {
    Modal.confirm({
      title: "Hủy đơn hàng",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      onOk: handleCancelOrder,
    });
  };
  if (!user || !user._id) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Vui lòng đăng nhập để xem chi tiết đơn hàng."
        extra={
          <Link
            to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`}
          >
            <Button type="primary">Đi tới trang đăng nhập</Button>
          </Link>
        }
      />
    );
  }
  if (isLoading || !orderDetail) {
    return <SpinLoading />;
  }

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <Row gutter={24}>
        <Col span={24}>
          <Title level={4} style={{ marginBottom: 24 }}>
            Chi tiết đơn hàng: #{orderDetail.order_trackingNumber}
          </Title>
        </Col>
      </Row>

      {getOrderProgress()}

      <Row gutter={24}>
        <Col span={16}>
          <Card title="Danh sách sản phẩm" style={{ marginBottom: 24 }}>
            <Table
              columns={columns}
              dataSource={orderDetail.order_products || []}
              pagination={false}
              rowKey="productId"
            />
          </Card>

          <Card title="Thông tin đơn hàng">
            <Descriptions column={1}>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColors[orderDetail.order_status]}>
                  {statusName[orderDetail.order_status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {orderDetail.order_shipping}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {orderDetail.order_payment.paymentMethod}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Tổng thanh toán">
            <div style={{ padding: "0 16px" }}>
              <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Text>Tổng tiền hàng: </Text>
                <Text>
                  {orderDetail?.order_checkout.totalPrice?.toLocaleString(
                    "vi-VN"
                  )}{" "}
                  đ
                </Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Text>Phí vận chuyển:</Text>
                <Text>
                  {orderDetail?.order_checkout.feeShip?.toLocaleString("vi-VN")}{" "}
                  đ
                </Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 16 }}>
                <Text>Giảm giá:</Text>
                <Text>
                  {" "}
                  -{" "}
                  {orderDetail?.order_checkout.totalDiscount?.toLocaleString(
                    "vi-VN"
                  )}{" "}
                  đ
                </Text>
              </Row>
              <div style={{ border: "1px dashed #d9d9d9", margin: "16px 0" }} />
              <Row justify="space-between">
                <Text strong>Thành tiền:</Text>
                <Text strong style={{ fontSize: 18, color: "#ff4d4f" }}>
                  {orderDetail?.order_checkout.totalCheckout?.toLocaleString(
                    "vi-VN"
                  )}{" "}
                  đ
                </Text>
              </Row>
            </div>
          </Card>
          {orderDetail.order_status === "pending" && (
            <Button
              style={{
                marginTop: 16,
                width: "100%",
              }}
              type="primary"
              danger
              onClick={handleOpenCancelOrderModal}
            >
              Hủy đơn hàng
            </Button>
          )}
        </Col>
      </Row>

      {orderDetail?.order_products?.map((item) => {
        const review = reviews[item.productId] || {};
        return (
          <Modal
            key={item.productId}
            title={`Đánh giá sản phẩm: ${item.product_name}`}
            open={isModalOpen === item.productId}
            onCancel={() => setIsModalOpen(null)}
            onOk={() => handleSubmitReview(item.productId)}
            okText="Gửi đánh giá"
            cancelText="Hủy"
          >
            <Rate
              value={review.rating}
              onChange={(value) =>
                handleReviewChange(item.productId, "rating", value)
              }
            />
            <TextArea
              rows={3}
              placeholder="Nhận xét sản phẩm..."
              value={review.reviewText || ""}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                handleReviewChange(item.productId, "reviewText", e.target.value)
              }
            />
            <UploadImage setImages={setImages} />
          </Modal>
        );
      })}
    </div>
  );
};

export default OrderDetailPage;
