import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const NotFoundPage: React.FC = () => {
  const { push } = useRouter();
  useEffect(() => {
    push('/');
  }, [push]);
  return null;
};

export default NotFoundPage;
