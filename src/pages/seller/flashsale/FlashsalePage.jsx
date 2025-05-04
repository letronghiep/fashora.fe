import { Breadcrumb, Button, Flex, Input, Segmented, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FlashSaleTable from "../../../components/table/FlashsaleTable";
import { useGetFlashsaleQuery } from "../../../apis/flashsaleApis";

function FlashSalePage() {
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
  const { data: flashSaleResponse, isLoading } = useGetFlashsaleQuery({
    q: searchParams.get("q") || "",
    flashsale_status: searchParams.get("flashsale_status") || "all",
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
          <div>Đang diễn ra</div>
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
          <div>Đã kết thúc</div>
        </div>
      ),
      value: "ended",
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
          <div>Sắp diễn ra</div>
        </div>
      ),
      value: "upcoming",
    },
  ];

  const handleChangeDataFlashsale = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set(`flashsale_status`, value);
    setSearchParams(params);
  };

  const onSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set(`q`, keySearch.toString());
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
            title: "Flash Sale",
          },
          {
            title: "Danh sách Flash Sale",
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
        Danh sách Flash Sale
      </Title>
      <Segmented
        onChange={(value) => handleChangeDataFlashsale(value)}
        options={options}
      />
      <Flex gap={20} style={{ width: "90%" }}>
        <Input
          addonBefore="Tìm kiếm Flash Sale"
          placeholder="Tìm Tên Flash Sale, Id Flash Sale"
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
      <FlashSaleTable
        data={flashSaleResponse?.metadata}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isLoading={isLoading}
      />
    </Flex>
  );
}

export default FlashSalePage;
