import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2000) {
  const [copiedHex, setCopiedHex] = useState(null);

  const copyToClipboard = useCallback((hex) => {
    navigator.clipboard.writeText(hex).catch((err) => console.error('Copy failed:', err));
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), timeout);
  }, [timeout]);

  return { copiedHex, copyToClipboard };
}
