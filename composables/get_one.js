// import { useQuery } from "@vue/apollo-composable";




export default function (
  query,
  id
) {
  const { onResult, loading, onError, refetch } = useQuery(
    query,
    () => ({
      id
    }),
    () => ({
      fetchPolicy: 'network-only',
      clientId: "authClient",
      context: {
        headers: {
          'x-hasura-role':'shegeradmin'
        }
      },
      enabled: true
    })
  )
  //   onError((err) => notify(parse(err)));
  return {
    onResult,
    loading,
    refetch
  }
}
