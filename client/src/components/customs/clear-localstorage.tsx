'use client';

import { useEffect } from 'react';

export default function ClearLocalStorage() {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return null; 
}
