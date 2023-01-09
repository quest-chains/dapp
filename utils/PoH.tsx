export const PoHAPI =
  'https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet';

export const getRegisteredStatus = `
query GetRegisteredStatus ($id: ID!) {
  submission(id: $id) {
    registered
  }
}
`;

export const getRegisteredStatuses = `
query GetRegisteredStatuses ($id: [ID!]) {
  submissions(where: { id_in: $id }) {
    registered
    id
  }
}
`;
