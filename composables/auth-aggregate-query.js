const xHasuraRole = useCookie("x-hasura-role");
export default (query) => {
  const { onResult, onError, loading } = useQuery(
    query,
    () => ({}),
    () => ({
      fetchPolicy: "network-only",
      clientId: "authClient",
      context: {
        headers: {
          "x-hasura-role:": xHasuraRole.value,
        },
      },
    })
  );

  return {
    onResult,
    onError,
    loading,
    refetch,
  };
};
