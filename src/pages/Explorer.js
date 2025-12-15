import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
const alchemy = new Alchemy({
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

function Explorer() {
  const [latestBlock, setLatestBlock] = useState(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    async function loadBlocks() {
      const latest = await alchemy.core.getBlockNumber();
      setLatestBlock(latest);

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(alchemy.core.getBlock(latest - i));
      }

      const data = await Promise.all(promises);
      setBlocks(data);
    }

    loadBlocks();
  }, []);

  return (
    <div className="container">
      <h1>Ethereum Block Explorer</h1>

      <p>
        <strong>Latest Block:</strong> {latestBlock}
      </p>

      <div className="card">
        <h2>Recent Blocks</h2>

        <ul className="block-list">
          {blocks.map((block) => (
            <li key={block.number}>
              <Link to={`/block/${block.number}`}>
                Block #{block.number}
              </Link>

              <span className="muted">
                {new Date(block.timestamp * 1000).toLocaleTimeString()}
              </span>

              <span className="muted">
                {block.transactions.length} txns
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Explorer;
