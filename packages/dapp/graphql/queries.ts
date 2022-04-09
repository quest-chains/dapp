/* eslint-disable @typescript-eslint/no-unused-expressions */
import { gql } from 'graphql-tag';

import { QuestChainInfoFragment } from './fragments';

gql`
  query QuestChainsInfo($limit: Int) {
    questChains(first: $limit) {
      ...QuestChainInfo
    }
  }
  ${QuestChainInfoFragment}
`;

gql`
  query QuestChainInfo($address: ID!) {
    questChain(id: $address) {
      ...QuestChainInfo
    }
  }
  ${QuestChainInfoFragment}
`;

gql`
  query QuestChainSearch($search: String, $first: Int) {
    questChains(
      first: $first
      where: { search_contains: $search }
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...QuestChainInfo
    }
  }
  ${QuestChainInfoFragment}
`;
