
import { EditOutlined } from "@ant-design/icons";
import Button from "~/components/Button";
import Anticon from "../../Anticon";

function ShippingItem({
  shipping,
  setOpenModal,
  setShippingId,
  setOpenModalRemove,
  setDefaultShipping
}) {
  const { name, phone, address, is_delivery_address, is_return_address, _id } =
    shipping;
  const handleClickEdit = () => {
    if (_id) {
      setShippingId(_id);
      setOpenModal();
    }
  };

  const handleClickRemove = () => {
    if (_id) {
      setShippingId(_id);
      setOpenModalRemove();
    }
  };
  const handleClickSetDefault =  () => {
    if (_id) {
      setShippingId(_id);
      setDefaultShipping();
    }
  };
  return (
    <div className="py-4 border-b border-b-gray-300 flex justify-between">
      <div>
        <div className="flex items-center gap-x-3">
          <p className="border-r border-r-gray-400 pr-3">{name}</p>
          <p className="text-gray-400">{phone}</p>
        </div>
        <p className="text-neutral-600">{address}</p>
        {is_delivery_address && (
          <div className="flex items-center gap-x-3 my-2">
            <Button
              size="xs"
              variant="default"
              className={`${
                is_delivery_address
                  ? "border border-blue-500 text-blue-400 cursor-not-allowed bg-gray-200"
                  : ""
              } `}
              disabled={is_delivery_address}
            >
              Mặc định
            </Button>
            <Button
              size="xs"
              variant="default"
              className={`${
                is_delivery_address
                  ? "border-gray-500 text-gray-400 cursor-not-allowed bg-gray-200"
                  : ""
              } `}
              disabled={is_delivery_address}
            >
              Địa chỉ nhận hàng
            </Button>
            <Button
              size="xs"
              variant="default"
              className={`${
                is_delivery_address
                  ? "border-gray-500 text-gray-400 cursor-not-allowed bg-gray-200"
                  : ""
              } `}
              disabled={is_delivery_address}
            >
              Địa chỉ giao hàng
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center flex-col justify-center gap-y-2">
        <div className="flex items-center gap-x-2">
          <Anticon
            label="Cập nhật"
            Icon={EditOutlined}
            onClick={handleClickEdit}
          />
          {!is_return_address && (
            <Anticon
              
            />
          )}
        </div>
        {!is_return_address && (
          <div>
            <Button onClick={handleClickSetDefault} size="xs" variant="default">
              Thiết lập mặc định
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShippingItem;
