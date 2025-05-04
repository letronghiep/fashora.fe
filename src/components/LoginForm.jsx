import Input from "~/components/inputs/Input";
import useResponsive from "~/hooks/useResponsive";
import { FacebookFilled, GoogleOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Typography } from "antd";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import SpinLoading from "./loading/SpinLoading";
import { SignInSchema } from "../schema/SignInSchema";
import Button from "./Button";
// import { useAuth } from "../AuthProvider";

function LoginForm({ title, onSubmit, loading }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignInSchema),
  });
  const { Link } = Typography;
  const { isMobile } = useResponsive();
  return (
    <div
      className=""
      style={{
        backgroundImage: 'url("/bg-img.png")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
        display: "flex",
      }}
    >
      <div className="fixed top-0 right-0 left-0 bottom-0 h-full bg-neutral-800/60" />
      {loading && (
        <div className="fixed top-0 right-0 left-0 bottom-0 h-full bg-neutral-800/30 z-[9999]">
          <SpinLoading />
        </div>
      )}
      <div className="flex items-center justify-between w-full">
        <div className="z-[1000] text-left hidden md:flex md:flex-col justify-center text-white mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div>
              <div className="flex items-center gap-x-2 mb-[60px]">
                {/* <img
                  alt="Logo"
                  src="/logo-white.svg"
                  width={250}
                  height={250}
                /> */}
                <Typography.Title style={{
                  color: "#fff",
                  fontSize: "40px",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  textTransform: "uppercase",
                  letterSpacing: "10px",
                }} level={1} className="text-white font-bold z-[1000]">Fashora</Typography.Title>
              </div>
            </div>
            <p className="max-w-[350px]">{title}</p>
          </motion.div>
        </div>
        <motion.div
          initial={{
            x: isMobile ? "0%" : "100%",
            opacity: isMobile ? 1 : 0,
          }}
          animate={{
            x: "0%",
            opacity: 1,
          }}
          transition={{
            duration: 1.5,
          }}
          className="p-6 rounded-lg shadow shadow-neutral-500 md:w-[400px] bg-white my-auto z-[1000] mx-auto w-[90%]"
        >
          <div>
            <h2 className="text-xl font-semibold mb-5">Đăng nhập</h2>
            <form
              className="flex flex-col gap-y-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                type="text"
                label="Tài khoản"
                name="username"
                register={register}
                error={errors.username}
                control={control}
                placeholder="Tài khoản"
              />
              <Input
                type="password"
                label="Mật khẩu"
                name="password"
                register={register}
                placeholder="Mật khẩu"
                error={errors.password}
                control={control}
              />

              <div className="flex items-center justify-between text-sm">
                <Checkbox>Ghi nhớ mật khẩu</Checkbox>
                <Link
                  className="text-blue-500 hover:underline"
                  href="/forgot-password"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Button
                size="md"
                className="text-center justify-center items-center"
                variant="default"
                type="submit"
              >
                Đăng nhập
              </Button>
              <div className="my-3 flex flex-col items-center justify-center">
                <div className="flex justify-between text-sm gap-x-2 items-center relative w-full text-center">
                  <div className="w-full h-[0.5px] bg-neutral-800/50" />
                  <p className="text-neutral-500">HOẶC</p>
                  <div className="w-full h-[.5px] bg-neutral-800/50" />
                </div>
                <div className="flex item-center gap-x-2 my-6 w-full">
                  <Button
                    size="md"
                    className="gap-x-3 items-center text-[14px] w-full justify-evenly"
                    variant="danger"
                    onClick={() => {}}
                    leftIcon={<GoogleOutlined />}
                  >
                    Google
                  </Button>
                  <Button
                    size="md"
                    className="gap-x-3 items-center text-[14px] w-full justify-evenly"
                    variant="primary"
                    onClick={() => {}}
                    leftIcon={<FacebookFilled />}
                  >
                    Facebook
                  </Button>
                </div>
                <p className="text-sm text-neutral-800">
                  Bạn mới biết đến cửa hàng?
                  <Link
                    className="text-blue-500 hover:underline ml-2 "
                    href={`/register`}
                  >
                    Đăng ký
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm;
