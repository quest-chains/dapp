/* eslint-disable no-console, no-await-in-loop */
import { gql, request } from 'graphql-request';

import { GRAPH_HEALTH_ENDPOINT } from '@/utils/constants';
import { SUPPORTED_NETWORK_INFO } from '@/web3/networks';

const statusQuery = gql`
  query getGraphStatus($subgraph: String!) {
    status: indexingStatusForCurrentVersion(subgraphName: $subgraph) {
      chains {
        latestBlock {
          number
        }
      }
    }
  }
`;

export const getLatestBlock = async (subgraph: string): Promise<number> => {
  const data = await request(GRAPH_HEALTH_ENDPOINT, statusQuery, {
    subgraph,
  });
  return data.status.chains[0].latestBlock.number;
};

const UPDATE_INTERVAL = 10000;

class GraphHealthStore {
  graphHealth: Record<string, number> = {};

  constructor() {
    this.updateGraphHealth();
  }

  public async updateGraphHealth() {
    await Promise.all(
      Object.values(SUPPORTED_NETWORK_INFO).map(async info => {
        this.graphHealth[info.chainId] = await getLatestBlock(
          info.subgraphName,
        );
      }),
    );
    console.log('Updated Graph Health', this.graphHealth);
    setTimeout(() => this.updateGraphHealth(), UPDATE_INTERVAL);
  }

  status() {
    return this.graphHealth;
  }
}

const HealthStoreSingleton = (function () {
  let instance: GraphHealthStore;

  function createInstance() {
    return new GraphHealthStore();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const getGraphStatus = () => HealthStoreSingleton.getInstance().status();

export const initGraphHealthStore = getGraphStatus;

export const getGraphLatestBlock = (chainId: string): number =>
  getGraphStatus()[chainId];
