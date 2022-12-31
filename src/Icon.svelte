<script>
	import itemdb from "./item-db.json";

	export let id;

	const getIconURL = (id) => itemdb[id].icon;
</script>

<img src={getIconURL(id)} alt={id} />

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
