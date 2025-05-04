import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { modifyImageDimensions } from "../../helpers";

function CategorySlide({ categories, title }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -360 : 360,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="my-4">
      {categories.length > 0 && (
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
                className="flex gap-4 overflow-x-hidden scroll-smooth no-scrollbar"
              >
                {categories.map((category) => (
                  <Card
                    hoverable
                    key={category._id}
                    className="relative text-center border shadow-md cursor-pointer w-[360px] max-w-[360px] min-w-[360px] group"
                    onClick={() =>
                      navigate(`/category/${category.category_id}`)
                    }
                  >
                    <img
                      src={modifyImageDimensions(
                        category.category_thumb,
                        495,
                        360
                      )}
                      className="object-cover"
                      alt="category"
                    />
                    <div className="rounded-md absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-full">
                      <div className="flex flex-col space-y-4">
                        <p className="text-white font-bold text-center text-2xl">
                          {category.category_name}
                        </p>
                        <Button >
                          <p className="text-black text-center text-base">
                            Xem ngay
                          </p>
                        </Button>
                      </div>
                    </div>
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

export default CategorySlide;
