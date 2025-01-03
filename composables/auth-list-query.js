const xHasuraRole = useCookie("x-hasura-role");
export default (query, filter, order, offset, limit, enabled) => {
  const { onResult, onError, loading, refetch } = useQuery(
    query,
    () => ({
      offset: offset && offset.value,
      limit: limit && limit.value,
      order: order && order?.value?.length ? order.value : undefined,
      filter: filter.value,
    }),
    () => ({
      fetchPolicy: "network-only",
      clientId: "authClient",
      context: {
        headers: {
          "x-hasura-role": xHasuraRole.value,
        },
      },
      enabled: enabled ? enabled.value : true,
    })
  );

  return {
    onResult,
    onError,
    loading,
    refetch,
  };
};
