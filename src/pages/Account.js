import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alchemy, Network, Utils } from 'alchemy-sdk';

const alchemy = new Alchemy({
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

function Account() {
  const { address } = useParams();

  const [balance, setBalance] = useState(null);
  const [txCount, setTxCount] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAccountData() {
      try {
        // 1 Balance
        const wei = await alchemy.core.getBalance(address);
        setBalance(Utils.formatEther(wei));

        // 2 Tx Count (nonce)
        const count = await alchemy.core.getTransactionCount(address);
        setTxCount(count);

        // 3 Recent Transfers
        const transfersRes = await alchemy.core.getAssetTransfers({
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: address,
            toAddress: address,
            category: ['external'],
            order: 'desc',
            maxCount: 10,
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load account data');
        }
    }

    loadAccountData();
  }, [address]);

  return (
    <div className="container">
      <h1>Account</h1>

      <div className="card">
        <div className="detail-row">
          <strong>Address:</strong> {address}
        </div>

        {balance && (
          <div className="detail-row">
            <strong>Balance:</strong> {balance} ETH
          </div>
        )}

        {txCount !== null && (
          <div className="detail-row">
            <strong>Tx Count:</strong> {txCount}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Recent Transactions</h2>

        {transfers.length === 0 && <p>No recent transactions</p>}

        <ul className="tx-list">
          {transfers.map((tx) => (
            <li key={tx.hash}>
              <div>
                <strong>Hash:</strong>{' '}
                <Link to={`/tx/${tx.hash}`}>
                  {tx.hash.slice(0, 20)}...
                </Link>
              </div>
              <div>
                <strong>From:</strong> {tx.from}
              </div>
              <div>
                <strong>To:</strong> {tx.to}
              </div>
              <div>
                <strong>Value:</strong>{' '}
                {tx.value ? `${tx.value} ETH` : '—'}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Account;
