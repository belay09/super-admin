import error from "~/plugins/error";

const xHasuraRole = useCookie("x-hasura-role");
export default (query, id) => {
  const { onResult, onError, loading, refetch } = useQuery(
    query,
    () => ({
      id,
    }),
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

  onError((error) => {
    console.log("error", error);
  });

  return {
    onResult,
    onError,
    loading,
    refetch,
  };
};
