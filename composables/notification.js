import { useQuery } from "@vue/apollo-composable";
const xHasuraRole = useCookie("x-hasura-role");

export default function (query) {
  const { onResult, loading, onError, refetch, fetchMore } = useQuery(
    query,
    null,
    () => ({
      fetchPolicy: "network-only",
      clientId: "authClient",
      pollInterval: 60000, //update count every minute
      context: {
        headers: {
          "x-hasura-role": xHasuraRole.value,
        },
      },

    })
  );

  return {
    onResult,
    loading,
    refetch,
    onError,
    fetchMore,
  };
}