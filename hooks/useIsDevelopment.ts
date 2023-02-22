import { useEffect, useState } from 'react';

export const useIsDevelopment = (): boolean => {
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    setIsDevelopment(
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
    );
  }, []);

  return isDevelopment;
};
