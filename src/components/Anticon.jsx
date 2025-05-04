import { Button, Popconfirm } from "antd";

function Anticon({
  title,
  handleOk,
  showPopconfirm,
  label,
  description,
  confirmLoading,
  type,
  open,
}) {
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Popconfirm
      title={title}
      description={description}
      open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <Button type={type} onClick={showPopconfirm}>
        {label}
      </Button>
    </Popconfirm>
  );
}

export default Anticon;
