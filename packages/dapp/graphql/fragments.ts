import { gql } from 'graphql-tag';

export const QuestChainInfoFragment = gql`
  fragment QuestChainInfo on QuestChain {
    address: id
    name
    description
    admins {
      address: id
    }
    quests {
      questId
      name
      description
    }
    editors {
      address: id
    }
    reviewers {
      address: id
    }
  }
`;
