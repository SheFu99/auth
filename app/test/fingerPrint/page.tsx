'use client'

import { useFingerprint } from '@/hooks/use-Fingerprint';
import { useState } from 'react';

export default function FingerprintTestPage() {
  const fingerprint = useFingerprint();
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    if (!fingerprint) {
      setStatus('Fingerprint not generated yet.');
      return;
    }
    try {
      const res = await fetch('/api/store-fingerprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint })
      });
      console.log('Response',res)
      if (res.ok) {
        setStatus('Fingerprint saved to cookie.');
      } else {
        setStatus('Error saving fingerprint.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error sending fingerprint.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Fingerprint Test</h1>
      <p>Your fingerprint: {fingerprint || 'Generating...'}</p>
      <button onClick={handleSend}>
        Store Fingerprint in HTTP-Only Cookie
      </button>
      <p>{status}</p>
    </div>
  );
}
