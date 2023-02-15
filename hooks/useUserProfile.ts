import { useCallback, useEffect, useState } from 'react';

import { MongoUser } from '@/lib/mongodb/types';

import { useRefresh } from './useRefresh';

export const fetchUserProfile = async (
  addressOrUsername: string,
): Promise<MongoUser | null> => {
  if (!addressOrUsername) return null;
  const res = await fetch('/api/profile/' + addressOrUsername);
  if (res.ok && res.status === 200) {
    return await res.json();
  }
  return null;
};

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
    try {
      setFetching(true);
      setProfile(await fetchUserProfile(addressOrUsername));
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
