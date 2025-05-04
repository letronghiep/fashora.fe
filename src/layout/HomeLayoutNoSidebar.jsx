import { Drawer, Layout, theme } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeHeader from "../components/header/Header";
import { getAuth } from "../stores/slices/authSlice";
import Footer from "../components/Footer";
import ShoppingCart from "../components/shopping-cart";
import Chat from "../components/Chat";

function HomeLayoutNoSidebar({ children }) {
  const { Content } = Layout;
  const [openCart, setOpenCart] = useState(false);
  const onClose = () => {
    setOpenCart(false);
  };
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const userStorage = useSelector((state) => state.user);
  const userData = userStorage?.user;
  useEffect(() => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");

    const getUserData = async () => {
      // Nếu đã có dữ liệu hợp lệ, không cần gọi API nữa
      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
        return;
      }

      // Nếu không có userData nhưng có token, thử xác thực
      if (
        (!userData || Object.keys(userData).length === 0) &&
        token &&
        client_id
      ) {
        try {
          const data = await dispatch(getAuth()).unwrap();
          if (data?.user) {
            setUser(data.user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Nếu lỗi xác thực, chỉ xóa token nhưng không điều hướng
          localStorage.removeItem("token");
          localStorage.removeItem("client_id");
        }
      }
    };

    getUserData();
  }, [userData, dispatch]);
  return (
    <Layout>
      <HomeHeader user={user} onOpenCart={setOpenCart} />
      <Content
        style={{
          maxWidth: "1440px",
          minWidth: "1440px",
          margin: "auto",
          width: "100%",
          padding: "0px 24px",
        }}
      >
        <Layout
          style={{
            margin: "20px 0",
            borderRadius: borderRadiusLG,
            display: "flex",
            columnGap: "20px",
          }}
        >
          {children}
          <Drawer
            // title="Giỏ hàng"
            placement="right"
            closable={false}
            onClose={onClose}
            open={openCart}
          >
            <ShoppingCart onClose={() => setOpenCart(false)}/>
          </Drawer>
          <Chat />
        </Layout>
      </Content>
      <Footer />
    </Layout>
  );
}

export default HomeLayoutNoSidebar;
