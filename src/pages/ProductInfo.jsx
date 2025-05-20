import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  InputNumber,
  Rate,
  Skeleton,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CommentList from "../components/comment/comment-list";
import ImageCarousel from "../components/ImageCarousel";
import ProductSlide from "../components/product/product-slide";
import ProductVariation from "../components/product/product-variations";
import { areEqual, validateFormMoney } from "../helpers";
import { getAllCommentForProduct } from "../services/comment";
import {
  addProductToWishList,
  getCountFavorite,
  getInfoProduct,
  getRelatedProducts,
  increaseViewProduct,
  updateFavoriteProduct,
} from "../services/product";
import { socket } from "../socket";
import { useAddToCartMutation } from "../apis/cartApis";

function ProductInfo() {
  const { product_slug } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [productQuantity, setProductQuantity] = useState(1);
  const [totalFavorite, setTotalFavorite] = useState();
  const [isWishList, setIsWishList] = useState(false);
  const userStorage = useSelector((state) => state.user);
  const [commentPage, setCommentPage] = useState(1);
  const [commentLimit, setCommentLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(1);
  const [addToCart] = useAddToCartMutation();
  const [sku_id, setSku_id] = useState(null);
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const userId = userStorage._id;
  const userData = userStorage?.user;
  useEffect(() => {
    if (product) {
      setIsWishList(
        userData?.usr_wishList?.some((wish) => wish === product._id)
      );
    }
  }, [userData, product]);
  const increase = () => setProductQuantity(productQuantity + 1);
  const decrease = () =>
    setProductQuantity(productQuantity > 1 ? productQuantity - 1 : 1);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getInfoProduct(product_slug);
        setProduct(response.metadata);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [product_slug]);
  useEffect(() => {
    if (product) {
      async function fetchData() {
        try {
          const [increaseViewData, relatedData, favoriteData] =
            await Promise.all([
              // getAllCommentForProduct(product._id),
              increaseViewProduct(product._id),
              getRelatedProducts(product._id),
              getCountFavorite(product._id),
            ]);
          // setComments(commentData.metadata.data);
          setRelatedProducts(relatedData.metadata);
          setTotalFavorite(favoriteData.metadata);
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }
  }, [product]);
  useEffect(() => {
    async function fetchComment() {
      try {
        if (product) {
          const response = await getAllCommentForProduct(
            product._id,
            commentPage,
            commentLimit
          );
          setComments(response.metadata.data);
          setTotalRows(response.metadata.totalRows);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchComment();
  }, [commentPage, commentLimit, product]);
  const breadcrumbs = useMemo(() => {
    if (!product) return [];
    if (product)
      return product.product_category.map((category) => ({
        href: `/category/${category.category_id}`,
        title: category.category_name,
      }));
  }, [product]);
  const selectedCombination = useMemo(() => {
    return Object.values(selectedOptions).join(", ") || "";
  }, [selectedOptions]);
  const product_stock = useMemo(() => {
    if (!product) return 0;
    const foundModel = product.product_models.find(
      (model) => areEqual(model.sku_name, selectedCombination)
    );
    if (foundModel) return foundModel.sku_stock;
    else return product.product_quantity;
  }, [selectedCombination, product]);
  const product_price = useMemo(() => {
    if (!product) return 0;
    const foundModel = product.product_models.find(
      (model) => areEqual(model.sku_name, selectedCombination)
    );
    if (foundModel) return foundModel.sku_price;
    else return product.product_price;
  }, [selectedCombination, product]);
  const product_price_sale = useMemo(() => {
    if (!product) return 0;
    const foundModel = product.product_models.find(
      (model) => areEqual(model.sku_name, selectedCombination)
    );
    if (foundModel && foundModel.sku_price_sale > 0 && foundModel.sku_price_sale < foundModel.sku_price) return foundModel.sku_price_sale;
    else return product.product_price;
  }, [selectedCombination, product]);

  useEffect(() => {
    if (selectedCombination) {
      const foundModel = product.product_models.find(
        (model) => areEqual(model.sku_name, selectedCombination)
      );
      if (foundModel) setSku_id(foundModel.sku_id);
    }
  }, [selectedCombination, product]);
  //socket
  useEffect(() => {
    if (product) {
      socket.on(`updatedLikes:${product._id}`, ({ likesCount }) => {
        setTotalFavorite(likesCount);
      });

      return () => {
        socket.off(`updatedLikes:${product._id}`);
      };
    }
  }, [product]);
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("createdComment", ({ comment }) => {
      setComments((prev) => [comment, ...prev]);
    });

    return () => {
      socket.off("createdComment");
    };
  }, [socket]);

  const handleGotoCheckout = async () => {
    await handleAddToCart();
    setTimeout(() => {
      navigate("/checkout");
    }, [200]);
  };

  // end socket
  const handleAddToCart = async () => {
    if (!userData || Object.keys(userData).length === 0) {
      const currentUrl = window.location.href;
      navigate(`/login?nextUrl=${encodeURIComponent(currentUrl)}`);
    } else {
      const cart_products = {
        productId: product._id,
        shopId: product.product_shop,
        quantity: productQuantity,
        name: product.product_name,
        price: Number(product_price),
        image: product.product_thumb,
        size: selectedOptions["Size"],
        color: selectedOptions["Màu sắc"],
        sku_id: sku_id,
      };
      await addToCart(cart_products);
    }
  };
  const handleAddToWishList = async () => {
    if (!userData || Object.keys(userData).length === 0) {
      const currentUrl = window.location.href;
      navigate(`/login?nextUrl=${encodeURIComponent(currentUrl)}`);
    } else {
      // Add to wishlist logic here
      setIsWishList(!isWishList);
      // Call API to add to wishlist
      await addProductToWishList(product._id, userData._id);
      await updateFavoriteProduct(product._id, userData._id);
      socket.emit("likeProduct", { productId: product._id });
    }
  };
  if (!product) return <Skeleton />;

  return (
    <div>
      <Breadcrumb
        items={[
          {
            href: "/",
            title: "Trang chủ",
          },
          ...breadcrumbs,
          {
            href: `/${product_slug}`,
            title: product.product_name,
          },

          // Add more breadcrumbs as needed for the product page.
        ]}
      />
      <div className="grid grid-cols-12 gap-6 my-4 p-4 bg-white">
        <div className="col-span-4">
          <ImageCarousel
            images={product.product_images}
            width={440}
            height={440}
          />
        </div>
        <div className="col-span-8">
          <h2 className="text-xl mt-2 mb-2">{product.product_name}</h2>
          <div className="my-4 rating flex items-center gap-x-2">
            <div className="px-3 border-r border-gray-500">
              <span className=" mr-2 ">
                {product.product_rattingAvg.toFixed(1).toLocaleString("en-UK")}
              </span>
              <Rate
                value={product.product_rattingAvg}
                allowHalf
                disabled
                style={{
                  fontSize: "12px",
                }}
              />
            </div>
            <div className="px-3 border-r border-gray-500">
              <span className="text-sm text-gray-400">
                {comments?.length && comments.length} Đánh giá
              </span>
            </div>
            <div className="px-3">
              <span className="text-sm text-gray-400">
                {product.product_sold} đã bán
              </span>
            </div>
          </div>
          <div className="flex items-center gap-x-4 mb-4 p-4 bg-neutral-200/50">
            {product_price_sale < product.product_price ? (
              <>
                <p className="text-3xl text-red-500 font-semibold">
                  {validateFormMoney(product_price_sale)}{" "}
                  <sup>
                    <u>đ</u>
                  </sup>
                </p>
                <del className="text-base text-gray-400">
                  {validateFormMoney(product.product_price)}{" "}
                  <sup>
                    <u>đ</u>
                  </sup>
                </del>
                <p className="p-1 text-sm font-bold bg-red-100/70 text-red-500">
                  -
                  {Math.floor(
                    ((product.product_price - product.product_seller) /
                      product.product_price) *
                      100
                  )}
                  %
                </p>
              </>
            ) : (
              <p className="text-xl">
                {validateFormMoney(product.product_price)}{" "}
                <sup>
                  <u>đ</u>
                </sup>
              </p>
            )}
          </div>
          <ProductVariation
            variations={product.product_variations}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
          {/* <p>Bảng quy đổi kích thước</p> */}
          <div className="my-6 flex items-center">
            <span className="w-[100px]">Số lượng: </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #d9d9d9",
                width: "120px",
                justifyContent: "space-between",
              }}
            >
              <Button type="text" onClick={decrease} style={{ border: "none" }}>
                -
              </Button>
              <InputNumber
                value={productQuantity}
                onChange={setProductQuantity}
                min={1}
                max={product_stock}
                controls={false} // Ẩn nút tăng giảm mặc định
                style={{ textAlign: "center", border: "none", width: "40px" }}
              />
              <Button type="text" onClick={increase} style={{ border: "none" }}>
                +
              </Button>
            </div>
            <p className="ml-4 text-sm text-neutral-600/70">
              {product_stock} Sản phẩm có sẵn
            </p>
          </div>
          <div className="my-8 flex items-center gap-x-6 w-1/2">
            <Button
              size="large"
              type="default"
              variant="outlined"
              className="w-1/2"
              onClick={handleAddToCart}
            >
              <ShoppingCartOutlined />
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="large"
              type="primary"
              style={{
                backgroundColor: "#7C3FFF",
              }}
              onClick={handleGotoCheckout}
              className="w-1/2"
            >
              Mua ngay
            </Button>
          </div>
          <div
            className="my-4 flex items-center gap-x-2 cursor-pointer"
            onClick={handleAddToWishList}
          >
            {isWishList ? (
              <Tooltip placement="bottom" title="Xóa khỏi danh sách yêu thích">
                <HeartFilled className="text-red-500" />
              </Tooltip>
            ) : (
              <Tooltip placement="bottom" title="Thêm vào danh sách yêu thích">
                <HeartOutlined />
              </Tooltip>
            )}
            <p> {totalFavorite} Lượt thích</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-7 my-4">
        <ProductSlide products={relatedProducts} title="Sản phẩm liên quan" />
      </div>
      <div className="bg-white p-7 my-4">
        <Typography.Title
          level={4}
          style={{
            textTransform: "uppercase",
          }}
        >
          Chi tiết sản phẩm
        </Typography.Title>
        <div>
          <table className="w-full">
            <tbody>
              {product.product_attributes?.map((item, index) => (
                <tr
                  key={index}
                  className="mb-3 flex gap-x-4 py-2 px-2 text-base"
                >
                  <td
                    colSpan={4}
                    className="flex justify-start  items-center min-w-[120px] max-w-[240px]"
                  >
                    <p className="justify-start flex text-gray-600/70">
                      {item.id}:
                    </p>
                  </td>
                  <td colSpan={2} className="flex items-center">
                    <p className="justify-start flex">{item.value}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Typography.Title
            level={4}
            style={{
              textTransform: "uppercase",
            }}
          >
            Mô tả sản phẩm
          </Typography.Title>
          <div
            dangerouslySetInnerHTML={{ __html: product.product_description }}
          />
        </div>
      </div>
      <div className="bg-white p-7 my-4">
        <Typography.Title
          level={4}
          style={{
            textTransform: "uppercase",
          }}
        >
          Đánh giá sản phẩm
        </Typography.Title>

        <CommentList
          comments={comments}
          productId={product._id}
          currentPage={commentPage}
          limit={commentLimit}
          setCurrentPage={setCommentPage}
          setLimit={setCommentLimit}
          totalRows={totalRows}
        />
      </div>
    </div>
  );
}

export default ProductInfo;
