import { Statistic } from "antd";
import CountUp from "react-countup";

function StatisticCustom({ value, title }) {
  const formatter = (value) => <CountUp end={value} separator="." />;
  return <Statistic title={title} value={value} formatter={formatter} />;
}

export default StatisticCustom;
