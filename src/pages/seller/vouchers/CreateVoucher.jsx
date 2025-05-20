import { notification, Typography } from "antd";
import { useForm } from "react-hook-form";
import { useCreateDiscountMutation } from "../../../apis/vouchersApi";
import VoucherForm from "../../../components/form/voucher-form";

function CreateVoucher() {
  const {
    handleSubmit,
    setValue,
    register,
    control,
    reset,
  } = useForm({
    criteriaMode: "all",
  });
  const [createVoucher, { isLoading: isCreating }] =
    useCreateDiscountMutation();
  const onSubmit = async (data) => {
    try {
      const result_data = {
        ...data,
        discount_start_date: data.range[0],
        discount_end_date: data.range[1],
        discount_applies_to: "all",
      };
      const res = await createVoucher(result_data).unwrap();
      if (res.status === 201) {
        notification.success({
          message: "Tạo danh mục thành công",
          showProgress: true,
          placement: "topRight",
          onClose: () => {
            // navigate("/login");
            reset();
            window.location.reload();
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-[90%] relative bg-white p-4">
      <Typography.Title level={3}>Tạo mã giảm giá</Typography.Title>
      <div className="w-[50%] mx-auto">
        <VoucherForm
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          setValue={setValue}
          loadingSubmit={isCreating}
          register={register}
        />
      </div>
    </div>
  );
}

export default CreateVoucher;
