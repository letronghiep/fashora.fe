import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetHomepageQuery } from "../apis/productsApi";
import BestSeller from "../components/best-seller";
import CategorySlide from "../components/slider/category-slider";
import ProductSlide from "../components/slider/product-slider";
import { modifyImageDimensions } from "../helpers";
import { getBanners } from "../services/banner";
import { getCategoryByParentId } from "../services/category";

function HomePage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryList, bannerList] = await Promise.all([
          getCategoryByParentId(""),
          getBanners(),
        ]);
        setBanners(bannerList.metadata?.data);
        setCategories(categoryList.metadata);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  
  const { data: homepage } = useGetHomepageQuery();
  return (
    <div>
      {/* Banner */}
      {banners.length > 0 && (
        <div>
          <Carousel arrows={true}>
            {banners.map((banner) => (
              <div
                key={banner.id}
                onClick={() => navigate(`flashsale/${banner.linkTo}`)}
              >
                <img
                  src={modifyImageDimensions(banner.thumb, 360, 1440)}
                  alt={banner.title}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
      {/* End Banner */}
      {/* New Arrivals */}
      <ProductSlide
        products={homepage?.metadata.arrivalProduct || []}
        title="Sản phẩm mới nhất"
      />
      {/* Category */}
      <CategorySlide
        categories={categories.filter(
          (category) =>
            category?.category_parentId === null ||
            category?.category_parentId?.length === 0
        )}
        title="Danh mục sản phẩm"
      />
      {/* End Category */}
      {/* Best seller */}
      <BestSeller
        data={homepage?.metadata.bestSeller}
        title="Bán chạy nhất trong tuần"
      />
    </div>
  );
}

export default HomePage;
