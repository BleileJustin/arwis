const WalletBalance = (props) => {
  return (
    <h3 className={props.className}>
      {props.balance} {props.currency}
    </h3>
  );
};

export default WalletBalance;
