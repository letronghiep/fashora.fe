import { Breadcrumb, Flex, Typography, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiOrigin } from "../../../constants";
import { axiosInstance } from "../../../core/axiosInstance";
import FlashSaleForm from "../../../components/form/flash-sale-form";
import dayjs from "dayjs";

const { Title } = Typography;

function EditFlashSale() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchFlashSaleData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${apiOrigin}/flashsale/${id}`
        );

        if (response.status === 200) {
          const flashSaleData = response.data.metadata;

          // Chuyển đổi dữ liệu để phù hợp với form
          const formattedData = {
            name: flashSaleData.name,
            thumb: flashSaleData.thumb,
            status: flashSaleData.status,
            isApproved: flashSaleData.isApproved,
            time: [
              dayjs(flashSaleData.start_time),
              dayjs(flashSaleData.end_time),
            ],
            products: flashSaleData.products || [],
          };

          setInitialData(formattedData);
        } else {
          message.error("Không thể tải thông tin flash sale!");
          navigate("/seller/flashsale");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu flash sale:", error);
        message.error("Có lỗi xảy ra khi tải thông tin flash sale!");
        navigate("/seller/flashsale");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFlashSaleData();
    }
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `${apiOrigin}/flashsale/${id}`,
        data
      );

      if (response.data.status === 200) {
        message.success("Cập nhật flash sale thành công!");
        navigate("/seller/flashsale");
      } else {
        message.error("Cập nhật flash sale thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật flash sale!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex vertical className="w-[90%] relative bg-white p-4">
      <Breadcrumb
        items={[
          {
            title: <Link to="/seller">Trang chủ</Link>,
          },
          {
            title: <Link to="/seller/flashsale">Flash Sale</Link>,
          },
          {
            title: "Chỉnh sửa Flash Sale",
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
        Chỉnh sửa Flash Sale
      </Title>

      <div className="w-[50%] mx-auto">
        {initialData ? (
          <FlashSaleForm
            initialData={initialData}
            onSubmit={handleSubmit}
            loading={loading}
          />
        ) : (
          <div className="text-center py-8">
            <p>Đang tải dữ liệu...</p>
          </div>
        )}
      </div>
    </Flex>
  );
}

export default EditFlashSale;
