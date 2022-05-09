import ReactApexChart from "react-apexcharts";
import { React, useState } from "react";

const ApexChart = (props) => {
  const [dateState, setDateState] = useState(new Date());
  console.log(dateState + "date");

  let data = {
    series: [
      {
        data: [
          {
            x: dateState,
            y: [6629.81, 6650.5, 6623.04, 6633.33],
          },
          {
            x: new Date(1538780400000),
            y: [6632.01, 6643.59, 6620, 6630.11],
          },
        ],
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
    setDateState(await props.getDate);
    console.log(dateState + "dateState");
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="candlestick"
        height={350}
      />

      <button className="callApiButt" onClick={dataHandler} />
    </div>
  );
};

//const domContainer = document.querySelector("#root");
//ReactDOM.render(React.createElement(ApexChart), domContainer);

export default ApexChart;
