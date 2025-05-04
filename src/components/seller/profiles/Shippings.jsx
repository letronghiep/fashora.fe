
import { LoadingOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createShipping,
  getShipping,
  getShippingDetail,
  updateShipping
} from "~/services/shipping";
// import Modal from "../../Modal";
import { Flex, Modal } from "antd";
import CheckboxCustom from "../../inputs/Checkbox";
import Input from "../../inputs/Input";
import LocationSelect from "../../inputs/LocationSelect";
import Map from '../../Map';
import ShippingItem from "./ShippingItem";

function Shippings({
  shippingData,
  loadingShipping,
//   error,
}) {
//   const REMOVE_TITLE = "Xác nhận xóa địa chỉ này?";
//   const DEFAULT_TITLE = "Đặt địa chỉ làm mặc định?";
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalDefault, setOpenModalDefault] = useState(false);
  const [valueLocation, setValueLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [shippings, setShippings] = useState([]);
  const [isDefault, setIsDefault] = useState(false);
  const [position, setPosition] = useState({
    lat: 10.7627,
    lng: 106.6605,
  });
  const [dataLocation, setDataLocation] = useState();
  const [shippingId, setShippingId] = useState("");
  const [shippingDetail, setShippingDetail] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const dataPosition = useMemo(() => {
    return {
      lat: position.lat,
      lng: position.lng,
    };
  }, [position]);
  const handleOpenModal = () => {
    setOpenModal(!openModal);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleOpenModalRemove = () => {
    setOpenModalDelete(!openModalDelete);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSetDefaultShipping = () => {
    setOpenModalDefault(!openModalDefault);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    criteriaMode: "all",
  });
  useEffect(() => {
    if (shippingData) {
      const data = shippingData.metadata;
      setShippings(data.data);
    }
  }, [shippingData]);
  useEffect(() => {
    if (shippings) {
      const defaultShipping = shippings.find(
        (shipping) => shipping.is_return_address === true
      );
      if (defaultShipping) {
        setIsDefault(true);
      } else {
        setIsDefault(false);
      }
    }
  }, [shippings]);
  const fetchDataShippings = async () => {
    try {
      const res = await getShipping();
      const data = await res.metadata.data;
      setShippings(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataShippings();
  }, [refresh]);
  useEffect(() => {
    async function getDetailShipping() {
      if (shippingId) {
        const shipping = await getShippingDetail(shippingId);
        const data = shipping.metadata.shipping;
        setShippingDetail(data);
      }
    }
    getDetailShipping();
  }, [shippingId]);
  const handleChangeLocation = (location) => {
    const {
      province: newProvince,
      district: newDistrict,
      ward: newWard,
    } = location;
    setValue("city", newProvince ?? "");
    setValue("district", newDistrict ?? "");
    setValue("ward", newWard ?? "");
    setValueLocation(`${newWard}, ${newDistrict}, ${newProvince}`);
  };

  const handleSetValueForm = useCallback(() => {
    if (shippingDetail) {
      const detail_add = shippingDetail.address?.split(",")?.[0] ?? "";
      const geo_info = {
        user_adjusted: false,
        region: {
          lat: 0,
          lng: 0,
        },
      };
      setValue("name", shippingDetail.name ?? "");
      setValue("phone", shippingDetail.phone ?? "");

      setValue("detail_address", detail_add ?? "");
      setValue(
        "is_delivery_address",
        shippingDetail.is_delivery_address ?? false
      );
      setValue("is_return_address", shippingDetail.is_return_address ?? false);
      setValue("geo_info", shippingDetail.geo_info ?? geo_info);
      setValue("city", shippingDetail.city ?? "");
      setValue("district", shippingDetail.district ?? "");
      setValue("ward", shippingDetail.ward ?? "");
    }
  }, [shippingDetail, setValue]);
  useEffect(() => {
    if (shippingDetail) {
      setDataLocation({
        ward: shippingDetail.ward,
        district: shippingDetail.district,
        province: shippingDetail.city,
      });
    }
  }, [shippingDetail]);
  useEffect(() => {
    if (!shippingDetail) {
      setLoading(false);
    }
    if (shippingDetail) handleSetValueForm();
  }, [shippingDetail, handleSetValueForm]);
  const resetFormValues = useCallback(() => {
    setValue("name", "");
    setValue("phone", "");
    setValue("detail_address", "");
    setValue("is_delivery_address", false);
    setValue("is_return_address", false);
    setValue("city", "");
    setValue("district", "");
    setValue("ward", "");
    setValueLocation("");
    setPosition({ lat: 10.7627, lng: 106.6605 });
    setShippingId("");
    setShippingDetail(null);
    setDataLocation({
      ward: "",
      district: "",
      province: "",
    });
  }, [setValue]);
  useEffect(() => {
    if (!openModal) {
      resetFormValues();
    }
  }, [openModal, resetFormValues]);
  const bodyContent = (
    <Flex
      vertical
      style={{
        width: "auto",
        maxHeight: "600px",
        height: "400px",
        overflow: "auto",
        gap: "12px",
      }}
      className="max-h-[600px] h-[400px] overflow-auto flex flex-col gap-y-3 relative"
    >
      <Input
        type="text"
        label="Họ và tên"
        name="name"
        register={register}
        error={errors.name}
        control={control}
      />
      <Input
        type="text"
        label="Số điện thoại"
        name="phone"
        register={register}
        error={errors.phone}
        control={control}
      />
      <LocationSelect
        onApply={handleChangeLocation}
        dataLocation={dataLocation}
        position={position}
        setPosition={setPosition}
      />
      <Input
        type="text"
        label="Địa chỉ cụ thể"
        name="detail_address"
        register={register}
        error={errors.detail_address}
        control={control}
      />
      <Map lat={dataPosition.lat} lng={dataPosition.lng} />
      <div>
        <CheckboxCustom
          name="is_delivery_address"
          control={control}
          label="Đặt làm địa chỉ mặc định"
          disabled={isDefault && !shippingId}
        />
      </div>
    </Flex>
  );
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const location = valueLocation.split(", ");
      const city = location && location[2];
      const district = location && location[1];
      const ward = location && location[0];
      const formData = {
        name: data.name,
        phone: data.phone,
        city,
        district,
        ward,
        address: `${data.detail_address}, ${ward}, ${district}, ${city}, Việt Nam`,
        is_delivery_address: data.is_delivery_address,
        geo_info: {
          user_adjusted: false,
          region: {
            lat: dataPosition.lat,
            lng: dataPosition.lng,
          },
        },
        is_return_address: data.is_delivery_address,
      };
      // Add or update shipping address
      if (shippingId) {
        const res = await updateShipping(shippingId, formData);
        if (res.status === 200) {
          setLoading(false);
          // handleOpenModal();
        }
      } else {
        const res = await createShipping(formData);
        if (res.status === 201) {
          setLoading(false);
          // handleOpenModal();
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
      setRefresh(!refresh);
      handleOpenModal();
    }
  };
  return (
    <div className="bg-white p-6">
      <div
        onClick={handleOpenModal}
        className="flex items-center gap-x-2 py-2 px-3 w-fit bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-150 cursor-pointer"
      >
        <span>+</span>
        <button>Thêm địa chỉ</button>
      </div>
      <Modal
        open={openModal}
        onCancel={handleOpenModal}
        title="Thêm địa chỉ giao hàng"
        onOk={handleSubmit(onSubmit)}
        confirmLoading={loading}
      >
        {bodyContent}
      </Modal>
      {/* dùng modal để hiển thị remove và default */}
      <h3 className="text-2xl font-semibold my-4">Địa chỉ</h3>
      {!loadingShipping && shippings && shippings.length > 0 ? (
        shippings.map((shipping) => (
          <ShippingItem
            setOpenModalRemove={handleOpenModalRemove}
            setOpenModal={handleOpenModal}
            setDefaultShipping={handleSetDefaultShipping}
            key={shipping._id}
            shipping={shipping}
            setShippingId={setShippingId}
          />
        ))
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <LoadingOutlined />
        </div>
      )}
    </div>
  );
}

export default Shippings;
