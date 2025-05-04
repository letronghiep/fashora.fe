import { Button, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import InputCustom from "../inputs/Input";
import SelectCustom from "../inputs/Select";

function VoucherForm({ onSubmit, control, setValue, voucher, loadingSubmit }) {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const [discountType, setDiscountType] = useState("fixed_amount");
  useEffect(() => {
    setValue("discount_type", "fixed_amount");
  }, []);
  const statues = [
    {
      value: "active",
      label: "Đã kích hoạt",
    },
    {
      value: "block",
      label: "Đã vô hiệu hóa",
    },
    {
      value: "pending",
      label: "Đang xử lý",
    },
    {
      value: "expired",
      label: "Đã hết hạn",
    },
  ];
  useEffect(() => {
    if (voucher) {
      setValue("discount_code", voucher.discount_code);
      setValue("discount_name", voucher.discount_name);
      setValue("discount_type", voucher.discount_type);
      setValue("discount_value", voucher.discount_value);
      setValue("discount_min_order_value", voucher.discount_min_order_value);
      setValue("discount_max_uses", voucher.discount_max_uses);
      setValue(
        "discount_max_uses_per_user",
        voucher.discount_max_uses_per_user
      );

      setValue("discount_start_date", dayjs(voucher.discount_start_date));
      setValue("discount_end_date", dayjs(voucher.discount_end_date));
      setValue("discount_description", voucher.discount_description);
      setValue("discount_max_value", voucher.discount_max_value);
      setValue("range", [
        voucher.discount_start_date,
        voucher.discount_end_date,
      ]);
      setValue("discount_status", voucher.discount_status);
    }
  }, [voucher, setValue]);
  const handleChangeOption = (option) => {
    switch (option) {
      case "fixed_amount":
        setDiscountType("fixed_amount");
        setValue("discount_type", "fixed_amount");
        break;
      case "percentage":
        setDiscountType("percentage");
        setValue("discount_type", "percentage");
        break;
      default:
        setDiscountType("fixed_amount");
        setValue("discount_type", "fixed_amount");
        break;
    }
  };
  const selectBefore = (
    <Select onChange={handleChangeOption} defaultValue="fixed_amount">
      <Option value="fixed_amount">Theo số tiền</Option>
      <Option value="percentage">Theo phần trăm</Option>
    </Select>
  );
  return (
    <form className="" onSubmit={onSubmit}>
      <div className="">
        <div className="">
          <h4>Tên mã giảm giá</h4>
          <InputCustom
            control={control}
            name="discount_name"
            label="Tên mã giảm giá"
          />
        </div>
        <div className="my-4">
          <h4>Mã giảm giá</h4>
          <InputCustom
            control={control}
            name="discount_code"
            label="Mã giảm giá"
          />
        </div>
        <div className="my-4 w-full">
          <h4>Thời gian sử dụng mã: </h4>
          <Controller
            name="range"
            control={control}
            rules={{ required: "Vui lòng chọn khoảng thời gian!" }}
            render={({ field, fieldState }) => {
              const value =
                field.value && field.value.length === 2
                  ? [dayjs(field.value[0]), dayjs(field.value[1])]
                  : null;
              return (
                <>
                  <RangePicker
                    {...field}
                    showTime
                    value={value}
                    onChange={(dates) => field.onChange(dates)}
                    format="DD/MM/YYYY HH:mm"
                  />
                  {fieldState.error && (
                    <span style={{ color: "red" }}>
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              );
            }}
          />
        </div>
        <div className="my-4">
          <h4>Loại giảm giá/Mức giảm</h4>
          <InputCustom
            control={control}
            name="discount_value"
            addonBefore={selectBefore}
            addonAfter={discountType === "percentage" ? "%" : "đ"}
            label="Mức giảm"
          />
        </div>
        <div className="my-4">
          <h4>Tổng số lượt sử dụng tối đa</h4>
          <InputCustom
            control={control}
            name="discount_max_uses"
            label="Tổng số lượt sử dụng"
          />
        </div>
        <div className="my-4">
          <h4>Lượt sử dụng tối đa / Người mua</h4>
          <InputCustom
            control={control}
            name="discount_max_uses_per_user"
            label="Lượt sử dụng tối đa / Người mua"
            defaultValue={1}
          />
        </div>
        <div className="my-4">
          <h4>Giá trị đơn hàng tối thiểu</h4>
          <InputCustom
            control={control}
            name="discount_min_order_value"
            label="Giá trị đơn hàng tối thiểu"
            defaultValue={1}
          />
        </div>
        <div className="my-4">
          <h4>Giá trị đơn hàng tối đa</h4>
          <InputCustom
            control={control}
            name="discount_max_value"
            label="Giá trị đơn hàng tối đa"
            defaultValue={1}
          />
        </div>
        {voucher && (
          <div className="my-4">
            <h4>Trạng thái</h4>
            <SelectCustom
              control={control}
              data={statues}
              name="discount_status"
              keyField="value"
              valueField="label"
              placeholder="Trạng thái"
              value={voucher?.discount_status}
              onChange={(e) => setValue("discount_status", e)}
            />
          </div>
        )}
      </div>
      <div className="my-4">
        <Button
          type="default"
          variant="outlined"
          color="primary"
          onClick={onSubmit}
          loading={loadingSubmit}
          disabled={loadingSubmit}
        >
          Lưu
        </Button>
      </div>
    </form>
  );
}

export default VoucherForm;
