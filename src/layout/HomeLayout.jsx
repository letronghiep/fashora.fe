import { Drawer, Layout, theme } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Filter from "../components/filters/Filter";
import Footer from "../components/Footer";
import HomeHeader from "../components/header/Header";
import { getCategoryByParentId } from "../services/category";
import { getAuth } from "../stores/slices/authSlice";
import ShoppingCart from "../components/shopping-cart";
import Chat from "../components/Chat";

function HomeLayout({ children }) {
  const { Content } = Layout;
  const [openCart, setOpenCart] = useState(false);
  const onClose = () => {
    setOpenCart(false);
  };
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStorage = useSelector((state) => state.user);

  const userId = userStorage._id;
  useEffect(() => {
    const token = localStorage.getItem("token");
    const client_id = localStorage.getItem("client_id");
    async function getUserData() {
      if (!userId && token && client_id) {
        const data = await dispatch(getAuth()).unwrap();
        if (data) {
          setUser(data.user);
        }
      }
    }
    getUserData();
  }, [dispatch, navigate, userId]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryList] = await Promise.all([getCategoryByParentId("")]);
        setCategories(categoryList.metadata);
      } catch (error) {
       console.error(error);
      }
    }
    fetchData();
  }, []);
  return (
    <Layout>
      <HomeHeader user={user} onOpenCart={() => setOpenCart(true)} />
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
          <Filter categories={categories} />
          {children}
          <Drawer
            // title="Basic Drawer"
            placement="right"
            closable={false}
            onClose={onClose}
            open={openCart}
          >
            <ShoppingCart />
          </Drawer>
          <Chat />
        </Layout>
      </Content>
      <Footer />
    </Layout>
  );
}

export default HomeLayout;
