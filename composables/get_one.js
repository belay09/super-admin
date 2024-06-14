// import { useQuery } from "@vue/apollo-composable";


const defaultClientId = ref('shegeradmin')
const defaultEnabled = ref(true)

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
      clientId: clientId?.value,
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
