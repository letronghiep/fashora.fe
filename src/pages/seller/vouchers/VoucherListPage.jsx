import {
  Breadcrumb,
  Button,
  Flex,
  Input,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetDiscountsQuery } from "../../../apis/vouchersApi";
import DiscountTable from "../../../components/table/DiscountTable";

function VoucherListPage() {
  var { Title } = Typography;
  const [searchParams, setSearchParams] = useSearchParams("");
  const [keySearch, setKeySearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  
  useEffect(() => {
    const limit = searchParams.get("limit");
    if (limit) {
      setPageSize(parseInt(limit));
      const params = new URLSearchParams(searchParams);
      params.set("limit", pageSize);
      setSearchParams(params);
    }
  }, [searchParams, pageSize, setPageSize, setSearchParams]);

  const { data: discounts, isLoading } = useGetDiscountsQuery({
    q: searchParams.get("q") || "",
    discount_status: searchParams.get("discount_status") || "all",
    limit: pageSize,
  });
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
          <div>Đang xử lý</div>
        </div>
      ),
      value: "pending",
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
          <div>Đã kích hoạt</div>
        </div>
      ),
      value: "active",
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
          <div>Đã vô hiệu hóa</div>
        </div>
      ),
      value: "inactive",
    },
  ];
  const handleChangeDataProduct = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set(`discount_status`, value);
    setSearchParams(params);
  };
  const onSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set(`q`, keySearch.toString());
    setSearchParams(params);
  };
  if (isLoading)
    return (
      <div className="flex items-center h-full justify-center">
        <Spin size="large" />
      </div>
    );
  return (
    <Flex vertical>
      <Breadcrumb
        items={[
          {
            title: <Link to="/seller">Trang chủ</Link>,
          },
          {
            title: "Danh mục",
          },
          {
            title: "Danh sách danh mục",
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
        Danh sách danh mục
      </Title>
      <Segmented
        onChange={(value) => handleChangeDataProduct(value)}
        options={options}
      />
      <Flex gap={20} style={{ width: "90%" }}>
        <Input
          addonBefore="Tìm kiếm danh mục"
          placeholder="Tìm Tên danh mục, Id danh mục"
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
      {/* List Product */}
      {/* <CategoriesTable data={categories?.metadata || []} /> */}
      <DiscountTable 
        data={discounts?.metadata || []} 
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </Flex>
  );
}

export default VoucherListPage;
