import { useQuery } from "@vue/apollo-composable";

export default function (query) {
  const { onResult, loading, onError, refetch, fetchMore } = useQuery(
    query,
    null,
    () => ({
      fetchPolicy: "network-only",
      clientId: "authClient",
      pollInterval: 60000, //update count every minute

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