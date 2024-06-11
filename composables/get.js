import { ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import useNotify from "@/use/notify";

const { notify } = useNotify();


const xHasuraRole = ref()
xHasuraRole.value = useCookie('x-hasura-default-role').value || 'shegeradmin'

// Default Values
const defaultClientId = ref('authClient')
// Default Values
const defaultEnabled = ref(true);
const defaultOffset = ref(0);
const defaultLimit = ref(60); // 60 is divisible by 2,3,4 and 5. hence making it compatible with most lists and tables.
const defaultFilter = ref({});

export default function (
    query,
    {
        filter = defaultFilter,
        limit = defaultLimit,
        offset = defaultOffset,
        enabled = defaultEnabled,
    }
) {
    const { onResult, loading, onError, refetch, fetchMore } = useQuery(
        query,
        () => ({
            limit: limit?.value,
            offset: offset?.value,
            where: filter?.value,
        }),
        () => ({
            fetchPolicy: "network-only",
            enabled: enabled.value,
            clientId: "authClient",
            context: {
                headers: {
                    'x-hasura-role':
                        "shegeradmin"
                }
            },
            pollInterval: 60000, //update count every minute

        })
    );

    // onError((err) => notify(parse(err)));

    return {
        onResult,
        loading,
        refetch,
        fetchMore,
    };
}
