import {
  Breadcrumb,
  Button,
  DatePicker,
  Flex,
  Input,
  message,
  Modal,
  Segmented,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SpinLoading from "~/components/loading/SpinLoading";
import { useGetOrderForAdminQuery } from "../../../apis/ordersApi";
import OrderTable from "../../../components/table/OrderTable";
import { exportOrders } from "../../../services/order";
import { getShipment } from "../../../services/shipment";
function OrderListPage() {
  const { Title } = Typography;
  const { Option } = Select;
  const [orders, setOrders] = useState([]);
  const [openModalBill, setOpenModalBill] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [shipment, setShipment] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchType, setSearchType] = useState("order_trackingNumber");
  const [loading, setLoading] = useState(false);
  const [orderSelected, setOrderSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [orderQuery, setOrderQuery] = useState(`order_status=all`);
  const [datePicker, setDatePicker] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [billOption, setBillOption] = useState("Xuất hóa đơn");
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { RangePicker } = DatePicker;
  const { data: orderResponse, isLoading } = useGetOrderForAdminQuery({
    page: currentPage,
    limit: limit,
  });
  useEffect(() => {
    if (orderResponse) {
      setOrders(orderResponse.metadata);
    }
  }, [orderResponse]);
  useEffect(() => {
    async function fetchingData() {
      try {
        setLoading(true);
        const [shipmentData] = await Promise.all([
          // getOrderByUser({}),
          getShipment(),
        ]);
        setShipments(shipmentData.metadata);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    fetchingData();
  }, []);
  useEffect(() => {
    async function fetchingOrders() {
      try {
        console.log("Fetching with params:", Object.fromEntries(searchParams));
        // const orderData = await getOrderByUser(Object.fromEntries(searchParams));
        // setOrders(orderData.metadata);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchingOrders();
  }, [searchParams]);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page));
    }
  }, [searchParams]);

  const options = [
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Tất cả</div>
        </div>
      ),
      value: "all",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Chờ xác nhận</div>
        </div>
      ),
      value: "pending",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Đang xử lý</div>
        </div>
      ),
      value: "processing",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Đang vận chuyển</div>
        </div>
      ),
      value: "delivering",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Đã giao</div>
        </div>
      ),
      value: "shipped",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Đã hủy</div>
        </div>
      ),
      value: "cancelled",
    },
  ];
  let placeholder = "Nhập mã vận đơn";
  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const blob = await exportOrders({
        order_status: orderQuery,
        startDate: datePicker.start,
        endDate: datePicker.end,
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `orders_${new Date(datePicker.start).toLocaleDateString()}-${new Date(
          datePicker.end
        ).toLocaleDateString()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Xuất file thành công!");
      setOpenModalBill(false);
    } catch (error) {
      console.error("Lỗi khi xuất file:", error);
      message.error("Có lỗi xảy ra khi xuất file!");
    } finally {
      setConfirmLoading(false);
      setOpenModalBill(false);
      setBillOption("Xuất hóa đơn");
      setOrderQuery(`order_status=all`);
    }
  };
  const handleCancel = () => {
    setOpenModalBill(false);
    setBillOption("Xuất hóa đơn");
  };
  const modalSelectBill = (
    <Modal
      title="Xuất tất cả đơn hàng theo ngày"
      open={openModalBill}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <RangePicker
        onChange={(value, dateString) => {
          if (value) {
            const [start, end] = dateString;
            setDatePicker({
              start: new Date(start).toISOString(),
              end: new Date(end).toISOString(),
            });
          }
        }}
      />
    </Modal>
  );
  const handleChangeOption = (option) => {
    switch (option) {
      case "order_trackingNumber":
        placeholder = "Nhập mã vận đơn";
        setSearchType(option);
        break;
      case "sku":
        placeholder = "Nhập SKU";
        setSearchType(option);
        break;
      case "user_id":
        placeholder = "Nhập thông tin khách hàng";
        setSearchType(option);
        break;
      default:
        placeholder = "Tìm kiếm theo mã vận đơn, SKU, thông tin khách hàng";
        break;
    }
  };
  const handleChangeShipment = (shipment) => {
    setShipment(shipment);
  };
  const handleConfirmSearch = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (searchKey) {
      params.set("order_trackingNumber", searchKey);
      // params.set("search_type", searchType);
    }
    if (shipment) {
      params.set("shipment", shipment);
    }
    params.set("page", 1);
    console.log("Search params:", Object.fromEntries(params));
    setSearchParams(params);
  };
  const handleReset = () => {
    setSearchKey("");
    setShipment("");
    setSearchType("order_trackingNumber");
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };
  const selectBefore = (
    <Select onChange={handleChangeOption} defaultValue="order_trackingNumber">
      <Option value="order_trackingNumber">Mã vận đơn</Option>
      <Option value="sku">SKU</Option>
      <Option value="user_id">Thông tin khách hàng</Option>
    </Select>
  );

  const handleChangeDataOrder = (value) => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.set(`order_status`, value);
    params.set("page", 1);
    setSearchParams(params);
    setOrderQuery(`order_status=${value}`);
  };
  const handleChangeBill = (value) => {
    if (value === "invoice_by_date") {
      setBillOption(value);
      setOpenModalBill(true);
    }
  };
  const handleSortOrder = (value) => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("sort_by", value);
    params.set("page", 1);
    setSearchParams(params);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
  };
  const handleChangeLimit = (value) => {
    setLimit(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("limit", value);
    params.set("page", 1);
    setSearchParams(params);
  };
  if (loading) return <SpinLoading />;
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/seller">Trang chủ</Link>,
          },
          {
            title: "Đơn hàng",
          },
          {
            title: "Quản lý đơn hàng",
          },
        ]}
      />
      <Title
        style={{
          marginTop: 24,
          marginBottom: 16,
        }}
        level={4}
      >
        Danh sách đơn hàng
      </Title>
      <Segmented
        onChange={(value) => handleChangeDataOrder(value)}
        options={options}
      />
      <Flex
        gap={20}
        style={{
          maxWidth: "70%",
          margin: "24px 0px",
        }}
      >
        <Input
          style={{
            flex: 2,
          }}
          addonBefore={selectBefore}
          placeholder={placeholder}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <Select
          onChange={handleChangeShipment}
          style={{ width: "auto", flex: 1 }}
          defaultValue="all"
          value={shipment}
        >
          <Option value="all" disabled>
            Đơn vị vận chuyển
          </Option>
          {shipments.map((shipment) => (
            <Option key={shipment.id} value={shipment.shipment_slug}>
              {shipment.shipment_name}
            </Option>
          ))}
        </Select>
        <Button onClick={handleConfirmSearch} type="primary">
          Áp dụng
        </Button>
        <Button onClick={handleReset} type="default">
          Đặt lại
        </Button>
      </Flex>
      <Select
        defaultValue="confirmed_date_asc"
        onChange={(value) => handleSortOrder(value)}
      >
        <Option value="confirmed_date_asc">
          Ngày xác nhận đơn đặt hàng(Xa - Gần nhất)
        </Option>
        <Option value="confirmed_date_desc">
          Ngày xác nhận đơn đặt hàng(Gần - Xa nhất)
        </Option>
        <Option value="create_date_asc">Ngày tạo đơn(Xa - Gần nhất)</Option>
        <Option value="create_date_desc">Ngày tạo đơn(Gần - Xa nhất)</Option>
      </Select>
      <Flex gap={10} style={{ marginTop: 20, marginBottom: 20 }}>
        <Title level={5}>Đơn hàng: {orders.data?.length}</Title>
        <Select
          style={{ width: 240 }}
          placeholder="Xuất hóa đơn"
          value={billOption}
          onChange={(value) => handleChangeBill(value)}
        >
          <Option value="invoice_by_date">Toàn bộ hóa đơn theo ngày</Option>
          <Option
            value="invoice_by_choose"
            disabled={!orderSelected?.length > 0}
          >
            Đơn hàng được chọn
          </Option>
        </Select>
        <Select
          style={{ width: 120 }}
          placeholder="Số lượng hiển thị"
          value={limit}
          onChange={handleChangeLimit}
        >
          <Option value={5}>5 đơn hàng</Option>
          <Option value={10}>10 đơn hàng</Option>
          <Option value={20}>20 đơn hàng</Option>
          <Option value={50}>50 đơn hàng</Option>
          <Option value={100}>100 đơn hàng</Option>
        </Select>
      </Flex>

      <OrderTable
        data={orders}
        limit={limit}
        setCurrentPage={handlePageChange}
        isLoading={isLoading}
      />
      {openModalBill && modalSelectBill}
    </>
  );
}

export default OrderListPage;
