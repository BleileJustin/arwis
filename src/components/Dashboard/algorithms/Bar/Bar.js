import CurPair from "./CurPair";
import WalletValue from "./WalletValue";

import css from './Bar.module.css'

const Bar = () => {
  return (
    <div className={css.bar}>
      <CurPair></CurPair>
      <WalletValue></WalletValue>
    </div>
  );
};

export default Bar;
