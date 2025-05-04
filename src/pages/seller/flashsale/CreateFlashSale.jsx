import { Breadcrumb, Flex, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCreateFlashsaleMutation } from "../../../apis/flashsaleApis";
import FlashSaleForm from "../../../components/form/flash-sale-form";

const { Title } = Typography;

function CreateFlashSale() {
  const navigate = useNavigate();
  const [createFlashsale, { isLoading }] = useCreateFlashsaleMutation();
  const handleSubmit = async (formData) => {
    try {
      const response = await createFlashsale(formData);

      if (response.data.status === 201) {
        message.success("Tạo flash sale thành công!");
        navigate("/seller/flashsale");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo flash sale!");
      console.error(error);
    }
  };

  return (
    <Flex vertical className="relative bg-white p-4">
      <Breadcrumb
        items={[
          {
            title: <Link to="/seller">Trang chủ</Link>,
          },
          {
            title: <Link to="/seller/flashsale">Flash Sale</Link>,
          },
          {
            title: "Tạo Flash Sale",
          },
        ]}
      />
      <Title
        style={{
          marginTop: 24,
          marginBottom: 16,
        }}
        level={4}
      >
        Tạo Flash Sale
      </Title>

      <div className="w-[50%] mx-auto">
        <FlashSaleForm onSubmit={handleSubmit} loading={isLoading} />
      </div>
    </Flex>
  );
}

export default CreateFlashSale;
