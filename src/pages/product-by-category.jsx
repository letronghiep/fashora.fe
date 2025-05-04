import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useSearchProductQuery } from "../apis/productsApi";
import ProductCard from "../components/product/product-card";
import { searchProductService } from "../services/product";
function ProductByCategory() {
  // const { category_id } = useParams();
  const { product_category } = useSelector((state) => state.filter);
  const [keySearch, setKeySearch] = useState("");
  const [products, setProducts] = useState();
  const [totalRows, setTotalRows] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useSelector((state) => state.filter);
  const handleSearch = (e) => {
    setKeySearch(e.target.value);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page, offset: limit });
  };
  useEffect(() => {
    const offset = Number(searchParams.get("offset")) || 10;
    const currentPage = Number(searchParams.get("page")) || 1;
    setLimit(Number(offset));
    setCurrentPage(Number(currentPage));
  }, [searchParams]);
  const { data, isLoading, refetch } = useSearchProductQuery(
    { 
      q: keySearch,
      product_status: "published",
      product_category: product_category,
      limit: limit,
      currentPage: currentPage,
      sort: "ctime",
      product_price: filters.product_price,
      size: filters.size,
      color: filters.color,

    }
  );
  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        {data?.metadata?.data &&
          data?.metadata?.data.map((product) => (
            <ProductCard
              className="col-span-3 bg-white"
              key={product._id}
              product={product}
            />
          ))}
      </div>
      {(products && products.length > 0)&& (
        <Pagination
          className="flex justify-center mt-4"
          align="center"
          current={currentPage}
          onChange={handlePageChange}
          total={totalRows}
          pageSize={limit}
        />
      )}
    </div>
  );
}

export default ProductByCategory;
