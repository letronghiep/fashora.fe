import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import Information from "~/components/seller/profiles/Information";
import useResponsive from "~/hooks/useResponsive";

function CreateUser() {
  const { isMobile } = useResponsive();
  const params = useParams();
  const userId = params.userId;
  const tabs = [
    {
      label: "Thông tin cơ bản",
      key: "1",
      children: <Information userId={userId?.toString() || ""} />,
    },
    // {
    //   label: "Địa chỉ",
    //   key: "2",
    //   children: (
    //     <Shippings
    //       shippingData={data}
    //       loadingShipping={loading}
    //       error={error}
    //     />
    //   ),
    // },
  ];
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={tabs}
        style={{
          width: "100%",
          padding: `${isMobile ? "0 10px" : "0px 20px"}`,
        }}
      />
    </>
  );
}

export default CreateUser;
