"use client";
import useResponsive from "~/hooks/useResponsive";
import { Flex, Space, Typography } from "antd";
function Avatar({
  src,
  alt,
  register,
  name,
  loading,
  handleChangeImage,
}) {
  const { isMobile } = useResponsive();
  return (
    <Flex vertical align="center" gap={10}>
      <Flex
        vertical
        style={{
          position: "relative",
          height: isMobile ? "80px" : "120px",
          width: isMobile ? "80px" : "120px",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
          display: "flex",
        }}
      >
        {loading && (
          <Space className="absolute top-0 left-0 w-full h-full bg-gray-200" />
        )}
        {src ? (
          <img
            src={src}
            alt={alt}
            sizes="100%"
            className="rounded-full object-cover"
          />
        ) : (
          <img
            src="/no-avatar.webp"
            alt="no avatar"
            sizes="100%"
            className="object-cover"
          />
        )}
      </Flex>
      <label
        htmlFor="avatar"
        className="border-2 border-blue-400 text-blue-400 font-semibold text-sm  w-[80px]  lg:w-[120px] px-4 py-1 text-center rounded-full border-separate cursor-pointer hover:text-white hover:bg-blue-400 hover:border-none transition-colors duration-300 ease-linear focus:outline-none"
      >
        <input
          id="avatar"
          className="hidden"
          type="file"
          {...(register && register(name))}
          onChange={handleChangeImage}
        />
        Chọn ảnh
      </label>
      <Typography.Title level={5} style={{
        color: '#9ca3af',
        fontSize:'12px',
        fontStyle:'italic'
      }}>
        Dụng lượng file tối đa 1 MB
      </Typography.Title>
    </Flex>
  );
}

export default Avatar;
