import { useEffect, useState } from "react";
import { axiosInstance } from "~/core/axiosInstance";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url);
        setData(response.data);
      } catch (error) {
        if (error) {
          setError(error);
        } else {
          setError(null); // Có thể xử lý lỗi khác ở đây nếu muốn
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, loading, error };
}
export default useFetch;
