import { Checkbox } from "antd";
import { Controller } from "react-hook-form";

function CheckboxCustom({ name, control, label, disabled = false }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <Checkbox {...field} disabled={disabled} checked={field.value}>
            {label}
          </Checkbox>{" "}
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

export default CheckboxCustom;
