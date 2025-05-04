import { DatePicker, Flex, Select, Typography } from "antd";
import dayjs from "dayjs";

function Revenue({
  title,
  children,
  subTitle,
  onChange,
  setPickerDay,
  pickerDay,
}) {
  return (
    <Flex
      style={{
        width: "100%",
        // backgroundColor: "white",
        padding: "10px 20px",
      }}
      vertical="true"
    >
      <Flex align="center" gap={10}>
        <Typography.Title
          style={{
            margin: 0,
          }}
          level={5}
        >
          {title}
        </Typography.Title>
        <Select
          defaultValue="today"
          value={pickerDay.type}
          onChange={(value) => setPickerDay({ ...pickerDay, type: value })}
        >
          <Select.Option value="today">Hôm nay</Select.Option>
          <Select.Option value="yesterday">Hôm qua</Select.Option>
          <Select.Option value="week">7 ngày qua</Select.Option>
          <Select.Option value="month">30 ngày qua</Select.Option>
          <Select.Option value="specific-date">Chọn ngày</Select.Option>
        </Select>
        <Typography.Text
          style={{
            color: "#9ca3af",
          }}
        >
          {subTitle}
        </Typography.Text>
        <DatePicker.RangePicker
          onChange={onChange}
          value={pickerDay.type === "specific-date" 
            ? [
                pickerDay.start ? dayjs(pickerDay.start) : null,
                pickerDay.end ? dayjs(pickerDay.end) : null
              ] 
            : []}
          style={{
            marginLeft: "auto",
          }}
        />
      </Flex>
      <>{children}</>
    </Flex>
  );
}

export default Revenue;
