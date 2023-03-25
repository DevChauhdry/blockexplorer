import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

const Link = ({ item, onClick }) => {
  return (
    <a
      href="-"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {item}
    </a>
  );
};

const LabelValue = ({ label, value, onValueClick }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <span className="label">{label}</span>
      <span>
        {onValueClick ? (
          <Link item={value} onClick={() => onValueClick(label)} />
        ) : (
          value
        )}
      </span>
    </div>
  );
};

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockData, setBlockData] = useState();
  const [showTransactions, setShowTransactions] = useState(false);
  const [address, setAddress] = useState("");
  const [addressBalance, setAddressBalance] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });

  useEffect(() => {
    async function getBlockWithTransactions() {
      const response = await alchemy.core.getBlockWithTransactions();
      setBlockData(response);
    }

    getBlockWithTransactions();
  }, [blockNumber]);

  const itemClickAction = (key) => {
    if (key === "transactions") {
      setShowTransactions((st) => !st);
    }
  };

  const onInputChange = (e) => {
    setAddress(e.target.value);
  };

  const getBalance = async () => {
    const response = await alchemy.core.getBalance(address);
    setAddressBalance(Utils.formatEther(response.toString()));
  };

  return (
    <div className="App">
      <div className="blockAndTransaction">
        <h3>Block Number: {blockNumber}</h3>
        <div>
          <h3>Block Details</h3>
          {blockData && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "1000px",
                border: "2px solid black",
              }}
            >
              <LabelValue key="hash" label="hash" value={blockData.hash} />
              <LabelValue
                key="parentHash"
                label="parentHash"
                value={blockData.parentHash}
              />
              <LabelValue
                key="number"
                label="number"
                value={blockData.number}
              />
              <LabelValue
                key="timestamp"
                label="timestamp"
                value={blockData.timestamp}
              />
              <LabelValue key="nonce" label="nonce" value={blockData.nonce} />
              <LabelValue
                key="difficulty"
                label="difficulty"
                value={blockData.difficulty}
              />
              <LabelValue
                key="_difficulty"
                label="_difficulty"
                value={blockData._difficulty?.toString()}
              />
              <LabelValue
                key="gasLimit"
                label="gasLimit"
                value={blockData.gasLimit?.toString()}
              />
              <LabelValue
                key="gasUsed"
                label="gasUsed"
                value={blockData.gasUsed?.toString()}
              />
              <LabelValue key="miner" label="miner" value={blockData.miner} />
              <LabelValue
                key="extraData"
                label="extraData"
                value={blockData.extraData}
              />
              <LabelValue
                key="baseFeePerGas"
                label="baseFeePerGas"
                value={blockData.baseFeePerGas?.toString()}
              />
              <LabelValue
                key="transactions"
                label="transactions"
                value={blockData.transactions?.length}
                onValueClick={(key) => itemClickAction(key)}
              />
            </div>
          )}
        </div>

        {showTransactions && blockData && (
          <div>
            <h4>Transactions Detail:</h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "1000px",
                border: "2px solid black",
              }}
            >
              {blockData?.transactions.map((trx, index) => (
                <LabelValue
                  key={index}
                  label={`#${`${index + 1}`.padStart(3, "0")}`}
                  value={trx.hash}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="accountDetails">
        <h3>Account Details</h3>
        <div className="accountInput">
          <label>Input Account Address:</label>
          <div>
            <input
              style={{
                width: "250px",
              }}
              value={address}
              name="address"
              type={"text"}
              onChange={onInputChange}
            />
          </div>
          <button title="Get Balance" type="submit" onClick={getBalance}>
            Get Balance
          </button>
        </div>
        {addressBalance && (
          <div>Balance: {addressBalance?.slice(0, 5)} ETH</div>
        )}
      </div>
    </div>
  );
}

export default App;
