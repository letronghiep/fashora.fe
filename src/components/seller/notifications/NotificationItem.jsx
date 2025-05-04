import { Flex } from "antd";
import { formatTime } from "../../../helpers/formatDate";
import { readNotification } from "../../../services/notifications";

function NotificationItem({ Icon, notify_id, notify_content, date, isRead }) {
  const handleReadNotification = async () => {
    // TODO: Read notification
    await readNotification(notify_id, true);
  };
  return (
    <Flex
      className={`cursor-pointer group py-4 ${!isRead ? 'bg-blue-50' : ''}`}
      style={{
        width: "100%",
      }}
      vertical
      onClick={handleReadNotification}
    >
      <Flex gap={10} align="start" style={{ width: "100%" }}>
        <Icon
          style={{
            marginTop: "6px",
            color: !isRead ? '#1677ff' : 'inherit'
          }}
        />
        <div  
          className={`text-sm group-hover:text-blue-500 ${!isRead ? 'font-medium' : ''}`}
          dangerouslySetInnerHTML={{
            __html: notify_content,
          }}
        />
      </Flex>
      <p className="text-gray-400 text-xs italic ml-6">{formatTime(date)}</p>
    </Flex>
  );
}
export default NotificationItem;
