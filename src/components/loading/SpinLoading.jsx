import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const SpinLoading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spin indicator={<LoadingOutlined spin />} size="large" />
  </div>
);

export default SpinLoading;
