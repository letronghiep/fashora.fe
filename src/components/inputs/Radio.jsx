import { Radio } from "antd";
import { Controller } from "react-hook-form";


function RadioCustom({ name, control, data, disabled }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <Radio.Group {...field} name={name} disabled={disabled}>
            {data.map((item) => (
              <Radio key={item} value={item}>
                {item}
              </Radio>
            ))}
          </Radio.Group>
          {fieldState.error && (
            <span style={{ color: "red", display: "block" }}>
              {fieldState.error.message}
            </span>
          )}
        </>
      )}
    ></Controller>
  );
}

export default RadioCustom;
