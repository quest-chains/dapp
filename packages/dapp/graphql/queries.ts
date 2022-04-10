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
  query QuestChainAddresses($limit: Int!) {
    questChains(first: $limit) {
      address: id
    }
  }
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

gql`
  query QuestsToReview($reviewer: String!, $first: Int) {
    questChains(first: $first, where: { reviewers_contains: [$reviewer] }) {
      questsInReview {
        quest {
          questId
          name
          description
        }
        user {
          id
        }
      }
    }
  }
`;

gql`
  query QuestsStatus($user: String!, $first: Int) {
    questStatuses(first: $first, where: { user: $user }) {
      questChain {
        address: id
        name
        description
        quests {
          questId
        }
      }
      quest {
        questId
        name
        description
      }
      status
    }
  }
`;
