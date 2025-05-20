import { useNavigate, useParams } from "react-router-dom";
import {
  useGetDiscountByIdQuery,
  useUpdateVoucherMutation,
} from "../../../apis/vouchersApi";
import VoucherForm from "../../../components/form/voucher-form";
import { useForm } from "react-hook-form";
import { Typography, notification } from "antd";
function EditVoucher() {
  const { voucherId } = useParams();
  const { handleSubmit, setValue, register, control, reset } = useForm({
    criteriaMode: "all",
  });
  const [updateVoucher, { isLoading: isCreating }] = useUpdateVoucherMutation();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const result_data = {
        ...data,
        discount_start_date: data.range[0],
        discount_end_date: data.range[1],
        discount_applies_to: "all",
      };
      const res = await updateVoucher({
        voucherId: voucherId,
        data: result_data,
      }).unwrap();
      if (res.status === 200) {
        notification.success({
          message: "Cập nhật thành công thành công",
          showProgress: true,
          placement: "topRight",
          onClose: () => {
            const redirect = new URLSearchParams(window.location.search).get("redirect");
            if (redirect) {
              const path = redirect.replace(/^https?:\/\/[^/]+/, '');
              navigate(path);
            } else {
              navigate("/seller");
            }
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { data } = useGetDiscountByIdQuery(voucherId);

  return (
    <div className="w-[90%] relative bg-white p-4">
      <Typography.Title level={3}>Chỉnh sửa mã giảm giá</Typography.Title>
      <div className="w-[50%] mx-auto">
        <VoucherForm
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          setValue={setValue}
          // loadingSubmit={isCreating}
          register={register}
          voucher={data?.metadata}
        />
      </div>
    </div>
  );
}

export default EditVoucher;
