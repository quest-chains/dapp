/* eslint-disable @typescript-eslint/no-unused-expressions */
import { gql } from 'graphql-tag';

import { QuestChainInfoFragment, QuestStatusInfoFragment } from './fragments';

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
  query QuestChainsReviewStatus($reviewer: String!, $first: Int) {
    questChains(first: $first, where: { reviewers_contains: [$reviewer] }) {
      address: id
      name
      description
      questsFailed {
        id
      }
      questsPassed {
        id
      }
      questsInReview {
        id
      }
    }
  }
`;

gql`
  query StatusForChain($address: String!, $reviewer: String!, $first: Int) {
    questStatuses(first: $first, where: { questChain: $address }) {
      ...QuestStatusInfo
    }
  }
  ${QuestStatusInfoFragment}
`;

gql`
  query StatusForUser($user: String!, $first: Int) {
    questStatuses(first: $first, where: { user: $user }) {
      ...QuestStatusInfo
    }
  }
  ${QuestStatusInfoFragment}
`;
