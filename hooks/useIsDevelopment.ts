import { useEffect, useMemo, useState } from 'react';

export const useIsDevelopment = (): boolean => {
  // const [clientData, setClientData] = useState();
  const [isDevelopment, setIsDevelopment] = useState(false);

  const hasWindow = typeof window !== 'undefined';

  useEffect(() => {
    if (hasWindow) {
      const isDevelopment =
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test';
      setIsDevelopment(isDevelopment);
    }
  }, [hasWindow]);

  const value = useMemo(() => isDevelopment, [isDevelopment]);

  return value;
};
