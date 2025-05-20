import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Flex,
  Input,
  Modal,
  Segmented,
  Typography,
  Spin,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProductByShop } from "../services/product";
import {
  useUpdatePriceProductMutation,
  useGetInventoriesProductQuery,
} from "../apis/productsApi";
import InventoryTable from "../components/InventoryTable";

function InventoryPage() {
  const { Title } = Typography;
  const [searchParams, setSearchParams] = useSearchParams("");
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newPrice, setNewPrice] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: inventories, isLoading: isLoadingInventories } =
    useGetInventoriesProductQuery({
      page: currentPage,
      limit: pageSize,
    });
  useEffect(() => {
    async function fetchingProducts() {
      try {
        setIsLoading(true);
        const productData = await getProductByShop(searchParams);
        setProducts(productData.metadata.data);
        setTotal(productData.metadata.total);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
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

  const onSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set(`q`, keySearch.toString());
    setSearchParams(params);
  };

  const showModal = (product) => {
    setSelectedProduct(product);
    setNewPrice(product.product_price);
    setIsModalOpen(true);
  };

  const [updateProduct] = useUpdatePriceProductMutation();

  const handleOk = async () => {
    try {
      // TODO: Call API to update product price
      const res = await updateProduct({
        id: selectedProduct.skuId,
        data: { sku_price_sale: newPrice },
      });
      if (res.status === 200) {
        notification.success({
          message: "Cập nhật giá thành công",
          description: "Giá sản phẩm đã được cập nhật thành công",
          placement: "topRight",
          duration: 3,
          icon: <CheckCircleOutlined />,
          showProgress: true,
          onClose: () => {
            setIsModalOpen(false);
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (page, pageSize) => {
    setPageSize(pageSize);
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    params.set("limit", pageSize);
    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <div className="flex items-center h-full justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Flex vertical>
      <Breadcrumb
        items={[
          {
            title: <Link to="/seller">Trang chủ</Link>,
          },
          {
            title: "Kho hàng",
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
        Quản lý kho hàng
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
          onChange={(e) => setKeySearch(e.target.value)}
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

      <InventoryTable
        products={inventories?.metadata?.data}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onShowModal={showModal}
        total={inventories?.metadata?.totalRows}
        currentPage={currentPage}
        loading={isLoading}
      />

      <Modal
        title="Thay đổi giá sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedProduct && (
          <div>
            <p>Tên sản phẩm: {selectedProduct?.product_name}</p>
            <p>
              Giá hiện tại: {selectedProduct?.product_price.toLocaleString()}đ
            </p>
            <Input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              placeholder="Nhập giá mới"
              addonAfter="đ"
            />
          </div>
        )}
      </Modal>
    </Flex>
  );
}

export default InventoryPage;
