/* eslint-disable no-console, no-await-in-loop */
import { gql, request } from 'graphql-request';

import { GRAPH_HEALTH_ENDPOINT, SUBGRAPH_NAME } from '@/utils/constants';

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

export const getLatestBlock = async (): Promise<number> => {
  const data = await request(GRAPH_HEALTH_ENDPOINT, statusQuery, {
    subgraph: SUBGRAPH_NAME,
  });
  return data.status.chains[0].latestBlock.number;
};

const UPDATE_INTERVAL = 10000;

class GraphHealthStore {
  public latestBlock = 0;

  constructor() {
    this.updateGraphHealth();
  }

  public async updateGraphHealth() {
    try {
      this.latestBlock = await getLatestBlock();
      console.log(`Updated Graph Status, Latest Block: ${this.latestBlock}`);
    } catch (error) {
      console.error('Error fetching Graph Status:', error);
    }

    setTimeout(() => this.updateGraphHealth(), UPDATE_INTERVAL);
  }
}

const graphHealthStore = new GraphHealthStore();

export const getGraphLatestBlock = (): number => graphHealthStore.latestBlock;
