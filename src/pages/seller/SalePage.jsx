import { ExclamationCircleOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Col, notification, Row, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinLoading from "../../components/loading/SpinLoading";
import Revenue from "../../components/seller/Revenue";
import RevenueReport from "../../components/seller/RevenueReport";
import Section from "../../components/seller/Section";
import TodoBox from "../../components/seller/TodoBox";
import Notifications from "../../components/seller/notifications/Notifications";
import DiscountTable from "../../components/table/DiscountTable";
import { getDiscountByShop } from "../../services/discount";
import { getNotification } from "../../services/notifications";
import {
  analysisSeller,
} from "../../services/seller/analysis";
import { socket } from "../../socket";
import { setDataOrder } from "../../stores/slices/seller/orderSlice";
import { axiosInstance } from "../../core/axiosInstance";
import { apiOrigin } from "../../constants";
import { getOrderByUser } from "../../services/seller/order";

function SalePage() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState();
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
    on_hold: 0
  });
  const [revenue, setRevenue] = useState(0);
  const data = useSelector((state) => state.user);
  const [showAllStatus, setShowAllStatus] = useState(false);
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
        const [notifies, analysis, discountResponse, orderStatusData] = await Promise.all([
          getNotification(user._id, false),
          analysisSeller({
            startDate: pickerDay.start,
            endDate: pickerDay.end,
            type: pickerDay.type,
          }),
          getDiscountByShop(),
          getOrderByUser({})
        ]);
        setNotifications(notifies.metadata);
        if (analysis) {
          const { revenue_report } = analysis.metadata;
          setRevenue(revenue_report);
        }
        if (discountResponse) {
          setDiscounts(discountResponse.metadata);
        }
        if (orderStatusData?.metadata) {
          const { pending, confirmed, processing, packed, delivering, shipped, completed, cancelled, returned, exchanged, refunded, failed_delivery, on_hold } = orderStatusData.metadata;
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
            on_hold: on_hold || 0
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
              on_hold: on_hold || 0
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
  const handleExportRevenueToCSV = async () => {
    try {
      setLoading(true);
      const fileName = `revenue-report-${new Date().toISOString().split('T')[0]}`;
      const queryParams = {
        startDate: pickerDay.start,
        endDate: pickerDay.end,
        type: pickerDay.type
      };

      const response = await axiosInstance.get(`${apiOrigin}/analysis/seller/export`, {
        params: queryParams,
        responseType: 'blob'
      });

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
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportAllData = async () => {
    try {
      setLoading(true);
      const fileName = `full-report-${new Date().toISOString().split('T')[0]}`;
      const queryParams = {
        startDate: pickerDay.start,
        endDate: pickerDay.end,
        type: pickerDay.type,
        includeAll: true
      };

      const response = await axiosInstance.get(`${apiOrigin}/analysis/seller/export-all`, {
        params: queryParams,
        responseType: 'blob'
      });

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
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SpinLoading />;
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Section title="Những việc cần làm">
            <Row
              style={{
                backgroundColor: "white",
              }}
            >
              <TodoBox
                span={6}
                title="Chờ xác nhận"
                href="/seller/orders"
                value={orderStatus.pending}
              />
              <TodoBox
                span={6}
                title="Đã xác nhận"
                href="/seller/orders"
                value={orderStatus.confirmed}
              />
              <TodoBox
                span={6}
                title="Đang xử lý"
                href="/seller/orders"
                value={orderStatus.processing}
              />
              <TodoBox
                span={6}
                title="Đã đóng gói"
                href="/seller/orders"
                value={orderStatus.packed}
              />
              <TodoBox
                span={6}
                title="Đang vận chuyển"
                href="/seller/orders"
                value={orderStatus.delivering}
              />
              <TodoBox
                span={6}
                title="Đã giao"
                href="/seller/orders"
                value={orderStatus.shipped}
              />
              <TodoBox
                span={6}
                title="Hoàn tất"
                href="/seller/orders"
                value={orderStatus.completed}
              />
              <TodoBox
                span={6}
                title="Đã hủy"
                href="/seller/orders"
                value={orderStatus.cancelled}
              />
              {!showAllStatus ? (
                <Col span={24} style={{ textAlign: 'center', padding: '10px' }}>
                  <a onClick={() => setShowAllStatus(true)} style={{ cursor: 'pointer' }}>
                    Xem thêm <DownOutlined />
                  </a>
                </Col>
              ) : (
                <>
                  <TodoBox
                    span={6}
                    title="Trả hàng"
                    href="/seller/orders"
                    value={orderStatus.returned}
                  />
                  <TodoBox
                    span={6}
                    title="Đổi hàng"
                    href="/seller/orders"
                    value={orderStatus.exchanged}
                  />
                  <TodoBox
                    span={6}
                    title="Hoàn tiền"
                    href="/seller/orders"
                    value={orderStatus.refunded}
                  />
                  <TodoBox
                    span={6}
                    title="Giao hàng thất bại"
                    href="/seller/orders"
                    value={orderStatus.failed_delivery}
                  />
                  <TodoBox
                    span={6}
                    title="Tạm giữ"
                    href="/seller/orders"
                    value={orderStatus.on_hold}
                  />
                  <Col span={24} style={{ textAlign: 'center', padding: '10px' }}>
                    <a onClick={() => setShowAllStatus(false)} style={{ cursor: 'pointer' }}>
                      Thu gọn <UpOutlined />
                    </a>
                  </Col>
                </>
              )}
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
          <Section
            // style={{ marginTop: "20px" }}
            title="Danh sách voucher"
            viewLink="Xem thêm"
          >
            <DiscountTable data={discounts} />
          </Section>
        </Col>
        <Col span={8}>
          <Notifications notifications={notifications} />
        </Col>
      </Row>
    </>
  );
}

export default SalePage;
