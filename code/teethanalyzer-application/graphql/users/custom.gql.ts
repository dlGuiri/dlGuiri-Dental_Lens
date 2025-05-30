export default /* GraphQL */ `
  type User {
    _id: ID!
    oauthProvider: String!
    oauthId: String!
    name: String!
    email: String!
    avatarUrl: String
    teeth_status: String
    scanRecords: [ScanRecord]
    createdAt: String
    updatedAt: String
  }
`;
