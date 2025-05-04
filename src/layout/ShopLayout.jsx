import { Layout, theme } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShopHeader } from "~/components/header";
import Sidebar from "~/components/seller/Sidebar";
import SpinLoading from "../components/loading/SpinLoading";
import { apiOrigin } from "../constants";
import { axiosInstance } from "../core/axiosInstance";
import withRoleCheck from "../hoc/WithRoleCheck";
import { getAuth } from "../stores/slices/authSlice";

function ShopLayout({ children }) {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStorage = useSelector((state) => state.user);
  useEffect(() => {
    document.title = "Dashboard";
  }, []);
  const userId = userStorage._id;
  useEffect(() => {
    async function getRefreshToken() {
      try {
        await axiosInstance.get(`${apiOrigin}/auth/refresh-token`);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("client_id");
        window.location.href = "/login";
        console.log(error);
      }
    }
    getRefreshToken();
  }, []);
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
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  if (!user) return <SpinLoading />;
  return (
    <Layout>
      <ShopHeader user={user} />
      <Content
        style={{
          maxWidth: "1500px",
          margin: "auto",
          width: "100%",
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
          <Sidebar />
          <Content
            className="site-layout-background"
            style={{
              margin: "0 auto",
              height: "inherit",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default withRoleCheck(ShopLayout, ["shop"]);
