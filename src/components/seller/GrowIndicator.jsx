import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Text } = Typography;

const GrowthIndicator = ({ percentage, comparisonPeriod, isPositive }) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
        {isPositive ? (
          <ArrowUpOutlined style={{ color: "green", marginRight: 4 }} />
        ) : (
          <ArrowDownOutlined style={{ color: "red", marginRight: 4 }} />
        )}
        <Text style={{ color: isPositive ? "green" : "red", fontWeight: 500 }}>
          {percentage}%
        </Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>
          (So với: {comparisonPeriod})
        </Text>
      </div>
    </div>
  );
};

export default GrowthIndicator;
