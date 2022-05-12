import Chart from "./ApexChart";
import {useState} from "react";
import React from "react";

const ChartHandler = (props) => {
  const [getData, setGetData] = useState({});

  const connect = async () => {
    await fetch("/chart_socket").then((response) => response.json()).then((data) => setGetData(data));
  };

  return (<div>
    <React.StrictMode>
      <Chart getData={getData} callApi={connect}/>
    </React.StrictMode>
  </div>);
};

export default ChartHandler;
