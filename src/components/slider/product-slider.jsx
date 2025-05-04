import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { modifyImageDimensions, validateFormMoney } from "../../helpers";

function ProductSlide({ products, title, href }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Điều chỉnh khoảng cách scroll
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="my-4">
      {products.length > 0 && (
        <>
          <Typography.Title
            level={4}
            style={{
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {title}
          </Typography.Title>
          <div className="p-6 bg-white relative my-4">
            <div className="relative">
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg z-10 hover:bg-gray-300 transition-colors"
                onClick={() => scroll("left")}
              >
                <LeftOutlined />
              </button>
              <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none' }}
              >
                {products.map((product) => (
                  <Card
                    hoverable
                    key={product._id}
                    className="flex-shrink-0 w-[250px] relative text-center border shadow-md cursor-pointer group hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/${product.product_slug}`)}
                  >
                    <img
                      src={modifyImageDimensions(
                        product.product_thumb,
                        370,
                        270
                      )}
                      className="object-cover w-full h-[200px]"
                      alt={product.product_name}
                    />
                    <p className="text-base line-clamp-2 text-essential-800 ease-linear text-ellipsis overflow-hidden font-medium mt-3">
                      {product.product_name}
                    </p>
                    <p className="text-[#7C3FFF] font-semibold text-lg mt-2 mb-2">
                      {validateFormMoney(product.product_price)} VND
                    </p>
                  </Card>
                ))}
              </div>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-lg z-10 hover:bg-gray-300 transition-colors"
                onClick={() => scroll("right")}
              >
                <RightOutlined />
              </button>
            </div>
          </div>
          <Button
            type="link"
            style={{
              width: "fit-content",
              margin: "0 auto",
              display: "flex",
            }}
            href={href}
          >
            Xem thêm
          </Button>
        </>
      )}
    </div>
  );
}

export default ProductSlide;
