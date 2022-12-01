import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { TrackEvent } from '@/utils/plausibleHelpers';

export const NotFoundPage: React.FC = () => {
  const { push } = useRouter();
  useEffect(() => {
    push('/');
    // @ts-ignore
    window.plausible(TrackEvent.Error);
  }, [push]);
  return null;
};

export default NotFoundPage;
