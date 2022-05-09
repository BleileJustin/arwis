import Chart from "./ApexChart";
import { useState } from "react";

const ChartHandler = (props) => {
  const [getDate, setGetDate] = useState();
  const callApi = async () => {
    await fetch("/candlestick")
      .then((response) => response.json())
      .then((data) => setGetDate(data[0]));
    console.log(getDate + "getDate");
    return getDate;
  };

  return (
    <div>
      <Chart getDate={callApi} />;
    </div>
  );
};

export default ChartHandler;
