import { DownloadOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { formatDate } from "../../helpers/formatDate";
import DualAxesChart from "../charts/DualAxesChart";
import StatisticCustom from "../Statistic";
import GrowthIndicator from "./GrowIndicator";
import dayjs from "dayjs";
function RevenueReport({ revenueData, exportRevenueToCSV }) {
  const {
    current_week_revenue,
    percentage_change,
    daily,
    previous_week,
    order_per,
    total_order,
    revenue
  } = revenueData;
  
  const compareText = previous_week
    ? `${formatDate(previous_week.start, "DD/MM")} - ${formatDate(previous_week.end, "DD/MM")}`
    : "";

  const dataDate = daily?.map((item) => {
    if (!item.date) return "";
    try {
      const date = dayjs(item.date);
      return date.isValid() ? formatDate(date, "DD/MM") : "";
    } catch (error) {
      console.error("Lỗi khi xử lý ngày tháng:", error);
      return "";
    }
  }) || [];

  const dataRevenue = daily?.map((item) => item.revenue) || [];
  const dataOrder = daily?.map((item) => item.order) || [];

  return (
    <div className="bg-white my-4">
      <button className="hover:bg-gray-50 flex justify-end items-center gap-2 bg-white py-1 px-3 rounded-md w-fit ml-auto my-2 border border-gray-200 shadow-sm mr-4" onClick={exportRevenueToCSV}>
        <p>Tải dữ liệu</p>
        <DownloadOutlined />
      </button>
      <Row
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: "10px 20px",
        }}
      >
        <Col span={8} gap={10}>
          <div>
            <StatisticCustom
              value={revenue}
              title="Tổng doanh thu"
            />
            {/* <GrowthIndicator
              percentage={percentage_change}
              isPositive={!!percentage_change}
              comparisonPeriod={compareText}
            /> */}
          </div>
          <div>
            <StatisticCustom value={total_order} title="Đơn hàng" />
            {/* <GrowthIndicator
              percentage={order_per}
              isPositive={!!order_per}
              comparisonPeriod={compareText}
            /> */}
          </div>
        </Col>
        <Col span={16}>
          {/* <BarChart /> */}
            <DualAxesChart
              dataChart={dataDate}
              dataSetBar={dataRevenue}
              dataSetLine={dataOrder}
              min={0}
              max={dataRevenue.length > 0 && dataOrder.length > 0 ? Math.max(...dataRevenue, ...dataOrder) : 0}
            />
        </Col>
      </Row>
    </div>
  );
}

export default RevenueReport;
