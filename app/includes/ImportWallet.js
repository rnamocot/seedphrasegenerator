// ImportWallet.js
'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { HDNode } from '@ethersproject/hdnode';
import * as bip39 from 'bip39';

const ImportWallet = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setWallet] = useState(null);
  const [nativeBalance, setNativeBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [error, setError] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [network, setNetwork] = useState('eth');

  const RPCS = {
    eth: 'https://eth-mainnet.g.alchemy.com/v2/mvC1xT227wLpvNhDuPNw6CrSShrPRBZM',
    bsc: 'https://bsc-dataseed.binance.org',
    etc: 'https://www.ethercluster.com/etc'
  };

  const TOKENS = {
    eth: [
      {
        name: 'USDT',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      }
    ],
    bsc: [
      {
        name: 'BUSD',
        address: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
      },
      {
        name: 'USDT',
        address: '0x55d398326f99059ff775485246999027b3197955'
      }
    ],
    etc: [] // ETC typically doesn't use tokens
  };

  const handleImport = async () => {
    try {
      const trimmed = mnemonic.trim();
      if (!bip39.validateMnemonic(trimmed)) {
        setError('❌ Invalid seed phrase');
        setWallet(null);
        return;
      }

      const hdnode = HDNode.fromMnemonic(trimmed);
      const importedWallet = new ethers.Wallet(hdnode.privateKey);
      setWallet(importedWallet);
      setError('');

      const provider = new ethers.JsonRpcProvider(RPCS[network]);

      const balance = await provider.getBalance(importedWallet.address);
      setNativeBalance(ethers.formatEther(balance));

      const tokens = TOKENS[network];
      const erc20Abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ];

      const results = [];

      for (const token of tokens) {
        const contract = new ethers.Contract(token.address, erc20Abi, provider);
        const raw = await contract.balanceOf(importedWallet.address);
        const decimals = await contract.decimals();
        results.push({
          name: token.name,
          balance: ethers.formatUnits(raw, decimals)
        });
      }

      setTokenBalances(results);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to import wallet or fetch balances');
      setWallet(null);
    }
  };

  const copyToClipboard = async (text, field) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 1500);
  };

  return (
    <div className="mt-5 p-6 max-w-lg mx-auto bg-sky-200 rounded shadow space-y-4 justify-center align-middl space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">🔐 Import Wallet</h2>

      <textarea
        placeholder="Enter seed phrase"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        className="w-full p-2 border rounded resize-none"
        rows={3}
      />

      <div>
        <label className="mr-3 font-semibold">Select Network:</label>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="eth">Ethereum</option>
          <option value="bsc">BNB Smart Chain</option>
          <option value="etc">Ethereum Classic</option>
        </select>
      </div>

      <button
        onClick={handleImport}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Import Wallet
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {wallet && (
        <div className="bg-gray-100 p-3 rounded font-mono break-words space-y-2">
          <div>
            <strong>Address:</strong> {wallet.address}
            <button
              onClick={() => copyToClipboard(wallet.address, 'address')}
              className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded"
            >
              {copiedField === 'address' ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {nativeBalance !== null && (
            <div>
              <strong>{network.toUpperCase()}:</strong> {nativeBalance}
            </div>
          )}

          {tokenBalances.map((token) => (
            <div key={token.name}>
              <strong>{token.name}:</strong> {token.balance}
            </div>
          ))}

          <div>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={showPrivateKey}
                onChange={() => setShowPrivateKey(!showPrivateKey)}
              />
              <span>Show Private Key (dev only)</span>
            </label>

            {showPrivateKey && (
              <div className="mt-1">
                {wallet.privateKey}
                <button
                  onClick={() => copyToClipboard(wallet.privateKey, 'privateKey')}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded"
                >
                  {copiedField === 'privateKey' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportWallet;