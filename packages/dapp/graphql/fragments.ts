import { gql } from 'graphql-tag';

export const QuestChainInfoFragment = gql`
  fragment QuestChainInfo on QuestChain {
    address: id
    name
    description
    imageUrl
    externalUrl
    createdAt
    createdBy {
      address: id
    }
    admins {
      address: id
    }
    editors {
      address: id
    }
    reviewers {
      address: id
    }
  }
`;
