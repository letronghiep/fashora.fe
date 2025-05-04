import { Breadcrumb, Button, Flex, Input, Segmented, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductTable from "../../../components/table/ProductTable";
import { getProductByShop } from "../../../services/product";

function ProductListPage() {
  var { Title } = Typography;
  const [searchParams, setSearchParams] = useSearchParams("");
  const { Search } = Input;
  const [products, setProducts] = useState();
  useEffect(() => {
    async function fetchingProducts() {
      try {
        const productData = await getProductByShop(searchParams);
        setProducts(productData.metadata);
      } catch (error) {
        console.error(error);
      }
    }
    fetchingProducts();
  }, [searchParams]);
  const options = [
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Tất cả</div>
        </div>
      ),
      value: "all",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Đang hoạt động</div>
        </div>
      ),
      value: "published",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Chưa được đăng</div>
        </div>
      ),
      value: "draft",
    },
    {
      label: (
        <div
          style={{
            padding: 4,
            display: "flex",
            columnGap: 4,
            fontWeight: "600",
          }}
        >
          <div>Đang bị khóa</div>
        </div>
      ),
      value: "blocked",
    },
  ];
  const handleChangeDataProduct = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set(`product_status`, value);
    setSearchParams(params);
  };
  const onSearch = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set(`q`, value);
    setSearchParams(params);
  };
  return (
    <Flex vertical>
      <Breadcrumb
        items={[
          {
            title: <Link to="/seller">Trang chủ</Link>,
          },
          {
            title: "Sản phẩm",
          },
          {
            title: "Quản lý sản phẩm",
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
        Danh sách sản phẩm
      </Title>
      <Segmented
        onChange={(value) => handleChangeDataProduct(value)}
        options={options}
      />
      <Flex gap={20} style={{ width: "90%" }}>
        <Input
          addonBefore="Tìm kiếm Sản phẩm"
          placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
          allowClear
          style={{ marginBlock: 16, width: "60%" }}
        />
        <Input
          addonBefore="Ngành hàng sản phẩm"
          placeholder="Tìm kiếm theo ngành hàng"
          allowClear
          style={{ marginBlock: 16, width: "40%" }}
        />
      </Flex>
      <Flex
        gap={20}
        style={{
          maxWidth: "70%",
          margin: "24px 0px",
        }}
      >
        <Button onClick={onSearch} type="primary">
          Áp dụng
        </Button>
        <Button type="default">Đặt lại</Button>
      </Flex>
      {/* List Product */}
      <ProductTable data={products} />
    </Flex>
  );
}

export default ProductListPage;
