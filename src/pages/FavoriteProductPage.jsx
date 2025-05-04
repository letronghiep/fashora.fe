import { Row, Col, Empty, Typography, Spin } from "antd";
import ProductCard from "../components/product/product-card";
import { HeartOutlined } from "@ant-design/icons";
import { useGetFavoriteProductsQuery } from "../apis/productsApi";
import { useEffect, useState } from "react";

const { Title } = Typography;

const FavoriteProductPage = () => {
  const { data, isLoading } = useGetFavoriteProductsQuery();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  useEffect(() => {
    if (data) {
      setFavoriteProducts(data?.metadata.data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="mb-8">
      <Typography.Title
        level={4}
        style={{
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
          <HeartOutlined className="text-red-500 mr-2" />
          Sản phẩm yêu thích
        </Typography.Title>
      </div>

      {favoriteProducts?.length === 0 ? (
        <Empty
          description="Bạn chưa có sản phẩm yêu thích nào"
          className="my-8"
        />
      ) : (
        <Row gutter={[16, 16]}>
          {favoriteProducts?.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FavoriteProductPage;
