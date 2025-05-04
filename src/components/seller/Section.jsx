import { Flex, Typography } from "antd";
import { Link } from "react-router-dom";

function Section({ title, children, subTitle, href, viewLink }) {
  return (
    <Flex
      style={{
        width: "100%",
        // backgroundColor: "white",
        padding: "10px 20px",
      }}
      vertical="true"
    >
      <Flex gap={10}>
        <Typography.Title
          style={{
            margin: 0,
          }}
          level={5}
        >
          {title}
        </Typography.Title>
        <Typography.Text
          style={{
            color: "#9ca3af",
          }}
        >
          {subTitle}
        </Typography.Text>
        <Link
          style={{ marginLeft: "auto", marginRight: "20px", color: "#1677ff" }}
          className="hover:underline"
          to={href}
        >
          {viewLink}
        </Link>
      </Flex>
      <>{children}</>
    </Flex>
  );
}

export default Section;
