import React from 'react';
import { Result, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    navigate('/my-orders');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title="Thanh toán thành công!"
        subTitle="Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là #123456789. Chúng tôi đã gửi email xác nhận đơn hàng."
        extra={[
          <Button type="primary" key="home" onClick={handleGoHome}>
            Về trang chủ
          </Button>,
          <Button key="order" onClick={handleViewOrder}>
            Xem đơn hàng
          </Button>,
        ]}
      />
    </div>
  );
};

export default CheckoutSuccess;
