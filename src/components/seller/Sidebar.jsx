import {
  CloseOutlined,
  ContainerOutlined,
  EuroOutlined,
  HomeOutlined,
  MenuOutlined,
  PictureOutlined,
  ProductOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Drawer, Menu, Space, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useResponsive from "~/hooks/useResponsive";

const items = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link to="/seller">Trang chủ</Link>,
    title: "/seller",
  },
  {
    key: "2",
    icon: <UnorderedListOutlined />,
    label: `Quản lý đơn hàng`,
    children: [
      {
        key: "3",
        label: <Link to="/seller/orders">Danh sách đơn hàng</Link>,
        title: "/seller/orders",
      },
    ],
  },
  {
    key: "4",
    icon: <MenuOutlined />,
    label: `Quản lý danh mục`,
    children: [
      {
        key: "5",
        label: <Link to="/seller/categories">Danh sách danh mục</Link>,
        title: "/seller/categories",
      },
      {
        key: "6",
        label: <Link to="/seller/categories/create">Thêm danh mục</Link>,
        title: "/seller/categories/create",
      },
    ],
  },
  {
    key: "7",
    icon: <ProductOutlined />,
    label: `Quản lý sản phẩm`,
    children: [
      {
        key: "8",
        label: <Link to="/seller/products">Danh sách sản phẩm</Link>,
        title: "/seller/products",
      },
      
      {
        key: "9",
        label: <Link to="/seller/products/create">Thêm sản phẩm</Link>,
        title: "/seller/products/create",
      },
      {
        key: "10",
        label: <Link to="/seller/products/inventory">Sản phẩm tồn kho</Link>,
        title: "/seller/products/inventory",
      },
    ],
  },
  {
    key: "11",
    icon: <UserOutlined />,
    label: `Quản lý người dùng`,
    children: [
      {
        key: "12",
        label: <Link to="/seller/users">Danh sách người dùng</Link>,
        title: "/seller/users",
      },
      {
        key: "13",
        label: <Link to="/seller/users/create">Thêm người dùng</Link>,
        title: "/seller/users/create",
      },
    ],
  },
  {
    key: "14",
    icon: <EuroOutlined />,
    label: `Quản lý mã giảm giá/voucher`,
    children: [
      {
        key: "15",
        label: <Link to="/seller/vouchers">Danh sách vouchers</Link>,
        title: "/seller/vouchers",
      },
      {
        key: "16",
        label: <Link to="/seller/vouchers/create">Thêm voucher</Link>,
        title: "/seller/vouchers/create",
      },
    ],
  },
  {
    key: "17",
    icon: <PictureOutlined />,
    label: `Quản lý banner`,
    children: [
      {
        key: "18",
        label: <Link to="/seller/banners">Danh sách banner</Link>,
        title: "/seller/banners",
      },
      {
        key: "19",
        label: <Link to="/seller/banners/create">Thêm banner</Link>,
        title: "/seller/banners/create",
      },
    ],
  },
  {
    key: "20",
    icon: <EuroOutlined />,
    label: `Quản lý flash sale`,
    children: [
      {
        key: "21",
        label: <Link to="/seller/flashsale">Danh sách flash sale</Link>,
        title: "/seller/flashsale",
      },
      {
        key: "22",
        label: <Link to="/seller/flashsale/create">Tạo flash sale</Link>,
        title: "/seller/flashsale/create",
      },
    ],
  },
];
const Sidebar = () => {
  const { isMobile } = useResponsive();
  const [selectedKey, setSelectedKey] = useState("1");
  const windowPathname = window.location.pathname;

  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const [open, setOpen] = useState(false);

  const onClick = (e) => {
    // setSelectedKey(e.key);
    console.log(e);
  };
  useEffect(() => {
    const allData = items.flatMap((item) => {
      if (item && "children" in item && Array.isArray(item.children)) {
        return [item, ...item.children];
      }
      return [item];
    });
    const index = allData.findIndex((item) => {
      if (item && "title" in item && item.title) {
        return windowPathname === item.title;
      } else if (windowPathname === "/seller" && item.title === "/seller") {
        return true;
      }
      return false;
    });
    if (index > -1 && allData[index]) {
      setSelectedKey(allData[index].key);
    }
  }, [windowPathname]);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  if (isMobile) {
    return (
      <>
        <Col
          onClick={showDrawer}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            top: 0,
            height: "100%",
            backgroundColor: colorBgContainer,
            zIndex: 100,
            padding: "4px",
          }}
          className="block md:hidden fixed bottom-0 z-50 left-0 translate-x-7 -translate-y-7 py-2 px-2 shadow-sm shadow-blue-500"
        >
          <MenuOutlined style={{ fontSize: 20, color: "blue" }} />
        </Col>
        <Drawer
          title="Sidebar"
          placement="left"
          closable={false}
          onClose={onClose}
          open={open}
          width={280}
        >
          <Space
            onClick={onClose}
            className="absolute top-0 right-0 -translate-x-5 translate-y-4"
          >
            <CloseOutlined style={{ fontSize: 20 }} />
          </Space>
          <Menu
            onClick={onClick}
            selectedKeys={[selectedKey]}
            mode="inline"
            items={items}
          />
        </Drawer>
      </>
    );
  }

  return (
    <Sider
      style={{
        background: colorBgContainer,
        color: colorText,
      }}
      className="site-layout-background"
      width={240}
    >
      <Menu
        onClick={onClick}
        selectedKeys={[selectedKey]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
