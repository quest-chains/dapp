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

export const usePoH = (
  address: string | null | undefined,
): {
  registered: boolean;
} => {
  const [registered, setRegistered] = useState<boolean>(false);

  const getPOH = useCallback(async () => {
    try {
      const data = await client
        .query(getRegisteredStatus, { id: address })
        .toPromise();

      setRegistered(data?.data?.submission?.registered || false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching Proof of Humanity', error);
    }
  }, [address]);

  useEffect(() => {
    getPOH();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return {
    registered,
  };
};

export const usePoHs = (roles: {
  [addr: string]: Role;
}): {
  statuses: {
    [addr: string]: boolean;
  };
} => {
  const addresses = Object.keys(roles);
  const [statusesPoH, setStatusesPoH] = useState<{
    [addr: string]: boolean;
  }>({});

  const getStatuses = useCallback(async () => {
    try {
      const statuses: { [addr: string]: boolean } = {};

      const data = await client
        .query(getRegisteredStatuses, { id: addresses })
        .toPromise();

      const submissions = data?.data?.submissions;
      addresses.forEach(address => {
        statuses[address] = submissions.find(
          (submission: { id: string }) => submission.id === address,
        );
      });

      setStatusesPoH(statuses);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching Proof of Humanity', error);
    }
  }, [addresses]);

  useEffect(() => {
    getStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    statuses: statusesPoH,
  };
};
