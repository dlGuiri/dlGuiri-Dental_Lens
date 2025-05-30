import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql", // Next.js API route
  cache: new InMemoryCache(),
});

export default client;
