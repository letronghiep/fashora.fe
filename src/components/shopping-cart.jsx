import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Flex, InputNumber, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useCheckoutMutation,
  useDeleteCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
} from "../apis/cartApis";
import "./shopping-cart.css";
import { validateFormMoney } from "../helpers";

const { Title, Text } = Typography;

function ShoppingCart({ onClose }) {
  const navigate = useNavigate();
  // Queries & Mutations
  const { data, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCart] = useDeleteCartMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const cartItems = data?.metadata?.carts?.cart_products || [];
  const totalAmount = data?.metadata?.totalAmount || 0;
  const totalCart = data?.metadata?.totalCart || 0;
  // Hàm cập nhật số lượng sản phẩm
  const handleQuantityChange = async (id, value) => {
    try {
      await updateCartItem({
        cartItemId: id,
        data: { ...value },
      }).unwrap();
    } catch (error) {
      message.error("Không thể cập nhật số lượng");
    }
  };

  // Hàm tăng số lượng
  const handleIncrement = async (id) => {
    const item = cartItems.find((item) => item.productId === id);
    if (item && item.quantity < 10) {
      await handleQuantityChange(id, [
        {
          shopId: item.shopId,
          item_products: [
            {
              quantity: item.quantity + 1,
              shopId: item.shopId,
              old_quantity: item.quantity,
              productId: item.productId,
              name: item.name,
              price: Number(item.price),
              image: item.image,
              size: item.size,
              color: item.color,
              sku_id: item.sku_id,
            },
          ],
        },
      ]);
    }
  };

  // Hàm giảm số lượng
  const handleDecrement = async (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      await handleQuantityChange(id, [
        {
          shopId: item.shopId,
          item_products: [
            {
              quantity: item.quantity - 1,
              shopId: item.shopId,
              old_quantity: item.quantity,
              productId: item.productId,
              name: item.name,
              price: Number(item.price),
              image: item.image,
              size: item.size,
              color: item.color,
              sku_id: item.sku_id,
            },
          ],
        },
      ]);
    }
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (id) => {
    try {
      await deleteCart(id).unwrap();
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  // Hàm thanh toán
  const handleCheckout = async () => {
    try {
      navigate("/checkout");
      // message.success("Đặt hàng thành công");
      onClose?.();
    } catch (error) {
      message.error("Không thể hoàn tất đơn hàng");
    }
  };

  return (
    <Card
      className="shopping-cart-drawer relative overflow-hidden h-full"
      title={`Giỏ hàng (${totalCart} sản phẩm)`}
      extra={
        <Button type="text" onClick={onClose}>
          ×
        </Button>
      }
    >
      <div className="cart-items space-y-4 h-[500px] overflow-auto ">
        {cartItems.map((item) => (
          <Flex
            key={item.productId}
            align="start"
            className="cart-item"
            gap={16}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover"
            />
            <div className="flex-1">
              <Title level={5} className="m-0 line-clamp-2">
                {item.name}
              </Title>
              <Text className="text-purple-600 font-medium">${item.price}</Text>
              <Text className="block text-gray-600">
                {item.color} / {item.size}
              </Text>
              <Flex align="center" gap={8} className="mt-2">
                <Button
                  size="small"
                  onClick={() => handleDecrement(item.id)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <InputNumber
                  min={1}
                  max={10}
                  value={item.quantity}
                  onChange={(value) =>
                    handleQuantityChange(item.productId, [
                      {
                        shopId: item.shopId,
                        item_products: [
                          {
                            quantity: value,
                            shopId: item.shopId,
                            old_quantity: item.quantity,
                            productId: item.productId,
                          },
                        ],
                      },
                    ])
                  }
                  size="small"
                  className="w-12"
                />
                <Button
                  size="small"
                  onClick={() => handleIncrement(item.productId)}
                  disabled={item.quantity >= 10}
                >
                  +
                </Button>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  className="ml-auto"
                  onClick={() => {
                    handleRemoveItem(item.sku_id);
                  }}
                />
              </Flex>
            </div>
          </Flex>
        ))}
      </div>

      {cartItems.length > 0 ? (
        <div className="absolute bottom-0 w-full">
          <Button
            type="primary"
            block
            className="bg-purple-600"
            onClick={handleCheckout}
            loading={isCheckingOut}
          >
            Đi đến thanh toán - {validateFormMoney(totalAmount)} VND
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <Text className="text-gray-500">Giỏ hàng của bạn đang trống</Text>
        </div>
      )}
    </Card>
  );
}

export default ShoppingCart;
