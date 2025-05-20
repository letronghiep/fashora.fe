import {
  DownOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Flex, notification, Space, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useResponsive from "~/hooks/useResponsive";
import { logout } from "../../stores/slices/authSlice";

function ShopHeader({ bgColor = "#FFFFFF", user }) {
  const dispatch = useDispatch();

  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const logoutUser = async () => {
    try {
      // await handleLogout();
      // await dispatch(logoutAuth()).unwrap();
      // notification.success({
      //   message: "Logged out successfully",
      //   showProgress: true,
      //   placement: "topRight",
      //   onClose: () => {
      //     navigate("/login");
      //   },
      // });
      const data = await dispatch(logout()).unwrap();
      if (data) {
        notification.success({
          message: "Logged out successfully",
          showProgress: true,
          placement: "topRight",
          onClose: () => {
            window.location.reload();
          },
        });
      }
    } catch (error) {
      notification.error({
        message: error,
        showProgress: true,
        placement: "topRight",
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
              user.usr_avatar
                ? user.usr_avatar
                : user.usr_name?.split("")[0].toUpperCase()
            }`}
            alt="avatar"
            size={isMobile ? 0 : 60}
          />
          <Typography className="hidden md:block">
            {user.usr_full_name || user.usr_name}
          </Typography>
        </Flex>
      ),
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Typography>Hồ Sơ Shop</Typography>,
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: <Typography>Thiết Lập Shop</Typography>,
      onClick: () => navigate(`/seller/profile/edit/${user._id}`),
    },
    {
      key: "4",
      icon: <GlobalOutlined />,
      label: <Typography>Tiếng Việt (Vietnamese)</Typography>,
    },
    {
      type: "divider",
    },
    {
      key: "5",
      icon: <LogoutOutlined />,
      label: <Typography>Đăng xuất</Typography>,
      danger: true,
      onClick: logoutUser,
    },
  ];
  return (
    <>
      <Header
        style={{
          backgroundColor: bgColor,
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
            maxWidth: "1500px",
            margin: "0 auto",
          }}
        >
          <Link to="/seller" className="flex items-center gap-x-2">
            <img alt="Logo" src="/logo-l.png" width={120} height={80} />
            <Typography.Title
              style={{
                // color: "#0070f3",
                marginBottom: "4px",
              }}
              level={4}
            >
              Dashboard
            </Typography.Title>
          </Link>
          <Flex align="center" justify="center" gap="middle">
            <Dropdown
              menu={{ items: profileMenu }}
              placement="bottomLeft"
              trigger={[`${isMobile ? "click" : "hover"}`]}
              overlayStyle={{ width: "240px" }}
            >
              <Flex>
                {isMobile ? (
                  <Avatar
                    src={`${
                      user.usr_avatar
                        ? user.usr_avatar
                        : user.usr_name?.split("")[0].toUpperCase()
                    }`}
                    alt="avatar"
                  />
                ) : (
                  <Space align="center">
                    <Avatar
                      src={`${
                        user.usr_avatar
                          ? user.usr_avatar
                          : user.usr_name?.split("")[0].toUpperCase()
                      }`}
                      alt="avatar"
                    />
                    <Typography.Title
                      style={{
                        margin: 0,
                      }}
                      level={5}
                      className="hidden md:inline-block"
                    >
                      {user.usr_full_name || user.usr_name}
                    </Typography.Title>
                    <DownOutlined />
                  </Space>
                )}
              </Flex>
            </Dropdown>
          </Flex>
        </Flex>
      </Header>
    </>
  );
}

export default ShopHeader;
