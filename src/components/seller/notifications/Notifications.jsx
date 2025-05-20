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
        gap={10}
        style={{
          width: "100%",
          maxHeight: "480px",
          height: "100%",
          padding: "10px 20px",
          backgroundColor: "white",
          marginBottom: "20px",
          position: "relative",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#d9d9d9 #f1f1f1",

          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#d9d9d9",
            borderRadius: "4px",
          },
        }}
      >
        <div className="relative w-fit">
          <h1 className="font-semibold">Thông báo!</h1>
        </div>
        <div style={{ width: "100%" }}>
          {notifications.length > 0 ? (
            notifications
              .slice(0, 6)
              .map((notify) => (
                <NotificationItem
                  key={notify.notify_id}
                  Icon={NotificationOutlined}
                  notify_id={notify._id}
                  notify_content={notify.notify_content}
                  date={notify.createdAt}
                  isRead={notify.notify_isRead}
                />
              ))
          ) : (
            <Empty
              style={{
                width: "100%",
              }}
              description="Không có thông báo mới"
            />
          )}
        </div>
        <div
          style={{ marginTop: "auto", width: "100%", backgroundColor: "white" }}
        >
          <Link
            className="text-blue-400 hover:underline block text-center"
            to="/seller/notifications"
          >
            Xem tất cả
          </Link>
        </div>
      </Flex>
    </Suspense>
  );
}

export default Notifications;
