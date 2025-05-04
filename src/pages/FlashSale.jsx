import { ClockCircleOutlined, FireOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Pagination, Progress, Row, Statistic, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetFlashsaleQuery } from '../apis/flashsaleApis';
import { validateFormMoney } from '../helpers';

const { Meta } = Card;
const { Countdown } = Statistic;

const FlashSale = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { id } = useParams();
  const { data: products, isLoading } = useGetFlashsaleQuery({
    page: currentPage,
    limit: itemsPerPage,
  });  

  const totalPages = products?.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const deadline = dayjs().add(24, 'hours').valueOf(); // Thời gian kết thúc flash sale

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
          <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
          Flash Sale
        </h1>
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClockCircleOutlined style={{ marginRight: '8px' }} />
              <span>Kết thúc sau:</span>
              <Countdown
                value={deadline}
                format="HH:mm:ss"
                style={{ marginLeft: '8px' }}
              />
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      </div>

      <Row gutter={[16, 16]}>
        {products?.data?.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={
                <Link to={`/product/${product.id}`}>
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                    />
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: '#ff4d4f',
                        fontSize: '20px',
                      }}
                    />
                  </div>
                </Link>
              }
              actions={[
                // eslint-disable-next-line react/jsx-key
                <Button type="primary" danger block icon={<ShoppingCartOutlined />}>
                  Thêm vào giỏ
                </Button>,
              ]}
            >
              <Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{product.name}</span>
                    <Tag color="red">
                      -{Math.round((1 - product.salePrice / product.price) * 100)}%
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '18px', color: '#ff4d4f', fontWeight: 'bold' }}>
                        {validateFormMoney(product.salePrice)}
                      </span>
                      <span style={{ textDecoration: 'line-through', color: '#8c8c8c', marginLeft: '8px' }}>
                        {validateFormMoney(product.price)}
                      </span>
                    </div>
                    <div>
                      <Progress
                        percent={product.soldPercent}
                        size="small"
                        strokeColor="#ff4d4f"
                        format={(percent) => `${percent}% đã bán`}
                      />
                      <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                        Còn lại: {product.quantity - product.soldQuantity} sản phẩm
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Pagination
          current={currentPage}
          total={totalPages * itemsPerPage}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
        />
      </div>
    </div>
  );
};

export default FlashSale;
