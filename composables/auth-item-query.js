const xHasuraRole = useCookie("x-hasura-role");
export default (query, id) => {
  const { onResult, onError, loading, refetch } = useQuery(
    query,
    () => ({
      id
    }),
    () => ({
      fetchPolicy: "network-only",
      clientId: "authClient",
      context:{
        headers:{
          "x-hasura-role:":xHasuraRole.value
        }
      }
    })
  );

  return {
    onResult,
    onError,
    loading,
    refetch,
  };
};
