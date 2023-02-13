<script>
	import itemdb from "../../Data/item-db.json";

	export let id;

	const getIconURL = (id) => itemdb[id] ? itemdb[id].icon : Object.values(itemdb).find(x => x.placeholderId === id).icon;
	
</script>

<img src={getIconURL(id)} alt={id} />

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
