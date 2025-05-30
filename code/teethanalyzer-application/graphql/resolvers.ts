// graphql/resolvers.ts

import { userQueries } from "./users/queries";
import { userMutations } from "./users/mutations";

import { scanRecordQueries } from "./scanRecords/queries";
import { scanRecordMutations } from "./scanRecords/mutations";

export const resolvers = {
  Query: {
    ...userQueries,
    ...scanRecordQueries,
  },
  Mutation: {
    ...userMutations,
    ...scanRecordMutations,
  },
};
