import {
  DownOutlined,
  HeartOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ShoppingOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Dropdown,
  Flex,
  Input,
  notification,
  Space,
  Typography,
} from "antd";
import { Header } from "antd/es/layout/layout";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../stores/slices/authSlice";

function HomeHeader({ user, onOpenCart }) {
  const { Search } = Input;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const logoutUser = async () => {
    try {
      const data = await dispatch(logout()).unwrap();
      if (data) {
        notification.success({
          message: "Logged out successfully",
          showProgress: true,
          placement: "top",
          onClose: () => {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      notification.error({
        message: error,
        showProgress: true,
        placement: "top",
      });
    }
  };
  const profileMenu = [
    {
      key: "1",
      label: (
        <Flex
          gap="middle"
          vertical
          align="center"
          flex="center"
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${
              user?.usr_avatar
                ? user?.usr_avatar
                : user?.usr_name?.split("")[0].toUpperCase()
            }`}
            alt="avatar"
            size={60}
          />
          <Link to="/profile" className="hidden md:block">
            {user?.usr_full_name || user?.usr_name}
          </Link>
        </Flex>
      ),
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,
      label: <Link to="/my-orders">Đơn hàng của tôi</Link>,
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: <Link to="/profile">Hồ Sơ Cá nhân</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      icon: <LogoutOutlined />,
      label: <Typography>Đăng xuất</Typography>,
      danger: true,
      onClick: logoutUser,
    },
  ];
  const onNavigateFavoritePage = () => {};
  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 40px",
        position: "sticky",
        top: "0",
        left: "0",
        right: "0",
        zIndex: "100",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          maxWidth: "1440px",
          minWidth: "1440px",
          margin: "auto",
          width: "100%",
          padding: "0px 24px",
        }}
      >
        <Link
          to="/"
          onClick={() => {
            window.location.refresh();
          }}
          className="flex items-center gap-x-2"
        >
          <img alt="Logo" src="/logo-l.png" width={120} height={100} />
        </Link>
        <Search
          placeholder="Tìm kiếm sản phẩm"
          size="large"
          style={{ width: 600 }}
          onSearch={onSearch}
          allowClear
        />
        <Flex className="flex items-center gap-x-4">
          <Link to="/favorite-products" onClick={onNavigateFavoritePage}>
            <HeartOutlined
              style={{
                fontSize: 20,
              }}
            />
          </Link>
          <div onClick={onOpenCart}>
            <ShoppingCartOutlined
              style={{
                fontSize: 20,
              }}
            />
          </div>
          <div>
            {user ? (
              <Dropdown
                menu={{ items: profileMenu }}
                placement="bottomLeft"
                trigger={[`${"hover"}`]}
                overlayStyle={{ width: "240px" }}
              >
                <Space align="center">
                  <Avatar
                    src={`${
                      user?.usr_avatar
                        ? user?.usr_avatar
                        : user?.usr_name?.split("")[0].toUpperCase()
                    }`}
                    alt="avatar"
                  />
                  <DownOutlined />
                </Space>
              </Dropdown>
            ) : (
              <Link to="/login">Đăng nhập / Đăng ký</Link>
            )}
          </div>
        </Flex>
      </Flex>
    </Header>
  );
}

export default HomeHeader;
