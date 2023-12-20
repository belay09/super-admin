import { defineApolloClient } from "@nuxtjs/apollo";
export default defineApolloClient({
  httpEndpoint: process.env.GRAPHQL_ENDPOINT,
  browserHttpEndpoint: process.env.GRAPHQL_ENDPOINT,
  httpLinkOptions: {},
  defaultOptions: {},
  websocketsOnly: false,
  inMemoryCacheOptions: {},
});
