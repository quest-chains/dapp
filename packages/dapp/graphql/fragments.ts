import { gql } from 'graphql-tag';

export const QuestChainInfoFragment = gql`
  fragment QuestChainInfo on QuestChain {
    address: id
    name
    description
    quests {
      questId
      name
      description
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

export const QuestStatusInfoFragment = gql`
  fragment QuestStatusInfo on QuestStatus {
    id
    status
    questChain {
      ...QuestChainInfo
    }
    quest {
      questId
      name
      description
    }
    user {
      id
    }
    submissions {
      timestamp
      description
      externalUrl
    }
    reviews {
      accepted
      timestamp
      description
      externalUrl
      reviewer {
        id
      }
    }
  }
  ${QuestChainInfoFragment}
`;
