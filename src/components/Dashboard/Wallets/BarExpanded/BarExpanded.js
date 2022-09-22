import CurPair from "../Bar/CurPair";
import WalletValue from "../Bar/WalletValue";
import CurPairGraph from "./CurPairGraph";
import Algorithms from "./Algorithms";

const BarExpanded = () => {
  return (
    <div>
      <CurPair></CurPair>
      <WalletValue></WalletValue>
      <CurPairGraph></CurPairGraph>
      <Algorithms></Algorithms>
    </div>
  );
};

export default BarExpanded;
