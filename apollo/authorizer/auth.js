import { defineApolloClient } from "@nuxtjs/apollo";

export default defineApolloClient({
  httpEndpoint: process.env.USER_GRAPHQL_ENDPOINT,
  browserHttpEndpoint: process.env.USER_GRAPHQL_ENDPOINT,
  tokenName: "accessToken",
  httpLinkOptions: {},
  defaultOptions: {},
  inMemoryCacheOptions: {},
});
