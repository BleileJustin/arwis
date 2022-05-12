import ReactApexChart from "react-apexcharts";
import { React, useState } from "react";

const ApexChart = (props) => {
  const [dataState, setDataState] = useState(props.getData);

  const keys = Object.keys(dataState);
  const dataArray = [];
  keys.forEach((key) => {
    const dataKey = dataState[key];
    dataArray.push({
      x: new Date(parseInt(key)),
      y: [dataKey.open, dataKey.high, dataKey.low, dataKey.close],
    });
  });
  console.log(dataArray[0]);
  console.log("date");

  let data = {
    series: [
      {
        data: dataArray,
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: "CandleStick Chart",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };
  const dataHandler = async () => {
    await props.callApi();
    setDataState(props.getData);
    console.log(dataState);
    console.log("Data Handled");
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="candlestick"
        height={350}
      />

      <button className="callApiButt" onClick={dataHandler}>
        DataHandle
      </button>
    </div>
  );
};

//const domContainer = document.querySelector("#root");
//ReactDOM.render(React.createElement(ApexChart), domContainer);

export default ApexChart;
