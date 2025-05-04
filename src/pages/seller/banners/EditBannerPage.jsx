import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "antd";
import BannerForm from "../../../components/seller/banners/BannerForm";
import { createBanner } from "~/services/banner";
import { message } from "antd";
import { getBannerById, updateBanner } from "../../../services/banner";
import { useEffect, useState } from "react";

const EditBannerPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [banner, setBanner] = useState();
  useEffect(() => {
    const fetchBanner = async () => {
      const banner = await getBannerById(id);
      setBanner(banner.metadata);
    };
    fetchBanner();
  }, [id]);
  const handleSubmit = async (data) => {
    try {
      await updateBanner(id, data);
      message.success("Cập nhật banner thành công");
      navigate("/seller/banners");
    } catch (error) {
      console.error("Lỗi khi tạo banner:", error);
      message.error("Không thể tạo banner");
    }
  };

  return (
    <div style={{ maxWidth: "md", margin: "0 auto", padding: "32px 0" }}>
      <Typography.Title level={1} style={{ marginBottom: 24 }}>
        Tạo Banner Mới
      </Typography.Title>
      <BannerForm onSubmit={handleSubmit} banner={banner} />
    </div>
  );
};

export default EditBannerPage;
