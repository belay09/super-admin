import { ref } from "vue";

const enable = ref(true);
const offset_ = ref(0);
const limit_ = ref(100);
const filter_ = ref({});
const client_ = ref("default");
const role_ = ref("user");

export default function (
	query,
	{
		filter = filter_,
		order,
		limit = limit_,
		offset = offset_,
		enabled = enable,
		role = role_,
		client = client_,
	},
	...args
) {
	const { onResult, onError, loading, refetch } = useQuery(
		query,
		() => ({
			limit: limit && limit?.value ? limit.value : undefined,
			filter: filter && filter.value ? filter.value : {},
			order: order && order?.value.length ? order.value : undefined,
			offset: offset && offset?.value ? offset.value : undefined,
			// true_false_filter: args[0]?.true_false_filter
			// 	? args[0]?.true_false_filter?.value
			// 	: undefined,
			// choice_filter: args[0]?.choice_filter
			// 	? args[0]?.choice_filter?.value
			// 	: undefined,
		}),
		() => ({
			// fetchPolicy: "network-only",
			fetchPolicy: "no-cache",
			clientId: client.value,
			context: {
				headers: {
					"x-hasura-role": role.value,
				},
			},
			enabled: enabled.value,
			// prefetch: false,
		})
	);
	return {
		onResult,
		loading,
		refetch,
		onError,
	};
}
