import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { modifyImageDimensions, validateFormMoney } from "../helpers";

function BestSeller({ data, title }) {
  const navigate = useNavigate();
  return (
    <div className="my-4">
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
        <div className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth">
          {data?.map((product) => (
            <Card
              hoverable
              key={product._id}
              className="relative text-center border shadow-md min-w-[370px] max-w-[370px] snap-center cursor-pointer group"
              onClick={() => navigate(`/${product.product_slug}`)}
            >
              <img
                src={modifyImageDimensions(product.product_thumb, 370, 270)}
                className="object-cover"
                alt="product"
              />
              <p className="text-base text-essential-800 ease-linear text-ellipsis line-clamp-2 overflow-hidden font-medium mt-3">
                {product.product_name}
              </p>
              {/* <p className="text-[#7C3FFF] font-semibold text-lg mt-2 mb-2">
                {validateFormMoney(product.product_price)} VND
              </p> */}
              <p className="text-[#7C3FFF] font-semibold text-lg mt-2 mb-2">
                {product.product_seller > 0 &&
                product.product_seller < product.product_price
                  ? validateFormMoney(product.product_seller)
                  : validateFormMoney(product.product_price)}{" "}
                VND
              </p>
              {product.product_seller > 0 &&
                product.product_seller < product.product_price && (
                  <p className="text-gray-500 line-through text-sm">
                    {validateFormMoney(product.product_price)} VND
                  </p>
                )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BestSeller;
