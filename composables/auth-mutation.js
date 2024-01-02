const xHasuraRole = useCookie("x-hasura-role");
export default function (mutation) {
  const { mutate, onDone, loading, onError } = useMutation(mutation, () => ({
    fetchPolicy: "network-only",
    clientId: "authClient",
    context:{
      headers:{
        "x-hasura-role":xHasuraRole.value
      }
    }
  }));
  return {
    onError,
    mutate,
    loading,
    onDone,
  };
}
