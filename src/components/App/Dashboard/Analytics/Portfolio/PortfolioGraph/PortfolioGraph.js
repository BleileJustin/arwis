import css from "./PortfolioGraph.module.css";

const PortfolioGraph = () => {
  const tickHandler = async () => {
    const symbol = prompt("Choose a currency pair");
    symbol
      ? await fetch(`http://localhost:3000/ticker/${symbol}`)
          .then((res) => res.json())
          .then((data) => console.log(data))
      : console.log("err");
    return symbol;
  };
  //tickHandler();

  return <div className={css.portfolio_graph_container}></div>;
};

export default PortfolioGraph;
