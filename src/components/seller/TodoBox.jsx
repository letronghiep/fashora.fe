import { Col, Statistic } from "antd";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
function TodoBox({ href, value, title, span }) {
  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <Col span={span}>
      <Link
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
        to={href}
      >
        <Statistic title={title} value={value} formatter={formatter} />
      </Link>
    </Col>
  );
}

export default TodoBox;
