import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotification } from "../../services/notifications";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const data = useSelector((state) => state.user);

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotification(user._id, true, false);
      const data = response.metadata;
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Không thể tải thông báo. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thông báo</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">Không có thông báo nào</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow hover:shadow-md transition-shadow ${
                notification.notify_isRead ? 'bg-white' : 'bg-blue-50'
              }`}
              onClick={() => !notification.notify_isRead}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-semibold ${!notification.notify_isRead ? 'text-blue-600' : ''}`}>
                    {notification.notify_title}
                  </h3>
                  <div
                    className="text-gray-600 mt-1"
                    dangerouslySetInnerHTML={{
                      __html: notification.notify_content,
                    }}
                  />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500">
                    {format(
                      new Date(notification.createdAt),
                      "dd/MM/yyyy HH:mm",
                      {
                        locale: vi,
                      }
                    )}
                  </span>
                  {!notification.notify_isRead && (
                    <span className="text-xs text-blue-500 mt-1">Chưa đọc</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
