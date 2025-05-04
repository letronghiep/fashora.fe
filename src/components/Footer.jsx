import { FacebookFilled, InstagramFilled } from "@ant-design/icons";
import { Input } from "antd";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="my-4 bg-white">
      <div className="p-6 max-w-[1440px] mx-auto grid grid-cols-12 gap-x-3">
        <div className="col-span-3">
          <h2 className="text-2xl font-medium">Thời trang Fashora</h2>
          <Link
            to="/"
            onClick={() => {
              window.location.refresh();
            }}
            className="flex items-center gap-x-2 my-4"
          >
            <img alt="Logo" src="/logo-l.png" width={200} height={120} />
          </Link>
          <div className="flex flex-col gap-y-4 my-4">
            <p>
              Thương hiệu thời trang đẹp từ năm 2023. Fashora luôn muốn mang sự
              thoải mái và hài lòng đến Khách hàng.
            </p>
            <div>
              <b>Địa chỉ:</b>
              <span className="ml-3">
                Số 8- NV8, Green Park, ngõ 319 Vĩnh Hưng, P. Thanh Trì, Q. Hoàng
                Mai, Hà Nội
              </span>
            </div>
            <div>
              <b>Điện thoại:</b>
              <span className="ml-3">
                1800.646.809 LH làm Đại lý: 0962.800.126
              </span>
            </div>
            <div>
              <b>Email:</b>
              <span className="ml-3">info@fashora.vn</span>
            </div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col items-center">
          <h2 className="text-2xl font-medium">Hỗ trợ khách hàng</h2>
          <ul className="flex flex-col gap-y-4 my-4 w-full ml-32">
            <li>
              <Link to="/huong-dan-chon-size">Hướng dẫn chọn size</Link>
            </li>
            <li>
              <Link to="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
            </li>
            <li>
              <Link to="/thanh-toan">Thanh toán - giao nhận</Link>
            </li>
            <li>
              <Link to="/bao-mat-thong-tin">Bảo mật thông tin</Link>
            </li>
          </ul>
        </div>
        <div className="col-span-3">
          <h2 className="text-2xl font-medium">Thông tin về Fashora</h2>
          <ul className="flex flex-col gap-y-4 my-4">
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/he-thong">Hệ thống cửa hàng</Link>
            </li>
          </ul>
        </div>
        <div className="col-span-3">
          <h2 className="text-2xl font-medium">FANPAGE</h2>
          <div className="flex items-center gap-x-3">
            <Link to="https://www.facebook.com/fashora.vn">
              <FacebookFilled />
            </Link>
            <Link to="https://www.instagram.com/fashora.vn">
              <InstagramFilled />
            </Link>
          </div>
          <div className="my-4">
            <h3 className="text-base font-medium">
              Đăng ký nhận thông tin ưu đãi
            </h3>
            <Input
              className="my-4"
              addonAfter="Đăng ký"
              placeholder="Vui lòng nhập email của bạn"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
