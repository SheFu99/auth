import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    // Initialize FingerprintJS
    FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        setFingerprint(result.visitorId);
      })
      .catch((err) => {
        console.error('Error generating fingerprint:', err);
      });
  }, []);

  return fingerprint;
}
