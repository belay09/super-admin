import { useMutation } from "@vue/apollo-composable";

export default function (query, clientId) {
  const { mutate, onDone, loading, onError } = useMutation(query, () => ({
    fetchPolicy: "network-only",

    clientId: "Authorizer",

  }));
  // onError((err) => notify(parse(err)));
  return {
    mutate,
    loading,
    onDone,
    onError,
  };
}
