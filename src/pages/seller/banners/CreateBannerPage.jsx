import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import BannerForm from '../../../components/seller/banners/BannerForm';
import { createBanner } from '~/services/banner';
import { message } from 'antd';

const CreateBannerPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await createBanner(data);
      message.success('Tạo banner thành công');
      navigate('/seller/banners');
    } catch (error) {
      console.error('Lỗi khi tạo banner:', error);
      message.error('Không thể tạo banner');
    }
  };

  return (
    <div style={{ maxWidth: 'md', margin: '0 auto', padding: '32px 0' }}>
      <Typography.Title level={1} style={{ marginBottom: 24 }}>
        Tạo Banner Mới
      </Typography.Title>
      <BannerForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateBannerPage;
