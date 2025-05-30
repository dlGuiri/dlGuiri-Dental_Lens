import gql from "graphql-tag";

import userTypeDefsCustom from "./users/custom.gql";
import userTypeDefsQueries from "./users/queries.gql";
import userTypeDefsMutations from "./users/mutations.gql";

import scanRecordTypeDefsCustom from "./scanRecords/custom.gql";
import scanRecordTypeDefsQueries from "./scanRecords/queries.gql";
import scanRecordTypeDefsMutations from "./scanRecords/mutations.gql";

export const typeDefs = gql`
  # Custom Types
  ${userTypeDefsCustom}
  ${scanRecordTypeDefsCustom}

  # Root Query Type
  type Query {
    ${userTypeDefsQueries}
    ${scanRecordTypeDefsQueries}
  }

  # Root Mutation Type
  type Mutation {
    ${userTypeDefsMutations}
    ${scanRecordTypeDefsMutations}
  }
`;
