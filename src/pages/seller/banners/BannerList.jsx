import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Image, Space, Table, message, Input, Flex } from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { deleteBanner, getBanners } from "~/services/banner";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
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

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBanners({
        q: searchParams.get("q") || "",
        limit: pageSize,
      });
      setBanners(response.metadata.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách banner:", error);
      message.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [searchParams, pageSize]);

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      message.success("Xóa banner thành công");
      fetchBanners();
    } catch (error) {
      console.error("Lỗi khi xóa banner:", error);
      message.error("Không thể xóa banner");
    }
  };

  const onSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("q", keySearch.toString());
    setSearchParams(params);
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumb",
      key: "thumb",
      render: (thumb) => (
        <Image
          src={thumb}
          alt="banner"
          width={200}
          height={100}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Link",
      dataIndex: "linkTo",
      key: "link",
      render: (link) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/seller/banners/edit/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />}>
              Sửa
            </Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Danh sách Banner</h1>
        <Link to="/seller/banners/create">
          <Button type="primary">Thêm Banner</Button>
        </Link>
      </div>
      <Flex gap={20} style={{ width: "90%" }}>
        <Input
          addonBefore="Tìm kiếm banner"
          placeholder="Tìm theo tiêu đề"
          allowClear
          style={{ marginBlock: 16, width: "60%" }}
          onChange={(e) => setKeySearch(e.target.value)}
        />
        <Button onClick={onSearch} type="primary" style={{ marginBlock: 16 }}>
          Tìm kiếm
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={banners}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: pageSize,
          total: banners?.length || 0,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} banner`,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default BannerList; 