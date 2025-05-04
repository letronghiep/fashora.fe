import { Col, Empty, Pagination, Row, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useSearchProductQuery } from '../apis/productsApi';
import ProductCard from '../components/product/product-card';

function SearchPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page')) || 1;
  const { data: searchResults, isLoading } = useSearchProductQuery({
    q: query,
    product_status: "published",
    product_category: "",
    limit: 12,
    currentPage: page,
    sort: "ctime"
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Empty description="Vui lòng nhập từ khóa tìm kiếm" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {searchResults.metadata?.data.length === 0 ? (
        <Empty description="Không tìm thấy sản phẩm phù hợp" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {searchResults.metadata?.data.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          <div className="flex justify-center mt-8">
            <Pagination
              current={searchResults.metadata?.currentPage}
              total={searchResults.metadata?.totalRows}
              pageSize={searchResults.metadata?.limit}
              onChange={(newPage) => {
                window.location.href = `/search?q=${query}&page=${newPage}`;
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage; 