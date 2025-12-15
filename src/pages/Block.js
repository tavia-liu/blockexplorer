import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

const alchemy = new Alchemy({
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

function Block() {
  const { number } = useParams();
  const [block, setBlock] = useState(null);

  useEffect(() => {
    async function loadBlock() {
      const data = await alchemy.core.getBlockWithTransactions(
        Number(number)
      );
      setBlock(data);
    }
    loadBlock();
  }, [number]);

  if (!block) return <p>Loading...</p>;

    return (
    <div className="container">
      {/* ===== Block Summary ===== */}
      <div className="card">
        <h2>Block #{block.number}</h2>

        <div className="detail-row">
          <strong>Hash:</strong>
          <span>{block.hash}</span>
        </div>

        <div className="detail-row">
          <strong>Timestamp:</strong>
          <span>
            {new Date(block.timestamp * 1000).toLocaleString()}
          </span>
        </div>

        <div className="detail-row">
          <strong>Transactions:</strong>
          <span>{block.transactions.length}</span>
        </div>
      </div>

      {/* ===== Transaction List ===== */}
      <div className="card">
        <h3>Transactions</h3>

        <ul className="tx-list">
          {block.transactions.slice(0, 10).map((tx) => (
            <li key={tx.hash}>
              <Link to={`/tx/${tx.hash}`}>
                {tx.hash}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Block;