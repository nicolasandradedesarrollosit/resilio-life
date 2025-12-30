'use client';

import { useEffect } from 'react';

export function ConsoleBlocker() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV) {
      const noop = () => {};
      
      console.log = noop;
      console.info = noop;
      console.warn = noop;
      console.debug = noop;
      console.error = noop;
    }
  }, []);

  return null;
}