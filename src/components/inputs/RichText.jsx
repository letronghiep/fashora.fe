import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
function RichText({ control, name, style }) {
  return (
    <Controller
      style={style}
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <ReactQuill
            className="border-none max-h-full h-full w-full"
            theme="snow"
            value={field.value}
            style={{ height: "85%" }}
            onChange={field.onChange}
          />
          {fieldState.error && (
            <span style={{ color: "red", display: "block" }}>
              {fieldState.error.message}
            </span>
          )}
        </>
      )}
    />
  );
}

export default RichText;
