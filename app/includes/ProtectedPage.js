// components/ProtectedPage.js
'use client';

import { useState } from 'react';

const ProtectedPage = ({ children }) => {
  const [entered, setEntered] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const PASSWORD = 'Suman4sale!'; // 🔐 change this!

 const handleSubmit = (e) => {
  e.preventDefault();
  const input = passwordInput.trim();
  if (input === PASSWORD) {
    setEntered(true);
  } else {
    alert('Wrong password');
  }
};


  if (!entered) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-sky-200 rounded shadow space-y-4 justify-center align-middl">
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Wallet Balance Checker</h2>
          <h5 className="font-bold">🔐 Ako lang nakakaalam sa password hahaha</h5>
          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;
