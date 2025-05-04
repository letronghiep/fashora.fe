"use client";

import { notification } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { registerAuth } from "../stores/slices/authSlice";

// import { RegisterForm } from "~/components/register";
// import { notification } from "antd";
// import { useEffect } from "react";

function Register() {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    try {
      const res = await dispatch(registerAuth(data)).unwrap();
      const { user } = res;
      if (user) {
        const permission = user.usr_role.rol_name;
        // router.replace(decodeURIComponent(redirectTo));
        if (permission === "shop") {
          navigate("/seller");
        } else if (permission === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error,
        showProgress: true,
        placement: "top",
      });
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      // router.replace(decodeURIComponent(redirectTo));
      // history.replaceState();
    }
  }, [isAuthenticated]);
  return <RegisterForm onSubmit={onSubmit} title="" loading={loading} />;
}

export default Register;
