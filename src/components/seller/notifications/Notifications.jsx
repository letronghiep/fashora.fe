import { NotificationOutlined } from "@ant-design/icons";
import { Empty, Flex } from "antd";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem";

function Notifications({ notifications }) {
  return (
    <Suspense>
      <Flex
        vertical
        align="center"
        style={{
          width: "100%",
          height: "fit-content",
          maxHeight: "100%",
          padding: "10px 20px",
          backgroundColor: "white",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <div className="relative w-fit">
          <h1 className="font-semibold">Thông báo!</h1>
          {/* <span className="absolute -top-2 -right-7 rounded-full bg-[#1677ff] px-2 py-1 text-xs text-white">
            {count}
          </span> */}
        </div>
        {notifications.length > 0 ? (
          notifications.map(
            (notify, idx) =>
              idx < 6 && (
                <NotificationItem
                  key={notify.notify_id}
                  Icon={NotificationOutlined}
                  notify_id={notify._id}
                  notify_content={notify.notify_content}
                  date={notify.createdAt}
                  isRead={notify.notify_isRead}
                />
              )
          )
        ) : (
          <Empty
            style={{
              width: "100%",
            }}
            description="Không có thông báo mới"
          />
        )}
        <Link
          className="text-blue-400 hover:underline"
          to="/seller/notifications"
        >
          Xem tất cả
        </Link>
      </Flex>
    </Suspense>
  );
}

export default Notifications;
