import { Col, Flex, notification, Row, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Button from "~/components/Button";
import RadioCustom from "~/components/inputs/Radio";
import { checkMaxSizeFile } from "~/helpers";
import useResponsive from "~/hooks/useResponsive";
import { updateUserInfo, uploadUserAvatar } from "~/services/user";
import { useCreateUserMutation } from "../../../apis/usersApi";
import Avatar from "../../Avatar";
import DateSelect from "../../inputs/DateSelect";
import Input from "../../inputs/Input";

export default function Information({ userId }) {
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    control,
  } = useForm({
    criteriaMode: "all",
  });
  const { user } = useSelector((state) => state.user);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const location = useLocation();
  const [dataUser, setDataUser] = useState(null);
  const [tmpAvatar, setTmpAvatar] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const { isMobile } = useResponsive();
  useEffect(() => {
    if (user) setDataUser(user);
  }, [user]);
  const setValueOfFormData = useCallback(() => {
    setValue("userId", dataUser?.usr_id ?? 0);
    setValue("username", dataUser?.usr_name ?? "");
    setValue("userFullName", dataUser?.usr_full_name ?? "");
    setValue("userSex", dataUser?.usr_sex ?? "");
    setValue("userPhone", dataUser?.usr_phone ?? "");
    setValue("password", dataUser.password);
    setValue("userDateOfBirth", dataUser?.usr_date_of_birth ?? new Date());
    setValue("userAvatar", dataUser?.usr_avatar ?? tmpAvatar);
    setValue("userEmail", dataUser?.usr_email ?? "");
  }, [dataUser, setValue, tmpAvatar]);
  useEffect(() => {
    if (dataUser && location.pathname !== "/seller/users/create")
      setValueOfFormData();
  }, [dataUser, setValueOfFormData, location]);
  const handleDateChange = (newDate) => {
    setValue(
      "userDateOfBirth",
      new Date(`${newDate.year}/${newDate.month}/${newDate.day}`)
    );
  };
  const uploadAvatar = async (file) => {
    try {
      setLoadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);
      const data = await uploadUserAvatar(formData);
      if (data) {
        setValue("userAvatar", data.metadata.image_url);
        setLoadingAvatar(false);
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Tải ảnh thất bại",
        type: "error",
      });
      setLoadingAvatar(false);
    }
  };
  const handleChangeImage = (e) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      const checkSize = checkMaxSizeFile(file);
      if (checkSize) {
        const url = URL.createObjectURL(file);
        setTmpAvatar(url);
        uploadAvatar(file);
      } else {
        notification.warning({
          message: "Kích thước ảnh phải nhỏ hơn hoặc bằng 1MB",
          type: "warning",
        });
      }
    }
  };
  const handleSubmitInfo = async (data) => {
    const dataUpdateUser = {
      usr_id: data?.userId,
      usr_name: data.username,
      usr_full_name: data.userFullName,
      usr_sex: data.userSex,
      usr_phone: data.userPhone,
      usr_date_of_birth: new Date(data.userDateOfBirth),
      usr_avatar: data.userAvatar,
      usr_email: data.userEmail,
    };
    if (userId) {
      await updateUserInfo(userId, dataUpdateUser);
      notification.success({
        message: "Cập nhật thông tin thành công",
        type: "success",
        showProgress: true,
        onClose: () => {
          window.location.reload();
        },
      });
    } else {
      dataUpdateUser.usr_password = data.password;
      const response = await createUser(dataUpdateUser);
      if (response?.data && response.data.status === 201) {
        notification.success({
          message: "Tạo người dùng thành công",
          type: "success",
          showProgress: true,
          onClose: () => {
            window.location.reload();
          },
        });
      }
      if (response.error) {
        notification.error({
          message: "Xảy ra lỗi",
          type: "error",
          showProgress: true,
          onClose: () => {
            window.location.reload();
          },
        });
      }
    }
  };

  return (
    <Flex
      vertical
      justify="flex-start"
      style={{
        width: "100%",
      }}
    >
      <Row
        style={{
          padding: "24px",
          width: "100%",
        }}
      >
        <Col
          span={16}
          style={{
            order: isMobile ? 2 : 1,
          }}
        >
          <Typography.Title level={4} className="text-xl font-bold ">
            Thông tin cơ bản
          </Typography.Title>
          <Flex gap={10} vertical style={{ width: "80%" }}>
            {userId && (
              <Input
                type="text"
                label="Mã người dùng"
                name="userId"
                register={register}
                error={errors.userId}
                control={control}
              />
            )}
            <Input
              type="text"
              label="Tên đăng nhập"
              name="username"
              register={register}
              error={errors.username}
              control={control}
            />
            <Input
              type="text"
              label="Họ và tên"
              name="userFullName"
              register={register}
              error={errors.userFullName}
              control={control}
            />
            <Input
              type="email"
              label="Email"
              name="userEmail"
              register={register}
              error={errors.userEmail}
              control={control}
            />
            <Input
              type="text"
              label="Số điện thoại"
              name="userPhone"
              register={register}
              error={errors.userPhone}
              control={control}
            />
            {!userId && (
              <Input
                type="password"
                label="Mật khẩu"
                name="password"
                register={register}
                error={errors.password}
                control={control}
              />
            )}
            <DateSelect
              onApply={handleDateChange}
              dataDate={dataUser?.usr_date_of_birth}
            />
            <RadioCustom
              name="userSex"
              data={["Nam", "Nữ"]}
              control={control}
            />
          </Flex>
        </Col>
        <Col
          span={8}
          style={{
            order: isMobile ? 1 : 2,
          }}
        >
          <Avatar
            src={dataUser?.usr_avatar || tmpAvatar}
            alt="avatar"
            handleChangeImage={handleChangeImage}
            register={register}
            name="userAvatar"
            loading={loadingAvatar}
          />
        </Col>
      </Row>
      <Button
        size="sm"
        variant="primary"
        type="submit"
        loading={isLoading}
        className="w-fit border ml-6 mb-6 border-blue-500 hover:border-none hover:bg-blue-500 text-black hover:text-white hover:highlight-white  py-2 px-4 rounded cursor-pointer text-black"
        onClick={handleSubmit(handleSubmitInfo)}
      >
        {userId ? "Cập nhật" : "Tạo người dùng"}
      </Button>
    </Flex>
  );
}
