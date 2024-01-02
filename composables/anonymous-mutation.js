const defaultClientId = ref("shegerAnonymous");
export default function (mutation , clientId=defaultClientId) {
  const { mutate, onDone, loading, onError } = useMutation(mutation, () => ({
    fetchPolicy: "network-only",
    clientId: clientId.value,
  }));
  return {
    onError,
    mutate,
    loading,
    onDone,
  };
}
