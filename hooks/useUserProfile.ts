import { useCallback, useEffect, useState } from 'react';

import { MongoUser } from '@/lib/mongodb/types';

import { useRefresh } from './useRefresh';

export const useUserProfile = (
  addressOrUsername: string,
): {
  profile: MongoUser | null;
  refresh: () => void;
  fetching: boolean;
} => {
  const [profile, setProfile] = useState<MongoUser | null>(null);
  const [fetching, setFetching] = useState(false);
  const [refreshCount, refresh] = useRefresh();

  const fetchProfile = useCallback(async () => {
    if (!addressOrUsername) {
      setProfile(null);
      return;
    }
    try {
      setFetching(true);
      const res = await fetch('/api/profile/' + addressOrUsername);
      if (res.ok && res.status === 200) {
        setProfile(await res.json());
      } else {
        setProfile(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching profile', error);
    } finally {
      setFetching(false);
    }
  }, [addressOrUsername]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refreshCount]);

  return {
    profile,
    refresh,
    fetching,
  };
};
