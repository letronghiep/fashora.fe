import { Card, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import { modifyImageDimensions, validateFormMoney } from "../../helpers";
const { Meta } = Card;
function ProductCard({ product, className }) {
  const navigate = useNavigate();
  return (
    <Card
      hoverable
      className={className}
      style={
        {
          // width: 240,
        }
      }
      onClick={() => navigate(`/${product.product_slug}`)}
      cover={
        <img
          alt={product.product_name}
          src={modifyImageDimensions(product.product_thumb, 232, 232)}
        />
      }
    >
      <div>
        <p className="text-lg font-bold">
          {validateFormMoney(product.product_price)}
        </p>
        <p className="text-sm uppercase text-neutral-800/70 mt-3 mb-3">
          {product.product_shop?.user_full_name ||
            product.product_shop?.usr_name}
        </p>
        <Meta
          title={product.product_name}
          prefixCls="product-card"
          style={{
            fontWeight: "500",
            fontSize: "16px",
            lineHeight: "1.25em",
            marginBottom: "6px",
          }}
          description={
            <div className="flex items-center my-3 gap-x-3">
              <Rate
                value={product.product_rattingAvg}
                allowHalf
                disabled
                style={{
                  fontSize: "12px",
                }}
              />

              <span className="text-sm text-zinc-400">
                Đã bán {product.product_sold}
              </span>
            </div>
          }
        />
      </div>
    </Card>
  );
}

export default ProductCard;
