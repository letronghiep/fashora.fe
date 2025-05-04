import HomeLayout from "../layout/HomeLayout";
import HomeLayoutNoSidebar from "../layout/HomeLayoutNoSidebar";
import ShopLayout from "../layout/ShopLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProductByCategory from "../pages/product-by-category";
import ProductInfo from "../pages/ProductInfo";
import RegisterPage from "../pages/RegisterPage";
import CategoriesListPage from "../pages/seller/categories/CategoriesListPage";
import CreateCategory from "../pages/seller/categories/CreateCategory";
import EditCategory from "../pages/seller/categories/EditCategory";
import OrderListPage from "../pages/seller/orders/OrderListPage";
import ProductCreatePage from "../pages/seller/product/ProductCreatePage";
import ProductEditPage from "../pages/seller/product/ProductEditPage";
import ProductListPage from "../pages/seller/product/ProductListPage";
import EditProfile from "../pages/seller/profile/edit/EditProfile";
import SalePage from "../pages/seller/SalePage";
import CreateUser from "../pages/seller/users/CreateUser";
import EditUser from "../pages/seller/users/EditUser";
import UserListPage from "../pages/seller/users/UserListPage";
import CreateVoucher from "../pages/seller/vouchers/CreateVoucher";
import EditVoucher from "../pages/seller/vouchers/EditVoucher";
import VoucherListPage from "../pages/seller/vouchers/VoucherListPage";
import UnauthorizedPage from "../pages/Unauthorized";
import CheckoutPage from "../pages/CheckoutPage";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import MyOrder from "../pages/MyOrder";
import OrderDetailPage from "../pages/OrderDetailPage";
import UserProfile from "../pages/UserProfile";
import FavoriteProductPage from "../pages/FavoriteProductPage";
import BannerList from "../pages/seller/banners/BannerList";
import NotificationsPage from "../pages/seller/NotificationsPage";
import SearchPage from "../pages/SearchPage";
import FlashsalePage from "../pages/seller/flashsale/FlashsalePage";
import CreateFlashSale from "../pages/seller/flashsale/CreateFlashSale";
import CreateBannerPage from "../pages/seller/banners/CreateBannerPage";
import EditBannerPage from "../pages/seller/banners/EditBannerPage";
import FlashSalePage from "../pages/seller/flashsale/FlashsalePage";
import FlashSale from "../pages/FlashSale";
// import ShopLayout from "../layout/ShopLayout";
// import EditProfile from "../pages/seller/profile/edit/EditProfile";
// import SalePage from "../pages/seller/SalePage";

// export const routes = [
//   {
//     path: "/",
//     component: HomePage,
//     exact: true,
//     private: false,
//     layout: HomeLayout,
//   },
//   {
//     path: "/login",
//     component: LoginPage,
//     exact: true,
//     private: false,
//   },
//   {
//     path: "/register",
//     component: RegisterPage,
//     private: false,
//   },
//   {
//     path: "/seller",
//     component: SalePage,
//   },
//   // Add more routes as needed...
//   {
//     path: "/unauthorized",
//     component: UnauthorizedPage,
//     private: false,
//   },
//   {
//     path: "/seller/profile/edit/:userId",
//     component: EditProfile,
//     private: true,
//   },
//   {
//     path: "*",
//     exact: true,
//     private: false,
//   },
//   {
//     path: "/seller/*",
//     private: true,
//     layout: ShopLayout,
//     permission: "shop",
//   },
// ];
export const routes = [
  {
    path: "/",
    component: HomePage,
    exact: true,
    private: false,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/favorite-products",
    component: FavoriteProductPage,
    exact: true,
    private: false,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/search",
    component: SearchPage,
    exact: true,
    private: false,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/profile",
    component: UserProfile,
    exact: true,
    private: false,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/checkout",
    component: CheckoutPage,
    exact: true,
    private: true,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/checkout/success",
    component: CheckoutSuccess,
    exact: true,
    private: true,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/my-orders",
    component: MyOrder,
    exact: true,
    private: true,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/my-orders/:orderId",
    component: OrderDetailPage,
    exact: true,
    private: true,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/:product_slug",
    component: ProductInfo,
    exact: true,
    private: false,
    layout: HomeLayoutNoSidebar,
  },
  {
    path: "/category/:category_id",
    component: ProductByCategory,
    exact: true,
    private: false,
    layout: HomeLayout,
  },
  {
    path: "/flashsale/:id",
    component: FlashSale,
    exact: true,
    private: false,
    layout: HomeLayout,
  },
  {
    path: "/login",
    component: LoginPage,
    exact: true,
    private: false,
    layout: null,
  },
  {
    path: "/register",
    component: RegisterPage,
    exact: true,
    private: false,
    layout: null,
  },
  {
    path: "/unauthorized",
    component: UnauthorizedPage,
    exact: true,
    private: false,
    layout: null,
  },
  {
    path: "/seller",
    component: SalePage, // Component chính của Seller
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/profile/edit/:userId",
    component: EditProfile,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/orders",
    component: OrderListPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/categories",
    component: CategoriesListPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/categories/create",
    component: CreateCategory,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/categories/edit/:categoryId",
    component: EditCategory,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/products",
    component: ProductListPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/products/create",
    component: ProductCreatePage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/products/edit/:productId",
    component: ProductEditPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/users",
    component: UserListPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/users/create",
    component: CreateUser,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/users/edit/:userId",
    component: EditUser,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/vouchers",
    component: VoucherListPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/vouchers/create",
    component: CreateVoucher,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/vouchers/edit/:voucherId",
    component: EditVoucher,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/banners",
    component: BannerList,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/banners/create",
    component: CreateBannerPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/banners/edit/:id",
    component: EditBannerPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/notifications",
    component: NotificationsPage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/flashsale",
    component: FlashsalePage,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  {
    path: "/seller/flashsale/create",
    component: CreateFlashSale,
    exact: true,
    private: true,
    layout: ShopLayout,
    permission: "shop",
  },
  // {
  //   path: "/seller/flashsale/edit/:id",
  //   component: EditFlashSale,
  //   exact: true,
  //   private: true,
  // },
];
