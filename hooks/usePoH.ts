import { useCallback, useEffect, useState } from 'react';
import { createClient } from 'urql';

import { Role } from '@/components/RoleTag';
import {
  getRegisteredStatus,
  getRegisteredStatuses,
  PoHAPI,
} from '@/utils/PoH';

const client = createClient({
  url: PoHAPI,
});

export const fetchPoH = async (
  address: string | null | undefined,
): Promise<boolean> => {
  if (!address) return false;
  const data = await client
    .query(getRegisteredStatus, { id: address })
    .toPromise();
  return data?.data?.submission?.registered ?? false;
};

export const usePoH = (
  address: string | null | undefined,
): {
  registered: boolean;
  fetching: boolean;
} => {
  const [registered, setRegistered] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const getPoH = useCallback(async () => {
    try {
      setFetching(true);
      setRegistered(await fetchPoH(address));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching Proof of Humanity', error);
    } finally {
      setFetching(false);
    }
  }, [address]);

  useEffect(() => {
    getPoH();
  }, [getPoH]);

  return {
    registered,
    fetching,
  };
};

export const usePoHs = (roles: {
  [addr: string]: Role;
}): {
  statuses: {
    [addr: string]: boolean;
  };
} => {
  const [statusesPoH, setStatusesPoH] = useState<{
    [addr: string]: boolean;
  }>({});

  const getStatuses = useCallback(async () => {
    try {
      const addresses = Object.keys(roles);

      const statuses: { [addr: string]: boolean } = {};

      const data = await client
        .query(getRegisteredStatuses, { id: addresses })
        .toPromise();

      const submissions = data?.data?.submissions ?? [];
      addresses.forEach(address => {
        statuses[address] =
          submissions.find(
            (submission: { id: string }) => submission.id === address,
          )?.registered ?? false;
      });

      setStatusesPoH(statuses);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching Proof of Humanity', error);
    }
  }, [roles]);

  useEffect(() => {
    getStatuses();
  }, [getStatuses]);

  return {
    statuses: statusesPoH,
  };
};
