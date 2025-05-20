  import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col, Input, message, Modal, notification, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InventoryTable from "../../components/InventoryTable";
import SpinLoading from "../../components/loading/SpinLoading";
import Revenue from "../../components/seller/Revenue";
import RevenueReport from "../../components/seller/RevenueReport";
import Section from "../../components/seller/Section";
import TodoBox from "../../components/seller/TodoBox";
import Notifications from "../../components/seller/notifications/Notifications";
import DiscountTable from "../../components/table/DiscountTable";
import { apiOrigin } from "../../constants";
import { axiosInstance } from "../../core/axiosInstance";
import { getDiscountByShop } from "../../services/discount";
import { getNotification } from "../../services/notifications";
import { analysisSeller } from "../../services/seller/analysis";
import { getOrderByUser } from "../../services/seller/order";
import { socket } from "../../socket";
import { setDataOrder } from "../../stores/slices/seller/orderSlice";
import { useUpdatePriceProductMutation } from "../../apis/productsApi";

function SalePage() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState();
  const [pageSize, setPageSize] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [totalProductView, setTotalProductView] = useState(0);
  const [countLowSaleSku, setCountLowSaleSku] = useState(0);
  const [countTopSellingSku, setCountTopSellingSku] = useState(0);
  const [updatePriceProduct] = useUpdatePriceProductMutation();
  const [pickerDay, setPickerDay] = useState({
    start: null,
    end: null,
    type: "today",
  });
  const [orderStatus, setOrderStatus] = useState({
    pending: 0,
    confirmed: 0,
    processing: 0,
    packed: 0,
    delivering: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
    returned: 0,
    exchanged: 0,
    refunded: 0,
    failed_delivery: 0,
    on_hold: 0,
  });
  const [revenue, setRevenue] = useState(0);
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const data = useSelector((state) => state.user);
  const [showAllStatus, setShowAllStatus] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState(0);
  useEffect(() => {
    const getUser = async () => {
      try {
        if (data) {
          setUser(data.user);
        }
      } catch (error) {
        notification.error({
          message: error.message,
          duration: 5,
          placement: "topRight",
          icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
          key: "salepage-error",
          closable: true,
          showProgress: true,
        });
      }
    };
    getUser();
  }, [dispatch, data]);
  useEffect(() => {
    async function fetchData() {
      if (!user?._id) return;
      try {
        setLoading(true);
        const [notifies, analysis, discountResponse, orderStatusData] =
          await Promise.all([
            getNotification(user._id, false, false),
            analysisSeller({
              startDate: pickerDay.start,
              endDate: pickerDay.end,
              type: pickerDay.type,
            }),
            getDiscountByShop(),
            getOrderByUser({}),
          ]);
        setNotifications(notifies.metadata);
        if (analysis) {
          const { revenue_report, lowSaleSku, totalProductView, countLowSaleSku, countTopSellingSku } = analysis.metadata;
          setRevenue(revenue_report);
          setInventoryProducts(lowSaleSku);
          setTotalProductView(totalProductView);
          setCountLowSaleSku(countLowSaleSku);
          setCountTopSellingSku(countTopSellingSku);
        }
        if (discountResponse) {
          setDiscounts(discountResponse.metadata);
        }
        if (orderStatusData?.metadata) {
          const {
            pending,
            confirmed,
            processing,
            packed,
            delivering,
            shipped,
            completed,
            cancelled,
            returned,
            exchanged,
            refunded,
            failed_delivery,
            on_hold,
          } = orderStatusData.metadata;
          setOrderStatus({
            pending: pending || 0,
            confirmed: confirmed || 0,
            processing: processing || 0,
            packed: packed || 0,
            delivering: delivering || 0,
            shipped: shipped || 0,
            completed: completed || 0,
            cancelled: cancelled || 0,
            returned: returned || 0,
            exchanged: exchanged || 0,
            refunded: refunded || 0,
            failed_delivery: failed_delivery || 0,
            on_hold: on_hold || 0,
          });
          dispatch(
            setDataOrder({
              pending: pending || 0,
              confirmed: confirmed || 0,
              processing: processing || 0,
              packed: packed || 0,
              delivering: delivering || 0,
              shipped: shipped || 0,
              completed: completed || 0,
              cancelled: cancelled || 0,
              returned: returned || 0,
              exchanged: exchanged || 0,
              refunded: refunded || 0,
              failed_delivery: failed_delivery || 0,
              on_hold: on_hold || 0,
            })
          );
        }
        socket.on("read:notification", async () => {
          const data = await getNotification(user._id, false);
          setNotifications(data.metadata);
        });
        return () => {
          socket.off("read:notification");
        };
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, pickerDay]);
  // updatet socket
  useEffect(() => {
    socket.on("read:notification", async (notificationId) => {
      const newNotifications = notifications.map((notification) => {
        if (notification._id === notificationId) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
      console.log(notificationId);
      setNotifications(newNotifications);
    });
    return () => {
      socket.off("read:notification");
    };
  }, []);
  const revenueSubTitle = (
    <span>
      {pickerDay.type === "specific-date" &&
        pickerDay.start &&
        pickerDay.end &&
        `${new Date(pickerDay.start).toLocaleDateString("vi-VN")} - ${new Date(
          pickerDay.end
        ).toLocaleDateString("vi-VN")}`}
    </span>
  );
  const handleDateChange = (dates) => {
    if (dates) {
      setPickerDay({
        start: dates[0],
        end: dates[1],
        type: "specific-date",
      });
    }
  };
  const handleOk = async () => {
    try {
      if (!selectedProduct || !newPrice) {
        message.error("Vui lòng nhập giá mới cho sản phẩm");
        return;
      }

      const res = await updatePriceProduct({
        id: selectedProduct.skuId,
        data: { sku_price_sale: newPrice },
      });

      if (res.data?.status === 200) {
        message.success("Cập nhật giá sản phẩm thành công");
        // Cập nhật lại danh sách sản phẩm
        const analysis = await analysisSeller({
          startDate: pickerDay.start,
          endDate: pickerDay.end,
          type: pickerDay.type,
        });
        if (analysis) {
          const { lowSaleSku } = analysis.metadata;
          setInventoryProducts(lowSaleSku);
        }
      } else {
        message.error("Cập nhật giá sản phẩm thất bại");
      }
      setShowModal(false);
      setSelectedProduct(null);
      setNewPrice(0);
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi cập nhật giá sản phẩm");
    }
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const handleExportRevenueToCSV = async () => {
    try {
      setLoading(true);
      const fileName = `revenue-report-${
        new Date().toISOString().split("T")[0]
      }`;
      const queryParams = {
        startDate: pickerDay.start,
        endDate: pickerDay.end,
        type: pickerDay.type,
      };

      const response = await axiosInstance.get(
        `${apiOrigin}/analysis/seller/export`,
        {
          params: queryParams,
          responseType: "blob",
        }
      );

      // Tạo URL tạm thời và tải xuống file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Xuất báo cáo doanh thu thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất file:", error);
      message.error({
        content: "Có lỗi xảy ra khi xuất file! Vui lòng thử lại sau.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportAllData = async () => {
    try {
      setLoading(true);
      const fileName = `full-report-${new Date().toISOString().split("T")[0]}`;
      const queryParams = {
        startDate: pickerDay.start,
        endDate: pickerDay.end,
        type: pickerDay.type,
        includeAll: true,
      };

      const response = await axiosInstance.get(
        `${apiOrigin}/analysis/seller/export-all`,
        {
          params: queryParams,
          responseType: "blob",
        }
      );

      // Tạo URL tạm thời và tải xuống file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Xuất báo cáo đầy đủ thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất báo cáo đầy đủ:", error);
      message.error({
        content: "Có lỗi xảy ra khi xuất báo cáo đầy đủ! Vui lòng thử lại sau.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setNewPrice(product.product_price);
    setShowModal(true);
  };

  if (loading) return <SpinLoading />;
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Section title="Báo cáo thống kê">
            <Row
              style={{
                backgroundColor: "white",
                marginBlock: "20px",
              }}
            >
              <TodoBox
                span={6}
                title="Sản phẩm tồn kho"
                href="/seller/products/inventory"
                value={countLowSaleSku}
              />
              <TodoBox
                span={6}
                title="Sản phẩm bán chạy"
                href="/seller/products"
                value={countTopSellingSku}
              />
              <TodoBox
                span={6}
                title="Lượt xem sản phẩm"
                href="/seller/products"
                value={totalProductView}
              />
            </Row>
          </Section>

          <Revenue
            onChange={handleDateChange}
            title="Hiệu quả kinh doanh"
            subTitle={revenueSubTitle}
            setPickerDay={setPickerDay}
            pickerDay={pickerDay}
          >
            <RevenueReport
              revenueData={revenue}
              exportRevenueToCSV={handleExportRevenueToCSV}
              exportAllData={handleExportAllData}
            />
          </Revenue>
        </Col>
        <Col span={8}>
          <Notifications notifications={notifications} />
        </Col>
      </Row>
      <Section
        // style={{ marginTop: "20px" }}
        title="Hàng tồn kho"
        viewLink="Xem thêm"
      >
        <InventoryTable
          products={inventoryProducts}
          pageSize={pageSize}
          onShowModal={handleShowModal}
          showModal={showModal}
        />
      </Section>
      <Section
        // style={{ marginTop: "20px" }}
        title="Danh sách voucher"
        viewLink="Xem thêm"
      >
        <DiscountTable
          data={discounts}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </Section>
      <Modal
        title="Thay đổi giá sản phẩm"
        open={showModal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        {selectedProduct && (
          <div>
            <p className="mb-2">
              Tên sản phẩm: {selectedProduct?.product_name}
            </p>
            <p className="mb-4">
              Giá hiện tại: {selectedProduct?.product_price.toLocaleString()}đ
            </p>
            <Input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              placeholder="Nhập giá mới"
              addonAfter="đ"
              min={0}
              style={{ width: "100%" }}
            />
            {newPrice <= 0 && (
              <p className="text-red-500 mt-2">Giá sản phẩm phải lớn hơn 0</p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

export default SalePage;
