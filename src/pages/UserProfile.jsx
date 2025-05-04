import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, Input, Button, message, Avatar, Row, Col, Typography, Divider, Spin } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "../stores/slices/authSlice";
import { useUpdateUserMutation } from "../apis/usersApi";
import LocationSelect from "../components/inputs/LocationSelect";
import DateSelect from "../components/inputs/DateSelect";
import RadioCustom from "../components/inputs/Radio";

const { Title, Text } = Typography;

const defaultValues = {
  usr_name: "",
  usr_email: "",
  usr_phone: "",
  usr_address: "",
  usr_sex: "",
  usr_date_of_birth: null,
  usr_city: "",
  usr_district: "",
  usr_ward: "",
};

const UserProfile = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [updateUser] = useUpdateUserMutation();
  const [position, setPosition] = useState({ lat: 10.7627, lng: 106.6605 }); // Default position (HCMC)

  const { handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: user || defaultValues,
  });

  // Watch for changes in location fields
  const city = watch("usr_city");
  const district = watch("usr_district");
  const ward = watch("usr_ward");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await dispatch(getAuth()).unwrap();
        if (result.user) {
          // Format date for DateSelect
          const userData = {
            ...result.user,
            usr_date_of_birth: result.user.usr_date_of_birth ? new Date(result.user.usr_date_of_birth) : null
          };
          reset(userData);

          // Set position if available in user data
          if (userData.geo_info?.region) {
            setPosition({
              lat: userData.geo_info.region.lat || 10.7627,
              lng: userData.geo_info.region.lng || 106.6605
            });
          }
        }
      } catch (error) {
        console.error('Không thể lấy dữ liệu:', error);
        message.error("Không thể lấy thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, reset]);

  const handleEdit = () => {
    setEditing(true);
    reset(user);
  };

  const handleCancel = () => {
    setEditing(false);
    reset(user);
  };

  const handleDateChange = (newDate) => {
    const date = new Date(`${newDate.year}/${newDate.month}/${newDate.day}`);
    setValue("usr_date_of_birth", date);
  };

  const handleLocationChange = (location) => {
    console.log("Location changed:", location);
    setValue("usr_city", location.province);
    setValue("usr_district", location.district);
    setValue("usr_ward", location.ward);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateUser({ 
        userId: user._id, 
        data: {
          usr_name: data.usr_name,
          usr_email: data.usr_email,
          usr_phone: data.usr_phone,
          usr_address: data.usr_address,
          usr_sex: data.usr_sex,
          usr_date_of_birth: data.usr_date_of_birth,
          usr_city: data.usr_city,
          usr_district: data.usr_district,
          usr_ward: data.usr_ward,
          geo_info: {
            user_adjusted: false,
            region: position
          }
        }
      }).unwrap();
      
      // Refresh user data
      await dispatch(getAuth()).unwrap();
      
      setEditing(false);
      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật thông tin!");
      console.error('Lỗi khi cập nhật:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const locationData = {
    province: city,
    district: district,
    ward: ward
  };

  console.log("Current location data:", locationData);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <Avatar size={100} icon={<UserOutlined />} className="mb-4" />
            <Title level={2}>{user?.usr_name || 'Chưa có tên'}</Title>
            <Text type="secondary">{user?.usr_email || 'Chưa có email'}</Text>
          </div>

          <Divider />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text strong className="block mb-2">Họ và tên</Text>
                  <Controller
                    name="usr_name"
                    control={control}
                    rules={{ required: "Vui lòng nhập họ tên!" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input 
                          {...field} 
                          disabled={!editing}
                          prefix={<UserOutlined />}
                          className="rounded-lg"
                          placeholder="Nhập họ và tên"
                        />
                        {fieldState.error && (
                          <Text type="danger" className="mt-1 block">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text strong className="block mb-2">Email</Text>
                  <Controller
                    name="usr_email"
                    control={control}
                    rules={{
                      required: "Vui lòng nhập email!",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email không hợp lệ!",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input 
                          {...field} 
                          disabled={!editing}
                          className="rounded-lg"
                          placeholder="Nhập email"
                        />
                        {fieldState.error && (
                          <Text type="danger" className="mt-1 block">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text strong className="block mb-2">Số điện thoại</Text>
                  <Controller
                    name="usr_phone"
                    control={control}
                    rules={{ required: "Vui lòng nhập số điện thoại!" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input 
                          {...field} 
                          disabled={!editing}
                          className="rounded-lg"
                          placeholder="Nhập số điện thoại"
                        />
                        {fieldState.error && (
                          <Text type="danger" className="mt-1 block">
                            {fieldState.error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text strong className="block mb-2">Giới tính</Text>
                  <Controller
                    name="usr_sex"
                    control={control}
                    render={({ field }) => (
                      <RadioCustom
                        {...field}
                        disabled={!editing}
                        data={["Nam", "Nữ"]}
                        control={control}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col xs={24}>
                <div className="mb-4">
                  <Text strong className="block mb-2">Ngày sinh</Text>
                  <Controller
                    name="usr_date_of_birth"
                    control={control}
                    render={({ field }) => (
                      <DateSelect
                        disabled={!editing}
                        onApply={handleDateChange}
                        dataDate={field.value}
                      />
                    )}
                  />
                </div>
              </Col>

              <Col xs={24}>
                <div className="mb-4">
                  <Text strong className="block mb-2">Địa chỉ</Text>
                  <Controller
                    name="usr_address"
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        disabled={!editing}
                        className="rounded-lg mb-4"
                        placeholder="Nhập địa chỉ chi tiết"
                      />
                    )}
                  />
                  <LocationSelect
                    disabled={!editing}
                    onApply={handleLocationChange}
                    dataLocation={locationData}
                    setPosition={setPosition}
                    position={position}
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end mt-6">
              {!editing ? (
                <Button 
                  type="primary" 
                  onClick={handleEdit}
                  icon={<EditOutlined />}
                  size="large"
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="space-x-4">
                  <Button 
                    onClick={handleCancel}
                    icon={<CloseOutlined />}
                    size="large"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={loading}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
