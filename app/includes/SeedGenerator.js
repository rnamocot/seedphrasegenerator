import React, { useState } from 'react';
import * as bip39 from 'bip39';

const SeedGenerator = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [wordCount, setWordCount] = useState(12);
  const [useFake, setUseFake] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSeed = () => {
    const strength = wordCount === 24 ? 256 : 128;
    let phrase = bip39.generateMnemonic(strength);

    // Optionally replace last word with a fake one
    if (useFake) {
      const fakeWord = 'hovercraft'; // Not in BIP-39 wordlist
      const words = phrase.split(' ');
      words[words.length - 1] = fakeWord;
      phrase = words.join(' ');
    }

    setSeedPhrase(phrase);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Seed Phrase Generator</h2>

      <div className="space-x-3">
        <label>
          <input
            type="radio"
            value={12}
            checked={wordCount === 12}
            onChange={() => setWordCount(12)}
          />
          12 words
        </label>
        <label>
          <input
            type="radio"
            value={24}
            checked={wordCount === 24}
            onChange={() => setWordCount(24)}
          />
          24 words
        </label>
      </div>

      <div className="space-x-2">
        <label>
          <input
            type="checkbox"
            checked={useFake}
            onChange={() => setUseFake(!useFake)}
          />
          Insert fake last word
        </label>
      </div>

      <button
        onClick={generateSeed}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Seed Phrase
      </button>

      {seedPhrase && (
        <>
          <div className="bg-gray-100 p-3 rounded font-mono break-words">
            {seedPhrase}
          </div>

          <button
            onClick={copyToClipboard}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </>
      )}
    </div>
  );
};

export default SeedGenerator;
