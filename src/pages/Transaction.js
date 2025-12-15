import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

const alchemy = new Alchemy({
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

function Transaction() {
  const { hash } = useParams();
  const [tx, setTx] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    async function loadTx() {
      const txData = await alchemy.core.getTransaction(hash);
      const receiptData = await alchemy.core.getTransactionReceipt(hash);
      setTx(txData);
      setReceipt(receiptData);
    }

    loadTx();
  }, [hash]);

  if (!tx) return <p>Loading transaction...</p>;

  return (
    <div className="container">
      <div className="card">
        <h2>Transaction</h2>

        <div className="detail-row">
          <strong>Hash:</strong>
          <span>{tx.hash}</span>
        </div>

        <div className="detail-row">
          <strong>From:</strong>
          <Link to={`/address/${tx.from}`}>{tx.from}</Link>
        </div>

        <div className="detail-row">
          <strong>To:</strong>
          {tx.to ? (
            <Link to={`/address/${tx.to}`}>{tx.to}</Link>
          ) : (
            <span>Contract Creation</span>
          )}
        </div>

        <div className="detail-row">
          <strong>Value:</strong>
          <span>{tx.value.toString()} wei</span>
        </div>

        <div className="detail-row">
          <strong>Status:</strong>
          <span>{receipt?.status === 1 ? 'Success' : 'Failed'}</span>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
