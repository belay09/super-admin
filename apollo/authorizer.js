import { defineApolloClient } from "@nuxtjs/apollo";
export default defineApolloClient({
  httpEndpoint: process.env.USER_GRAPHQL_ENDPOINT,
  tokenStorage: "cookie",
  authHeader: "Authorization",
  tokenName: "authorizerAccessToken",
  httpLinkOptions: {},
  defaultOptions: {},
  inMemoryCacheOptions: {},
});