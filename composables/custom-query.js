const xHasuraRole = useCookie("x-hasura-role");
export default (query, variables) => {
  const { onResult, onError, loading, refetch } = useQuery(
    query,
    () => variables.value,
    () => ({
      fetchPolicy: "network-only",
      clientId: "authClient",
      context: {
        headers: {
          "x-hasura-role": xHasuraRole.value,
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
