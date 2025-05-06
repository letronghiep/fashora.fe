import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { modifyImageDimensions } from "../../helpers";

function ProductSlide({ products, title }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -278 : 278,
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      {products && products.length > 0 && (
        <>
          <Typography.Title
            level={4}
            style={{
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography.Title>
          <div className="p-6 bg-white relative">
            <div className="relative ">
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg z-10"
                onClick={() => scroll("left")}
              >
                <LeftOutlined />
              </button>
              <div
                ref={scrollRef}
                className="grid grid-cols-12 gap-4 overflow-x-hidden scroll-smooth no-scrollbar"
              >
                {products.map((product) => (
                  <Card
                    hoverable
                    key={product._id}
                    className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 relative text-center border shadow-md min-w-[200px] cursor-pointer"
                    onClick={() => navigate(`/${product.product_slug}`)}
                  >
                    <img
                      src={modifyImageDimensions(
                        product.product_thumb,
                        166,
                        166
                      )}
                      alt="Product"
                    />
                    <Card.Meta
                      title={product.product_name}
                      prefixCls="product-card"
                      style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        lineHeight: "1.25em",
                        marginBottom: "6px",
                      }}
                    />
                  </Card>
                ))}
              </div>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg z-10"
                onClick={() => scroll("right")}
              >
                <RightOutlined />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductSlide;
