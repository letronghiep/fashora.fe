import axios from "axios";
// import { isTokenExpired } from "../helpers/isTokenExpired";

const baseURL = import.meta.env.VITE_SERVER_URL;

// Tạo instance Axios
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Hàm lấy token và client_id từ localStorage
const getTokenAndClientId = () => {
  const token = localStorage.getItem("token");
  const client_id = localStorage.getItem("client_id");
  return { token, client_id };
};

// Hàm lưu token và client_id vào localStorage
// const setTokenAndClientId = (token, client_id) => {
//   localStorage.setItem("token", token);
//   localStorage.setItem("client_id", client_id);
// };

// Hàm xử lý khi refresh token thất bại
// const handleRefreshFailure = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("client_id");
//   window.location.href = "/login";
// };

// Interceptor thêm Authorization và x-client-id vào headers
axiosInstance.interceptors.request.use(async (config) => {
  const { token, client_id } = getTokenAndClientId();
  // if (token && isTokenExpired(token)) {
  //   const response = await axios.post(
  //     `${baseURL}/auth/refreshToken`,
  //     {},
  //     { withCredentials: true }
  //   );
  //   const newAccessToken = response.data.tokens.accessToken;
  //   const newClientId = response.data.user._id;

  //   setTokenAndClientId(newAccessToken, newClientId);
  // }
  if (token && client_id) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["x-client-id"] = client_id;
  } else {
    delete config.headers["Authorization"];
    delete config.headers["x-client-id"];
  }

  // Tự động loại bỏ Content-Type nếu đang dùng FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Interceptor xử lý lỗi và tự động refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      return Promise.reject(error.response);
    }

    return Promise.reject(error);
  }
);
