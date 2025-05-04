import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Radio,
  Select,
  Typography,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetCartQuery } from "../apis/cartApis";
import { useGetDiscountsQuery } from "../apis/vouchersApi";
import InputCustom from "../components/inputs/Input";
import LocationSelect from "../components/inputs/LocationSelect";
import SpinLoading from "../components/loading/SpinLoading";
import {
  useCheckoutMutation,
  useCreateCheckoutOnlineMutation,
  useReviewOrderMutation,
} from "../apis/ordersApi";
import { validateFormMoney } from "../helpers";

const { Title, Text } = Typography;
const { TextArea } = Input;


function CheckoutPage() {
  const [checkout_order, setCheckout_order] = useState();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [productCarts, setProductCarts] = useState();
  const [discountCode, setDiscountCode] = useState("");
  const [shopOrderIds, setShopOrderIds] = useState([]);
  const { data, isLoading } = useGetCartQuery();
  const { data: vouchersData } = useGetDiscountsQuery({
    q: "",
    discount_status: "active",
  });
  const [reviewOrder] = useReviewOrderMutation();
  const [checkout] = useCheckoutMutation();
  const [createCheckoutOnline] = useCreateCheckoutOnlineMutation();
  useEffect(() => {
    const handleReviewOrder = async () => {
      try {
        if (data && data.metadata) {
          const response = await reviewOrder({
            cartId: data?.metadata?.carts?._id,
            userId: data?.metadata?.carts?.cart_userId,
            shop_order_ids: data?.metadata?.carts?.cart_products,
            discount_code: discountCode,
            payment_method: paymentMethod,
          });

          if (response && response.data.status === 200) {
            setCheckout_order(response.data?.metadata.checkout_order);
            setShopOrderIds(response.data?.metadata?.shop_order_ids);
          }
          if (response && response.error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi gọi API:", response.error);
          }
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    handleReviewOrder();
  }, [data, data?.metadata?.carts, reviewOrder, paymentMethod, discountCode]);
  useEffect(() => {
    if (data && data.metadata) {
      setProductCarts(data?.metadata?.cart_products);
    }
  }, [data]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      shop_order_ids: [],
      cartId: "",
      userId: "",
      user_address: "",
      user_payment: {
        paymentMethod: "",
        paymentGateway: "",
        paymentToken: "",
      },
    },
    mode: "onChange",
  });
  const [dataLocation, setDataLocation] = useState();
  const [position, setPosition] = useState({
    city: "",
    district: "",
    ward: "",
  });

  useEffect(() => {
    if (paymentMethod) {
      setValue("user_payment.paymentMethod", paymentMethod);
    }
  }, [paymentMethod, setValue]);
  const totalCart = data?.metadata?.totalCart || [];
  const cartItems = data?.metadata?.carts?.cart_products || [];
  const subtotal = data?.metadata?.cart_total_price || 0;
  const shipping = 0;
  const points = 0;
  const total = subtotal + shipping - points;
  const { user } = useSelector((state) => state.user);
  const handleApplyDiscount = async () => {
    try {
      // await applyVoucher(discountCode);
      if (discountCode) {
        const response = await reviewOrder({
          cartId: data?.metadata?.carts?._id,
          userId: data?.metadata?.carts?.cart_userId,
          shop_order_ids: data?.metadata?.carts?.cart_products,
          discount_code: discountCode,
          payment_method: paymentMethod,
        });
        if (response.data?.status === 200) {
          setCheckout_order(response.data?.metadata.checkout_order);
          setShopOrderIds(response.data?.metadata?.shop_order_ids);
        } else {
          message.error(response.error?.data?.message);
        }
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
    }
  };

  const handleChangeLocation = (data) => {
    setDataLocation(data);
    setPosition({
      city: data.city,
      district: data.district,
      ward: data.ward,
    });
    setValue("city", data.city);
  };

  useEffect(() => {
    if (user) {
      setDataLocation({
        ward: user.usr_ward,
        district: user.usr_district,
        province: user.usr_city,
      });
      setValue("user_address", user.usr_address);
      setValue("userId", user._id);
      setValue("shop_order_ids", shopOrderIds);
      setValue("cartId", data?.metadata?.carts?._id);
      setValue("address", user.usr_address);
      setValue("fullName", user.usr_full_name);
      setValue("email", user.usr_email);
      setValue("phone", user.usr_phone);
      setValue("city", user.usr_city);
      setValue("district", user.usr_district);
      setValue("ward", user.usr_ward);
    }
  }, [user, setValue, shopOrderIds, data?.metadata?.carts]);

  const onSubmit = async (dataSubmit) => {
    try {
      if (paymentMethod === "COD") {
        const data = await checkout({
          ...dataSubmit,
          discount_code: discountCode,
        });
        if (data.data.status === 200) {
          notification.success({
            message: "Đặt hàng thành công!",
            description: "Đơn hàng của bạn đã được đặt thành công.",
            placement: "topRight",
            duration: 3,
            showProgress: true,
            onClose: () => {
              window.location.href = '/';
            },
          });
        }
      } else {
        const data = await createCheckoutOnline({
          ...dataSubmit,
          discount_code: discountCode,
        });
        console.log(data);
        if (data.data.status === 200) {
          notification.success({
            message: "Đặt hàng thành công!",
            description: "Đơn hàng của bạn đã được đặt thành công.",
          });
          window.location.href = data.data.metadata.order_url;
          // window.open(data.data.metadata.order_url, '_blank');
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt hàng!");
      console.log(error);
    }
  };

  if (isLoading) {
    return <SpinLoading />;
  }
  if (productCarts && productCarts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <svg
            className="w-20 h-20 mx-auto mb-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-4">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-500 mb-8">
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </p>
          <Link to="/">
            <Button
              type="primary"
              size="large"
              className="bg-black hover:!bg-white hover:!text-black hover:!border-black"
            >
              Quay về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Cột trái */}
          <div className="md:col-span-7 flex gap-x-4">
            <div className="mb-8 flex-1">
              <div className="mb-8">
                <img src="/logo-l.png" alt="Logo" className="h-36" />
              </div>
              <Title level={4} className="mb-4">
                Thông Tin Giao Hàng
              </Title>
              <form
                className="flex flex-col gap-y-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="form-group">
                  <InputCustom
                    control={control}
                    name="fullName"
                    placeholder="Hiệp Lê"
                    error={errors.fullName?.message}
                    rules={{ required: "Vui lòng nhập họ tên" }}
                  />
                </div>

                <div className="form-group">
                  <InputCustom
                    control={control}
                    name="email"
                    placeholder="lehiep269@gmail.com"
                    error={errors.email?.message}
                    rules={{
                      required: "Vui lòng nhập email",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ",
                      },
                    }}
                  />
                </div>

                <div className="form-group">
                  <InputCustom
                    control={control}
                    name="phone"
                    placeholder="Số điện thoại"
                    error={errors.phone?.message}
                    rules={{
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    }}
                  />
                </div>

                <div className="form-group">
                  <InputCustom
                    control={control}
                    name="address"
                    placeholder="Địa chỉ"
                    error={errors.address?.message}
                    rules={{ required: "Vui lòng nhập địa chỉ" }}
                  />
                </div>

                <div className="form-group">
                  <LocationSelect
                    onApply={handleChangeLocation}
                    dataLocation={dataLocation}
                    position={position}
                    setPosition={setPosition}
                  />
                </div>

                <div className="form-group">
                  <Controller
                    control={control}
                    name="note"
                    render={({ field }) => (
                      <Form.Item name="note">
                        <TextArea rows={4} placeholder="Ghi chú" {...field} />
                      </Form.Item>
                    )}
                  />
                </div>
              </form>
            </div>

            <div className="flex-1">
              <Title level={4} className="mb-4">
                Phương Thức Thanh Toán
              </Title>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                className="w-full"
              >
                <div className="border rounded-md p-4 mb-3 cursor-pointer hover:border-gray-400">
                  <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                </div>
                <div className="border rounded-md p-4 cursor-pointer hover:border-gray-400">
                  <Radio value="BANK">Thanh toán với tài khoản ngân hàng</Radio>
                </div>
              </Radio.Group>

              {/* {paymentMethod === "BANK" && (
                <div className="mt-4">
                  <div className="text-red-500 font-medium mb-2">
                    QUÝ KHÁCH MUA HÀNG CÓ THỂ CHUYỂN KHOẢN VÀO TÀI KHOẢN SAU:
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-red-500">Tên tài khoản: </span>
                      <span className="text-red-500">Đỗ Bích Ngọc</span>
                    </div>
                    <div>
                      <span>Số tài khoản: </span>
                      <span>16525111</span>
                    </div>
                    <div>
                      <span>Ngân hàng: </span>
                      <span>TMCP Á Châu (ACB)</span>
                    </div>
                    <div>
                      <span>Nội dung: </span>
                      <span>Họ tên + SĐT đặt hàng</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    Quý khách chuyển khoản thành công vui lòng thêm nội dung ở
                    phần Ghi chú đơn hàng:{" "}
                    <span className="font-bold">ĐÃ THANH TOÁN CK</span>
                  </div>
                  <div className="mt-4 border p-4">
                    <div className="bg-[#0072bc] text-white text-center py-2 mb-4">
                      TKTT FIRST KHTN (CN) VND
                    </div>
                    <div className="flex justify-center mb-4">
                      <img src="/vietqr-acb.png" alt="VietQR" className="h-8" />
                    </div>
                    <div className="flex justify-center mb-4">
                      <img src="/qr-code.png" alt="QR Code" className="w-48" />
                    </div>
                    <div className="text-center">
                      <div className="flex justify-between px-8 text-sm">
                        <span className="text-gray-500">Số tài khoản</span>
                        <span>16525111</span>
                      </div>
                      <div className="flex justify-between px-8 text-sm">
                        <span className="text-gray-500">Tên chủ tài khoản</span>
                        <span>DO BICH NGOC</span>
                      </div>
                      <div className="flex justify-between px-8 text-sm">
                        <span className="text-gray-500">Tên ngân hàng</span>
                        <span>ACB</span>
                      </div>
                      <div className="flex justify-between px-8 text-sm">
                        <span className="text-gray-500">Chi nhánh</span>
                        <span>ACB - CN THANG LONG</span>
                      </div>
                      <div className="flex justify-between px-8 text-sm">
                        <span className="text-gray-500">Swift Code</span>
                        <span>ASCBVNVX</span>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* Cột phải */}
          <div className="md:col-span-5">
            <Card className="bg-gray-50">
              <Title level={4} className="mb-4">
                Đơn Hàng ({totalCart} sản phẩm)
              </Title>

              <div className="space-y-4 mb-6 h-[270px] overflow-auto">
                {cartItems.map((item, index) => (
                  <Flex
                    key={item.productId}
                    align="start"
                    gap={12}
                    className="border-b pb-4"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Text className="block font-medium">{item.name}</Text>
                      <Text className="block text-gray-500 text-sm">
                        {item.color} / {item.size}
                      </Text>
                      <Flex
                        justify="space-between"
                        align="center"
                        className="mt-2"
                      >
                        <Text className="text-red-500">
                          {item.price.toLocaleString()}₫
                        </Text>
                      </Flex>
                    </div>
                  </Flex>
                ))}
              </div>

              {/* Mã giảm giá */}
              <div className="mb-6">
                <Input.Group compact>
                  {/* <Input
                    style={{ width: "calc(100% - 100px)" }}
                    placeholder="Mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  /> */}
                  <Select
                    onChange={(value) => setDiscountCode(value)}
                    placeholder="Mã giảm giá"
                    style={{ width: "calc(100% - 200px)" }}
                    // options={vouchersData?.metadata.data.map((item) => ({
                    //   label: item.discount_code,
                    //   value: item.discount_code,
                    // }))}
                  >
                    {vouchersData?.metadata.data.map((item) => (
                      <Select.Option
                        key={item.discount_code}
                        value={item.discount_code}
                      >
                        <span>{item.discount_code}</span>
                        <span className="text-neutral-500 italic text-xs ml-2">
                          (-
                          {item.discount_type === "fixed_amount"
                            ? validateFormMoney(item.discount_value)
                            : item.discount_value}
                          {item.discount_type === "fixed_amount" ? "VND" : "%"})
                        </span>
                        {/* )} */}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button
                    onClick={handleApplyDiscount}
                    className="hover:!border-black hover:!outline-black hover:bg-white hover:!text-black bg-black rounded-sm text-white"
                  >
                    Sử dụng
                  </Button>
                </Input.Group>
              </div>

              {/* Chi tiết thanh toán */}
              <div className="space-y-2 mb-6">
                <Flex justify="space-between">
                  <Text>Tạm tính:</Text>
                  <Text>{checkout_order?.totalPrice.toLocaleString()}₫</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Phí vận chuyển:</Text>
                  <Text>
                    {(checkout_order && checkout_order?.feeShip === 0) ||
                    !checkout_order?.feeShip
                      ? "0 ₫"
                      : checkout_order?.feeShip.toLocaleString() + "₫"}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Điểm tích lũy:</Text>
                  <Text>{points} ₫</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Mã giảm giá:</Text>
                  <Text>{checkout_order?.totalDiscount} ₫</Text>
                </Flex>
                <div className="mt-4">
                  <Flex justify="space-between">
                    <Text strong>Tổng cộng:</Text>
                    <Text strong className="text-xl">
                      {checkout_order?.totalCheckout > 0
                        ? checkout_order?.totalCheckout.toLocaleString()
                        : checkout_order?.totalPrice.toLocaleString()}
                      ₫
                    </Text>
                  </Flex>
                </div>
              </div>

              {total > 0 && (
                <Text className="block text-green-500 text-center mb-4">
                  Đơn hàng của bạn sẽ được FREE SHIP
                </Text>
              )}

              <Flex gap={8} align="center">
                <Link to="/cart" className="flex-1 rounded-sm">
                  {/* <Button block className="rounded-sm p-4"> */}← Giỏ hàng
                  {/* </Button> */}
                </Link>
                <Button
                  type="primary"
                  block
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1 py-6 hover:!border-black hover:!outline-black hover:!bg-white hover:!text-black bg-black rounded-sm text-white"
                >
                  Hoàn tất đơn hàng
                </Button>
              </Flex>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
